import { useEffect, useState } from 'react'
import pixel from '../assets/kurkkumopo-pixel.png'
import { GITHUB_ORG } from '../data'

const B = '1px solid #1c2740'
const navLink = {
  display: 'flex',
  alignItems: 'center',
  padding: '0 20px',
  fontSize: 14,
  color: '#9aa3b5',
  textDecoration: 'none',
  transition: 'background .15s,color .15s',
} as const

const LINKS = [
  { href: '#projets', label: 'Projets' },
  { href: '#equipe', label: 'Équipe' },
  { href: '#stats', label: 'La nuit' },
]

/** Icône burger / croix en pixel art (grille 8×8). */
function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 8 8" shapeRendering="crispEdges" fill="currentColor" aria-hidden="true">
      {open ? (
        <path d="M1 1h1v1H1zM2 2h1v1H2zM3 3h2v2H3zM5 2h1v1H5zM6 1h1v1H6zM2 5h1v1H2zM1 6h1v1H1zM5 5h1v1H5zM6 6h1v1H6z" />
      ) : (
        <path d="M1 1h6v1H1zM1 3.5h6v1H1zM1 6h6v1H1z" />
      )}
    </svg>
  )
}

export function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onResize = () => window.innerWidth > 760 && setOpen(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        borderBottom: B,
        position: 'sticky',
        top: 0,
        background: '#070c18',
        zIndex: 5,
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'stretch', flexWrap: 'wrap' }}>
        <a
          href="#top"
          className="kh1"
          onClick={close}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 20px',
            height: 56,
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 17,
            borderRight: B,
            transition: 'background .15s',
          }}
        >
          <img src={pixel} alt="" style={{ width: 36, height: 36, imageRendering: 'pixelated' }} />
          Kurkkumopo
        </a>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="kh2 kh-desk" style={{ ...navLink, borderRight: B }}>
            {l.label}
          </a>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <a href={GITHUB_ORG} className="kh2 kh-desk" style={{ ...navLink, borderLeft: B }}>
          GitHub ↗
        </a>
        <a
          href="#projets"
          className="kh3 kh-desk"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 22px',
            fontSize: 14,
            fontWeight: 600,
            background: '#f5b81c',
            color: '#070c18',
            textDecoration: 'none',
            transition: 'background .15s',
          }}
        >
          Projets
        </a>
        <button
          type="button"
          className="kh2 kh-mob"
          aria-expanded={open}
          aria-controls="kh-menu"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={() => setOpen((o) => !o)}
          style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            height: 56,
            padding: 0,
            border: 0,
            borderLeft: B,
            background: open ? '#0b1224' : 'transparent',
            color: open ? '#f5b81c' : '#ece8dc',
            cursor: 'pointer',
          }}
        >
          <MenuIcon open={open} />
        </button>
      </div>

      {open && (
        <nav id="kh-menu" className="kh-mob" style={{ display: 'none', flexDirection: 'column', width: '100%', borderTop: B }}>
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={close}
              className="kh2"
              style={{ ...navLink, height: 52, padding: '0 20px', fontSize: 16, borderBottom: B }}
            >
              {l.label}
            </a>
          ))}
          <a
            href={GITHUB_ORG}
            onClick={close}
            className="kh2"
            style={{ ...navLink, height: 52, padding: '0 20px', fontSize: 16, borderBottom: B }}
          >
            GitHub ↗
          </a>
          <a
            href="#projets"
            onClick={close}
            className="kh3"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 52,
              margin: 16,
              fontSize: 15,
              fontWeight: 600,
              background: '#f5b81c',
              color: '#070c18',
              textDecoration: 'none',
            }}
          >
            Voir les projets →
          </a>
        </nav>
      )}
    </header>
  )
}
