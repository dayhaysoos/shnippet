import { describe, it, expect } from 'vitest';

describe('Math functions', () => {
  it('should add numbers', () => {
    // :snippet-start: add
    const result = add(2, 3);
    // result is 5
    // :snippet-end:
    expect(result).toBe(5);
  });
});

// Helper function for the test
declare function add(a: number, b: number): number;
