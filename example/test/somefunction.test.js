import { vitest } from "vitest";

function add(a, b) {
  return a + b;
}

vitest("add function", (test) => {
  test("should return the sum of two numbers", () => {
    const result = add(2, 3);
    test.assertEqual(result, 5);
  });

  test("should return 0 when adding zero to a number", () => {
    const result = add(5, 0);
    test.assertEqual(result, 5);
  });

  test.run();
});
