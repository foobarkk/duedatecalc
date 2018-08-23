const WORKDAYEND = 17
const WORKDAYLENGTH = 8
const WORKDAYSTART = 9

module.exports = {
  calc: (ticketCreatedAt, turnaroundHours) => {
    if (isNaN(turnaroundHours) || !turnaroundHours > 0) throw new Error('Turnaround is not a positive number')

    const startTime = new Date(ticketCreatedAt)
    if (!(startTime instanceof Date) || isNaN(startTime.valueOf())) throw new Error('First parameter must be a date')

    let dueTime = new Date(startTime)
    let dueWeeks = parseInt(turnaroundHours / 40)
    let dueDays = parseInt(turnaroundHours / WORKDAYLENGTH) + (dueWeeks * 2)
    let turnaroundOverFlow = turnaroundHours % WORKDAYLENGTH

    let hoursOnLastDay = turnaroundOverFlow
    if (hoursOnLastDay === 0) {
      hoursOnLastDay = startTime.getUTCHours() - WORKDAYSTART
    }
    if (turnaroundOverFlow >= WORKDAYEND - startTime.getUTCHours()) {
      hoursOnLastDay = turnaroundOverFlow - (WORKDAYEND - startTime.getUTCHours())
      dueDays++
    }

    dueTime.setUTCDate(startTime.getUTCDate() + dueDays)
    dueTime.setUTCHours(WORKDAYSTART + hoursOnLastDay)

    if (dueWeeks > 0) {
      if (turnaroundHours % WORKDAYLENGTH > 0) {
        dueTime.setUTCDate(dueTime.getUTCDate() + 2)
      }
    }

    if (dueTime.getUTCDay() > 5) {
      dueTime.setUTCDate(dueTime.getUTCDate() + 2)
    }

    return dueTime
  }
}
