/**
 * CocoonPoller - Periodically polls the Cocoon network for node metrics
 * and stores them in the database for the dashboard to consume.
 */

import { getAllNodeIds, insertMetrics } from '../db/queries/nodes.js'
import { cache } from '../cache/redis.js'

const POLL_INTERVAL_MS = 30_000 // 30 seconds
const COCOON_API = process.env.COCOON_API_URL ?? 'https://api.cocoon.network'

interface NodeMetricsResponse {
  node_id: string
  status: string
  gpu_utilization: number
  vram_used_mb: number
  temperature_c: number
  uptime_seconds: number
  tee_status: string
}

export class CocoonPoller {
  private intervalHandle: ReturnType<typeof setInterval> | null = null
  private isRunning = false

  start() {
    if (this.isRunning) return
    this.isRunning = true
    console.log(`[CocoonPoller] Starting with ${POLL_INTERVAL_MS}ms interval`)

    // Initial poll
    this.poll().catch((err) => console.error('[CocoonPoller] Initial poll failed:', err))

    this.intervalHandle = setInterval(() => {
      this.poll().catch((err) => console.error('[CocoonPoller] Poll failed:', err))
    }, POLL_INTERVAL_MS)
  }

  stop() {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle)
      this.intervalHandle = null
    }
    this.isRunning = false
    console.log('[CocoonPoller] Stopped')
  }

  private async poll() {
    try {
      const nodeIds = await getAllNodeIds()
      if (nodeIds.length === 0) return

      const BATCH_SIZE = 10
      for (let i = 0; i < nodeIds.length; i += BATCH_SIZE) {
        const batch = nodeIds.slice(i, i + BATCH_SIZE)
        await Promise.allSettled(
          batch.map(async (nodeId) => {
            const metrics = await this.fetchNodeMetrics(nodeId)
            if (metrics) {
              await this.storeMetrics(metrics)
              await this.cacheLatestMetrics(metrics)
              await this.checkAlerts(metrics)
            }
          })
        )
      }
    } catch (err) {
      console.error('[CocoonPoller] Poll cycle failed:', err)
    }
  }

  private async fetchNodeMetrics(nodeId: string): Promise<NodeMetricsResponse | null> {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 8000)

      const res = await fetch(`${COCOON_API}/v1/nodes/${nodeId}/status`, {
        headers: {
          'Authorization': `Bearer ${process.env.COCOON_API_KEY ?? ''}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      })

      clearTimeout(timeout)

      if (!res.ok) return null
      return (await res.json()) as NodeMetricsResponse
    } catch {
      return null
    }
  }

  private async storeMetrics(metrics: NodeMetricsResponse): Promise<void> {
    await insertMetrics(
      metrics.node_id,
      metrics.status,
      metrics.gpu_utilization,
      metrics.vram_used_mb,
      metrics.temperature_c,
      metrics.uptime_seconds,
      metrics.tee_status,
    )
  }

  private async cacheLatestMetrics(metrics: NodeMetricsResponse): Promise<void> {
    // Cache latest snapshot in Redis for fast reads (30s TTL matches poll interval)
    await cache.set(`node:metrics:${metrics.node_id}`, JSON.stringify(metrics), 60)
  }

  private async checkAlerts(metrics: NodeMetricsResponse): Promise<void> {
    if (metrics.status === 'offline') {
      console.log(`[CocoonPoller] ALERT: Node ${metrics.node_id} is offline`)
    }

    if (metrics.temperature_c > 85) {
      console.log(`[CocoonPoller] ALERT: Node ${metrics.node_id} temp ${metrics.temperature_c}°C exceeds threshold`)
    }

    if (metrics.tee_status === 'failed') {
      console.log(`[CocoonPoller] ALERT: Node ${metrics.node_id} TEE attestation failed`)
    }
  }
}
