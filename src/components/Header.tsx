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

export function Header() {
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
        <a href="#projets" className="kh2" style={{ ...navLink, borderRight: B }}>
          Projets
        </a>
        <a href="#equipe" className="kh2" style={{ ...navLink, borderRight: B }}>
          Équipe
        </a>
        <a href="#stats" className="kh2" style={{ ...navLink, borderRight: B }}>
          La nuit
        </a>
      </div>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <a href={GITHUB_ORG} className="kh2" style={{ ...navLink, borderLeft: B }}>
          GitHub ↗
        </a>
        <a
          href="#projets"
          className="kh3"
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
      </div>
    </header>
  )
}
