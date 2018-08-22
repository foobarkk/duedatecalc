const ENDOFWORKDAY = 17
const STARTOFWORKDAY = 9

module.exports = {
  calc: (ticketCreatedAt, turnaroundHours) => {
    if (isNaN(turnaroundHours) || !turnaroundHours > 0) throw new Error('Turnaround is not a positive number')

    const startTime = new Date(ticketCreatedAt)
    if (!(startTime instanceof Date) || isNaN(startTime.valueOf())) throw new Error('First parameter must be a date')

    let dayIncrement = 0
    if (turnaroundHours > 8) dayIncrement++
    let dueTime = new Date(startTime.setUTCHours(startTime.getUTCHours() + turnaroundHours))
    if (dueTime.getUTCHours() > ENDOFWORKDAY) {
      dayIncrement++
      dueTime.setUTCHours(STARTOFWORKDAY + turnaroundHours)
    }
    dueTime.setUTCDate(dueTime.getUTCDate() + dayIncrement)
    return dueTime
  }
}
