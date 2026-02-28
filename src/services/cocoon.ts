/**
 * Cocoon Network API client
 *
 * NOTE: Cocoon's developer APIs may still be maturing as of early 2026.
 * This client is built against expected schema and falls back to mock data.
 */

const COCOON_API = import.meta.env.VITE_COCOON_API_URL ?? 'https://api.cocoon.network'

interface CocoonNodeStatus {
  node_id: string
  status: string
  gpu_utilization: number
  vram_used_mb: number
  vram_total_mb: number
  temperature_c: number
  uptime_seconds: number
  tee_status: string
  last_heartbeat: string
}

interface CocoonTaskRecord {
  task_id: string
  node_id: string
  task_type: string
  reward_nanoton: number
  compute_time_ms: number
  completed_at: string
}

async function cocoonFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${COCOON_API}${path}`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_COCOON_API_KEY ?? ''}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    return res.json() as Promise<T>
  } catch {
    // API not available — will fall back to mock data
    return null
  }
}

export async function fetchNodeStatus(nodeId: string): Promise<CocoonNodeStatus | null> {
  return cocoonFetch<CocoonNodeStatus>(`/v1/nodes/${nodeId}/status`)
}

export async function fetchNodeTasks(nodeId: string, limit = 50): Promise<CocoonTaskRecord[] | null> {
  return cocoonFetch<CocoonTaskRecord[]>(`/v1/nodes/${nodeId}/tasks?limit=${limit}`)
}

export async function fetchNetworkOverview() {
  return cocoonFetch<{
    total_nodes: number
    total_tasks_24h: number
    total_tasks_all_time: number
    avg_reward_nanoton: number
    network_tflops: number
  }>('/v1/network/overview')
}
