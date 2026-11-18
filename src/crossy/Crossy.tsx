import { useEffect, useRef } from 'react'
import { useI18n } from '../i18n/context'
import { startCrossy, type GameEls } from './game'
import './crossy.css'

const HUB = '/'

export default function Crossy() {
  const { t } = useI18n()
  const g = t.game
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.classList.add('crossy-page')
    document.title = 'Kurkkumopo Crossy · NDI 2026'
    const el = root.current!
    const q = <E extends HTMLElement>(s: string) => el.querySelector<E>(s)!
    const els: GameEls = {
      canvas: q('canvas'),
      score: q('.cr-score'),
      coffee: q('.cr-coffee'),
      best: q('.cr-best'),
      mute: q('.cr-mute'),
      title: q('.cr-title'),
      over: q('.cr-over'),
      overKind: q('.cr-over-kind'),
      overMsg: q('.cr-over-msg'),
      oScore: q('.cr-o-score'),
      oBest: q('.cr-o-best'),
      oCoffee: q('.cr-o-coffee'),
      play: q('.cr-play'),
      again: q('.cr-again'),
    }
    const stop = startCrossy(els, { coffee: g.coffee, record: g.record, sound: g.sound, gameOver: g.gameOver, msgs: g.msgs }, HUB)
    return () => {
      stop()
      document.documentElement.classList.remove('crossy-page')
    }
  }, [g])

  return (
    <div className="crossy" ref={root}>
      <canvas />
      <div className="cr-score hide">0</div>
      <div className="cr-meta">
        <span className="cr-coffee">{g.coffee} 0</span>
        <span className="cr-best">{g.record} 0</span>
        <button className="cr-mute">{g.sound} : ON</button>
      </div>
      <div className="panel cr-title">
        <span className="kbd">{g.kicker}</span>
        <h1>
          KURKKUMOPO <em>CROSSY</em>
        </h1>
        <p>{g.desc}</p>
        <span className="kbd">{g.controls}</span>
        <div className="row">
          <button className="btn cr-play">{g.play}</button>
          <a className="btn ghost" href={HUB}>
            {g.hub}
          </a>
        </div>
      </div>
      <div className="panel cr-over hide">
        <span className="kbd cr-over-kind">{g.gameOver}</span>
        <h1 className="cr-over-msg" />
        <div className="stats">
          <div>
            <b className="cr-o-score">0</b>
            <small>{g.score}</small>
          </div>
          <div>
            <b className="cr-o-best">0</b>
            <small>{g.record}</small>
          </div>
          <div>
            <b className="cr-o-coffee">0</b>
            <small>{g.coffees}</small>
          </div>
        </div>
        <div className="row">
          <button className="btn cr-again">{g.again}</button>
          <a className="btn ghost" href={HUB}>
            {g.hub}
          </a>
        </div>
      </div>
    </div>
  )
}
