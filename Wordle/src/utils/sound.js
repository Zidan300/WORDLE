let audioContext

function getContext() {
  try {
    const Engine = window.AudioContext || window.webkitAudioContext
    if (!Engine) return null
    if (!audioContext) audioContext = new Engine()
    return audioContext
  } catch {
    return null
  }
}

function playTone(frequency, duration, volume = 0.025, type = 'sine') {
  const ctx = getContext()
  if (!ctx) return
  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = frequency
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
    osc.connect(gain).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch {
    // Sound is optional
  }
}

export function playKeySound(key) {
  if (key === 'ENTER') playTone(510, 0.05, 0.025)
  else if (key === 'BACKSPACE') playTone(180, 0.05, 0.02)
  else playTone(360, 0.04, 0.02)
}

export function playRevealSound() {
  playTone(400, 0.08, 0.015, 'sine')
}

export function playCorrectSound() {
  const ctx = getContext()
  if (!ctx) return
  try {
    const now = ctx.currentTime
    ;[523, 659, 784].forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.03, now + i * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.15)
      osc.connect(gain).connect(ctx.destination)
      osc.start(now + i * 0.08)
      osc.stop(now + i * 0.08 + 0.15)
    })
  } catch { /* sound skipped */ }
}

export function playWinSound() {
  const ctx = getContext()
  if (!ctx) return
  try {
    const now = ctx.currentTime
    ;[523, 659, 784, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.035, now + i * 0.12)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.25)
      osc.connect(gain).connect(ctx.destination)
      osc.start(now + i * 0.12)
      osc.stop(now + i * 0.12 + 0.25)
    })
  } catch { /* sound skipped */ }
}

export function playLoseSound() {
  playTone(300, 0.15, 0.02)
  setTimeout(() => playTone(250, 0.2, 0.02), 150)
}

export function playHintSound() {
  playTone(880, 0.08, 0.02, 'sine')
  setTimeout(() => playTone(1100, 0.1, 0.015, 'sine'), 80)
}

export function playErrorSound() {
  playTone(200, 0.1, 0.02, 'square')
}
