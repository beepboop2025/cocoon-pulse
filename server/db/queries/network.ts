import { query } from '../client.js'

export interface NetworkStats {
  total_nodes: number
  total_tasks_today: number
  total_tasks_all_time: number
  avg_reward_per_task: number
}

/** Get global network statistics from the database */
export async function getNetworkStats(): Promise<NetworkStats> {
  const result = await query<NetworkStats>(
    `SELECT
       (SELECT COUNT(*) FROM nodes) AS total_nodes,
       (SELECT COUNT(*) FROM earnings WHERE completed_at >= CURRENT_DATE) AS total_tasks_today,
       (SELECT COUNT(*) FROM earnings) AS total_tasks_all_time,
       (SELECT COALESCE(AVG(ton_reward), 0) FROM earnings) AS avg_reward_per_task`,
  )
  return result.rows[0]
}

export interface RankResult {
  your_rank: number
  total_operators: number
  percentile: number
}

/** Calculate a wallet's rank among all operators by total earnings */
export async function getWalletRank(walletAddress: string): Promise<RankResult> {
  const result = await query<RankResult>(
    `WITH operator_earnings AS (
       SELECT n.wallet_address, SUM(e.ton_reward) AS total
       FROM nodes n
       JOIN earnings e ON e.node_id = n.node_id
       GROUP BY n.wallet_address
     ),
     ranked AS (
       SELECT wallet_address, total,
              ROW_NUMBER() OVER (ORDER BY total DESC) AS rank,
              COUNT(*) OVER () AS total_operators
       FROM operator_earnings
     )
     SELECT
       COALESCE(rank, 0)::int AS your_rank,
       COALESCE(total_operators, 0)::int AS total_operators,
       CASE WHEN total_operators > 0
        THEN ROUND((1.0 - (rank - 1.0) / total_operators) * 100, 1)
        ELSE 0 END AS percentile
     FROM ranked
     WHERE wallet_address = $1`,
    [walletAddress],
  )
  return result.rows[0] ?? { your_rank: 0, total_operators: 0, percentile: 0 }
}
