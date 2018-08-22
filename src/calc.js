const WORKDAYEND = 17
const WORKDAYLENGTH = 8
const WORKDAYSTART = 9
const getEndOfWorkday = (date) => {
  let workdayEndsAt = new Date(date)
  workdayEndsAt.setUTCHours(WORKDAYEND)
  workdayEndsAt.setUTCMinutes(0)
  workdayEndsAt.setUTCSeconds(0)
  workdayEndsAt.setUTCMilliseconds(0)
  return workdayEndsAt
}

module.exports = {
  calc: (ticketCreatedAt, turnaroundHours) => {
    if (isNaN(turnaroundHours) || !turnaroundHours > 0) throw new Error('Turnaround is not a positive number')

    const startTime = new Date(ticketCreatedAt)
    if (!(startTime instanceof Date) || isNaN(startTime.valueOf())) throw new Error('First parameter must be a date')

    let dueTime = new Date(startTime)
    const firstWorkdayEndsAt = getEndOfWorkday(startTime)
    let elapsedDays = parseInt(turnaroundHours / WORKDAYLENGTH)
    let turnaroundOverFlow = turnaroundHours

    if (turnaroundHours > WORKDAYLENGTH) {
      turnaroundOverFlow = turnaroundHours - (WORKDAYLENGTH * elapsedDays)
    }

    dueTime = new Date(dueTime.setUTCHours(startTime.getUTCHours() + turnaroundHours))

    if (dueTime > firstWorkdayEndsAt) {
      let hoursOnLastDay = turnaroundOverFlow
      if (turnaroundOverFlow >= WORKDAYEND - startTime.getUTCHours()) {
        hoursOnLastDay = turnaroundOverFlow - (WORKDAYEND - startTime.getUTCHours())
        elapsedDays++
      }
      dueTime.setUTCHours(WORKDAYSTART + hoursOnLastDay)
      dueTime.setUTCDate(startTime.getUTCDate() + elapsedDays)
    }

    return dueTime
  }
}
