import { useEffect, type ReactNode } from 'react'
import { expandApp } from '@/services/telegram'

interface TelegramProviderProps {
  children: ReactNode
}

export function TelegramProvider({ children }: TelegramProviderProps) {
  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.ready()
      expandApp()
    }
  }, [])

  return <>{children}</>
}
