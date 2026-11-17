import { Header } from './components/Header'
import { useFitZoom } from './useFitZoom'
import { Hero } from './components/Hero'
import { Cta, Footer, Projects, Stats, Team } from './components/Sections'

export default function App() {
  const wrapRef = useFitZoom<HTMLDivElement>()
  return (
    <div style={{ background: '#070c18', minHeight: '100vh', color: '#ece8dc', fontFamily: "'Space Grotesk',var(--font-body),sans-serif" }}>
      <div
        ref={wrapRef}
        className="kh-wrap"
        style={{
          maxWidth: 1368,
          margin: '0 auto',
          borderLeft: '1px solid #1c2740',
          borderRight: '1px solid #1c2740',
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
