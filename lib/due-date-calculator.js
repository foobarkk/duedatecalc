'use strict'

class DueDateCalculator {
  constructor (config) {
    this.WORKDAYEND = config.WORKDAYEND
    this.WORKDAYLENGTH = config.WORKDAYLENGTH
    this.WORKDAYSTART = config.WORKDAYSTART
    this.WEEKLENGTH = config.WEEKLENGTH
  }
  getTurnaroundWeeks (turnaroundHours) {
    return parseInt(turnaroundHours / this.WEEKLENGTH)
  }
  getTurnaroundOverFlow (turnaroundHours) {
    return turnaroundHours % this.WORKDAYLENGTH
  }
  getInitialDueDays (turnaroundHours) {
    return parseInt(turnaroundHours / this.WORKDAYLENGTH) + this.getTurnaroundWeeks(turnaroundHours) * 2
  }
  convertToWorkDay (date) {
    const isOnWeekend = date.getUTCDay() === 0 || date.getUTCDay() === 6
    let daysUntilMonday = 2
    if (date.getUTCDay() === 0) {
      daysUntilMonday = 1
    }
    if (isOnWeekend) {
      date.setUTCDate(date.getUTCDate() + daysUntilMonday)
    }
    return date
  }

  endsAfterWorkingHours (turnaroundOverFlow, startTime) {
    return turnaroundOverFlow >= this.WORKDAYEND - startTime.getUTCHours()
  }

  getHoursOnLastDay (startTime, turnaroundOverFlow) {
    let hoursOnLastDay = turnaroundOverFlow
    if (turnaroundOverFlow === 0) {
      hoursOnLastDay = startTime.getUTCHours() - this.WORKDAYSTART
    }
    if (this.endsAfterWorkingHours(turnaroundOverFlow, startTime)) {
      hoursOnLastDay = turnaroundOverFlow - (this.WORKDAYEND - startTime.getUTCHours())
    }
    return hoursOnLastDay
  }

  getOverflowingDays (turnaroundHours, startTime) {
    const turnaroundOverFlow = this.getTurnaroundOverFlow(turnaroundHours)
    const turnaroundWeeks = this.getTurnaroundWeeks(turnaroundHours)
    let extraDays = 0
    if (turnaroundWeeks > 0 && turnaroundOverFlow > 0) {
      if (startTime.getUTCHours() !== this.WORKDAYSTART || startTime.getUTCMinutes() !== 0) {
        extraDays = 2
      }
    }
    return extraDays
  }

  calculateDueTime (startTime, turnaroundHours) {
    let dueTime = new Date(startTime)
    let dueDays = this.getInitialDueDays(turnaroundHours)

    const turnaroundOverFlow = this.getTurnaroundOverFlow(turnaroundHours)

    let hoursOnLastDay = this.getHoursOnLastDay(startTime, turnaroundOverFlow)
    if (this.endsAfterWorkingHours(turnaroundOverFlow, startTime)) {
      dueDays++
    }

    dueTime.setUTCDate(startTime.getUTCDate() + dueDays)
    dueTime.setUTCHours(this.WORKDAYSTART + hoursOnLastDay)

    const extraDays = this.getOverflowingDays(turnaroundHours, startTime)
    dueTime.setUTCDate(dueTime.getUTCDate() + extraDays)

    dueTime = this.convertToWorkDay(dueTime)

    return dueTime
  }
}

module.exports = DueDateCalculator
