/**
 * Telegram Mini App utilities
 */

export function getTelegramUser() {
  const tg = window.Telegram?.WebApp
  if (!tg?.initDataUnsafe?.user) return null
  return tg.initDataUnsafe.user
}

export function getTelegramInitData(): string {
  return window.Telegram?.WebApp?.initData ?? ''
}

export function hapticFeedback(type: 'light' | 'medium' | 'heavy' = 'medium') {
  window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(type)
}

export function hapticNotification(type: 'error' | 'success' | 'warning') {
  window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred(type)
}

export function expandApp() {
  window.Telegram?.WebApp?.expand()
}

export function closeApp() {
  window.Telegram?.WebApp?.close()
}

let _mainButtonHandler: (() => void) | null = null

export function showMainButton(text: string, onClick: () => void) {
  const btn = window.Telegram?.WebApp?.MainButton
  if (!btn) return
  if (_mainButtonHandler) btn.offClick(_mainButtonHandler)
  _mainButtonHandler = onClick
  btn.text = text
  btn.onClick(onClick)
  btn.show()
}

export function hideMainButton() {
  const btn = window.Telegram?.WebApp?.MainButton
  if (!btn) return
  if (_mainButtonHandler) btn.offClick(_mainButtonHandler)
  _mainButtonHandler = null
  btn.hide()
}

let _backButtonHandler: (() => void) | null = null

export function showBackButton(onClick: () => void) {
  const btn = window.Telegram?.WebApp?.BackButton
  if (!btn) return
  if (_backButtonHandler) btn.offClick(_backButtonHandler)
  _backButtonHandler = onClick
  btn.onClick(onClick)
  btn.show()
}

export function hideBackButton() {
  const btn = window.Telegram?.WebApp?.BackButton
  if (!btn) return
  if (_backButtonHandler) btn.offClick(_backButtonHandler)
  _backButtonHandler = null
  btn.hide()
}

/**
 * Cloud storage for user preferences
 */
export function cloudStorageSet(key: string, value: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const cs = window.Telegram?.WebApp?.CloudStorage
    if (!cs) { resolve(); return }
    cs.setItem(key, value, (err: unknown) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export function cloudStorageGet(key: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const cs = window.Telegram?.WebApp?.CloudStorage
    if (!cs) { resolve(null); return }
    cs.getItem(key, (err: unknown, value: string) => {
      if (err) reject(err)
      else resolve(value || null)
    })
  })
}
