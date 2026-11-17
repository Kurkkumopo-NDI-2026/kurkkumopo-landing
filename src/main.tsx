import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/modernist.css'
import './styles/page.css'
import App from './App'
import { LangProvider } from './i18n/LangProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
  </StrictMode>,
)
