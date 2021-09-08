const msToTime = (duration: number) => ({
  hours: Math.floor((duration / (1000 * 60 * 60)) % 24),
  minutes: Math.floor((duration / (1000 * 60)) % 60),
  seconds: Math.floor((duration / 1000) % 60)
})

export default msToTime
