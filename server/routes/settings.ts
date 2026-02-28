import { Router, type Request, type Response } from 'express'

export const settingsRouter = Router()

// GET /api/settings/alerts?wallet=...
settingsRouter.get('/alerts', (req: Request, res: Response) => {
  const wallet = req.query.wallet as string

  if (!wallet) {
    res.status(400).json({ error: 'wallet query parameter required' })
    return
  }

  // TODO: Query alert_preferences table
  res.json({
    nodeOffline: true,
    tempThreshold: true,
    tempThresholdValue: 85,
    earningsDrop: true,
    teeFailure: true,
  })
})

// PUT /api/settings/alerts
settingsRouter.put('/alerts', (req: Request, res: Response) => {
  const { walletAddress, ...prefs } = req.body as Record<string, unknown>

  if (!walletAddress) {
    res.status(400).json({ error: 'walletAddress is required' })
    return
  }

  // TODO: Upsert alert_preferences table
  res.json({ success: true, preferences: prefs })
})
