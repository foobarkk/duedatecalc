'use strict'
const Calculator = require('./due-date-calculator')
const calculatorConfig = require('./calculator.config')

const DueDateCalculator = {
  getDueTime: (ticketCreatedAt, turnaroundHours) => {
    const calculator = new Calculator(calculatorConfig)
    if (isNaN(turnaroundHours) || !turnaroundHours > 0) throw new Error('Turnaround is not a positive number')

    const startTime = new Date(ticketCreatedAt)
    if (!(startTime instanceof Date) || isNaN(startTime.valueOf())) throw new Error('First parameter must be a date')

    return calculator.calculateDueDate(ticketCreatedAt, turnaroundHours)
  }

}

module.exports = DueDateCalculator
