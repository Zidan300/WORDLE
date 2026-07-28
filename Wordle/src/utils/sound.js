let audioContext

export function playKeySound(key) {
  try {
    const AudioEngine = window.AudioContext || window.webkitAudioContext
    if (!AudioEngine) return
    audioContext ??= new AudioEngine()
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()
    oscillator.frequency.value = key === 'ENTER' ? 510 : key === 'BACKSPACE' ? 180 : 360
    oscillator.type = 'sine'
    gain.gain.setValueAtTime(0.025, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.045)
    oscillator.connect(gain).connect(audioContext.destination)
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.05)
  } catch {
    // Sound feedback is optional and should never interrupt play.
  }
}
