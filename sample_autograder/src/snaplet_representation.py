"""
Representation of Snaplet data to simplify scoring logic
Also includes logic for parsing JSON-read objects into this representation
Note that this is a more-type-restricted version of the raw JSON
Having a more-restricted version helps us sanitize the autograder code

last modified by Dietrich Geisler April 2026
"""

import math
import typing
import json
from src.utils import DEBUG


class ID:
    """
    Represents a pointer by index
    Comparing IDs will always return true
    """

    _id: int

    def __init__(self, id: int):
        assert isinstance(id, int)
        assert id >= 0
        self._id = id

    def __str__(self) -> str:
        return f'id{self._id}'

    def __repr__(self) -> str:
        return str(self)

    def __hash__(self) -> int:
        return hash(self.id) ^ 12739373  # large prime

    def __eq__(self, other) -> bool:
        if isinstance(other, ID):
            return self._id == other._id
        return False

    @property
    def id(self) -> int:
        return self._id


ValueType = bool | int | float | str | None | ID
"""
Supported types for primitives when autograding
Note also that tuples () are explicitly not supported
"""

IGNORED_CHARACTERS = '\'"'
"""
Characters to ignore when parsing raw values
"""


class Value:
    """
    Represents a raw Snap value
    """

    _value: ValueType
    """
    Value converted to a raw type to help with comparisons
    Specifically permits nearlyEqualFloat and ID checks
    """

    def __init__(self, value: str):
        assert isinstance(value, str)
        self._value = Value._parse_value(value)

    def almost_equal(self, other: 'Value') -> bool:
        """
        Returns true if this is almost equal to other (semantically)
        Note that the "almost equal" is important for id and floats
        """
        if not isinstance(other, Value):
            return False

        v1 = self._value
        v2 = other._value

        # Easy checks
        if v1 is None:
            return v2 is None

        for typ in [bool, int, str]:
            if isinstance(v1, typ):
                return isinstance(v2, typ) and v1 == v2

        # Floats
        if isinstance(v1, float):
            return isinstance(v2, float) and math.isclose(v1, v2)

        # IDs
        if isinstance(v1, ID):
            # All IDs are equal
            return isinstance(v2, ID)

        typing.assert_never(v1)

    @property
    def value(self):
        return self._value

    @property
    def is_id(self):
        return isinstance(self._value, ID)

    def __str__(self) -> str:
        return f'{self._value} : {type(self._value).__name__}'

    def __repr__(self) -> str:
        return f'Value({repr(self._value)}: {type(self._value).__name__})'

    def __hash__(self):
        return hash(self.value)

    def _parse_value(value: str) -> ValueType:
        value = value.strip().lower()
        # Ignore special characters
        for ignored in IGNORED_CHARACTERS:
            value = value.replace(ignored, '')

        # Booleans
        if value == 'true':
            return True
        if value == 'false':
            return False

        # None type
        if value == 'none':
            return None

        # Integers
        try:
            return int(value)
        except ValueError:
            pass

        # Floats
        try:
            return float(value)
        except ValueError:
            pass

        # IDs
        try:
            if value[:2] == 'id':
                return ID(int(value[2:]))
        except ValueError:
            pass

        # Must be a string, by process of elimination
        return str(value)


class SnapletObject:
    """
    Abstract class for any Snaplet Object (i.e. box)
    Can be a Variable, StackFrame, or HeapObject
    Mostly exists for typing, but can simplify traversal as well
    """

    def count_values(self) -> int:
        raise AssertionError('Unimplemented')


class Variable(SnapletObject):
    """
    Represents a single variable stored in memory
    """
    _name: Value
    _value: Value

    def __init__(self, name: str, value: str):
        assert isinstance(name, str)
        assert isinstance(value, str)
        self._name = Value(name)
        self._value = Value(value)

    @property
    def name(self) -> Value:
        return self._name

    @property
    def value(self) -> Value:
        return self._value

    def __str__(self) -> str:
        return f'{self._name} = {self._value}'

    def __repr__(self) -> str:
        return f'Variable (\n\t{self._name},\n\t{repr(self._value)}\n)'

    def count_values(self) -> int:
        return 2  # name + value
    
