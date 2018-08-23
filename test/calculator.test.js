'use strict'
/* global expect, test */

const calculator = require('../src/calculator')

const dateDiffInHours = (date1, date2) => (date1.valueOf() - date2.valueOf()) / 60 / 60 / 1000
const nightTimeInHours = 16
const weekendHours = 48

test('should throw error when only one parameter is given', () => {
  expect(() => calculator.getDueTime('alma')).toThrow()
})

test('should throw error when first parameter cannot be translated as a date', () => {
  expect(() => calculator.getDueTime('alma', 'korte')).toThrow()
})

test('should throw error when second parameter couldn`t is not a number', () => {
  expect(() => calculator.getDueTime('2012-12-12T11:32:00Z', 'korte')).toThrow()
})

test('should throw error when second parameter couldn`t be translated as positive, non zero number', () => {
  expect(() => calculator.getDueTime('2012-12-12T11:32:00Z', 0)).toThrow()
})

test('should return some date with correct parameters', () => {
  const dueTime = calculator.getDueTime('2012-12-12T11:32:00Z', 2)
  expect(dueTime).toBeInstanceOf(Date)
})

test('due time should be at least turnaround hours later than the ticket creation time', () => {
  const ticketCreatedAt = new Date('2018-08-22T09:12Z')
  const turnaround = 2
  const dueTime = calculator.getDueTime(ticketCreatedAt, turnaround)
  const diffHours = dateDiffInHours(dueTime, ticketCreatedAt)
  expect(diffHours).toBeGreaterThanOrEqual(turnaround)
})

test('due time should continue on the next day from 9 if it would overflow 17', () => {
  const ticketCreatedAt = new Date('2018-08-22T16:12Z')
  const turnaround = 2
  const dueTime = calculator.getDueTime(ticketCreatedAt, turnaround)
  const diffHours = dateDiffInHours(dueTime, ticketCreatedAt)
  expect(diffHours).toBeGreaterThanOrEqual(turnaround + nightTimeInHours)
})

test('due time should be night time + turnaround overflow time later than ticket creation', () => {
  const ticketCreatedAt = new Date('2018-08-22T16:12Z')
  const turnaround = 5
  const dueTime = calculator.getDueTime(ticketCreatedAt, turnaround)
  const diffHours = dateDiffInHours(dueTime, ticketCreatedAt)
  expect(diffHours).toBe(turnaround + nightTimeInHours)
})

test('should be able to handle more than 8 hours turnaround time', () => {
  const ticketCreatedAt = new Date('2018-08-12T16:12Z')
  const turnaround = 15
  const dueTime = calculator.getDueTime(ticketCreatedAt, turnaround)
  const diffHours = dateDiffInHours(dueTime, ticketCreatedAt)
  expect(diffHours).toBe(turnaround + (nightTimeInHours * 2))
})

test('should be able to handle more than 16 hours turnaround time', () => {
  const ticketCreatedAt = new Date('2018-08-13T16:12Z')
  const turnaround = 17
  const dueTime = calculator.getDueTime(ticketCreatedAt, turnaround)
  const diffHours = dateDiffInHours(dueTime, ticketCreatedAt)
  expect(diffHours).toBe(turnaround + (nightTimeInHours * 3))
})

test('should handle start times with more than one hour remaining on workday', () => {
  const ticketCreatedAt = new Date('2018-08-22T09:12Z')
  const turnaround = 17
  const dueTime = calculator.getDueTime(ticketCreatedAt, turnaround)
  const diffHours = dateDiffInHours(dueTime, ticketCreatedAt)
  expect(diffHours).toBe(turnaround + (nightTimeInHours * 2))
})

test('should skip weekend days if due time is on Saturday or Sunday', () => {
  const ticketCreatedAt = new Date('2018-08-24T16:12Z')
  const turnaround = 2
  const dueTime = calculator.getDueTime(ticketCreatedAt, turnaround)
  const diffHours = dateDiffInHours(dueTime, ticketCreatedAt)
  expect(diffHours).toBe(turnaround + weekendHours + nightTimeInHours)
})

test('should skip two weekends', () => {
  const ticketCreatedAt = new Date('2018-08-22T16:12Z')
  const turnaround = 66
  const dueTime = calculator.getDueTime(ticketCreatedAt, turnaround)
  const diffHours = dateDiffInHours(dueTime, ticketCreatedAt)
  expect(diffHours).toBe(turnaround + (weekendHours * 2) + nightTimeInHours * 9)
})

test('should skip more than two weekends', () => {
  const ticketCreatedAt = new Date('2018-08-22T09:12Z')
  const turnaround = 105
  const dueTime = calculator.getDueTime(ticketCreatedAt, turnaround)
  const diffHours = dateDiffInHours(dueTime, ticketCreatedAt)
  expect(diffHours).toBe(turnaround + (weekendHours * 3) + nightTimeInHours * 13)
})

test('should skip more than two weekends with friday ending', () => {
  const ticketCreatedAt = new Date('2018-08-22T09:12Z')
  const turnaround = 96
  const dueTime = calculator.getDueTime(ticketCreatedAt, turnaround)
  const diffHours = dateDiffInHours(dueTime, ticketCreatedAt)
  expect(diffHours).toBe(turnaround + (weekendHours * 2) + nightTimeInHours * 12)
})

test('should skip more than two weekends with friday ending and day ending', () => {
  const ticketCreatedAt = new Date('2018-08-22T16:12Z')
  const turnaround = 56
  const dueTime = calculator.getDueTime(ticketCreatedAt, turnaround)
  const diffHours = dateDiffInHours(dueTime, ticketCreatedAt)
  expect(diffHours).toBe(turnaround + (weekendHours) + nightTimeInHours * 7)
})

test('should skip right amout of weekdays even if starts on Monday 9AM', () => {
  const ticketCreatedAt = new Date('2018-08-20T09:00Z')
  const turnaround = 88
  const dueTime = calculator.getDueTime(ticketCreatedAt, turnaround)
  const diffHours = dateDiffInHours(dueTime, ticketCreatedAt)
  expect(diffHours).toBe(turnaround + (weekendHours * 2) + nightTimeInHours * 11)
})
