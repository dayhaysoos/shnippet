import unittest


def subtract(a: int, b: int) -> int:
    return a - b


class TestMathSubtract(unittest.TestCase):
    def test_subtracts_two_numbers(self):
        # :snippet-start: subtract
        result = subtract(5, 3)
        # result is 2
        # :snippet-end:
        self.assertEqual(result, 2)


if __name__ == '__main__':
    unittest.main()
