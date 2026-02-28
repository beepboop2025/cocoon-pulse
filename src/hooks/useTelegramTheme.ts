import { useEffect, useState } from 'react'

interface TelegramTheme {
  bgColor: string
  textColor: string
  hintColor: string
  buttonColor: string
  buttonTextColor: string
  secondaryBgColor: string
  isDark: boolean
}

const DEFAULT_THEME: TelegramTheme = {
  bgColor: '#0a0a0f',
  textColor: '#e2e2e8',
  hintColor: '#6b6b80',
  buttonColor: '#3742FA',
  buttonTextColor: '#ffffff',
  secondaryBgColor: '#12121a',
  isDark: true,
}

export function useTelegramTheme(): TelegramTheme {
  const [theme, setTheme] = useState<TelegramTheme>(DEFAULT_THEME)

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (!tg) return

    const update = () => {
      const tp = tg.themeParams
      setTheme({
        bgColor: tp.bg_color ?? DEFAULT_THEME.bgColor,
        textColor: tp.text_color ?? DEFAULT_THEME.textColor,
        hintColor: tp.hint_color ?? DEFAULT_THEME.hintColor,
        buttonColor: tp.button_color ?? DEFAULT_THEME.buttonColor,
        buttonTextColor: tp.button_text_color ?? DEFAULT_THEME.buttonTextColor,
        secondaryBgColor: tp.secondary_bg_color ?? DEFAULT_THEME.secondaryBgColor,
        isDark: tg.colorScheme === 'dark',
      })
    }

    update()
    tg.onEvent('themeChanged', update)
    return () => tg.offEvent('themeChanged', update)
  }, [])

  return theme
}
