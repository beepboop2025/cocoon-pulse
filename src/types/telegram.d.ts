/* eslint-disable @typescript-eslint/no-explicit-any */
interface TelegramWebAppUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
}

interface TelegramWebAppButton {
  text: string
  isVisible: boolean
  show(): void
  hide(): void
  onClick(fn: () => void): void
  offClick(fn: () => void): void
}

interface TelegramWebAppHaptic {
  impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void
  notificationOccurred(type: 'error' | 'success' | 'warning'): void
  selectionChanged(): void
}

interface TelegramCloudStorage {
  setItem(key: string, value: string, callback?: (err: any) => void): void
  getItem(key: string, callback?: (err: any, value: string) => void): void
  removeItem(key: string, callback?: (err: any) => void): void
  getKeys(callback?: (err: any, keys: string[]) => void): void
}

interface TelegramWebApp {
  initData: string
  initDataUnsafe: {
    user?: TelegramWebAppUser
    auth_date?: number
    hash?: string
  }
  colorScheme: 'light' | 'dark'
  themeParams: {
    bg_color?: string
    text_color?: string
    hint_color?: string
    button_color?: string
    button_text_color?: string
    secondary_bg_color?: string
  }
  MainButton: TelegramWebAppButton
  BackButton: TelegramWebAppButton
  HapticFeedback: TelegramWebAppHaptic
  CloudStorage: TelegramCloudStorage
  expand(): void
  close(): void
  ready(): void
  onEvent(event: string, callback: () => void): void
  offEvent(event: string, callback: () => void): void
  version: string
  platform: string
}

interface Window {
  Telegram?: {
    WebApp?: TelegramWebApp
  }
}
