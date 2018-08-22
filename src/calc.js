const WORKDAYEND = 17
const WORKDAYLENGTH = 8
const WORKDAYSTART = 9

module.exports = {
  calc: (ticketCreatedAt, turnaroundHours) => {
    if (isNaN(turnaroundHours) || !turnaroundHours > 0) throw new Error('Turnaround is not a positive number')

    const startTime = new Date(ticketCreatedAt)
    if (!(startTime instanceof Date) || isNaN(startTime.valueOf())) throw new Error('First parameter must be a date')

    let dueTime = new Date(startTime)
    let dueDays = parseInt(turnaroundHours / WORKDAYLENGTH)
    let turnaroundOverFlow = turnaroundHours % WORKDAYLENGTH

    dueTime.setUTCDate(startTime.getUTCDate() + dueDays)
    dueTime.setUTCHours(startTime.getUTCHours() + turnaroundOverFlow)

    let hoursOnLastDay = turnaroundOverFlow
    if (turnaroundOverFlow >= WORKDAYEND - startTime.getUTCHours()) {
      hoursOnLastDay = turnaroundOverFlow - (WORKDAYEND - startTime.getUTCHours())
      dueDays++
    }

    dueTime.setUTCHours(WORKDAYSTART + hoursOnLastDay)
    dueTime.setUTCDate(startTime.getUTCDate() + dueDays)

    return dueTime
  }
}
