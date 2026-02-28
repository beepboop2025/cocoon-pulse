import type { Request, Response, NextFunction } from 'express'
import crypto from 'node:crypto'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? ''

/**
 * Validate Telegram Mini App initData using HMAC-SHA256.
 * See: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function validateTelegramAuth(req: Request, res: Response, next: NextFunction): void {
  const initData = req.headers['x-telegram-init-data'] as string | undefined

  // In development, skip validation
  if (process.env.NODE_ENV === 'development') {
    next()
    return
  }

  if (!initData) {
    res.status(401).json({ error: 'Missing Telegram init data' })
    return
  }

  try {
    const params = new URLSearchParams(initData)
    const hash = params.get('hash')
    if (!hash) {
      res.status(401).json({ error: 'Missing hash in init data' })
      return
    }

    params.delete('hash')
    const dataCheckArr = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
    const dataCheckString = dataCheckArr.join('\n')

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest()
    const computedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex')

    if (computedHash !== hash) {
      res.status(401).json({ error: 'Invalid init data hash' })
      return
    }

    // Check auth_date is not too old (5 minutes)
    const authDate = Number(params.get('auth_date'))
    if (!authDate || authDate <= 0 || Date.now() / 1000 - authDate > 300) {
      res.status(401).json({ error: 'Init data expired' })
      return
    }

    // Attach user to request
    const userParam = params.get('user')
    if (userParam) {
      try {
        (req as Record<string, unknown>).telegramUser = JSON.parse(userParam)
      } catch {
        // non-critical
      }
    }

    next()
  } catch {
    res.status(401).json({ error: 'Auth validation failed' })
  }
}
