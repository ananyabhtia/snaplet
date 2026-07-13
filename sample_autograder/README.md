# Demo Snaplet Autograder

This folder contains a basic Snaplet autograder to provide a baseline framework for parsing and grading .snap files.  Note that this autograder framework relies heavily on the data layout of snaplet-created JSON files (.snap files), meaning that the details may need to be adjusted when Snaplet increases in version.

## Requirements

We need to be able to parse YAML manifest files from Gradescope to write out names for connecting to manual grading.  For this to work, you need to have PyYAML installed: https://pypi.org/project/PyYAML/.  The simplest way to install this is by simply running `python -m pip install pyyaml`.

NOTE: YAML files are a [security nightmare](https://dev.to/fkkarakurt/be-careful-when-using-yaml-in-python-there-may-be-security-vulnerabilities-3cdb), and PyYAML has a collection of security flaws.  We expect that Gradescope is _unlikely_ to hand us a dangerous YAML file, and we are running in "safe mode" when parsing, but I would still recommend double-checking that Gradescope's created `submissions/submission_metadata.yml` contains a bunch of student names and submission metadata rather than something nefarious/weird...just to be safe.

## Running Locally

This autograder is currently untrustworthy, and not intended to be used in Gradescope directly.  Instead, you should download student submissions from Gradescope as a zip folder and then copy this autograder into that folder (usually downloaded as submissions.zip).  Specifically, to run the full autograder, you need to copy `src/`, `grade_all.py`, and your `solution/` folder consisting of instructor-made Snaplet files.

To run the autograder, use the following command:

```
python grade_all.py solutions student_folder metadata.yml results.csv
```

Note that student_folder would be `assignment_xxxxxx_export` if you copied the autograder into the GS submissions folder, and metadata.yml would be `assignment_xxxxxx_export/submission_metadata.yml`.