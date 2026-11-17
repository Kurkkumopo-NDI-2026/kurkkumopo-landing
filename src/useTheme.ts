import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const read = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')

const stored = (): string | null => {
  try {
    return localStorage.getItem('theme')
  } catch {
    return null
  }
}

/** Thème courant (posé par public/theme.js) + bascule mémorisée. Suit le système tant que l'utilisateur n'a rien choisi. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(read)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = (e: MediaQueryListEvent) => {
      if (!stored()) setTheme(e.matches ? 'light' : 'dark')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

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
