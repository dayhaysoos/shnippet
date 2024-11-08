import { vitest } from "vitest";

vitest("add function", (test) => {
  test("should return the sum of two numbers", () => {
    // :snippet-start: add-function

    function add(a, b) {
      return a + b;
    }

    const result = add(2, 3);

    return result;
    // :snippet-end:
    test.assertEqual(result, 5);
  });

  test("should return 0 when adding zero to a number", () => {
    const result = add(5, 0);
    test.assertEqual(result, 5);
  });

  test.run();
});
