import type { CSSProperties } from 'react'
import pixel from '../assets/kurkkumopo-pixel.png'
import rouge from '../assets/kurkkumopo-pixel-rouge.png'
import vert2 from '../assets/kurkkumopo-pixel-vert2.png'
import orange from '../assets/kurkkumopo-pixel-orange.png'
import { GITHUB_ORG, PROJECTS, STATS, TEAM } from '../data'
import { useI18n } from '../i18n/context'
import { Kart, Road, Track } from './pixel'
import { silkLabel } from './styles'
import { PrimaryBtn, SecondaryBtn } from './buttons'

const B = '1px solid var(--line)'

function SectionHead({ kicker, title, sub, maxWidth }: { kicker: string; title: string; sub?: string; maxWidth?: string }) {
  return (
    <div
      style={{ textAlign: 'center', padding: '96px 32px 56px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
    >
      <span style={silkLabel(12)}>{kicker}</span>
      <h2
        className="kh-h2"
        style={{
          fontSize: 'clamp(32px,4.5vw,60px)',
          lineHeight: 1.05,
          letterSpacing: '-.03em',
          fontWeight: 500,
          margin: 0,
          maxWidth,
          textWrap: 'balance',
        }}
      >
        {title}
      </h2>
      {sub && (
        <p style={{ margin: 0, fontSize: 17, lineHeight: 1.65, color: 'var(--muted)', maxWidth: '34em', textWrap: 'pretty' }}>{sub}</p>
      )}
    </div>
  )
}

export function Stats() {
  const { t } = useI18n()
  return (
    <section id="stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', borderBottom: B }}>
      {STATS.map((value, i) => (
        <div key={i} style={{ padding: 32, borderRight: B, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ fontFamily: "'Silkscreen',monospace", fontSize: 44, lineHeight: 1, color: 'var(--accent-ink)' }}>{value}</span>
          <span style={{ fontSize: 14, color: 'var(--muted)' }}>{t.stats[i]}</span>
        </div>
      ))}
    </section>
  )
}

export function Projects() {
  const { t } = useI18n()
  return (
    <section id="projets" style={{ borderBottom: B }}>
      <SectionHead kicker={t.projects.kicker} title={t.projects.title} sub={t.projects.sub} maxWidth="14em" />
      <div className="kh-projrow" style={{ display: 'flex', borderTop: B, minHeight: 360 }}>
        {PROJECTS.map((p) => (
          <a
            key={p.num}
            href={p.url}
            className="kh-proj"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              gap: 12,
              padding: 32,
              minHeight: 360,
              textDecoration: 'none',
              color: 'var(--text)',
              borderRight: B,
              background: 'var(--surface)',
            }}
          >
            <div
              className="kh-ban"
              style={{
                backgroundImage: `url('${p.banner}')`,
                backgroundSize: p.size,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                imageRendering: p.render,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg,rgba(var(--bg-rgb),0) 30%,rgba(var(--bg-rgb),.92) 100%)',
              }}
            />
            <span style={{ position: 'relative', ...silkLabel(11) }}>
              {t.projects.label} {p.num}
            </span>
            <h3
              style={{
                position: 'relative',
                fontSize: 'clamp(24px,2.4vw,34px)',
                lineHeight: 1.05,
                letterSpacing: '-.02em',
                fontWeight: 500,
                margin: 0,
              }}
            >
              {p.placeholder ? t.projects.soonTitle : p.title}
            </h3>
            <p style={{ position: 'relative', margin: 0, fontSize: 15, lineHeight: 1.6, color: 'var(--muted-2)' }}>
              {p.placeholder ? t.projects.soonDesc : p.desc}
            </p>
            <span style={{ position: 'relative', fontSize: 14, color: 'var(--accent-ink)' }}>{p.stack}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

export function Team() {
  const { t } = useI18n()
  return (
    <section id="equipe" style={{ borderBottom: B }}>
      <SectionHead kicker={t.team.kicker} title={t.team.title} />
      <div className="kh-teamrow" style={{ display: 'flex', borderTop: B }}>
        {TEAM.map((m, i) => (
          <a
            key={m.handle}
            href={m.url}
            className="kh-team"
            style={
              {
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                padding: '40px 32px',
                textDecoration: 'none',
                borderRight: B,
                color: 'var(--text)',
                minWidth: 0,
                '--kh-bg': m.bg,
                '--kh-acc': m.acc,
                '--kh-ink': m.ink,
              } as CSSProperties
            }
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div
                className="grayscale"
                style={{
                  width: 72,
                  height: 72,
                  backgroundColor: 'var(--surface)',
                  backgroundImage: `url('${m.avatar}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: B,
                }}
              />
              <span className="kh-lbl" style={silkLabel(11)}>
                {t.team.agent} {m.num}
              </span>
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>{m.name}</h3>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: 'var(--muted)', flex: 1, textWrap: 'pretty' }}>
              {t.team.roles[i]}
            </p>
            <span className="kh-gh" style={{ fontSize: 14, color: 'var(--accent-ink)' }}>
              {m.handle} →
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}

// un kart par membre, dans l'ordre de TEAM (jaune, rouge, vert, orange)
const PEEK_KARTS = [pixel, rouge, vert2, orange]

function Peek() {
  return (
    <div className="kk" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 200, overflow: 'hidden' }}>
      <Road animated={false} />
      {PEEK_KARTS.map((src, i) => (
        <Track key={i} bottom={10} zIndex={2} animation={`kk-cross 12s ${-i * 3}s linear infinite`}>
          <Kart width={144} puffs src={src} />
        </Track>
      ))}
    </div>
  )
}

export function Cta() {
  const { t } = useI18n()
  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '96px 32px 220px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 28,
        borderBottom: B,
      }}
    >
      <h2
        className="kh-h2-cta"
        style={{
          fontSize: 'clamp(32px,5vw,68px)',
          lineHeight: 1.02,
          letterSpacing: '-.035em',
          fontWeight: 500,
          margin: 0,
          maxWidth: '12em',
          textWrap: 'balance',
        }}
      >
        {t.cta.title} <span style={{ color: 'var(--accent-ink)' }}>{t.cta.accent}</span>
      </h2>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <PrimaryBtn href={GITHUB_ORG}>{t.cta.github}</PrimaryBtn>
        <SecondaryBtn href="#projets">{t.cta.projects}</SecondaryBtn>
      </div>
      <Peek />
    </section>
  )
}

const col: CSSProperties = { padding: 32, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }
const fLink: CSSProperties = { textDecoration: 'none', color: 'var(--muted)', transition: 'color .15s' }

export function Footer() {
  const { t } = useI18n()
  return (
    <footer style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 12, borderRight: B }}>
        <strong style={{ fontSize: 20, fontWeight: 600 }}>kurkkumopo.info</strong>
        <span style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--muted)' }}>{t.footer.tagline}</span>
      </div>
      <div style={{ ...col, borderRight: B }}>
        <span style={silkLabel(11)}>HUB</span>
        <a href="#projets" className="kh8" style={fLink}>
          {t.nav.projects}
        </a>
        <a href="#equipe" className="kh8" style={fLink}>
          {t.nav.team}
        </a>
      </div>
      <div style={{ ...col, borderRight: B }}>
        <span style={silkLabel(11)}>GITHUB</span>
        {TEAM.map((m) => (
          <a key={m.handle} href={m.url} className="kh8" style={fLink}>
            {m.handle}
          </a>
        ))}
      </div>
      <div style={{ ...col, color: 'var(--muted)' }}>
        <span style={silkLabel(11)}>{t.footer.event}</span>
        <span>© 2026 Kurkkumopo</span>
        <span>{t.footer.made}</span>
      </div>
    </footer>
  )
}
