import { createContext, useCallback, useMemo, useEffect } from 'react'
import { initialSettings } from '../data/initialData.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

export const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useLocalStorage('budgetflow-settings', initialSettings)

  const updateSettings = useCallback((updatedSettings) => {
    setSettings((current) => ({ ...current, ...updatedSettings }))
  }, [setSettings])

  const toggleTheme = useCallback(() => {
    setSettings((current) => ({ ...current, theme: current.theme === 'dark' ? 'light' : 'dark' }))
  }, [setSettings])

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', settings.theme)
  }, [settings.theme])

  const value = useMemo(
    () => ({
      settings,
      updateSettings,
      theme: settings.theme,
      toggleTheme,
    }),
    [settings, updateSettings, toggleTheme],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}
