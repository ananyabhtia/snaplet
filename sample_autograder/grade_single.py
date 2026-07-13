import argparse
import os
import src.snaplet_representation as sr
import src.scoring as scoring
import src.utils as utils
from src.utils import DEBUG

def main():
    parser = argparse.ArgumentParser(description='Interference Analysis')
    parser.add_argument('reference',
                        help='Solution location to test (relative or absolute)')
    parser.add_argument('input',
                        help='Student location to test (relative or absolute)')
    parser.add_argument('-v', '--verbose', action='store_true',
                        help='Detailed runtime messages')
    parser.add_argument('-q', '--quiet', action='store_true',
                        help='Disable all non-essential script messages')
    args = parser.parse_args()

    utils.set_verbosity_from_args(args)

    assert os.path.exists(args.reference), f'{args.reference} not found'
    assert os.path.exists(args.input), f'{args.input} not found'

    reference = sr.parse_snap(args.reference)
    inp = sr.parse_snap(args.input)
    print(repr(scoring.score(reference, inp)))

if __name__ == "__main__":
    main()