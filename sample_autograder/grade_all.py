import argparse
import os
from pathlib import Path
import src.snaplet_representation as sr
import src.scoring as scoring
import src.utils as utils
import csv
import yaml
from src.utils import DEBUG


def parse_dir(dir: str) -> dict[str, sr.Program | str]:
    """
    Reads all snap programs from the given directory
    Args:
        directory: the folder to read from
    Returns:
        a dictionary mapping from file names to associated .snap programs
          (if a file fails to parse for any reason, instead writes a string error)
    """
    assert os.path.isdir(dir), f'{dir} not a directory'
    result = {}
    for filename in os.listdir(dir):
        if filename.lower().endswith('.snap'):
            try:
                filepath = os.path.join(dir, filename)
                # replace dashes with underscores to help Gradescope out
                name = Path(filepath).stem.replace('-', '_')
                result[name] = sr.parse_snap(filepath)
            except Exception as e:
                result[name] = 'error'  # for later writing out
    return result


def grade_student(solutions: dict[str, sr.Program], student: str) -> dict[str, scoring.CurrentScore]:
    """
    Calculates a dictionary mapping filename to scores for the given student
    Args:
        solutions: the solution directory
        student: the directory of the student solutions
    Returns:
        a dictionary mapping filename (excluding .snap) to student score
    """
    result = {}
    student_programs = parse_dir(student)
    for filename in solutions:
        if filename in student_programs:
            try:
                solution = solutions[filename]
                student_program = student_programs[filename]
                if isinstance(student_program, str):
                    raise Exception(f'failed to parse') # will be caught
                result[filename] = scoring.score(solution, student_program)
            except Exception as e:
                error_score = scoring.CurrentScore()
                msg = f'The autograder failed for some reason:\n{e}'
                error_score.error(msg, 0)
                result[filename] = error_score
    return result


def grade_students(solutions: dict[str, sr.Program],
                   students: str,
                   id_map: dict[str, str]) \
        -> list[tuple[str, dict[str, scoring.CurrentScore]]]:
    """
    Calculates grades for all students in the given directory
    Names are read from id_map when possible, and ids are used otherwise
    Args:
        solutions: a map from names to solution programs
        students: the directory of all students
        id_map: a mapping from ids to student names
    Returns:
        a list of tuples between student names and their score map
    """
    assert os.path.isdir(students), f'{dir} not a directory'
    result = []
    for student in os.listdir(students):
        name = student[student.find('_')+1:]
        # only consider student submissions
        dirpath = os.path.join(students, student)
        if not os.path.isdir(dirpath) or not 'submission' in student:
            continue
        dirpath = os.path.join(students, student)
        # NOTE: this assumes a Gradescope format that could change
        # specifically submission_[idnumber]
        if name in id_map:
            name = id_map[name]
            result.append((name, grade_student(solutions, dirpath)))

    return result


def parse_metadata(metadata: str) -> dict[str, str]:
    """
    Parses the given submission metadata file for an id map
    Arguments:
        metadata: a YAML file containing student submission metadata
    Returns:
        a map from student submission id to student name
    """
    msg = f'{metadata} must be a YAML file (.yml or .yaml)'
    assert metadata.endswith('.yml') or metadata.endswith('.yaml'), msg

    # NOTE: this operation makes strong assumptions on the GS format
    # See test_submissions/submission_metadata.yml
    #   for an example of what we expect format-wise
    with open(metadata, 'r') as ifile:
        data = yaml.safe_load(ifile)

    result = {}
    if not isinstance(data, dict):  # we need a dictionary to do anything
        utils.write_normal(f'YAML file {metadata} has unexpected format')
        return result

    for key in data:
        # NOTE: Assumes each key is submission_[idnum]
        id_num = key[key.find('_')+1:]
        if not id_num.isdigit():
            utils.write_verbose(f'NOTE: unexpected data {id_num}')
            continue

        lookup = ':submitters'
        if lookup in data[key]:
            submitters = data[key][lookup]
            if not isinstance(submitters, list) or len(submitters) == 0:
                utils.write_verbose(f'NOTE: no submitters for {key}')
                continue  # We dunno what to do in this case, don't crash
            first = submitters[0]  # safe
            name = ':name'
            if name not in first:
                utils.write_verbose(f'NOTE: no name attached to {first}')
                continue
            result[id_num] = first[name]

    return result


def write_students(outfile: str,
                   max_scores: dict[str, scoring.CurrentScore],
                   scores: list[tuple[str, dict[str, scoring.CurrentScore]]]):
    """
    Writes all student score results to the target csv
    Args:
        output: the output filename
        solutions: a map from snaplet reference name and the max score
        score: a list of tuples between student names and their score map
    """
    assert outfile.endswith('.csv'), f'{outfile} must end with .csv'
    # Setup the header and data
    filenames = list(max_scores.keys())
    # Strip diagram_ from filenames for readability in the output
    output_names = []
    for filename in filenames:
        if filename.startswith('diagram_'):
            filename = filename[filename.find('_')+1:]
        output_names.append(filename)
    headers = ['name'] + output_names + \
        [f'{name} comments' for name in output_names]
    data = [headers]

    # Add student data
    for name, student in scores:
        numbers = []
        comments = []
        for filename in filenames:
            max_score = max_scores[filename].current
            if filename in student:
                score = student[filename]
                numbers.append(f'{score.current}/{max_score}')
                comments.append(score.comments())
            else:
                numbers.append(f'-/{max_score}')
                comments.append('not graded')
        data.append([name] + numbers + comments)

    # Write the result
    # https://stackoverflow.com/a/3191811
    with open(outfile, 'w', newline='') as ofile:
        csv.writer(ofile).writerows(data)


def main():
    parser = argparse.ArgumentParser(description='Interference Analysis')
    parser.add_argument('solution',
                        help='Solution folder with solutions to test from')
    parser.add_argument('students',
                        help='Folder of student submissions (one submission per sub-folder)')
    parser.add_argument('metadata',
                        help='Gradescope-provided YAML file mapping submissions to names')
    parser.add_argument('outfile',
                        help='Output filename (must be a CSV file)')
    parser.add_argument('-v', '--verbose', action='store_true',
                        help='Detailed runtime messages')
    parser.add_argument('-q', '--quiet', action='store_true',
                        help='Disable all non-essential script messages')
    args = parser.parse_args()

    utils.set_verbosity_from_args(args)

    assert os.path.isdir(args.solution), f'{args.solution} not found'
    assert os.path.isdir(args.students), f'{args.students} not found'

    solutions = parse_dir(args.solution)
    utils.write_normal('Solutions parsed')
    # Get max scores
    max_scores: dict[str, scoring.CurrentScore] = {}
    for key in solutions:
        max_scores[key] = scoring.score(solutions[key], solutions[key])
    utils.write_normal('Max scores calculated')

    id_map = parse_metadata(args.metadata)
    utils.write_normal('Metadata parsed')

    scores = grade_students(solutions, args.students, id_map)
    utils.write_normal('Students graded')

    write_students(args.outfile, max_scores, scores)
    utils.write_normal(f'Results written to {args.outfile}')


if __name__ == "__main__":
    main()
