module.exports = {
  calc: (ticketCreatedAt, turnaroundHours) => {
    if (!turnaroundHours) throw new Error('One parameter is missing!')

    const startTime = new Date(ticketCreatedAt)
    if (!(startTime instanceof Date) || isNaN(startTime.valueOf())) throw new Error('First parameter must be a date')
    return 'OK'
  }
}
