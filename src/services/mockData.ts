import type { NodeMetrics, EarningsRecord, DailyEarnings, HourlyHeatmap, NetworkStats, TaskType } from '@/types'
import { subDays, format } from 'date-fns'

const GPU_MODELS = ['NVIDIA A100 80GB', 'NVIDIA H100 80GB', 'NVIDIA RTX 4090', 'NVIDIA A6000']
const TASK_TYPES: TaskType[] = ['translation', 'summarization', 'inference', 'other']

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

export function generateMockNodes(): NodeMetrics[] {
  const rand = seededRandom(42)
  const statuses: Array<NodeMetrics['status']> = ['online', 'online', 'online', 'syncing']

  return Array.from({ length: 4 }, (_, i) => {
    const status = i === 3 ? 'syncing' : statuses[i] ?? 'online'
    return {
      nodeId: `cocoon-node-${String(i + 1).padStart(3, '0')}`,
      name: `GPU Node ${i + 1}`,
      walletAddress: `EQ${Array.from({ length: 48 }, () => '0123456789ABCDEF'[Math.floor(rand() * 16)]).join('')}`,
      status,
      gpuUtilization: status === 'online' ? Math.round(65 + rand() * 30) : status === 'syncing' ? Math.round(20 + rand() * 15) : 0,
      vramUsed: status === 'online' ? Math.round(45000 + rand() * 30000) : 0,
      vramTotal: 81920,
      temperature: status === 'online' ? Math.round(58 + rand() * 22) : 25,
      uptimeSeconds: Math.round((5 + rand() * 25) * 86400),
      teeStatus: i === 2 ? 'pending' : 'verified',
      lastHeartbeat: new Date().toISOString(),
      gpuModel: GPU_MODELS[i % GPU_MODELS.length] ?? 'NVIDIA A100',
    }
  })
}

export function generateMockEarnings(nodeIds: string[]): EarningsRecord[] {
  const rand = seededRandom(123)
  const records: EarningsRecord[] = []

  for (let i = 0; i < 50; i++) {
    const hoursAgo = i * (0.5 + rand() * 2)
    records.push({
      taskId: `task-${String(i + 1).padStart(5, '0')}`,
      nodeId: nodeIds[Math.floor(rand() * nodeIds.length)] ?? nodeIds[0] ?? '',
      taskType: TASK_TYPES[Math.floor(rand() * TASK_TYPES.length)] ?? 'inference',
      tonReward: Math.round((0.02 + rand() * 0.15) * 1000) / 1000,
      computeTimeMs: Math.round(500 + rand() * 9500),
      completedAt: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
    })
  }

  return records
}

export function generateMockDailyEarnings(): DailyEarnings[] {
  const rand = seededRandom(456)
  return Array.from({ length: 30 }, (_, i) => ({
    date: format(subDays(new Date(), 29 - i), 'yyyy-MM-dd'),
    earnings: Math.round((2.5 + rand() * 4.5) * 100) / 100,
    tasks: Math.round(80 + rand() * 120),
  }))
}

export function generateMockHeatmap(): HourlyHeatmap[] {
  const rand = seededRandom(789)
  const data: HourlyHeatmap[] = []
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      // Higher activity during UTC 0-8 (night in US = peak AI demand)
      const peakMultiplier = hour >= 0 && hour <= 8 ? 1.8 : 1
      data.push({
        day,
        hour,
        taskCount: Math.round(rand() * 15 * peakMultiplier),
      })
    }
  }
  return data
}

export function generateMockNetworkStats(): NetworkStats {
  return {
    totalNodes: 12847,
    totalTasksToday: 1_284_392,
    totalTasksAllTime: 89_432_108,
    avgRewardPerTask: 0.065,
    networkComputeTflops: 547_200,
    yourRank: 342,
    totalOperators: 4821,
  }
}
