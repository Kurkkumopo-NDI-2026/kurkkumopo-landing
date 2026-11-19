export type DeathKind = 'car' | 'truck' | 'train' | 'water' | 'current' | 'caught'

export interface GameTexts {
  coffee: string
  record: string
  sound: string
  gameOver: string
  msgs: Record<DeathKind, [string, string]>
}

export interface GameEls {
  canvas: HTMLCanvasElement
  score: HTMLElement
  coffee: HTMLElement
  best: HTMLElement
  mute: HTMLButtonElement
  title: HTMLElement
  over: HTMLElement
  overKind: HTMLElement
  overMsg: HTMLElement
  oScore: HTMLElement
  oBest: HTMLElement
  oCoffee: HTMLElement
  play: HTMLButtonElement
  again: HTMLButtonElement
}

type Box = [number, number, number, number, number, number, string]
type LaneType = 'grass' | 'road' | 'river' | 'rail'
interface Obj {
  x: number
  len: number
  kind: 'car' | 'truck' | 'log'
  col?: string
}
interface Block {
  k: 'tree' | 'rock' | 'server'
  h: number
  s: number
}
interface Lane {
  r: number
  type: LaneType
  objs: Obj[]
  block: Record<number, Block>
  items: Record<number, 'coffee'>
  pads: Record<number, 1>
  dir: number
  speed: number
  T: number
  lily?: boolean
  timer?: number
  train?: { x: number; len: number } | null
  n?: number
  warn?: boolean
}
interface Part {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  col: string
  life: number
  s: number
}
interface Player {
  c: number
  r: number
  fc: number
  fr: number
  tc: number
  tr: number
  t: number
  f: number
  dy: number
  sq: number
  alive: boolean
  ride: Obj | null
  dead: DeathKind | null
  dt: number
  q: [number, number] | null
  sink: number
}

const BEST_KEY = 'kurkkumopo-crossy-best'
const MUTE_KEY = 'kurkkumopo-crossy-mute'

const store = {
  get(k: string) {
    try {
      return localStorage.getItem(k)
    } catch {
      return null
    }
  },
  set(k: string, v: string) {
    try {
      localStorage.setItem(k, v)
    } catch {
      return
    }
  },
}

