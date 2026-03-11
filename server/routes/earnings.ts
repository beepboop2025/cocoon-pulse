import { Router, type Request, type Response } from 'express'
import { getEarningsStats, getTaskRecords, getDailyEarnings, exportEarnings } from '../db/queries/earnings.js'

export const earningsRouter = Router()

// GET /api/earnings?wallet=...&period=week
earningsRouter.get('/', async (req: Request, res: Response) => {
  const wallet = req.query.wallet as string
  const period = (req.query.period as string) ?? 'week'

  if (!wallet) {
    res.status(400).json({ error: 'wallet query parameter required' })
    return
  }

  try {
    const raw = await getEarningsStats(wallet, period)
    res.json({
      stats: {
        today: Number(raw.today),
        thisWeek: Number(raw.this_week),
        thisMonth: Number(raw.this_month),
        allTime: Number(raw.all_time),
        projectedDaily: Number(raw.projected_daily),
        projectedMonthly: Number(raw.projected_monthly),
        percentChangeVsPrevPeriod: Number(raw.percent_change),
      },
      period,
    })
  } catch (err) {
    console.error('[earnings] GET / error:', err)
    res.status(500).json({ error: 'Failed to fetch earnings' })
  }
})

// GET /api/earnings/tasks?wallet=...&type=all&limit=50
earningsRouter.get('/tasks', async (req: Request, res: Response) => {
  const wallet = req.query.wallet as string
  const taskType = (req.query.type as string) ?? 'all'
  const limit = Math.min(Number(req.query.limit) || 50, 200)
  const offset = Number(req.query.offset) || 0

  if (!wallet) {
    res.status(400).json({ error: 'wallet query parameter required' })
    return
  }

  try {
    const tasks = await getTaskRecords(wallet, taskType, limit, offset)
    res.json({ tasks, taskType, limit })
  } catch (err) {
    console.error('[earnings] GET /tasks error:', err)
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
})

// GET /api/earnings/daily?wallet=...&days=30
earningsRouter.get('/daily', async (req: Request, res: Response) => {
  const wallet = req.query.wallet as string
  const days = Math.min(Number(req.query.days) || 30, 365)

  if (!wallet) {
    res.status(400).json({ error: 'wallet query parameter required' })
    return
  }

  try {
    const daily = await getDailyEarnings(wallet, days)
    res.json({
      daily: daily.map((d) => ({
        date: d.date,
        totalTon: Number(d.total_ton),
        taskCount: Number(d.task_count),
      })),
      days,
    })
  } catch (err) {
    console.error('[earnings] GET /daily error:', err)
    res.status(500).json({ error: 'Failed to fetch daily earnings' })
  }
})

// GET /api/earnings/export?wallet=...
earningsRouter.get('/export', async (req: Request, res: Response) => {
  const wallet = req.query.wallet as string

  if (!wallet) {
    res.status(400).json({ error: 'wallet query parameter required' })
    return
  }

  try {
    const rows = await exportEarnings(wallet)
    const escCsv = (val: unknown) => `"${String(val ?? '').replace(/"/g, '""')}"`
    const header = '"task_id","node_id","task_type","ton_reward","compute_time_ms","completed_at"\n'
    const csv = header + rows.map((r) =>
      [r.task_id, r.node_id, r.task_type, r.ton_reward, r.compute_time_ms, r.completed_at].map(escCsv).join(',')
    ).join('\n')

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="cocoon-earnings-${Date.now()}.csv"`)
    res.send(csv)
  } catch (err) {
    console.error('[earnings] GET /export error:', err)
    res.status(500).json({ error: 'Failed to export earnings' })
  }
})
