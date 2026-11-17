import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import pixel from '../assets/kurkkumopo-pixel.png'
import { GITHUB_ORG } from '../data'
import { useTheme } from '../useTheme'
import { useI18n } from '../i18n/context'
import { LANGS, LANG_NAMES, type Lang } from '../i18n/messages'

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
  { href: '#projets', key: 'projects' },
  { href: '#equipe', key: 'team' },
  { href: '#stats', key: 'night' },
] as const

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

/** Flèche ▾ en pixel art (grille 5×3). */
function Caret() {
  return (
    <svg width="10" height="6" viewBox="0 0 5 3" shapeRendering="crispEdges" fill="currentColor" aria-hidden="true">
      <path d="M0 0h5v1H0zM1 1h3v1H1zM2 2h1v1H2z" />
    </svg>
  )
}

/** Sélecteur de langue pixel art : bouton + liste déroulante sur mesure (listbox accessible au clavier). */
function LangSelect() {
  const { lang, setLang, t } = useI18n()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const btn = useRef<HTMLButtonElement>(null)
  const list = useRef<HTMLUListElement>(null)

  const openList = () => {
    setActive(LANGS.indexOf(lang))
    setOpen(true)
  }
  const choose = (l: Lang) => {
    setLang(l)
    setOpen(false)
    btn.current?.focus()
  }

  // focus sur la liste à l'ouverture, fermeture au clic en dehors
  useEffect(() => {
    if (!open) return
    list.current?.focus()
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  const onListKey = (e: ReactKeyboardEvent) => {
    if (e.key === 'ArrowDown') setActive((i) => (i + 1) % LANGS.length)
    else if (e.key === 'ArrowUp') setActive((i) => (i - 1 + LANGS.length) % LANGS.length)
    else if (e.key === 'Home') setActive(0)
    else if (e.key === 'End') setActive(LANGS.length - 1)
    else if (e.key === 'Enter' || e.key === ' ') choose(LANGS[active])
    else if (e.key === 'Escape') {
      setOpen(false)
      btn.current?.focus()
    } else if (e.key === 'Tab') setOpen(false)
    else return
    e.preventDefault()
  }

  return (
    <div ref={root} style={{ position: 'relative', display: 'flex' }}>
      <button
        ref={btn}
        type="button"
        className="kh2 kh-lang-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="kh-lang-list"
        aria-label={`${t.nav.language} : ${LANG_NAMES[lang]}`}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault()
            openList()
          }
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          minWidth: 64,
          padding: '0 14px',
          border: 0,
          borderLeft: B,
          background: open ? 'var(--surface)' : 'transparent',
          color: open ? 'var(--text)' : 'var(--muted)',
          fontFamily: "'Silkscreen',monospace",
          fontSize: 13,
          letterSpacing: '.08em',
          cursor: 'pointer',
          transition: 'background .15s,color .15s',
        }}
      >
        {lang.toUpperCase()}
        <span style={{ display: 'flex', transform: open ? 'rotate(180deg)' : undefined, transition: 'transform .15s' }}>
          <Caret />
        </span>
      </button>
      {open && (
        <ul
          ref={list}
          id="kh-lang-list"
          role="listbox"
          tabIndex={-1}
          aria-label={t.nav.language}
          aria-activedescendant={`kh-lang-${LANGS[active]}`}
          onKeyDown={onListKey}
          style={{
            position: 'absolute',
            top: 'calc(100% + 1px)',
            right: 0,
            zIndex: 10,
            minWidth: 176,
            margin: 0,
            padding: 4,
            listStyle: 'none',
            background: 'var(--surface)',
            border: B,
            boxShadow: '4px 4px 0 var(--accent)',
            outline: 'none',
          }}
        >
          {LANGS.map((l, i) => (
            <li
              key={l}
              id={`kh-lang-${l}`}
              role="option"
              aria-selected={l === lang}
              data-active={i === active}
              className="kh-lang-opt"
              onPointerEnter={() => setActive(i)}
              onClick={() => choose(l)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                color: 'var(--muted)',
                fontSize: 14,
              }}
            >
              <span
                className="kh-lang-code"
                style={{ fontFamily: "'Silkscreen',monospace", fontSize: 12, letterSpacing: '.08em', width: 22 }}
              >
                {l.toUpperCase()}
              </span>
              <span style={{ flex: 1 }}>{LANG_NAMES[l]}</span>
              {l === lang && <Check />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** Coche en pixel art (grille 7×5). */
function Check() {
  return (
    <svg width="14" height="10" viewBox="0 0 7 5" shapeRendering="crispEdges" fill="var(--accent-ink)" aria-hidden="true">
      <path d="M6 0h1v1H6zM5 1h1v1H5zM0 2h1v1H0zM4 2h1v1H4zM1 3h1v1H1zM3 3h1v1H3zM2 4h1v1H2z" />
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
  const { t } = useI18n()

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
          className="kh1 kh-logo"
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
          <span className="kh-logo-txt">Kurkkumopo</span>
        </a>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="kh2 kh-desk" style={{ ...navLink, borderRight: B }}>
            {t.nav[l.key]}
          </a>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <LangSelect />
        <button
          type="button"
          className="kh2"
          onClick={toggle}
          aria-label={theme === 'dark' ? t.nav.toLight : t.nav.toDark}
          title={theme === 'dark' ? t.nav.toLight : t.nav.toDark}
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
          aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
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
              {t.nav[l.key]}
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
