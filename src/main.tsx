
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { LifeOSProvider } from './context/LifeOSContext'
import { ThemeProvider } from './context/ThemeContext'
import SplashScreen from './components/SplashScreen'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LifeOSProvider>
          <SplashScreen />
          <App />
        </LifeOSProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
