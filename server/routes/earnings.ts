import { Router, type Request, type Response } from 'express'

export const earningsRouter = Router()

// GET /api/earnings?wallet=...&period=week
earningsRouter.get('/', (req: Request, res: Response) => {
  const wallet = req.query.wallet as string
  const period = (req.query.period as string) ?? 'week'

  if (!wallet) {
    res.status(400).json({ error: 'wallet query parameter required' })
    return
  }

  // TODO: Query database for earnings aggregated by period
  const mockStats = {
    today: 4.28,
    thisWeek: 28.95,
    thisMonth: 112.40,
    allTime: 472.08,
    projectedDaily: 4.71,
    projectedMonthly: 131.46,
    percentChangeVsPrevPeriod: 8.3,
  }

  res.json({ stats: mockStats, period })
})

// GET /api/earnings/tasks?wallet=...&type=all&limit=50
earningsRouter.get('/tasks', (req: Request, res: Response) => {
  const wallet = req.query.wallet as string
  const taskType = req.query.type as string ?? 'all'
  const limit = Math.min(Number(req.query.limit) || 50, 200)

  if (!wallet) {
    res.status(400).json({ error: 'wallet query parameter required' })
    return
  }

  // TODO: Query database for task records
  res.json({ tasks: [], taskType, limit })
})

// GET /api/earnings/daily?wallet=...&days=30
earningsRouter.get('/daily', (req: Request, res: Response) => {
  const wallet = req.query.wallet as string
  const days = Math.min(Number(req.query.days) || 30, 365)

  if (!wallet) {
    res.status(400).json({ error: 'wallet query parameter required' })
    return
  }

  // TODO: Query daily_earnings_cache table
  res.json({ daily: [], days })
})

// GET /api/earnings/export?wallet=...
earningsRouter.get('/export', (req: Request, res: Response) => {
  const wallet = req.query.wallet as string

  if (!wallet) {
    res.status(400).json({ error: 'wallet query parameter required' })
    return
  }

  // TODO: Generate CSV from earnings table
  const csv = 'task_id,node_id,task_type,ton_reward,compute_time_ms,completed_at\n'
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', `attachment; filename="cocoon-earnings-${Date.now()}.csv"`)
  res.send(csv)
})