export function startCrossy(els: GameEls, T: GameTexts, hubUrl: string): () => void {
  const cv = els.canvas
  const ctx = cv.getContext('2d')!
  let W = 0,
    H = 0,
    S = 48,
    DPR = 1
  const ZM = 1,
    CO = 2.4
  function resize() {
    DPR = Math.min(2, window.devicePixelRatio || 1)
    W = innerWidth
    H = innerHeight
    cv.width = (W * DPR) | 0
    cv.height = (H * DPR) | 0
    cv.style.width = W + 'px'
    cv.style.height = H + 'px'
    S = Math.max(34, Math.min(72, W / 9, H / 9.5)) * ZM
  }
  addEventListener('resize', resize)
  resize()

  const C = { y: '#f5b81c', o: '#c98a0f', w: '#ece8dc', r: '#e23b2e', g: '#52c45a', dk: '#0a1426' }
  const SH: Record<string, [string, string, string]> = {}
  function sh(h: string) {
    const s = SH[h]
    if (s) return s
    const n = parseInt(h.slice(1), 16),
      r = n >> 16,
      g = (n >> 8) & 255,
      b = n & 255,
      f = (k: number) => 'rgb(' + ((r * k) | 0) + ',' + ((g * k) | 0) + ',' + ((b * k) | 0) + ')'
    return (SH[h] = [h, f(0.74), f(0.56)])
  }
  const mix = (c: string, a: number) => {
    const m = c.match(/\d+/g)
    const [r, g, b] = c[0] === '#' ? [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)) : m!.map(Number)
    return 'rgb(' + (((r * (1 - a) + 7 * a) | 0) + ',' + ((g * (1 - a) + 12 * a) | 0) + ',' + ((b * (1 - a) + 24 * a) | 0)) + ')'
  }
  let camC = 0,
    camR = 0,
    ox = 0,
    oy = 0
  const px = (c: number, _y: number, r: number) => ox + (c - camC + (r - camR) * 0.36) * S
  const py = (c: number, y: number, r: number) => oy + ((c - camC) * 0.25 - (r - camR) * 0.8 - y * 0.86) * S
  function quad(a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, col: string) {
    ctx.fillStyle = col
    ctx.beginPath()
    ctx.moveTo(a, b)
    ctx.lineTo(c, d)
    ctx.lineTo(e, f)
    ctx.lineTo(g, h)
    ctx.closePath()
    ctx.fill()
  }
  function drawBox(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, col: string, dim = 0) {
    const s = dim ? sh(col).map((c) => mix(c, dim)) : sh(col)
    quad(
      px(x0, y0, z0),
      py(x0, y0, z0),
      px(x1, y0, z0),
      py(x1, y0, z0),
      px(x1, y1, z0),
      py(x1, y1, z0),
      px(x0, y1, z0),
      py(x0, y1, z0),
      s[2],
    )
    quad(
      px(x1, y0, z0),
      py(x1, y0, z0),
      px(x1, y0, z1),
      py(x1, y0, z1),
      px(x1, y1, z1),
      py(x1, y1, z1),
      px(x1, y1, z0),
      py(x1, y1, z0),
      s[1],
    )
    quad(
      px(x0, y1, z0),
      py(x0, y1, z0),
      px(x1, y1, z0),
      py(x1, y1, z0),
      px(x1, y1, z1),
      py(x1, y1, z1),
      px(x0, y1, z1),
      py(x0, y1, z1),
      s[0],
    )
  }
  function flat(x0: number, z0: number, x1: number, z1: number, y: number, col: string) {
    quad(px(x0, y, z0), py(x0, y, z0), px(x1, y, z0), py(x1, y, z0), px(x1, y, z1), py(x1, y, z1), px(x0, y, z1), py(x0, y, z1), col)
  }
  let Q: { lane: number; k: number; i: number; b: Box }[] = []
  let G: [number, number, number, number, string][] = []
  function add(lane: number, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, col: string) {
    Q.push({ lane, k: -0.36 * (x0 + x1) - 1.035 * (y0 + y1) + (z0 + z1), i: Q.length, b: [x0, y0, z0, x1, y1, z1, col] })
  }
  const rot = (x: number, z: number, f: number): [number, number] => (f === 0 ? [x, z] : f === 1 ? [z, -x] : f === 2 ? [-x, -z] : [-z, x])
  const byDepth = (a: (typeof Q)[number], b: (typeof Q)[number]) => b.lane - a.lane || (Math.abs(b.k - a.k) > 1e-6 ? b.k - a.k : a.i - b.i)
  function addModel(lane: number, M: Box[], cx: number, cy: number, cz: number, f: number, sxz: number, sy: number) {
    for (const m of M) {
      const a = rot(m[0], m[2], f),
        b = rot(m[3], m[5], f)
      add(
        lane,
        cx + Math.min(a[0], b[0]) * sxz,
        cy + m[1] * sy,
        cz + Math.min(a[1], b[1]) * sxz,
        cx + Math.max(a[0], b[0]) * sxz,
        cy + m[4] * sy,
        cz + Math.max(a[1], b[1]) * sxz,
        m[6],
      )
    }
  }

  const N1 = '#1d3a78',
    N2 = '#2a4c93',
    NOSE = '#2f5aa6',
    NOSE2 = '#3a68b8',
    DISC = '#d99a12',
    HUB = '#c9ced8'
  const KM: Box[] = []
  {
    const SC = 0.86,
      cy = 0.42
    const b = (x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, c: string, m = 1) => {
      KM.push([x0 * SC, y0 * SC, z0 * SC, x1 * SC, y1 * SC, z1 * SC, c])
      if (m) KM.push([-x1 * SC, y0 * SC, z0 * SC, -x0 * SC, y1 * SC, z1 * SC, c])
    }
    const ring = (z0: number, z1: number, r: number) => {
      b(-r * 0.52, cy - r, z0, r * 0.52, cy + r, z1, N1, 0)
      b(-r * 0.82, cy - r * 0.93, z0, r * 0.82, cy + r * 0.93, z1, N1, 0)
      b(-r, cy - r * 0.67, z0, r, cy + r * 0.67, z1, N1, 0)
    }
    ring(-0.5, -0.46, 0.14)
    ring(-0.46, -0.4, 0.22)
    ring(-0.4, 0.34, 0.27)
    ring(0.34, 0.42, 0.24)
    ring(0.42, 0.46, 0.17)
    b(-0.1, cy + 0.27, -0.36, 0.1, cy + 0.275, 0.3, N2, 0)

    b(-0.08, 0.3, 0.44, 0.08, 0.42, 0.5, NOSE, 0)
    b(-0.1, 0.29, 0.47, 0.1, 0.43, 0.63, NOSE, 0)
    b(-0.07, 0.26, 0.49, 0.07, 0.46, 0.61, NOSE, 0)
    b(-0.07, 0.29, 0.63, 0.07, 0.43, 0.65, NOSE2, 0)
    b(-0.04, 0.46, 0.52, 0.04, 0.465, 0.58, C.w, 0)
    b(-0.035, 0.34, 0.65, -0.005, 0.37, 0.651, C.dk, 0)

    b(0.27, 0.44, 0.14, 0.28, 0.58, 0.28, C.w)
    b(0.28, 0.47, 0.18, 0.285, 0.55, 0.25, C.dk)
    b(0.27, 0.32, 0.14, 0.275, 0.345, 0.3, C.w)
    b(0.24, 0.345, 0.33, 0.245, 0.37, 0.38, C.w)

    b(0.27, 0.36, -0.27, 0.275, 0.52, -0.21, C.y)
    b(0.27, 0.5, -0.24, 0.275, 0.55, -0.15, C.y)
    b(0.27, 0.52, -0.15, 0.275, 0.56, -0.09, C.y)
    b(0.27, 0.33, -0.24, 0.275, 0.38, -0.15, C.y)
    b(0.27, 0.32, -0.15, 0.275, 0.36, -0.09, C.y)

    b(0.03, 0.65, 0.36, 0.07, 0.69, 0.4, C.y)
    b(0.04, 0.69, 0.37, 0.06, 0.76, 0.39, C.y)
    b(0.06, 0.75, 0.38, 0.08, 0.82, 0.41, C.y)
    b(0.08, 0.81, 0.4, 0.1, 0.86, 0.43, C.y)
    b(0.08, 0.85, 0.4, 0.13, 0.9, 0.45, C.y)

    b(-0.1, 0.66, 0.06, 0.1, 0.73, 0.2, N1, 0)
    b(-0.065, 0.73, 0.09, 0.065, 0.83, 0.17, N1, 0)
    b(-0.44, 0.85, 0.1, 0.44, 0.91, 0.16, C.y, 0)
    b(-0.09, 0.82, 0.07, 0.09, 0.93, 0.19, N1, 0)

    for (const zc of [-0.28, 0.27]) {
      b(0.23, 0.07, zc - 0.17, 0.31, 0.27, zc + 0.17, C.y)
      b(0.23, 0.02, zc - 0.12, 0.31, 0.32, zc + 0.12, C.y)
      b(0.23, 0, zc - 0.07, 0.31, 0.34, zc + 0.07, C.y)
      b(0.31, 0.08, zc - 0.1, 0.312, 0.26, zc + 0.1, DISC)
      b(0.312, 0.14, zc - 0.035, 0.317, 0.2, zc + 0.035, HUB)
    }
  }

  const rnd = (a: number, b: number) => a + Math.random() * (b - a),
    ri = (n: number) => (Math.random() * n) | 0,
    pick = <V>(a: V[]) => a[ri(a.length)]
  const CARS = ['#e23b2e', '#f5b81c', '#52c45a', '#4d7cff', '#ece8dc', '#ff8a1e', '#b06cff']
  const lanes = new Map<number, Lane>()
  let runType: LaneType = 'grass',
    runLeft = 0,
    lastRun: LaneType = 'grass'
  function makeLane(r: number) {
    let type: LaneType = 'grass'
    if (r >= 4) {
      if (runLeft <= 0) {
        const opts = (
          [
            ['grass', 3],
            ['road', 3.5],
            ['river', 2.2],
            ['rail', 1.1],
          ] as [LaneType, number][]
        ).filter((o) => o[0] !== lastRun)
        let s = opts.reduce((a, o) => a + o[1], 0) * Math.random()
        for (const o of opts) {
          if ((s -= o[1]) <= 0) {
            runType = o[0]
            break
          }
        }
        runLeft = { grass: 1 + ri(3), road: 1 + ri(4), river: 1 + ri(3), rail: 1 + ri(2) }[runType]
        lastRun = runType
      }
      type = runType
      runLeft--
    }
    const diff = Math.min(2.2, 1 + Math.max(0, r) / 110),
      prev = lanes.get(r - 1)
    const L: Lane = { r, type, objs: [], block: {}, items: {}, pads: {}, dir: Math.random() < 0.5 ? 1 : -1, speed: 0, T: 28 }
    if (type === 'grass') {
      for (let c = -14; c <= 14; c++) {
        let o: Block['k'] | null = null
        if (r < 0) o = Math.random() < 0.75 ? 'tree' : 'rock'
        else if (Math.abs(c) > 4) o = Math.random() < 0.6 ? 'tree' : Math.random() < 0.3 ? 'rock' : null
        else if (r > 2 && Math.random() < 0.17) o = pick<Block['k']>(['tree', 'tree', 'rock', 'server'])
        if (o) L.block[c] = { k: o, h: rnd(0.8, 1.6), s: Math.random() * 10 }
      }
      if (r >= 0) {
        const free: number[] = []
        for (let c = -4; c <= 4; c++) if (!L.block[c]) free.push(c)
        while (free.length < 4) {
          const c = -4 + ri(9)
          if (L.block[c]) {
            delete L.block[c]
            free.push(c)
          }
        }
        if (r > 2 && Math.random() < 0.32) L.items[pick(free)] = 'coffee'
      }
    } else if (type === 'road') {
      if (prev && prev.type === 'road' && Math.random() < 0.6) L.dir = -prev.dir
      L.speed = rnd(1.4, 3.1) * diff
      const truck = Math.random() < 0.35
      let x = -14
      while (x < 14) {
        const len = truck && Math.random() < 0.6 ? 2.5 : 1.35
        L.objs.push({ x, len, kind: len > 2 ? 'truck' : 'car', col: pick(CARS) })
        x += len + rnd(2.4, 5.8 / Math.min(diff, 1.5))
      }
      L.T = Math.max(28, x + 14)
    } else if (type === 'river') {
      if (prev && prev.type === 'river') L.dir = -prev.dir
      if (Math.random() < 0.22 && !(prev && prev.lily) && prev && prev.type !== 'grass') {
        L.lily = true
        let n = 0
        for (let c = -4; c <= 4; c++)
          if (Math.random() < 0.45) {
            L.pads[c] = 1
            n++
          }
        while (n < 3) {
          const c = -4 + ri(9)
          if (!L.pads[c]) {
            L.pads[c] = 1
            n++
          }
        }
      } else {
        L.speed = rnd(1, 2.1) * Math.min(diff, 1.5)
        let x = -14
        while (x < 14) {
          const len = pick([2, 3, 3, 4])
          L.objs.push({ x, len, kind: 'log' })
          x += len + rnd(1.3, 2.7)
        }
        L.T = Math.max(28, x + 14)
      }
    } else {
      L.speed = 24
      L.timer = rnd(1.5, 5)
      L.train = null
      L.n = 3 + ri(3)
    }
    lanes.set(r, L)
  }
  function updLane(L: Lane, dt: number) {
    if (L.type === 'road' || (L.type === 'river' && !L.lily)) {
      for (const o of L.objs) {
        o.x += L.dir * L.speed * dt
        o.x = ((((o.x + 14) % L.T) + L.T) % L.T) - 14
      }
    } else if (L.type === 'rail') {
      if (!L.train) {
        L.timer! -= dt
        if (L.timer! <= 0) {
          const len = L.n! * 2.45
          L.train = { x: L.dir > 0 ? -18 - len : 18, len }
        }
      } else {
        L.train.x += L.dir * L.speed * dt
        if ((L.dir > 0 && L.train.x > 18) || (L.dir < 0 && L.train.x + L.train.len < -18)) {
          L.train = null
          L.timer = rnd(2.5, 6)
        }
      }
      L.warn = !!L.train || L.timer! < 1.4
    }
  }

  const P = {} as Player
  let state: 'title' | 'play' | 'over' = 'title',
    score = 0,
    coffees = 0,
    creep = -4,
    overT = 0,
    shake = 0,
    parts: Part[] = [],
    t = 0
  let best = +(store.get(BEST_KEY) || 0)
  const HOP = 0.12
  const timers: number[] = []
  const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms))

  function reset() {
    lanes.clear()
    runLeft = 0
    lastRun = 'grass'
    runType = 'grass'
    for (let r = -10; r <= 30; r++) makeLane(r)
    Object.assign(P, {
      c: 0,
      r: 0,
      fc: 0,
      fr: 0,
      tc: 0,
      tr: 0,
      t: 1,
      f: 1,
      dy: 0,
      sq: 1,
      alive: true,
      ride: null,
      dead: null,
      dt: 0,
      q: null,
      sink: 0,
    })
    score = 0
    coffees = 0
    creep = -4
    parts = []
    camR = 2.4
    camC = 0
    hud()
    els.over.classList.add('hide')
    if (state === 'over') {
      state = 'play'
      els.score.classList.remove('hide')
    }
  }
  function move(dx: number, dr: number) {
    if (state === 'title') {
      state = 'play'
      els.title.classList.add('hide')
      els.score.classList.remove('hide')
    }
    if (state !== 'play' || !P.alive) return
    if (P.t < 1) {
      P.q = [dx, dr]
      return
    }
    P.f = dr > 0 ? 0 : dr < 0 ? 2 : dx > 0 ? 1 : 3
    const tr = P.r + dr,
      L = lanes.get(tr)
    if (!L) return
    const river = L.type === 'river' && !L.lily
    let tc = P.c + dx
    if (!river) tc = Math.round(tc)
    if (Math.abs(tc) > 4.5) return
    if (L.type === 'grass' && L.block[Math.round(tc)]) return
    P.fc = P.c
    P.fr = P.r
    P.tc = tc
    P.tr = tr
    P.t = 0
    P.ride = null
    beep(440 + dr * 60 + dx * 20, 0.05, 'square', 0.03)
  }
  function land() {
    P.r = P.tr
    P.c = P.tc
    P.sq = 0.72
    const L = lanes.get(P.r)!
    if (P.r > score) {
      score = P.r
      els.score.classList.add('bump')
      later(() => els.score.classList.remove('bump'), 120)
    }
    if (L.type === 'grass' && L.items[P.c] === 'coffee') {
      delete L.items[P.c]
      coffees++
      beep(880, 0.07, 'square', 0.04)
      later(() => beep(1320, 0.1, 'square', 0.04), 70)
      burst(P.c, 0.4, P.r, [C.y, C.w, '#5a3418'], 10, 2)
    }
    if (L.type === 'river') {
      if (L.lily) {
        if (L.pads[Math.round(P.c)]) P.c = Math.round(P.c)
        else return die('water')
      } else {
        const o = L.objs.find((o) => P.c >= o.x - 0.12 && P.c <= o.x + o.len + 0.12)
        if (!o) return die('water')
        P.ride = o
        P.c = Math.min(Math.max(P.c, o.x + 0.3), o.x + o.len - 0.3)
      }
    }
    hud()
    if (P.q) {
      const q = P.q
      P.q = null
      move(q[0], q[1])
    }
  }
  function die(kind: DeathKind) {
    if (!P.alive) return
    P.alive = false
    P.dead = kind
    P.dt = 0
    if (kind === 'water' || kind === 'current') {
      burst(P.c, -0.2, P.r, ['#cfe3ff', '#4d7cff', C.w], 18, 3)
      beep(180, 0.3, 'triangle', 0.06)
    } else if (kind === 'caught') {
      burst(P.c, 0.4, P.r, [N1, C.y, C.r], 24, 4)
      beep(110, 0.5, 'sawtooth', 0.05)
    } else {
      shake = kind === 'train' ? 0.45 : 0.25
      burst(P.c, 0.4, P.r, [N1, C.y, C.r, C.w], kind === 'train' ? 28 : 14, kind === 'train' ? 6 : 3)
      beep(120, 0.35, 'sawtooth', 0.06)
    }
    if (score > best) {
      best = score
      store.set(BEST_KEY, String(best))
    }
    later(() => {
      state = 'over'
      overT = 0
      const m = T.msgs[kind]
      els.overKind.textContent = T.gameOver + ' · ' + m[0]
      els.overMsg.textContent = m[1]
      els.oScore.textContent = String(score)
      els.oBest.textContent = String(best)
      els.oCoffee.textContent = String(coffees)
      els.over.classList.remove('hide')
      hud()
    }, 900)
  }
  function burst(c: number, y: number, r: number, cols: string[], n: number, pw: number) {
    for (let i = 0; i < n; i++)
      parts.push({
        x: c,
        y,
        z: r,
        vx: rnd(-1, 1) * pw,
        vy: rnd(1, 3) * pw * 0.8,
        vz: rnd(-1, 1) * pw * 0.6,
        col: pick(cols),
        life: rnd(0.5, 1),
        s: rnd(0.06, 0.14),
      })
  }
  function hud() {
    els.score.textContent = String(score)
    els.coffee.textContent = T.coffee + ' ' + coffees
    els.best.textContent = T.record + ' ' + Math.max(best, score)
  }

  let muted = store.get(MUTE_KEY) === '1'
  let AC: AudioContext | null = null
  function beep(f: number, d: number, type: OscillatorType, v: number) {
    if (muted) return
    try {
      AC = AC || new AudioContext()
      const o = AC.createOscillator(),
        g = AC.createGain()
      o.type = type
      o.frequency.value = f
      g.gain.setValueAtTime(v, AC.currentTime)
      g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + d)
      o.connect(g)
      g.connect(AC.destination)
      o.start()
      o.stop(AC.currentTime + d)
    } catch {
      return
    }
  }
  function setMute(m: boolean) {
    muted = m
    store.set(MUTE_KEY, m ? '1' : '0')
    els.mute.textContent = T.sound + ' : ' + (m ? 'OFF' : 'ON')
  }
  setMute(muted)
  els.mute.onclick = (e) => {
    e.stopPropagation()
    setMute(!muted)
    els.mute.blur()
  }

  function update(dt: number) {
    t += dt
    for (const L of lanes.values()) updLane(L, dt)
    if (state === 'play' && P.alive) {
      if (P.t < 1) {
        P.t = Math.min(1, P.t + dt / HOP)
        const e = P.t
        P.c = P.fc + (P.tc - P.fc) * e
        P.r = P.fr + (P.tr - P.fr) * e
        P.dy = Math.sin(Math.PI * e) * 0.42
        if (P.t >= 1) {
          P.dy = 0
          land()
        }
      } else if (P.ride) {
        const L = lanes.get(P.r)!
        P.c += L.dir * L.speed * dt
        P.tc = P.c
        if (Math.abs(P.c) > 5) die('current')
      }
      P.sq += (1 - P.sq) * Math.min(1, dt * 14)
      if (P.alive) {
        const lr = Math.round(P.r),
          L = lanes.get(lr)
        if (L && L.type === 'road') {
          for (const o of L.objs)
            if (P.c + 0.28 > o.x && P.c - 0.28 < o.x + o.len) {
              die(o.kind as DeathKind)
              break
            }
        }
        if (L && L.type === 'rail' && L.train && P.c + 0.3 > L.train.x && P.c - 0.3 < L.train.x + L.train.len) die('train')
      }
      creep = Math.max(creep + dt * (0.42 + Math.min(score, 200) * 0.004), P.r - 5)
      if (P.alive && P.r < creep - 0.2) die('caught')
    }
    if (!P.alive) {
      P.dt += dt
      if (P.dead === 'water' || P.dead === 'current') P.sink = Math.min(1, P.sink + dt * 2.5)
    }
    if (state === 'over') overT += dt
    for (const p of parts) {
      p.vy -= 9 * dt
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.z += p.vz * dt
      if (p.y < 0) {
        p.y = 0
        p.vy *= -0.3
        p.vx *= 0.6
        p.vz *= 0.6
      }
      p.life -= dt
    }
    parts = parts.filter((p) => p.life > 0)
    camR += (P.r + CO - camR) * Math.min(1, dt * 5)
    camC += (Math.max(-3, Math.min(3, P.c)) * 0.4 - camC) * Math.min(1, dt * 4)
    shake = Math.max(0, shake - dt)
    const top = Math.ceil(camR + H / (0.8 * S) + 6)
    for (let r = top - 12; r <= top; r++) if (!lanes.has(r)) makeLane(r)
    for (const r of lanes.keys()) if (r < camR - H / (0.8 * S) - 10) lanes.delete(r)
  }

  function render() {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    ctx.fillStyle = '#070c18'
    ctx.fillRect(0, 0, W, H)
    ox = W * 0.5 + (shake ? (Math.random() - 0.5) * shake * 30 : 0)
    oy = H * 0.56 + (shake ? (Math.random() - 0.5) * shake * 20 : 0)
    const rTop = Math.ceil(camR + (oy + 4 * S) / (0.8 * S)) + 3,
      rBot = Math.floor(camR - (H - oy + 3 * S) / (0.8 * S)) - 3
    const cMin = Math.floor(camC - W / S / 2 - 6),
      cMax = Math.ceil(camC + W / S / 2 + 4)
    for (let r = rTop; r >= rBot; r--) {
      const L = lanes.get(r)
      if (L) ground(L, cMin, cMax)
    }
    playerShadow()
    ctx.fillStyle = 'rgba(7,12,24,.5)'
    for (const [a, b] of [
      [-40, -4.5],
      [4.5, 40],
    ]) {
      ctx.beginPath()
      ctx.moveTo(px(a, 0, rBot - 4), py(a, 0, rBot - 4))
      ctx.lineTo(px(b, 0, rBot - 4), py(b, 0, rBot - 4))
      ctx.lineTo(px(b, 0, rTop + 4), py(b, 0, rTop + 4))
      ctx.lineTo(px(a, 0, rTop + 4), py(a, 0, rTop + 4))
      ctx.fill()
    }
    if (state === 'play') {
      ctx.fillStyle = 'rgba(7,12,24,.78)'
      ctx.beginPath()
      ctx.moveTo(px(-40, 0, creep - 30), py(-40, 0, creep - 30))
      ctx.lineTo(px(40, 0, creep - 30), py(40, 0, creep - 30))
      ctx.lineTo(px(40, 0, creep), py(40, 0, creep))
      ctx.lineTo(px(-40, 0, creep), py(-40, 0, creep))
      ctx.fill()
      const a = 0.45 + Math.sin(t * 6) * 0.25
      flat(-40, creep - 0.06, 40, creep + 0.06, 0, 'rgba(226,59,46,' + a.toFixed(2) + ')')
    }
    Q = []
    G = []
    for (let r = rTop; r >= rBot; r--) {
      const L = lanes.get(r)
      if (L) objects(L, cMin, cMax)
    }
    if (state !== 'over' || P.dead) {
      const lane = P.t < 1 ? Math.max(Math.round(P.fr), Math.round(P.tr)) : Math.round(P.r)
      let base = 0
      const L = lanes.get(Math.round(P.r))
      if (L && L.type === 'river' && P.t >= 1) base = L.lily ? -0.2 : 0.02
      if (P.alive || P.dead === 'car' || P.dead === 'truck' || P.dead === 'water' || P.dead === 'current') {
        let sxz = 1 + (1 - P.sq) * 0.5,
          sy = P.sq
        if (P.dead === 'car' || P.dead === 'truck') {
          sy = 0.18
          sxz = 1.35
        }
        if (P.dead === 'water' || P.dead === 'current') base -= P.sink * 1.1
        if ((P.dead !== 'water' && P.dead !== 'current') || P.sink < 1)
          addModel(lane, KM, P.c, base + P.dy, P.r, P.f, sxz * 1.05, sy * 1.05)
      }
    }
    for (const p of parts) add(Math.round(p.z), p.x - p.s, p.y, p.z - p.s, p.x + p.s, p.y + p.s * 2, p.z + p.s, p.col)
    Q.sort(byDepth)
    ctx.globalCompositeOperation = 'lighter'
    for (const g of G) {
      const x = px(g[0], g[1], g[2]),
        y = py(g[0], g[1], g[2]),
        rr = g[3] * S,
        gr = ctx.createRadialGradient(x, y, 0, x, y, rr)
      gr.addColorStop(0, g[4])
      gr.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = gr
      ctx.fillRect(x - rr, y - rr, rr * 2, rr * 2)
    }
    ctx.globalCompositeOperation = 'source-over'
    for (const q of Q) drawFogged(q.b)
    const v = ctx.createRadialGradient(W / 2, H * 0.5, Math.min(W, H) * 0.35, W / 2, H * 0.5, Math.max(W, H) * 0.75)
    v.addColorStop(0, 'rgba(7,12,24,0)')
    v.addColorStop(1, 'rgba(7,12,24,.7)')
    ctx.fillStyle = v
    ctx.fillRect(0, 0, W, H)
  }
  function drawFogged(b: Box) {
    const [ax, y0, az, bx, y1, bz, col] = b
    const x0 = Math.min(ax, bx),
      x1 = Math.max(ax, bx),
      z0 = Math.min(az, bz),
      z1 = Math.max(az, bz)
    const xs = [x0, ...[-4.5, 4.5].filter((v) => v > x0 && v < x1), x1]
    const zs = state === 'play' && creep > z0 && creep < z1 ? [z1, creep, z0] : [z1, z0]
    for (let j = 0; j < zs.length - 1; j++) {
      const za = zs[j + 1],
        zb = zs[j],
        night = state === 'play' && (za + zb) / 2 < creep
      for (let i = 0; i < xs.length - 1; i++) {
        const xa = xs[i],
          xb = xs[i + 1],
          side = Math.abs((xa + xb) / 2) > 4.5
        const dim = night ? 1 - (side ? 0.5 : 1) * 0.22 : side ? 0.5 : 0
        drawBox(xa, y0, za, xb, y1, zb, col, dim)
      }
    }
  }
  function playerShadow() {
    if (state === 'over' && !P.dead) return
    if (!P.alive && P.dead !== 'car' && P.dead !== 'truck') return
    const L = lanes.get(Math.round(P.r))
    if (!L || L.type === 'river' || P.ride) return
    const pts = (
      [
        [-0.25, -0.44],
        [0.25, -0.44],
        [0.25, 0.52],
        [-0.25, 0.52],
      ] as [number, number][]
    ).map(([x, z]) => {
      const [a, b] = rot(x, z, P.f)
      return [P.c + a, P.r + b]
    })
    ctx.globalAlpha = 0.3 * (1 - P.dy)
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    pts.forEach(([c, r], i) => (i ? ctx.lineTo(px(c, 0.003, r), py(c, 0.003, r)) : ctx.moveTo(px(c, 0.003, r), py(c, 0.003, r))))
    ctx.closePath()
    ctx.fill()
    ctx.globalAlpha = 1
  }
  function ground(L: Lane, cMin: number, cMax: number) {
    const r = L.r,
      z0 = r - 0.5,
      z1 = r + 0.5
    if (L.type === 'grass') {
      drawBox(cMin - 2, -1.5, z0, cMax + 2, 0, z1, r & 1 ? '#1d5a34' : '#21653a')
      for (let c = cMin; c <= cMax; c++) if ((c + r) & 1) flat(c - 0.5, z0, c + 0.5, z1, 0, r & 1 ? '#20623a' : '#246e40')
      for (let c = cMin; c <= cMax; c++)
        if (L.items[c] === 'coffee') {
          ctx.globalAlpha = 0.22 + Math.sin(t * 4 + c) * 0.08
          flat(c - 0.4, r - 0.4, c + 0.4, r + 0.4, 0.002, C.y)
          ctx.globalAlpha = 1
        }
    } else if (L.type === 'road') {
      drawBox(cMin - 2, -1.5, z0, cMax + 2, 0, z1, '#1a2030')
      const nx = lanes.get(r + 1)
      if (nx && nx.type === 'road')
        for (let c = cMin; c <= cMax; c++) if (!(c & 1)) flat(c - 0.3, r + 0.46, c + 0.3, r + 0.54, 0.002, '#4a5470')
      const pv = lanes.get(r - 1)
      if (!pv || pv.type !== 'road') flat(cMin - 2, z0, cMax + 2, z0 + 0.06, 0.002, '#2b3347')
      if (!nx || nx.type !== 'road') flat(cMin - 2, z1 - 0.06, cMax + 2, z1, 0.002, '#2b3347')
      ctx.globalAlpha = 0.13
      for (const o of L.objs) {
        const f = L.dir > 0 ? o.x + o.len : o.x
        flat(Math.min(f, f + L.dir * 2.4), r - 0.3, Math.max(f, f + L.dir * 2.4), r + 0.3, 0.003, '#f5b81c')
      }
      ctx.globalAlpha = 1
    } else if (L.type === 'river') {
      drawBox(cMin - 2, -1.5, z0, cMax + 2, -0.28, z1, '#123a6b')
      const sp = L.lily ? 0.3 : L.speed * 0.6
      for (let i = 0; i < 14; i++) {
        const base = ((((i * 3.7 + r * 1.3 + t * L.dir * sp) % 40) + 40) % 40) - 20 + camC
        flat(base, r - 0.12 + ((i * 7) % 5) * 0.06, base + 0.7, r - 0.07 + ((i * 7) % 5) * 0.06, -0.279, '#1b4f8f')
      }
      if (L.lily) {
        for (let c = cMin; c <= cMax; c++)
          if (L.pads[c]) {
            drawBox(c - 0.36, -0.27, r - 0.36, c + 0.36, -0.21, r + 0.36, '#3fae5a')
            drawBox(c - 0.08, -0.21, r - 0.08, c + 0.04, -0.17, r + 0.04, '#f5b81c')
          }
      } else
        for (const o of [...L.objs].sort((a, b) => a.x - b.x)) {
          if (o.x + o.len < cMin || o.x > cMax) continue
          drawBox(o.x, -0.32, r - 0.3, o.x + o.len - 0.08, 0.02, r + 0.3, '#7a4e26')
          drawBox(o.x + o.len - 0.08, -0.32, r - 0.3, o.x + o.len, 0.02, r + 0.3, '#b5824a')
          drawBox(o.x + 0.3, 0.02, r - 0.12, o.x + 0.6, 0.04, r + 0.0, '#6a4220')
        }
    } else {
      drawBox(cMin - 2, -1.5, z0, cMax + 2, 0, z1, '#262a36')
      for (let c = cMin; c <= cMax; c++) flat(c - 0.14, r - 0.38, c + 0.14, r + 0.38, 0.002, '#4a3a2c')
      drawBox(cMin - 2, 0, r - 0.26, cMax + 2, 0.06, r - 0.2, '#8a93a6')
      drawBox(cMin - 2, 0, r + 0.2, cMax + 2, 0.06, r + 0.26, '#8a93a6')
    }
  }
  function objects(L: Lane, cMin: number, cMax: number) {
    const r = L.r
    if (L.type === 'grass') {
      for (let c = cMin; c <= cMax; c++) {
        const b = L.block[c]
        if (b) {
          if (b.k === 'tree') {
            add(r, c - 0.1, 0, r - 0.1, c + 0.1, 0.3, r + 0.1, '#5a3a1e')
            const h = b.h
            add(r, c - 0.36, 0.3, r - 0.36, c + 0.36, 0.3 + h * 0.55, r + 0.36, '#25774a')
            add(r, c - 0.24, 0.3 + h * 0.55, r - 0.24, c + 0.24, 0.6 + h * 0.55, r + 0.24, '#33995a')
          } else if (b.k === 'rock') {
            add(r, c - 0.34, 0, r - 0.3, c + 0.3, 0.3, r + 0.3, '#5c6476')
            add(r, c - 0.22, 0.3, r - 0.18, c + 0.14, 0.44, r + 0.18, '#737c90')
          } else {
            add(r, c - 0.3, 0, r - 0.28, c + 0.3, 1.15, r + 0.28, '#1c2333')
            add(r, c - 0.3, 1.15, r - 0.28, c + 0.3, 1.2, r + 0.28, '#2b3a5c')
            for (let i = 0; i < 4; i++)
              for (let j = 0; j < 3; j++) {
                const on = Math.sin(t * (3 + i) + b.s + j * 2) > 0
                add(
                  r,
                  c - 0.22 + i * 0.12,
                  0.35 + j * 0.25,
                  r - 0.29,
                  c - 0.16 + i * 0.12,
                  0.4 + j * 0.25,
                  r - 0.28,
                  on ? (i === 3 ? C.y : C.g) : '#0f1a2a',
                )
              }
          }
        }
        if (L.items[c] === 'coffee') {
          const y = 0.12 + Math.sin(t * 3 + c) * 0.06
          add(r, c - 0.15, y, r - 0.15, c + 0.15, y + 0.12, r + 0.15, C.w)
          add(r, c - 0.15, y + 0.12, r - 0.15, c + 0.15, y + 0.2, r + 0.15, C.y)
          add(r, c - 0.15, y + 0.2, r - 0.15, c + 0.15, y + 0.32, r + 0.15, C.w)
          add(r, c - 0.11, y + 0.32, r - 0.11, c + 0.11, y + 0.33, r + 0.11, '#5a3418')
          add(r, c + 0.15, y + 0.1, r - 0.04, c + 0.23, y + 0.24, r + 0.04, C.w)
          add(r, c - 0.04, y + 0.42 + Math.sin(t * 5) * 0.04, r - 0.02, c + 0.0, y + 0.5 + Math.sin(t * 5) * 0.04, r + 0.02, '#8a93a6')
        }
      }
    } else if (L.type === 'road') {
      for (const o of L.objs) {
        if (o.x + o.len < cMin || o.x > cMax) continue
        const x0 = o.x,
          x1 = o.x + o.len,
          z0 = r - 0.3,
          z1 = r + 0.3,
          d = L.dir,
          col = o.col!
        add(r, x0 + 0.15, 0, z0 - 0.03, x0 + 0.45, 0.2, z0 + 0.1, '#0a0f1c')
        add(r, x1 - 0.45, 0, z0 - 0.03, x1 - 0.15, 0.2, z0 + 0.1, '#0a0f1c')
        add(r, x0 + 0.15, 0, z1 - 0.1, x0 + 0.45, 0.2, z1 + 0.03, '#0a0f1c')
        add(r, x1 - 0.45, 0, z1 - 0.1, x1 - 0.15, 0.2, z1 + 0.03, '#0a0f1c')
        if (o.kind === 'car') {
          add(r, x0, 0.12, z0, x1, 0.46, z1, col)
          const a = d > 0 ? x0 + 0.12 : x0 + 0.42,
            b = a + 0.8
          add(r, a, 0.46, z0 + 0.05, b, 0.76, z1 - 0.05, col)
          add(r, a + 0.08, 0.52, z0 + 0.04, b - 0.08, 0.7, z0 + 0.05, '#0f1830')
          add(r, b, 0.52, z0 + 0.12, b + 0.01, 0.7, z1 - 0.12, '#0f1830')
        } else {
          const cab = d > 0 ? [x1 - 0.8, x1] : [x0, x0 + 0.8],
            cg = d > 0 ? [x0, x1 - 0.85] : [x0 + 0.85, x1]
          add(r, cg[0], 0.14, z0 - 0.02, cg[1], 1, z1 + 0.02, '#c9ced8')
          add(r, cg[0], 0.6, z0 - 0.03, cg[1], 0.7, z0 - 0.02, col)
          add(r, cab[0], 0.12, z0, cab[1], 0.74, z1, col)
          add(r, cab[0] + 0.12, 0.46, z0 - 0.01, cab[1] - 0.12, 0.66, z0, '#0f1830')
        }
        const fx = d > 0 ? x1 : x0 + 0.02
        if (d > 0) {
          add(r, x1, 0.24, z0 + 0.04, x1 + 0.03, 0.34, z0 + 0.14, '#fff1b0')
          add(r, x1, 0.24, z1 - 0.14, x1 + 0.03, 0.34, z1 - 0.04, '#fff1b0')
        } else add(r, x0 + 0.02, 0.24, z0 - 0.01, x0 + 0.14, 0.34, z0, '#fff1b0')
        const bx = d > 0 ? x0 + 0.02 : x1 - 0.14
        add(r, bx, 0.24, z0 - 0.01, bx + 0.12, 0.34, z0, '#ff3b2e')
        G.push([fx + d * 0.2, 0.3, r, 1.1, 'rgba(245,184,28,.28)'])
      }
    } else if (L.type === 'river') {
      return
    } else {
      const on = L.warn && Math.sin(t * 14) > 0
      add(r, 4.92, 0, r + 0.3, 5.04, 1.3, r + 0.42, '#3a4258')
      add(r, 4.82, 1.3, r + 0.26, 5.14, 1.36, r + 0.46, '#3a4258')
      add(r, 4.84, 1.36, r + 0.28, 4.96, 1.5, r + 0.44, on ? '#ff3b2e' : '#3a1210')
      add(r, 5.0, 1.36, r + 0.28, 5.12, 1.5, r + 0.44, !on && L.warn ? '#ff3b2e' : '#3a1210')
      if (L.warn) G.push([on ? 4.9 : 5.06, 1.43, r + 0.36, 1.4, 'rgba(255,59,46,.45)'])
      if (L.train) {
        const n = L.n!
        for (let i = 0; i < n; i++) {
          const x0 = L.train.x + i * 2.45,
            x1 = x0 + 2.3
          if (x1 < cMin || x0 > cMax) continue
          const lead = L.dir > 0 ? i === n - 1 : i === 0,
            col = lead ? '#e23b2e' : '#ece8dc'
          add(r, x0 + 0.1, 0, r - 0.36, x1 - 0.1, 0.16, r + 0.36, '#0a0f1c')
          add(r, x0, 0.12, r - 0.34, x1, 1.02, r + 0.34, col)
          add(r, x0, 0.42, r - 0.35, x1, 0.52, r - 0.34, lead ? C.y : '#e23b2e')
          for (let w = 0; w < 3; w++) add(r, x0 + 0.25 + w * 0.7, 0.62, r - 0.35, x0 + 0.65 + w * 0.7, 0.86, r - 0.34, '#0f1830')
          if (lead) G.push([L.dir > 0 ? x1 + 0.3 : x0 - 0.3, 0.4, r, 2, 'rgba(245,184,28,.4)'])
        }
      }
    }
  }

  let last = performance.now(),
    lastTick = 0,
    raf = 0
  function frame(now: number) {
    lastTick = performance.now()
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000))
    last = now
    update(dt)
    render()
    raf = requestAnimationFrame(frame)
  }
  const tick = window.setInterval(() => {
    if (performance.now() - lastTick > 120) {
      const n = performance.now()
      const dt = Math.min(0.05, (n - last) / 1000)
      last = n
      update(dt)
      render()
    }
  }, 33)

  const KEYS: Record<string, [number, number]> = {
    ArrowUp: [0, 1],
    w: [0, 1],
    z: [0, 1],
    ArrowDown: [0, -1],
    s: [0, -1],
    ArrowLeft: [-1, 0],
    a: [-1, 0],
    q: [-1, 0],
    ArrowRight: [1, 0],
    d: [1, 0],
  }
  const onKey = (e: KeyboardEvent) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key,
      m = KEYS[k]
    if (m) {
      e.preventDefault()
      if (e.repeat || state === 'over') return
      move(m[0], m[1])
    } else if (k === ' ' || k === 'Enter') {
      e.preventDefault()
      if (state === 'over' && overT > 0.4) reset()
      else if (state === 'title') move(0, 1)
    } else if (k === 'm') setMute(!muted)
    else if (k === 'Escape') location.href = hubUrl
  }
  addEventListener('keydown', onKey)
  let sp: [number, number] | null = null
  const onDown = (e: PointerEvent) => {
    sp = [e.clientX, e.clientY]
  }
  const onUp = (e: PointerEvent) => {
    if (!sp) return
    const dx = e.clientX - sp[0],
      dy = e.clientY - sp[1]
    sp = null
    if (state === 'over') {
      if (overT > 0.4) reset()
      return
    }
    if (Math.hypot(dx, dy) < 24) return move(0, 1)
    if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 1 : -1, 0)
    else move(0, dy < 0 ? 1 : -1)
  }
  cv.addEventListener('pointerdown', onDown)
  cv.addEventListener('pointerup', onUp)
  els.play.onclick = () => move(0, 1)
  els.again.onclick = () => reset()

  reset()
  render()
  raf = requestAnimationFrame(frame)

  return () => {
    cancelAnimationFrame(raf)
    clearInterval(tick)
    timers.forEach(clearTimeout)
    removeEventListener('resize', resize)
    removeEventListener('keydown', onKey)
    cv.removeEventListener('pointerdown', onDown)
    cv.removeEventListener('pointerup', onUp)
    els.play.onclick = els.again.onclick = els.mute.onclick = null
    AC?.close().catch(() => {})
  }
}
