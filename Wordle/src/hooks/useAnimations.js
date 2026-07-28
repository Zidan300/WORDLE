import { useEffect, useState } from 'react'

export function useAnimations(userPreference) {
  const [systemPreference, setSystemPreference] = useState(() => (
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  ))

  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!query) return undefined
    const update = () => setSystemPreference(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return userPreference || systemPreference
}
