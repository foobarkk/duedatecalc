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

// const getStartOfWorkday = (date) => {
//   let workdayStartsAt = new Date(date)
//   workdayStartsAt.setUTCHours(WORKDAYSTART)
//   workdayStartsAt.setUTCMinutes(0)
//   workdayStartsAt.setUTCSeconds(0)
//   workdayStartsAt.setUTCMilliseconds(0)
//   return workdayStartsAt
// }
module.exports = {
  calc: (ticketCreatedAt, turnaroundHours) => {
    if (isNaN(turnaroundHours) || !turnaroundHours > 0) throw new Error('Turnaround is not a positive number')

    const startTime = new Date(ticketCreatedAt)
    if (!(startTime instanceof Date) || isNaN(startTime.valueOf())) throw new Error('First parameter must be a date')

    let dueTime = new Date(startTime)
    const firstWorkdayEndsAt = getEndOfWorkday(startTime)
    let dueDays = parseInt(turnaroundHours / WORKDAYLENGTH)
    let turnaroundOverFlow = turnaroundHours % WORKDAYLENGTH

    dueTime = new Date(startTime)
    dueTime.setUTCDate(startTime.getUTCDate() + dueDays)
    dueTime.setUTCHours(startTime.getUTCHours() + turnaroundOverFlow)

    let lastDayEndsAt = new Date(startTime)
    lastDayEndsAt.setUTCHours(startTime.getUTCHours())
    lastDayEndsAt.setUTCDate(startTime.getUTCDate() + dueDays)
    lastDayEndsAt = getEndOfWorkday(lastDayEndsAt)

    let lastWorkingHour = new Date(startTime)
    lastWorkingHour.setUTCDate(startTime.getUTCDate() + dueDays)
    lastWorkingHour.setUTCHours(startTime.getUTCHours() + turnaroundHours)

    if (dueTime > firstWorkdayEndsAt) {
      let hoursOnLastDay = turnaroundOverFlow
      if (lastWorkingHour > lastDayEndsAt) {
        hoursOnLastDay = turnaroundOverFlow - (WORKDAYEND - startTime.getUTCHours())
        dueDays++
      }

      dueTime.setUTCHours(WORKDAYSTART + hoursOnLastDay)
      dueTime.setUTCDate(startTime.getUTCDate() + dueDays)
    }
    return dueTime
  }
}
