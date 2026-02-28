import { Router, type Request, type Response } from 'express'
import { getNetworkStats, getWalletRank } from '../db/queries/network.js'
import { cache } from '../cache/redis.js'

export const networkRouter = Router()

// GET /api/network/stats
networkRouter.get('/stats', async (_req: Request, res: Response) => {
  try {
    // Check Redis cache first (60s TTL)
    const cached = await cache.get('network:stats')
    if (cached) {
      res.json(JSON.parse(cached))
      return
    }

    const raw = await getNetworkStats()
    const stats = {
      totalNodes: Number(raw.total_nodes),
      totalTasksToday: Number(raw.total_tasks_today),
      totalTasksAllTime: Number(raw.total_tasks_all_time),
      avgRewardPerTask: Number(raw.avg_reward_per_task),
    }

    await cache.set('network:stats', JSON.stringify(stats), 60)
    res.json(stats)
  } catch (err) {
    console.error('[network] GET /stats error:', err)
    res.status(500).json({ error: 'Failed to fetch network stats' })
  }
})

// GET /api/network/rank?wallet=...
networkRouter.get('/rank', async (req: Request, res: Response) => {
  const wallet = req.query.wallet as string

  if (!wallet) {
    res.status(400).json({ error: 'wallet query parameter required' })
    return
  }

  try {
    const rank = await getWalletRank(wallet)
    res.json({
      yourRank: rank.your_rank,
      totalOperators: rank.total_operators,
      percentile: Number(rank.percentile),
    })
  } catch (err) {
    console.error('[network] GET /rank error:', err)
    res.status(500).json({ error: 'Failed to fetch rank' })
  }
})
