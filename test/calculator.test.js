'use strict'
/* global expect, test */

const calculator = require('../lib/calculator')
const config = require('../lib/calculator.config')

const dateDiffInHours = (date1, date2) => (date1.valueOf() - date2.valueOf()) / 60 / 60 / 1000
const getNightTimeInHours = () => {
  const start = new Date(0).setUTCHours(config.WORKDAYEND)
  const end = new Date(0).setUTCHours(config.WORKDAYEND + (24 - config.WORKDAYLENGTH))
  const hours = dateDiffInHours(end, start)
  return hours
}
const nightTimeInHours = getNightTimeInHours()
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
  const dueTime = calculator.getDueTime(new Date('2012-12-12T11:32:00Z'), 2)
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

test('should be able to handle more than two workdays hours turnaround time', () => {
  const ticketCreatedAt = new Date('2018-08-13T16:12Z')
  const turnaround = config.WORKDAYLENGTH * 2 + (config.WORKDAYEND - ticketCreatedAt.getUTCHours())
  const dueTime = calculator.getDueTime(ticketCreatedAt, turnaround)
  const diffHours = dateDiffInHours(dueTime, ticketCreatedAt)
  expect(diffHours).toBe(turnaround + (nightTimeInHours * (parseInt(turnaround / config.WORKDAYLENGTH) + 1)))
})

test('should handle start times with more than one hour remaining on workday', () => {
  const ticketCreatedAt = new Date('2018-08-22T09:12Z')
  const overFlow = 1
  const turnaround = config.WORKDAYLENGTH * 2 + overFlow
  const dueTime = calculator.getDueTime(ticketCreatedAt, turnaround)
  const diffHours = dateDiffInHours(dueTime, ticketCreatedAt)
  expect(diffHours).toBe(turnaround + (nightTimeInHours * parseInt(turnaround / config.WORKDAYLENGTH)))
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
  const overFlow = 2
  const days = 8
  const turnaround = config.WORKDAYLENGTH * days + overFlow
  const dueTime = calculator.getDueTime(ticketCreatedAt, turnaround)
  const diffHours = dateDiffInHours(dueTime, ticketCreatedAt)
  expect(diffHours).toBe(turnaround + (weekendHours * 2) + nightTimeInHours * (days + 1))
})

test('should skip more than two weekends', () => {
  const ticketCreatedAt = new Date('2018-08-22T09:12Z')
  const turnaround = config.WORKDAYLENGTH * 13 + 1
  const dueTime = calculator.getDueTime(ticketCreatedAt, turnaround)
  const diffHours = dateDiffInHours(dueTime, ticketCreatedAt)
  expect(diffHours).toBe(turnaround + (weekendHours * 3) + nightTimeInHours * 13)
})

test('should skip more than two weekends with friday ending', () => {
  const ticketCreatedAt = new Date('2018-08-22T09:12Z')
  const days = 12
  const turnaround = config.WORKDAYLENGTH * days
  const dueTime = calculator.getDueTime(ticketCreatedAt, turnaround)
  const diffHours = dateDiffInHours(dueTime, ticketCreatedAt)
  expect(diffHours).toBe(turnaround + (weekendHours * 2) + nightTimeInHours * days)
})

test('should skip more than two weekends with friday ending and day ending', () => {
  const ticketCreatedAt = new Date('2018-08-22T16:12Z')
  const days = 7
  const turnaround = config.WORKDAYLENGTH * days
  const dueTime = calculator.getDueTime(ticketCreatedAt, turnaround)
  const diffHours = dateDiffInHours(dueTime, ticketCreatedAt)
  expect(diffHours).toBe(turnaround + (weekendHours) + nightTimeInHours * days)
})

test('should skip right amout of weekdays even if starts on Monday 9AM', () => {
  const ticketCreatedAt = new Date('2018-08-20T09:00Z')
  const days = 11
  const turnaround = config.WORKDAYLENGTH * days
  const dueTime = calculator.getDueTime(ticketCreatedAt, turnaround)
  const diffHours = dateDiffInHours(dueTime, ticketCreatedAt)
  expect(diffHours).toBe(turnaround + (weekendHours * 2) + nightTimeInHours * days)
})
