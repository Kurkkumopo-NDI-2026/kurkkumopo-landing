import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const read = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')

/** Thème courant (posé par public/theme.js, sombre par défaut) + bascule mémorisée. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(read)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem('theme', next)
      } catch {
        /* stockage indisponible : le choix vaut pour la session */
      }
      return next
    })
  }, [])

  return { theme, toggle }
}
