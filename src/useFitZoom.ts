import { useLayoutEffect, useRef } from 'react'

const CANVAS = 1368 // largeur de la maquette
const DESKTOP_MIN = 1024 // en dessous : layout responsive natif, pas de zoom

/**
 * Agrandit/réduit toute la page (CSS zoom) pour que le header + la section hero
 * remplissent exactement l'écran, quelle que soit sa taille.
 */
export function useFitZoom<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const fit = () => {
      const header = el.querySelector('header')
      const hero = el.querySelector<HTMLElement>('#top')
      if (!header || !hero) return

      const desktop = window.innerWidth >= DESKTOP_MIN
      el.classList.toggle('kh-fit', desktop)
      el.style.zoom = '1'
      el.style.setProperty('--hero-min', '0px')
      if (!desktop) return

      // hauteur naturelle (zoom 1) du header + hero
      const headerH = header.getBoundingClientRect().height
      const naturalH = headerH + hero.getBoundingClientRect().height
      const z = Math.min(window.innerWidth / CANVAS, window.innerHeight / naturalH)

      el.style.zoom = String(z)
      // le hero remplit le reste de l'écran (en px du canvas)
      el.style.setProperty('--hero-min', `${window.innerHeight / z - headerH}px`)
    }

    fit()
    window.addEventListener('resize', fit)
    document.fonts?.ready.then(fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  return ref
}
