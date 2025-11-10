import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RoutesProvider } from './context/RoutesContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RoutesProvider>
    <App />

    </RoutesProvider>
  </StrictMode>,
)
