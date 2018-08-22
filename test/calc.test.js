'use strict'
/* global expect, test */

const calculator = require('../src/calc')

test.skip('should not throw error when called woth two parameters', () => {
  expect(calculator.calc('alma', 'korte')).toBeTruthy()
})

test('should throw error when only one parameter is given', () => {
  expect(() => calculator.calc('alma')).toThrow()
})

test('should throw error when first parameter cannot be translated as a date', () => {
  expect(() => calculator.calc('alma', 'korte')).toThrow()
})
