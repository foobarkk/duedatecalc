const WORKDAYEND = 17
const WORKDAYLENGTH = 8
const WORKDAYSTART = 9
const WEEKLENGTH = 40
const convertToWorkDay = (date) => {
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
const endsAfterWorkingHours = (turnaroundOverFlow, startTime) => {
  return turnaroundOverFlow >= WORKDAYEND - startTime.getUTCHours()
}
const getHoursOnLastDay = (startTime, turnaroundOverFlow) => {
  let hoursOnLastDay = turnaroundOverFlow
  if (turnaroundOverFlow === 0) {
    hoursOnLastDay = startTime.getUTCHours() - WORKDAYSTART
  }
  if (endsAfterWorkingHours(turnaroundOverFlow, startTime)) {
    hoursOnLastDay = turnaroundOverFlow - (WORKDAYEND - startTime.getUTCHours())
  }
  return hoursOnLastDay
}
const getTurnaroundOverFlow = (turnaroundHours) => turnaroundHours % WORKDAYLENGTH
const getTurnaroundWeeks = (turnaroundHours) => parseInt(turnaroundHours / WEEKLENGTH)
const getAboveWeekDays = (turnaroundHours, startTime) => {
  const turnaroundOverFlow = getTurnaroundOverFlow(turnaroundHours)
  const turnaroundWeeks = getTurnaroundWeeks(turnaroundHours)
  let extraDays = 0
  if (turnaroundWeeks > 0 && turnaroundOverFlow > 0) {
    if (startTime.getUTCHours() !== WORKDAYSTART || startTime.getUTCMinutes() !== 0) {
      extraDays = 2
    }
  }
  return extraDays
}
const getInitialDueDays = (turnaroundHours) => parseInt(turnaroundHours / WORKDAYLENGTH) + getTurnaroundWeeks(turnaroundHours) * 2

module.exports = {
  calc: (ticketCreatedAt, turnaroundHours) => {
    if (isNaN(turnaroundHours) || !turnaroundHours > 0) throw new Error('Turnaround is not a positive number')

    const startTime = new Date(ticketCreatedAt)
    if (!(startTime instanceof Date) || isNaN(startTime.valueOf())) throw new Error('First parameter must be a date')

    let dueTime = new Date(startTime)
    let dueDays = getInitialDueDays(turnaroundHours)

    const turnaroundOverFlow = getTurnaroundOverFlow(turnaroundHours)

    let hoursOnLastDay = getHoursOnLastDay(startTime, turnaroundOverFlow)
    if (endsAfterWorkingHours(turnaroundOverFlow, startTime)) {
      dueDays++
    }

    dueTime.setUTCDate(startTime.getUTCDate() + dueDays)
    dueTime.setUTCHours(WORKDAYSTART + hoursOnLastDay)

    const extraDays = getAboveWeekDays(turnaroundHours, startTime)
    dueTime.setUTCDate(dueTime.getUTCDate() + extraDays)

    dueTime = convertToWorkDay(dueTime)

    return dueTime
  }
}
