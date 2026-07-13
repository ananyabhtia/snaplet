"""
Logic and representations to scores the given Snaplet file against a reference
This is the main file to modify to adjust autograding output

last modified by Dietrich Geisler April 2026
"""

import src.snaplet_representation as sr
from src.utils import DEBUG


class CurrentScore:
    """
    Represents the score for a given comparison with a reference
    We include maximum to help with internal representation logic
    """
    _maximum: int
    _current: int
    _errors: list[str]

    def __init__(self):
        self._maximum = 0
        self._current = 0
        self._errors = []

    def add(self, amount: int = 1):
        self._maximum += amount
        self._current += amount

    def error(self, msg: str, step: int, amount: int = 1):
        self._maximum += amount
        self._errors.append(f'-{amount} (Step {step}): {msg}')

    def copy(self, other: 'CurrentScore'):
        assert isinstance(other, CurrentScore)
        self._maximum = other._maximum
        self._current = other._current
        self._errors = other._errors[:]

    def clone(self) -> 'CurrentScore':
        result = CurrentScore()
        result._maximum = self._maximum
        result._current = self._current
        result._errors = self._errors[:]
        return result
    
    def comments(self) -> str:
        """Comments about mistakes in this problem"""
        return '\n'.join(self._errors)

    def __str__(self) -> str:
        errors = '\n'.join(self._errors)
        return f'Score: {self._current}/{self._maximum}' + '\n' + errors

    def __repr__(self) -> str:
        return str(self)

    @property
    def current(self) -> int:
        return self._current


class Context:
    """
    Stores meta-information about the program and our step for scoring
    """
    _solution_program: sr.Program
    _student_program: sr.Program
    _current_score: CurrentScore
    _step: int  # for error context and lookups

    def __init__(self, solution: sr.Program, student: sr.Program):
        assert isinstance(solution, sr.Program)
        assert isinstance(student, sr.Program)

        self._solution_program = solution
        self._student_program = student
        self._current_score = CurrentScore()
        self._step = 1

    def clone(self) -> 'Context':
        result = Context(self._solution_program, self._student_program)
        result._current_score = self._current_score.clone()
        result._step = self._step
        return result

    def next_step(self):
        self._step += 1

    def get_solution_step(self) -> sr.Step:
        return self._solution_program.steps[self._step - 1]

    def get_student_step(self) -> sr.Step:
        return self._student_program.steps[self._step - 1]

    @property
    def solution(self) -> sr.Program:
        return self._solution_program

    @property
    def step(self) -> int:
        return self._step

    @property
    def student(self) -> sr.Program:
        return self._student_program

    @property
    def score(self) -> CurrentScore:
        return self._current_score

    def __str__(self) -> str:
        return f'Context'

    def __repr__(self) -> str:
        return f'Context(score = {repr(self._current_score)})'


def best_score(score1: CurrentScore, score2: CurrentScore):
    """
    Helper function that returns the best of two scores
    Note that equal scores will take the larger maximum
      to avoid weird cases with scoring exactly zero
    """
    if score1._current == score2._current:
        if score1._maximum > score2._maximum:
            return score1
        return score2
    if score1._current > score2._current:
        return score1
    return score2


def score_unordered_list(solution: list[sr.SnapletObject],
                         student: list[sr.SnapletObject],
                         context: Context):
    """
    Calculates the best score from all arrangements of the given pair of unordered lists
    """
    for ritem in solution:
        bscore = context.score.clone()
        for titem in student:
            loop_context = context.clone()
            score_object(ritem, titem, loop_context)
            bscore = best_score(bscore, loop_context.score)
        context.score.copy(bscore)


def score_count(solution: sr.Value,
                student: sr.Value,
                context: Context,
                points: int):
    """
    Scores two counts of things one-to-one
    Always deducts exactly "points" if the counts differ at all
    """
    if solution == student:
        context.score.add(points)
    else:
        msg = f'Expected count {solution}, got {student}'
        context.score.error(msg, context.step, points)


