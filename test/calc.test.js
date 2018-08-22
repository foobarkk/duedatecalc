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

test('should throw error when second parameter couldn`t be translated as positive, non zero number', () => {
  expect(() => calculator.calc('2012-12-12T11:32:00Z', 0)).toThrow()
})

test('should return some date with correct parameters', () => {
  const dueTime = calculator.calc('2012-12-12T11:32:00Z', 2)
  expect(dueTime).toBeInstanceOf(Date)
})

test('due time should be at least turnaround hours later than the ticket creation time', () => {
  const ticketCreatedAt = new Date('2018-08-22T09:12Z')
  const turnaround = 2
  const dueTime = calculator.calc(ticketCreatedAt, turnaround)
  const diffHours = (dueTime.valueOf() - ticketCreatedAt.valueOf()) / 60 / 60 / 1000
  expect(diffHours).toBeGreaterThanOrEqual(turnaround)
})
