'use strict'
/* global expect, test */

const calculator = require('../src/calc')

const dateDiffInHours = (date1, date2) => (date1.valueOf() - date2.valueOf()) / 60 / 60 / 1000
const nightTimeInHours = 16

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
  const diffHours = dateDiffInHours(dueTime, ticketCreatedAt)
  expect(diffHours).toBeGreaterThanOrEqual(turnaround)
})

test('due time should continue on the next day from 9 if it would overflow 17', () => {
  const ticketCreatedAt = new Date('2018-08-22T16:12Z')
  const turnaround = 2
  const dueTime = calculator.calc(ticketCreatedAt, turnaround)
  const diffHours = dateDiffInHours(dueTime, ticketCreatedAt)
  expect(diffHours).toBeGreaterThanOrEqual(turnaround + nightTimeInHours)
})

test('due time should continue on the day after next day from 9 if turnaround overflow is more than 8 hours (and less than 16)', () => {
  const ticketCreatedAt = new Date('2018-08-22T16:12Z')
  const turnaround = 12
  const dueTime = calculator.calc(ticketCreatedAt, turnaround)
  const diffHours = dateDiffInHours(dueTime, ticketCreatedAt)
  expect(diffHours).toBeGreaterThanOrEqual(turnaround + nightTimeInHours)
})
