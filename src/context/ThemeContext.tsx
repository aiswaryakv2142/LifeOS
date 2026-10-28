
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type ThemePreference = 'light' | 'dark' | 'system'

type ThemeContextValue = {
  theme: ThemePreference
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: ThemePreference) => void
  animationsEnabled: boolean
  setAnimationsEnabled: (enabled: boolean) => void
}

const STORAGE_KEY = 'lifeos-theme-settings-v1'

const ThemeContext = createContext<ThemeContextValue | null>(null)

type SavedSettings = {
  theme?: ThemePreference
  animationsEnabled?: boolean
}

function readSettings(): SavedSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) as SavedSettings : {}
  } catch {
    return {}
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SavedSettings>(() => {
    if (typeof window === 'undefined') return {}
    return readSettings()
  })

  const [systemDark, setSystemDark] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const update = () => setSystemDark(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  const theme = settings.theme ?? 'light'
  const resolvedTheme =
    theme === 'system' ? (systemDark ? 'dark' : 'light') : theme

  const animationsEnabled = settings.animationsEnabled ?? true

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme
    document.documentElement.dataset.motion = animationsEnabled ? 'full' : 'reduced'
    document.documentElement.style.colorScheme = resolvedTheme

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      // The app remains usable if browser storage is unavailable.
    }
  }, [resolvedTheme, animationsEnabled, settings])

  const setTheme = useCallback((nextTheme: ThemePreference) => {
    setSettings(previous => ({ ...previous, theme: nextTheme }))
  }, [])

  const setAnimationsEnabled = useCallback((enabled: boolean) => {
    setSettings(previous => ({ ...previous, animationsEnabled: enabled }))
  }, [])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      animationsEnabled,
      setAnimationsEnabled,
    }),
    [theme, resolvedTheme, setTheme, animationsEnabled, setAnimationsEnabled],
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeSettings() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeSettings must be used inside ThemeProvider')
  }
  return context
}
