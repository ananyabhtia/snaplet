"""
Utilities for the Snaplet autograder

last modified by Dietrich Geisler April 2026
"""

from typing import Optional
from enum import Enum
import argparse
import os
import json
from inspect import currentframe, getouterframes

# ANSI Colors
RED = "\033[91m"
GREEN = "\033[92m"
RESET = "\033[0m"


def TODO(message: str = ''):
    print(f'{RED}TODO:{RESET} {message}')
    raise NotImplementedError()


def DEBUG(message: str):
    # https://stackoverflow.com/questions/3056048/filename-and-line-number-of-python-script
    frameinfo = getouterframes(currentframe())[1] # get the caller
    writeout = f'{frameinfo.filename} - {frameinfo.lineno}'
    print(f'DEBUG: {writeout}')
    print(message)
    print()


def as_red(message: str = ''):
    return f'{RED}{message}{RESET}'


def as_green(message: str = ''):
    return f'{GREEN}{message}{RESET}'


class Verbosity(Enum):
    QUIET = 1
    NORMAL = 2
    VERBOSE = 3


verbosity: Verbosity = Verbosity.NORMAL
file_capture: Optional[str] = None  # whether to capture write output in a file


def set_verbosity_from_args(args: argparse.Namespace) -> Verbosity:
    """
    Interprets a level of verbosity from the given args
        and reads it into the global "verbosity"
    assumes --verbose and --quiet as verbosity arguments, 
        where verbose takes precedence
    """
    set_verbosity(args.verbose, args.quiet)


def set_verbosity(verbose: bool, quiet: bool) -> Verbosity:
    """
    Interprets a level of verbosity from the given args
        and reads it into the global "verbosity"
    assumes --verbose and --quiet as verbosity arguments, 
        where verbose takes precedence
    """
    global verbosity
    if verbose:
        verbosity = Verbosity.VERBOSE
    elif quiet:
        verbosity = Verbosity.QUIET
    else:
        verbosity = Verbosity.NORMAL


def write_error(message: str):
    """
    Writes the given error to the console if we are not quiet
    """
    message = f'{RED}ERROR:{RESET} {message}'
    if verbosity == Verbosity.NORMAL or verbosity == Verbosity.VERBOSE:
        print(message)
    file_capture_write(f'{RED}ERROR:{RESET} {message}')


def write_verbose(message: str):
    """
    Writes the message to the console if we are verbose
    """
    message = f'{message}'
    if verbosity == Verbosity.VERBOSE:
        print(message)


def write_normal(message: str):
    """
    Writes the message to the console if we are not quiet
    """
    message = f'{message}'
    if verbosity == Verbosity.NORMAL or verbosity == Verbosity.VERBOSE:
        print(message)


def file_capture_write(message: str):
    """
    Helper function to write to the capturing file_capture if defined
    By default, writes to the console with print
    """
    if file_capture is not None:
        with open(file_capture, 'a+') as ofile:
            ofile.write(str(message) + '\n')


def save(data: str, output_file: Optional[str]):
    """
    Simple helper utility function to save results to a file
    """
    if output_file is not None:
        with open(output_file, 'w') as ofile:
            ofile.write(data)
