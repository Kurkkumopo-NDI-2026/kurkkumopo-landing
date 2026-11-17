import { Header } from './components/Header'
import { useFitZoom } from './useFitZoom'
import { Hero } from './components/Hero'
import { Cta, Footer, Projects, Stats, Team } from './components/Sections'

export default function App() {
  const wrapRef = useFitZoom<HTMLDivElement>()
  return (
    <div
      style={{
        background: 'var(--bg)',
        minHeight: '100vh',
        color: 'var(--text)',
        fontFamily: "'Space Grotesk',var(--font-body),sans-serif",
      }}
    >
      <div
        ref={wrapRef}
        className="kh-wrap"
        style={{
          maxWidth: 1368,
          margin: '0 auto',
          borderLeft: '1px solid var(--line)',
          borderRight: '1px solid var(--line)',
          position: 'relative',
        }}
      >
        <Header />
        <Hero />
        <Stats />
        <Projects />
        <Team />
        <Cta />
        <Footer />
      </div>
    </div>
  )
}
