export type NodeStatus = 'online' | 'syncing' | 'offline'
export type TeeStatus = 'verified' | 'pending' | 'failed'
export type TaskType = 'translation' | 'summarization' | 'inference' | 'other'
export type TimePeriod = 'day' | 'week' | 'month' | 'all'

export interface NodeMetrics {
  nodeId: string
  name: string
  walletAddress: string
  status: NodeStatus
  gpuUtilization: number
  vramUsed: number
  vramTotal: number
  temperature: number
  uptimeSeconds: number
  teeStatus: TeeStatus
  lastHeartbeat: string
  gpuModel: string
}

export interface EarningsRecord {
  taskId: string
  nodeId: string
  taskType: TaskType
  tonReward: number
  computeTimeMs: number
  completedAt: string
}

export interface EarningsStats {
  today: number
  thisWeek: number
  thisMonth: number
  allTime: number
  projectedDaily: number
  projectedMonthly: number
  percentChangeVsPrevPeriod: number
}

export interface DailyEarnings {
  date: string
  earnings: number
  tasks: number
}

export interface HourlyHeatmap {
  day: number // 0-6
  hour: number // 0-23
  taskCount: number
}

export interface NetworkStats {
  totalNodes: number
  totalTasksToday: number
  totalTasksAllTime: number
  avgRewardPerTask: number
  networkComputeTflops: number
  yourRank: number
  totalOperators: number
}

export interface AlertConfig {
  nodeOffline: boolean
  tempThreshold: boolean
  tempThresholdValue: number
  earningsDrop: boolean
  teeFailure: boolean
}

export interface UserSettings {
  displayCurrency: 'TON' | 'USD'
  alerts: AlertConfig
  theme: 'dark' | 'light' | 'telegram'
}

export interface FleetSummary {
  totalNodes: number
  onlineNodes: number
  offlineNodes: number
  syncingNodes: number
  totalComputeTflops: number
  avgUptime: number
}

export type Tab = 'dashboard' | 'earnings' | 'analytics' | 'settings'