class Return(SnapletObject):
    """
    Represents a return "box" from a function or similar
    """
    _value: Value

    def __init__(self, value: str):
        assert isinstance(value, str)
        self._value = Value(value)

    @property
    def value(self) -> Value:
        return self._value

    def __str__(self) -> str:
        return f'return {self._value}'

    def __repr__(self) -> str:
        return f'Return (\n\t{repr(self._value)}\n)'

    def count_values(self) -> int:
        return 1


class StackFrame(SnapletObject):
    """
    Represents a single stack frames
    """
    _function_name: Value
    _items: list[SnapletObject]
    """
    Represents all objects (unordered) in this StackFrame
    We don't want to use a set since hashing is misleading here
    """

    def __init__(self, function_name: str, items: list[SnapletObject]):
        assert isinstance(function_name, str)
        assert isinstance(items, list)
        for item in items:
            assert isinstance(item, SnapletObject)
        self._function_name = Value(function_name)
        self._items = items

    @property
    def function_name(self) -> Value:
        return self._function_name

    @property
    def items(self) -> list[SnapletObject]:
        return self._items

    def __str__(self) -> str:
        return f'StackFrame with {len(self._items)} objects'

    def __repr__(self) -> str:
        item_strs = ''
        for item in self._items:
            item_strs += '\n\t'.join(repr(item).split('\n')) + '\n\t'
        return f'StackFrame(\n\t{item_strs}\n)'

    def count_values(self) -> int:
        return 1 + sum([item.count_values() for item in self._items])


class HeapObject(SnapletObject):
    """
    Represents a single stack frames
    """
    _id: Value
    _typ: Value
    _items: list[SnapletObject]
    """
    Represents all objects (unordered) in this StackFrame
    We don't want to use a set since hashing is misleading here
    """

    def __init__(self, id: str, typ: str, items: list[SnapletObject]):
        assert isinstance(id, str)
        assert isinstance(typ, str)
        assert isinstance(items, list)
        for item in items:
            assert isinstance(item, SnapletObject)

        self._id = Value(id)
        self._typ = Value(typ)
        self._items = items

    @property
    def id(self) -> Value:
        return self._id

    @property
    def typ(self) -> Value:
        return self._typ

    @property
    def items(self) -> list[SnapletObject]:
        return self._items

    def __str__(self) -> str:
        return f'HeapObject with {len(self._items)} objects'

    def __repr__(self) -> str:
        item_strs = ''
        for item in self._items:
            item_strs += '\n\t'.join(repr(item).split('\n')) + '\n\t'
        return f'HeapObject (\n\t{item_strs}\n)'

    def count_values(self) -> int:
        return 1 + sum([item.count_values() for item in self._items])


