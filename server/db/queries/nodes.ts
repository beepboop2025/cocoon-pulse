import { query } from '../client.js'

export interface NodeRow {
  id: number
  user_id: number
  node_id: string
  name: string
  wallet_address: string
  gpu_model: string | null
  vram_total_mb: number
  created_at: string
}

export interface NodeWithMetrics extends NodeRow {
  status: string
  gpu_utilization: number
  vram_used_mb: number
  temperature: number
  uptime_seconds: number
  tee_status: string
  last_heartbeat: string | null
}

/** Fetch all nodes for a wallet, joined with latest metrics */
export async function getNodesByWallet(walletAddress: string): Promise<NodeWithMetrics[]> {
  const result = await query<NodeWithMetrics>(
    `SELECT n.*,
            COALESCE(m.status, 'offline') AS status,
            COALESCE(m.gpu_utilization, 0) AS gpu_utilization,
            COALESCE(m.vram_used_mb, 0) AS vram_used_mb,
            COALESCE(m.temperature, 0) AS temperature,
            COALESCE(m.uptime_seconds, 0) AS uptime_seconds,
            COALESCE(m.tee_status, 'pending') AS tee_status,
            m.recorded_at AS last_heartbeat
     FROM nodes n
     LEFT JOIN LATERAL (
       SELECT * FROM node_metrics nm
       WHERE nm.node_id = n.node_id
       ORDER BY nm.recorded_at DESC
       LIMIT 1
     ) m ON true
     WHERE n.wallet_address = $1
     ORDER BY n.created_at DESC`,
    [walletAddress],
  )
  return result.rows
}

/** Register a new node for a user */
export async function registerNode(
  userId: number,
  nodeId: string,
  walletAddress: string,
  name?: string,
  gpuModel?: string,
  vramTotalMb?: number,
) {
  const result = await query(
    `INSERT INTO nodes (user_id, node_id, wallet_address, name, gpu_model, vram_total_mb)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (node_id) DO UPDATE SET
       name = COALESCE($4, nodes.name),
       gpu_model = COALESCE($5, nodes.gpu_model),
       vram_total_mb = COALESCE($6, nodes.vram_total_mb)
     RETURNING *`,
    [userId, nodeId, walletAddress, name ?? `Node ${nodeId.slice(-3)}`, gpuModel ?? null, vramTotalMb ?? 0],
  )
  return result.rows[0]
}

/** Delete a node by node_id and wallet (ownership check) */
export async function deleteNode(nodeId: string, walletAddress: string): Promise<boolean> {
  const result = await query(
    'DELETE FROM nodes WHERE node_id = $1 AND wallet_address = $2',
    [nodeId, walletAddress],
  )
  return (result.rowCount ?? 0) > 0
}

/** Rename a node */
export async function updateNodeName(nodeId: string, name: string, walletAddress: string): Promise<boolean> {
  const result = await query(
    'UPDATE nodes SET name = $1 WHERE node_id = $2 AND wallet_address = $3',
    [name, nodeId, walletAddress],
  )
  return (result.rowCount ?? 0) > 0
}

/** Get all registered node IDs (for the poller) */
export async function getAllNodeIds(): Promise<string[]> {
  const result = await query<{ node_id: string }>('SELECT node_id FROM nodes')
  return result.rows.map((r) => r.node_id)
}

/** Insert a metrics snapshot */
export async function insertMetrics(
  nodeId: string,
  status: string,
  gpuUtilization: number,
  vramUsedMb: number,
  temperature: number,
  uptimeSeconds: number,
  teeStatus: string,
) {
  await query(
    `INSERT INTO node_metrics (node_id, status, gpu_utilization, vram_used_mb, temperature, uptime_seconds, tee_status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [nodeId, status, gpuUtilization, vramUsedMb, temperature, uptimeSeconds, teeStatus],
  )
}
