import { useEffect, useState } from 'react'
import pixel from '../assets/kurkkumopo-pixel.png'
import { GITHUB_ORG } from '../data'
import { useTheme } from '../useTheme'

const B = '1px solid var(--line)'
const navLink = {
  display: 'flex',
  alignItems: 'center',
  padding: '0 20px',
  fontSize: 14,
  color: 'var(--muted)',
  textDecoration: 'none',
  transition: 'background .15s,color .15s',
} as const

const LINKS = [
  { href: '#projets', label: 'Projets' },
  { href: '#equipe', label: 'Équipe' },
  { href: '#stats', label: 'La nuit' },
]

const ctaStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  fontWeight: 600,
  background: 'var(--accent)',
  color: 'var(--on-accent)',
  textDecoration: 'none',
  transition: 'background .15s',
} as const

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}

const SUN = ['...XX...', '.X....X.', '..XXXX..', 'X.XXXX.X', 'X.XXXX.X', '..XXXX..', '.X....X.', '...XX...']
const MOON = ['..XXXX..', '.XXX....', 'XXX.....', 'XXX.....', 'XXX.....', 'XXXX....', '.XXXXXX.', '..XXXX..']

/** Icône pixel art 8×8 à partir d'une grille de caractères. */
function PixelIcon({ rows }: { rows: string[] }) {
  return (
    <svg width="18" height="18" viewBox="0 0 8 8" shapeRendering="crispEdges" fill="currentColor" aria-hidden="true">
      {rows.flatMap((r, y) => [...r].map((c, x) => (c === 'X' ? <rect key={x + '-' + y} x={x} y={y} width={1} height={1} /> : null)))}
    </svg>
  )
}

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
  const { theme, toggle } = useTheme()

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
        background: 'var(--bg)',
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
        <button
          type="button"
          className="kh2"
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
          title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            padding: 0,
            border: 0,
            borderLeft: B,
            background: 'transparent',
            color: 'var(--muted)',
            cursor: 'pointer',
            transition: 'background .15s,color .15s',
          }}
        >
          <PixelIcon rows={theme === 'dark' ? SUN : MOON} />
        </button>
        <a
          href={GITHUB_ORG}
          className="kh3 kh-desk"
          target="_blank"
          rel="noreferrer"
          style={{ ...ctaStyle, padding: '0 22px', fontSize: 14 }}
        >
          <GitHubIcon />
          GitHub ↗
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
            background: open ? 'var(--surface)' : 'transparent',
            color: open ? 'var(--accent-ink)' : 'var(--text)',
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
            className="kh3"
            target="_blank"
            rel="noreferrer"
            style={{ ...ctaStyle, justifyContent: 'center', height: 52, margin: 16, fontSize: 15 }}
          >
            <GitHubIcon />
            GitHub ↗
          </a>
        </nav>
      )}
    </header>
  )
}
