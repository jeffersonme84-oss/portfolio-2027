import { Analytics } from '@vercel/analytics/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/archivo'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import '@/i18n'
import App from '@/App'
import '@/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* Só na Vercel (VITE_VERCEL_ENV é exposto pela plataforma); fora dela o script daria 404 */}
    {import.meta.env.VITE_VERCEL_ENV && <Analytics />}
  </StrictMode>,
)
