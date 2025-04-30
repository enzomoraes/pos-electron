import 'reflect-metadata'
import './assets/main.css'
import 'react-confirm-alert/src/react-confirm-alert.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
