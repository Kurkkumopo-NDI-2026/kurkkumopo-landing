import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import pixel from '../assets/kurkkumopo-pixel.png'

const silk = "'Silkscreen',monospace"

/** Vitesse de défilement du décor (px/s, en px de la page) : partagée par les pointillés et les objets posés sur la route. */
const ROAD_SPEED = 120
const DASH = 48 // période du motif des pointillés

export function Road({ animated }: { animated: boolean }) {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 68,
          background: 'linear-gradient(#0e1830,#0b1224)',
          borderTop: '2px solid #f5b81c',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: animated ? -48 : 0,
          bottom: 30,
          height: 4,
          background: 'repeating-linear-gradient(90deg,#f5b81c 0 24px,transparent 24px 48px)',
          opacity: 0.45,
          animation: animated ? `kk-road ${DASH / ROAD_SPEED}s linear infinite` : 'none',
          willChange: animated ? 'transform' : undefined,
        }}
      />
    </>
  )
}

export function Kart({ width, puffs, src }: { width: number; puffs?: boolean; src?: string }) {
  const px = width / 72
  return (
    <div style={{ position: 'relative', width, animation: 'kk-hop .36s steps(2) infinite' }}>
      {puffs &&
        [0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              left: 2 * px,
              bottom: 14 * px,
              width: 3 * px,
              height: 3 * px,
              background: '#2b3a5c',
              animation: 'kk-puff 1.1s ' + i * 0.37 + 's infinite steps(5)',
            }}
          />
        ))}
      <img
        src={src ?? pixel}
        alt="Kurkkumopo, mascotte de l'équipe"
        style={{ width: '100%', display: 'block', imageRendering: 'pixelated' }}
      />
    </div>
  )
}

const C: Record<string, string> = { Y: '#f5b81c', W: '#ece8dc', G: '#8a93a6', N: '#2b3a5c', D: '#0a1426' }

function Sprite({ rows, px }: { rows: string[]; px: number }) {
  const rects: ReactNode[] = []
  rows.forEach((r, y) =>
    [...r].forEach((c, x) => {
      if (C[c]) rects.push(<rect key={x + '-' + y} x={x} y={y} width={1} height={1} fill={C[c]} />)
    }),
  )
  return (
    <svg width={8 * px} height={rows.length * px} viewBox={'0 0 8 ' + rows.length} shapeRendering="crispEdges" style={{ display: 'block' }}>
      {rects}
    </svg>
  )
}

const S: Record<string, string[]> = {
  cup: ['..W..W..', '.W..W...', '........', 'YYYYYY..', 'YWWWWYYY', 'YWWWWY.Y', 'YWWWWYYY', '.YYYY...'],
  cone: ['...YY...', '...YY...', '..WWWW..', '..YYYY..', '.YYYYYY.', '.WWWWWW.', 'YYYYYYYY', 'NNNNNNNN'],
  bug: ['.G....G.', '..G..G..', '..GGGG..', '.GWGGWG.', 'GGGGGGGG', '.GGGGGG.', 'G.GGGG.G', '.G....G.'],
  sign: ['YYYYYYYY', 'YDDYYDDY', 'YYYYYYYY', '...GG...', '...GG...', '...GG...', '...GG...', '..GGGG..'],
}

const ITEMS: [string, string][] = [
  ['cup', 'CAFÉ'],
  ['bug', 'BUG #42'],
  ['cone', 'TRAVAUX'],
  ['sign', 'DEPLOY'],
  ['cup', 'CAFÉ x2'],
]

// kk-pass : de translateX(100% + 52px) à translateX(-120px) => distance = largeur de la route + 172px
const PASS_EXTRA = 52 + 120

export function PassingItems() {
  const ref = useRef<HTMLDivElement>(null)
  const [roadW, setRoadW] = useState(1368)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setRoadW(el.offsetWidth) // offsetWidth = px locaux (non affectés par le zoom), comme les translate
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // même vitesse que les pointillés : les objets sont fixes sur la route, c'est le kart qui avance
  const dur = (roadW + PASS_EXTRA) / ROAD_SPEED
  const delay = (i: number) => (-i * dur) / ITEMS.length
  return (
    <>
      <div ref={ref} style={{ position: 'absolute', left: 0, right: 0, height: 0 }} />
      {ITEMS.map(([k, label], i) => (
        <Track key={'it' + i} bottom={40} animation={`kk-pass ${dur}s ${delay(i)}s linear infinite`}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: silk, fontSize: 10, letterSpacing: '.1em', color: '#9aa3b5', whiteSpace: 'nowrap' }}>{label}</span>
            <Sprite rows={S[k]} px={4} />
          </div>
        </Track>
      ))}
    </>
  )
}

/** Piste pleine largeur animée en transform : translateX(100%) = toute la largeur de la route. */
export function Track({
  bottom,
  animation,
  zIndex,
  children,
}: {
  bottom: number
  animation: string
  zIndex?: number
  children: ReactNode
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom,
        zIndex,
        display: 'flex',
        pointerEvents: 'none',
        animation,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  )
}
