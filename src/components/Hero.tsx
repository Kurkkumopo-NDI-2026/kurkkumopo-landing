import { memo, useEffect, useState } from 'react'
import { BUBBLES, GITHUB_ORG, WORDS } from '../data'
import { Kart, PassingItems, Road } from './pixel'
import { silkLabel } from './styles'
import { PrimaryBtn, SecondaryBtn } from './buttons'

const STARS = Array.from({ length: 22 }, (_, i) => {
  const x = (i * 37 + 11) % 100,
    y = (i * 53 + 7) % 55,
    sz = i % 3 ? 3 : 4
  return (
    <span
      key={'s' + i}
      style={{
        position: 'absolute',
        left: x + '%',
        top: y + '%',
        width: sz,
        height: sz,
        background: i % 4 ? '#ece8dc' : '#f5b81c',
        animation: 'kk-twinkle ' + (2.4 + (i % 5) * 0.6) + 's ' + (i % 7) * 0.4 + 's infinite steps(3)',
      }}
    />
  )
})

const Scene = memo(function Scene() {
  return (
    <div className="kk" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 30% 70% at 50% 100%, rgba(245,184,28,.12), transparent 70%)',
        }}
      />
      {STARS}
      <Road animated />
      <PassingItems />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 8,
          marginLeft: -108,
          zIndex: 2,
          animation: 'kk-in 1.6s cubic-bezier(.2,.8,.2,1) both',
        }}
      >
        {/* ombre dans le conteneur qui glisse (kk-in) : elle suit le kart à l'arrivée, sans sautiller avec lui */}
        <div style={{ position: 'absolute', left: 23, bottom: -2, width: 170, height: 10, background: 'rgba(0,0,0,.5)' }} />
        <Kart width={216} puffs />
      </div>
    </div>
  )
})

function Bubble({ w }: { w: number }) {
  return (
    <div className="kk" style={{ position: 'absolute', left: '50%', bottom: 212, marginLeft: 50, zIndex: 3, pointerEvents: 'none' }}>
      <div
        key={w}
        style={{
          fontFamily: "'Silkscreen',monospace",
          fontSize: 12,
          letterSpacing: '.08em',
          background: '#ece8dc',
          color: '#070c18',
          padding: '6px 10px',
          whiteSpace: 'nowrap',
          boxShadow: '4px 4px 0 #f5b81c',
          animation: 'kk-pop .3s steps(3) both ' + (w ? '0s' : '1.6s'),
        }}
      >
        {BUBBLES[w % 5]}
      </div>
    </div>
  )
}

export function Hero() {
  const [w, setW] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setW((s) => (s + 1) % WORDS.length), 2200)
    return () => clearInterval(t)
  }, [])

  return (
    <section
      id="top"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid #1c2740',
        textAlign: 'center',
        padding: '48px 32px 0',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <a
          href="#projets"
          className="kh4"
          style={{
            alignSelf: 'center',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            border: '1px solid #1c2740',
            padding: '10px 18px',
            textDecoration: 'none',
            background: '#0b1224',
            transition: 'border-color .15s',
          }}
        >
          <span style={silkLabel(13, '.14em')}>NUIT DE L'INFO 2026</span>
        </a>
        <h1
          className="kh-h1"
          style={{
            fontSize: 'clamp(40px,6vw,88px)',
            lineHeight: 1.02,
            letterSpacing: '-.035em',
            fontWeight: 500,
            margin: '24px auto 0',
            maxWidth: '12em',
            textWrap: 'balance',
          }}
        >
          Une nuit, quatre devs et
          <svg
            width="1.1em"
            height="1.1em"
            viewBox="0 0 12 12"
            shapeRendering="crispEdges"
            style={{ verticalAlign: '-.1em', margin: '0 .15em', fill: '#f5b81c' }}
          >
            <path d="M3 0h1v2H3zM6 0h1v2H6zM2 3h8v1H2zM2 4h1v5H2zM9 4h1v5H9zM10 4h2v1h-2zM11 5h1v3h-1zM10 7h1v1h-1zM3 9h6v1H3zM2 10h8v1H2z" />
          </svg>
          <br />
          <span style={{ color: '#f5b81c' }}>{WORDS[w]}.</span>
        </h1>
        <p
          className="kh-lead"
          style={{ fontSize: 19, lineHeight: 1.65, color: '#9aa3b5', maxWidth: '34em', margin: '20px auto 0', textWrap: 'pretty' }}
        >
          Le hub de l'équipe Kurkkumopo : tous les projets construits pendant la Nuit de l'Info 2026, au même endroit.
        </p>
        <div className="kh-ctas" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 28 }}>
          <PrimaryBtn href="#projets">Voir les projets →</PrimaryBtn>
          <SecondaryBtn href={GITHUB_ORG}>Voir sur GitHub</SecondaryBtn>
        </div>
      </div>
      <div className="kh-scene" style={{ position: 'relative', height: 270, margin: '8px -32px 0', flex: 'none' }}>
        <Scene />
        <Bubble w={w} />
      </div>
    </section>
  )
}
