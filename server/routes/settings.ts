import { Router, type Request, type Response } from 'express'
import { getAlertPreferences, upsertAlertPreferences } from '../db/queries/settings.js'

export const settingsRouter = Router()

// GET /api/settings/alerts?wallet=...
settingsRouter.get('/alerts', async (req: Request, res: Response) => {
  const wallet = req.query.wallet as string

  if (!wallet) {
    res.status(400).json({ error: 'wallet query parameter required' })
    return
  }

  try {
    const prefs = await getAlertPreferences(wallet)
    if (!prefs) {
      // Return defaults if no preferences set
      res.json({
        nodeOffline: true,
        tempThreshold: true,
        tempThresholdValue: 85,
        earningsDrop: true,
        teeFailure: true,
      })
      return
    }

    res.json({
      nodeOffline: prefs.node_offline,
      tempThreshold: prefs.temp_threshold,
      tempThresholdValue: prefs.temp_threshold_value,
      earningsDrop: prefs.earnings_drop,
      teeFailure: prefs.tee_failure,
    })
  } catch (err) {
    console.error('[settings] GET /alerts error:', err)
    res.status(500).json({ error: 'Failed to fetch alert preferences' })
  }
})

// PUT /api/settings/alerts
settingsRouter.put('/alerts', async (req: Request, res: Response) => {
  const { walletAddress, nodeOffline, tempThreshold, tempThresholdValue, earningsDrop, teeFailure } = req.body as {
    walletAddress?: string
    nodeOffline?: boolean
    tempThreshold?: boolean
    tempThresholdValue?: number
    earningsDrop?: boolean
    teeFailure?: boolean
  }

  if (!walletAddress) {
    res.status(400).json({ error: 'walletAddress is required' })
    return
  }

  try {
    const prefs = await upsertAlertPreferences(walletAddress, {
      node_offline: nodeOffline,
      temp_threshold: tempThreshold,
      temp_threshold_value: tempThresholdValue,
      earnings_drop: earningsDrop,
      tee_failure: teeFailure,
    })

    res.json({
      success: true,
      preferences: {
        nodeOffline: prefs.node_offline,
        tempThreshold: prefs.temp_threshold,
        tempThresholdValue: prefs.temp_threshold_value,
        earningsDrop: prefs.earnings_drop,
        teeFailure: prefs.tee_failure,
      },
    })
  } catch (err) {
    console.error('[settings] PUT /alerts error:', err)
    res.status(500).json({ error: 'Failed to update alert preferences' })
  }
})
