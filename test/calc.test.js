'use strict'
/* global expect, test */

const calculator = require('../src/calc')

test('should throw error when only one parameter is given', () => {
  expect(() => calculator.calc('alma')).toThrow()
})

test('should throw error when first parameter cannot be translated as a date', () => {
  expect(() => calculator.calc('alma', 'korte')).toThrow()
})

test('should throw error when second parameter couldn`t is not a number', () => {
  expect(() => calculator.calc('2012-12-12T11:32:00Z', 'korte')).toThrow()
})

test('should throw error when second parameter couldn`t be translated as positive, not zero number', () => {
  expect(() => calculator.calc('2012-12-12T11:32:00Z', 0)).toThrow()
})
