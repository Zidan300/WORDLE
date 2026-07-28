import { useEffect } from 'react'

export function useKeyboard({ onKey, disabled }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (disabled || event.metaKey || event.ctrlKey || event.altKey) return
      const key = event.key.length === 1 ? event.key.toUpperCase() : event.key.toUpperCase()
      if (/^[A-Z]$/.test(key) || key === 'ENTER' || key === 'BACKSPACE') {
        event.preventDefault()
        onKey(key)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [disabled, onKey])
}
