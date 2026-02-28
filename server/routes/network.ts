import { Router, type Request, type Response } from 'express'

export const networkRouter = Router()

// GET /api/network/stats
networkRouter.get('/stats', (_req: Request, res: Response) => {
  // TODO: Fetch from Cocoon API / cache in Redis
  res.json({
    totalNodes: 12847,
    totalTasksToday: 1_284_392,
    totalTasksAllTime: 89_432_108,
    avgRewardPerTask: 0.065,
    networkComputeTflops: 547_200,
  })
})

// GET /api/network/rank?wallet=...
networkRouter.get('/rank', (req: Request, res: Response) => {
  const wallet = req.query.wallet as string

  if (!wallet) {
    res.status(400).json({ error: 'wallet query parameter required' })
    return
  }

  // TODO: Calculate rank from earnings data
  res.json({
    yourRank: 342,
    totalOperators: 4821,
    percentile: 92.9,
  })
})