def score_value(solution: sr.Value,
                student: sr.Value,
                context: Context,
                points: int):
    """
    Scores two values one-to-one
    Always deducts exactly "points" if a value doesn't match
    """
    if solution.almost_equal(student):
        context.score.add(points)

    else:
        msg = f'Expected {solution}, got {student}'
        context.score.error(msg, context.step, points)

    # The hard case: always add the pointer
    if isinstance(solution.value, sr.ID):
        solution_object = context.get_solution_step().heap[solution.value]
        student_heap = context.get_student_step().heap
        if student.value in student_heap:
            student_object = student_heap[student.value]
            score_heap_object(solution_object, student_object, context)

        # If the student doesn't map correctly, error the entire object
        else:
            solution_context = context.clone()
            score_heap_object(
                solution_object, solution_object, solution_context)
            point_diff = solution_context.score.current - context.score.current
            msg = f'Incorrect heap object mapping for {student}'
            context.score.error(msg, context.step, point_diff)


def score_variable(solution: sr.Variable,
                   student: sr.Variable,
                   context: Context):
    """
    Scores a single variable
    """
    score_value(solution.name, student.name, context, 1)
    score_value(solution.value, student.value, context, 1)


def score_return(solution: sr.Return,
                 student: sr.Return | sr.Variable,
                 context: Context):
    """
    Scores a single variable
    """
    if isinstance(student, sr.Variable):
        # Fairly permissive
        name = student.name.value
        if not isinstance(name, str) or name not in 'return':
            msg = f'Variable name {student.name} not counted as a return value'
            context.score.error(msg, context.step)
            return
        
    score_value(solution.value, student.value, context, 1)


def score_stack_frame(solution: sr.StackFrame, student: sr.StackFrame, context: Context):
    """
    Scores a single stack frame object
    """
    score_value(solution.function_name, student.function_name, context, 1)
    score_unordered_list(solution.items, student.items, context)


def score_heap_object(solution: sr.HeapObject, student: sr.HeapObject, context: Context):
    """
    Scores a single heap object
    """
    score_value(solution.typ, student.typ, context, 1)
    score_unordered_list(solution.items, student.items, context)


def score_object(solution: sr.SnapletObject, student: sr.SnapletObject, context: Context):
    """
    Scores any object comparing from solution to student
    If that object is in solution, but not in student, 
        updates score with the number of values in solution
    Note that this means we can have "extra" stuff in student
    TODO: count number of things in student to avoid shenanigans
    """
    typs = [(sr.Variable, score_variable),
            (sr.Return, score_return),
            (sr.StackFrame, score_stack_frame),
            (sr.HeapObject, score_heap_object)]
    for (typ, fn) in typs:
        if isinstance(solution, typ):
            # special case for return
            return_check = isinstance(solution, sr.Return) \
                and isinstance(student, sr.Variable)
            # note we can only be of one type, so score is called only once
            if isinstance(student, typ) or return_check:
                fn(solution, student, context)
            else:
                msg = f'Expected a {typ.__name__}, got {type(student)}'
                context.score.error(msg, context.step, solution.count_values())


def score_step(solution: sr.Step, student: sr.Step, context: Context):
    """
    Scores the given step of a program, updating context.score
    """
    score_value(solution.line_number, student.line_number, context, 10)
    # Score number of items in each step
    score_count(len(solution.globals), len(student.globals),
                context, len(solution.globals))
    score_count(len(solution.stack), len(student.stack),
                context, len(solution.stack))
    score_count(len(solution.heap), len(student.heap),
                context, len(solution.heap))

    score_unordered_list(solution.globals, student.globals, context)
    score_unordered_list(solution.stack, student.stack, context)
    # We don't actually want to chek the heap besides object count
    # The references themselves give a score here


def score(solution: sr.Program, student: sr.Program) -> CurrentScore:
    """
    Scores a given student program against the reference solution
    """
    assert isinstance(solution, sr.Program)
    assert isinstance(student, sr.Program)

    context = Context(solution, student)
    for rstep, tstep in zip(solution.steps, student.steps):
        score_step(rstep, tstep, context)
        context.next_step()
    return context.score
