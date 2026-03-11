import { query } from '../client.js'

export interface EarningsStats {
  today: number
  this_week: number
  this_month: number
  all_time: number
  projected_daily: number
  projected_monthly: number
  percent_change: number
}

/** Get aggregated earnings stats for a wallet */
export async function getEarningsStats(walletAddress: string, _period: string): Promise<EarningsStats> {
  const result = await query<EarningsStats>(
    `WITH wallet_nodes AS (
       SELECT node_id FROM nodes WHERE wallet_address = $1
     ),
     today AS (
       SELECT COALESCE(SUM(ton_reward), 0) AS val
       FROM earnings WHERE node_id IN (SELECT node_id FROM wallet_nodes)
       AND completed_at >= CURRENT_DATE
     ),
     this_week AS (
       SELECT COALESCE(SUM(ton_reward), 0) AS val
       FROM earnings WHERE node_id IN (SELECT node_id FROM wallet_nodes)
       AND completed_at >= date_trunc('week', CURRENT_DATE)
     ),
     this_month AS (
       SELECT COALESCE(SUM(ton_reward), 0) AS val
       FROM earnings WHERE node_id IN (SELECT node_id FROM wallet_nodes)
       AND completed_at >= date_trunc('month', CURRENT_DATE)
     ),
     all_time AS (
       SELECT COALESCE(SUM(ton_reward), 0) AS val
       FROM earnings WHERE node_id IN (SELECT node_id FROM wallet_nodes)
     ),
     prev_period AS (
       SELECT COALESCE(SUM(ton_reward), 0) AS val
       FROM earnings WHERE node_id IN (SELECT node_id FROM wallet_nodes)
       AND completed_at >= (CURRENT_DATE - INTERVAL '14 days')
       AND completed_at < (CURRENT_DATE - INTERVAL '7 days')
     ),
     avg_daily AS (
       SELECT COALESCE(AVG(daily_sum), 0) AS val FROM (
         SELECT DATE(completed_at) AS d, SUM(ton_reward) AS daily_sum
         FROM earnings WHERE node_id IN (SELECT node_id FROM wallet_nodes)
         AND completed_at >= CURRENT_DATE - INTERVAL '7 days'
         GROUP BY DATE(completed_at)
       ) sub
     )
     SELECT
       (SELECT val FROM today) AS today,
       (SELECT val FROM this_week) AS this_week,
       (SELECT val FROM this_month) AS this_month,
       (SELECT val FROM all_time) AS all_time,
       (SELECT val FROM avg_daily) AS projected_daily,
       (SELECT val FROM avg_daily) * 30 AS projected_monthly,
       CASE WHEN (SELECT val FROM prev_period) > 0
        THEN ROUND(((SELECT val FROM this_week) - (SELECT val FROM prev_period)) / (SELECT val FROM prev_period) * 100, 1)
        ELSE 0 END AS percent_change`,
    [walletAddress],
  )
  return result.rows[0] ?? { today: 0, this_week: 0, this_month: 0, all_time: 0, projected_daily: 0, projected_monthly: 0, percent_change: 0 }
}

export interface TaskRecord {
  task_id: string
  node_id: string
  task_type: string
  ton_reward: number
  compute_time_ms: number
  completed_at: string
}

/** Get paginated task records for a wallet */
export async function getTaskRecords(
  walletAddress: string,
  taskType: string,
  limit: number,
  offset = 0,
): Promise<TaskRecord[]> {
  const typeFilter = taskType !== 'all' ? 'AND e.task_type = $3' : ''
  const params: unknown[] = [walletAddress, limit]
  if (taskType !== 'all') params.push(taskType)
  params.push(offset)

  const result = await query<TaskRecord>(
    `SELECT e.task_id, e.node_id, e.task_type, e.ton_reward, e.compute_time_ms, e.completed_at
     FROM earnings e
     JOIN nodes n ON n.node_id = e.node_id
     WHERE n.wallet_address = $1 ${typeFilter}
     ORDER BY e.completed_at DESC
     LIMIT $2 OFFSET $${params.length}`,
    params,
  )
  return result.rows
}

export interface DailyEarning {
  date: string
  total_ton: number
  task_count: number
}

/** Get daily earnings from the cache table */
export async function getDailyEarnings(walletAddress: string, days: number): Promise<DailyEarning[]> {
  const result = await query<DailyEarning>(
    `SELECT dc.date, dc.total_ton, dc.task_count
     FROM daily_earnings_cache dc
     JOIN nodes n ON n.node_id = dc.node_id
     WHERE n.wallet_address = $1 AND dc.date >= CURRENT_DATE - $2::int
     ORDER BY dc.date DESC`,
    [walletAddress, days],
  )
  return result.rows
}

/** Export all earnings as CSV-ready rows */
export async function exportEarnings(walletAddress: string): Promise<TaskRecord[]> {
  const result = await query<TaskRecord>(
    `SELECT e.task_id, e.node_id, e.task_type, e.ton_reward, e.compute_time_ms, e.completed_at
     FROM earnings e
     JOIN nodes n ON n.node_id = e.node_id
     WHERE n.wallet_address = $1
     ORDER BY e.completed_at DESC`,
    [walletAddress],
  )
  return result.rows
}
