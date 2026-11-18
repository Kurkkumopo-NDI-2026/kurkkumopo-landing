import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/modernist.css'
import './styles/page.css'
import App from './App'
import { LangProvider } from './i18n/LangProvider'

const Crossy = lazy(() => import('./crossy/Crossy'))
const isGame = window.location.pathname.replace(/\/+$/, '') === '/crossy'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      {isGame ? (
        <Suspense fallback={null}>
          <Crossy />
        </Suspense>
      ) : (
        <App />
      )}
    </LangProvider>
  </StrictMode>,
)
