/**
 * Cocoon Network API client
 *
 * All requests are proxied through the backend server to avoid
 * exposing API keys in the client bundle.
 */

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

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

async function apiFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: {
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
  return apiFetch<CocoonNodeStatus>(`/nodes/${nodeId}/status`)
}

export async function fetchNodeTasks(nodeId: string, limit = 50): Promise<CocoonTaskRecord[] | null> {
  return apiFetch<CocoonTaskRecord[]>(`/nodes/${nodeId}/tasks?limit=${limit}`)
}

export async function fetchNetworkOverview() {
  return apiFetch<{
    total_nodes: number
    total_tasks_24h: number
    total_tasks_all_time: number
    avg_reward_nanoton: number
    network_tflops: number
  }>('/network/overview')
}
