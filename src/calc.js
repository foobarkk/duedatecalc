const ENDOFWORKDAY = 17
const STARTOFWORKDAY = 9

module.exports = {
  calc: (ticketCreatedAt, turnaroundHours) => {
    if (isNaN(turnaroundHours) || !turnaroundHours > 0) throw new Error('Turnaround is not a positive number')

    const startTime = new Date(ticketCreatedAt)
    if (!(startTime instanceof Date) || isNaN(startTime.valueOf())) throw new Error('First parameter must be a date')

    let dueTime = new Date(startTime)
    let daysToAdd = 0
    let turnaroundOverFlow = turnaroundHours
    if (turnaroundHours / 8 > 1) {
      daysToAdd = parseInt(turnaroundHours / 8)
      turnaroundOverFlow = turnaroundHours - (8 * daysToAdd)
    }
    if (startTime.getUTCHours() + turnaroundOverFlow >= ENDOFWORKDAY || turnaroundHours > 8) {
      let overFlow = turnaroundOverFlow - (ENDOFWORKDAY - startTime.getUTCHours())
      if (overFlow < 0) {
        overFlow = turnaroundOverFlow
        daysToAdd--
      }
      dueTime.setUTCHours(STARTOFWORKDAY + overFlow)
      dueTime.setUTCDate(startTime.getUTCDate() + 1 + daysToAdd)
    } else {
      dueTime.setUTCHours(dueTime.getUTCHours() + turnaroundHours)
    }
    return dueTime
  }
}