class Step:
    """
    Represents a single step of a snaplet program
    """
    _line_number: Value
    _globals: list[SnapletObject]
    _stack: list[SnapletObject]
    _heap: dict[Value, SnapletObject]

    def __init__(self, json_step: dict):
        assert isinstance(json_step, dict)

        # Read the expected json objects
        globals_obj = json_step['globals']
        stack_obj = json_step['stack']
        heap_obj = json_step['heap']
        frames_obj = json_step['frames']
        objects_obj = json_step['objects']

        line_number = Value(str(json_step['line']))
        if not isinstance(line_number.value, int):
            line_number._value = None  # bit of a hack to avoid weirdness with DONE
        self._line_number = line_number

        assert isinstance(globals_obj, list), globals_obj
        assert isinstance(stack_obj, list), stack_obj
        assert isinstance(heap_obj, list), heap_obj

        # Parse each frame as mapped by the hash
        frames = {}
        if isinstance(frames_obj, dict):
            for frame in frames_obj:
                values = []
                for obj in frames_obj[frame]:
                    # TODO: Circular references?
                    values.append(Step._parse_object({}, {}, obj))
                frames[frame] = values

        # Parse each heap object as mapped by the hash
        objects = {}
        if isinstance(objects_obj, dict):
            for object in objects_obj:
                values = []
                for obj in objects_obj[object]:
                    # TODO: Circular references?
                    values.append(Step._parse_object({}, {}, obj))
                objects[object] = values

        # Read each global into an unordered list
        self._globals = []
        for glob in globals_obj:
            self._globals.append(Step._parse_object(frames, objects, glob))

        # Read each frame into an unordered list
        self._stack = []
        for stack in stack_obj:
            self._stack.append(Step._parse_object(frames, objects, stack))

        # Read each heap into an unordered list
        self._heap = {}
        for heap in heap_obj:
            value = Value._parse_value(heap['name'])
            # # If there's a duplicate, it's ok to overwrite it
            # #   since that implies the diagram must be wrong
            self._heap[value] = Step._parse_object(frames, objects, heap)

    @property
    def line_number(self) -> list[SnapletObject]:
        return self._line_number

    @property
    def globals(self) -> list[SnapletObject]:
        return self._globals

    @property
    def stack(self) -> list[SnapletObject]:
        return self._stack

    @property
    def heap(self) -> dict[Value, SnapletObject]:
        return self._heap

    def __str__(self) -> str:
        return f'Step at line number {self.line_number}'

    def __repr__(self) -> str:
        result = f'Step [ln: {self._line_number}]:\n'

        to_add = ''
        for object in self._globals:
            to_add += '\n\t'.join(repr(object).split('\n')) + '\n\t'
        result += f' globals:\n\t{to_add}\n'

        to_add = ''
        for object in self._stack:
            to_add += '\n\t'.join(repr(object).split('\n')) + '\n\t'
        result += f' stack:\n\t{to_add}\n'

        to_add = ''
        for key, object in self._heap.items():
            obj_string = '\n\t'.join(repr(object).split('\n')) + '\n\t'
            to_add += f'{repr(key)} : {obj_string}'
        result += f' heap:\n\t{to_add}\n'

        return result

    def _parse_object(frames: dict[str, list[Variable]],  # TODO: bad assumption for now
                      objects: dict[str, list[Variable]],
                      obj: dict) -> SnapletObject:
        """
        Parse a single object from our tables in the snaplet data
        """
        assert isinstance(obj, dict)
        typ = obj['type']
        if typ == 'frame':
            ptr = obj['id']
            items = []
            if ptr in frames:
                items = frames[ptr]
            return StackFrame(obj['name'], items)
        if typ == 'object':
            ptr = obj['id']
            items = []
            if ptr in objects:
                items = objects[ptr]
            return HeapObject(obj['name'], obj['value'], items)
        if typ == 'variable':
            return Variable(obj['name'], obj['value'])
        if typ == 'ret':
            return Return(obj['value'])
        raise ValueError(f'Unknown JSON object type {typ}')


class Program:
    """
    Represents a full snaplet program
    """
    _steps: list[Step]

    def __init__(self, json_program: dict):
        assert isinstance(json_program, dict)
        assert all([isinstance(key, str) and key.isdigit()
                   for key in json_program.keys()]), json_program.keys()

        self._steps = []
        for key in sorted(list(map(int, json_program.keys()))):
            self._steps.append(Step(json_program[str(key)]))

    @property
    def steps(self) -> list[Step]:
        return self._steps

    def __str__(self) -> str:
        return f'Program with {len(self._steps)} steps'

    def __repr__(self) -> str:
        return f'Program:\n{"\n".join(map(repr, self._steps))}'


def parse_snap(filename: str) -> Program:
    assert filename.lower().endswith('.snap'), f'{filename} must end with .snap'
    data = {}
    with open(filename, 'r') as ifile:
        data = json.loads(ifile.read())
        assert data['metadata']['snapletVersion'] == 1
    return Program(data['content'])
