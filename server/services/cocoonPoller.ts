/**
 * CocoonPoller - Periodically polls the Cocoon network for node metrics
 * and stores them in the database for the dashboard to consume.
 */

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
      // TODO: In production, fetch registered node IDs from database
      // then query Cocoon API for each node's status
      const nodeIds = await this.getRegisteredNodeIds()

      for (const nodeId of nodeIds) {
        try {
          const metrics = await this.fetchNodeMetrics(nodeId)
          if (metrics) {
            await this.storeMetrics(metrics)
            await this.checkAlerts(metrics)
          }
        } catch (err) {
          console.error(`[CocoonPoller] Failed to poll node ${nodeId}:`, err)
        }
      }
    } catch (err) {
      console.error('[CocoonPoller] Poll cycle failed:', err)
    }
  }

  private async getRegisteredNodeIds(): Promise<string[]> {
    // TODO: Query database for all registered node IDs
    return []
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
    // TODO: Insert into node_metrics table
    // Also update the latest snapshot in Redis for fast reads
    console.log(`[CocoonPoller] Stored metrics for ${metrics.node_id}: GPU ${metrics.gpu_utilization}%, Temp ${metrics.temperature_c}°C`)
  }

  private async checkAlerts(metrics: NodeMetricsResponse): Promise<void> {
    // TODO: Check against alert_preferences and send Telegram alerts if needed
    // - Node went offline
    // - Temperature exceeded threshold
    // - TEE attestation failed

    if (metrics.status === 'offline') {
      console.log(`[CocoonPoller] ALERT: Node ${metrics.node_id} is offline`)
      // await alertService.sendNodeOfflineAlert(metrics.node_id)
    }

    if (metrics.temperature_c > 85) {
      console.log(`[CocoonPoller] ALERT: Node ${metrics.node_id} temp ${metrics.temperature_c}°C exceeds threshold`)
      // await alertService.sendTempAlert(metrics.node_id, metrics.temperature_c)
    }
  }
}
