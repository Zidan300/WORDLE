import { useEffect } from 'react'

export function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(onDismiss, 2100)
    return () => window.clearTimeout(timer)
  }, [onDismiss, toast])

  if (!toast) return null
  return <div className={`toast toast-${toast.tone}`} role="status">{toast.text}</div>
}
