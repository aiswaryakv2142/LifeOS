
import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useThemeSettings } from '../context/ThemeContext'

const SESSION_KEY = 'lifeos-intro-seen-v1'

export default function SplashScreen() {
  const { animationsEnabled } = useThemeSettings()
  const [visible, setVisible] = useState(() => {
    try {
      return !sessionStorage.getItem(SESSION_KEY)
    } catch {
      return true
    }
  })
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (!visible) return

    let finishTimer: number | undefined
    let removeTimer: number | undefined

    const finish = () => {
      setLeaving(true)
      try {
        sessionStorage.setItem(SESSION_KEY, 'yes')
      } catch {
        // Intro still works if session storage is unavailable.
      }
      removeTimer = window.setTimeout(() => setVisible(false), animationsEnabled ? 850 : 0)
    }

    finishTimer = window.setTimeout(finish, animationsEnabled ? 1700 : 250)

    return () => {
      if (finishTimer) window.clearTimeout(finishTimer)
      if (removeTimer) window.clearTimeout(removeTimer)
    }
  }, [visible, animationsEnabled])

  if (!visible) return null

  return (
    <div
      className={`lifeos-splash ${leaving ? 'lifeos-splash--leaving' : ''} ${
        animationsEnabled ? '' : 'lifeos-splash--still'
      }`}
      role="status"
      aria-label="Opening LifeOS"
    >
      <div className="splash-glow splash-glow--one" />
      <div className="splash-glow splash-glow--two" />

      <div className="splash-brand">
        <div className="splash-mark">
          <Sparkles size={30} strokeWidth={1.5} />
        </div>
        <div className="splash-wordmark" aria-label="LifeOS">
          {'LIFEOS'.split('').map((letter, index) => (
            <span key={index} style={{ animationDelay: `${index * 90}ms` }}>
              {letter}
            </span>
          ))}
        </div>
        <p className="splash-tagline">YOUR LIFE, IN FOCUS</p>
        <div className="splash-loading" aria-hidden="true">
          <span />
        </div>
      </div>

      <p className="splash-footer">A little more intention, every day.</p>
    </div>
  )
}
