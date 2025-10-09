import { describe, expect, it } from 'vitest'

function add(a: number, b: number): number {
  return a + b
}

function subtract(a: number, b: number): number {
  return a - b
}

describe('math functions', () => {
  it('adds two numbers', () => {
    // :snippet-start: add
    const result = add(2, 3)
    // result is 5
    // :snippet-end:
    expect(result).toBe(5)
  })

  it('subtracts two numbers', () => {
    // :snippet-start: subtract
    const result = subtract(5, 3)
    // result is 2
    // :snippet-end:
    expect(result).toBe(2)
  })
})
