import unittest


def add(a: int, b: int) -> int:
    return a + b


class TestMathAdd(unittest.TestCase):
    def test_adds_two_numbers(self):
        # :snippet-start: add
        result = add(2, 3)
        # result is 5
        # :snippet-end:
        self.assertEqual(result, 5)


if __name__ == '__main__':
    unittest.main()
