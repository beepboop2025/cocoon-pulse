import { create } from 'zustand'
import type {
  NodeMetrics,
  EarningsRecord,
  EarningsStats,
  DailyEarnings,
  HourlyHeatmap,
  NetworkStats,
  UserSettings,
  FleetSummary,
  Tab,
} from '@/types'
import { generateMockNodes, generateMockEarnings, generateMockDailyEarnings, generateMockHeatmap, generateMockNetworkStats } from '@/services/mockData'

interface NodeStore {
  // Navigation
  activeTab: Tab
  setActiveTab: (tab: Tab) => void

  // Nodes
  nodes: NodeMetrics[]
  selectedNodeId: string | null
  setSelectedNode: (id: string | null) => void
  fleetSummary: FleetSummary

  // Earnings
  earningsStats: EarningsStats
  dailyEarnings: DailyEarnings[]
  recentTasks: EarningsRecord[]
  heatmapData: HourlyHeatmap[]

  // Network
  networkStats: NetworkStats

  // Settings
  settings: UserSettings
  updateSettings: (settings: Partial<UserSettings>) => void

  // Wallet
  walletAddress: string | null
  walletBalance: number
  setWallet: (address: string | null, balance: number) => void

  // Loading
  isLoading: boolean

  // Data
  loadData: () => void
  refreshData: () => Promise<void>
}

const defaultSettings: UserSettings = {
  displayCurrency: 'TON',
  alerts: {
    nodeOffline: true,
    tempThreshold: true,
    tempThresholdValue: 85,
    earningsDrop: true,
    teeFailure: true,
  },
  theme: 'dark',
}

export const useNodeStore = create<NodeStore>((set, get) => ({
  activeTab: 'dashboard',
  setActiveTab: (tab) => set({ activeTab: tab }),

  nodes: [],
  selectedNodeId: null,
  setSelectedNode: (id) => set({ selectedNodeId: id }),
  fleetSummary: { totalNodes: 0, onlineNodes: 0, offlineNodes: 0, syncingNodes: 0, totalComputeTflops: 0, avgUptime: 0 },

  earningsStats: { today: 0, thisWeek: 0, thisMonth: 0, allTime: 0, projectedDaily: 0, projectedMonthly: 0, percentChangeVsPrevPeriod: 0 },
  dailyEarnings: [],
  recentTasks: [],
  heatmapData: [],

  networkStats: { totalNodes: 0, totalTasksToday: 0, totalTasksAllTime: 0, avgRewardPerTask: 0, networkComputeTflops: 0, yourRank: 0, totalOperators: 0 },

  settings: defaultSettings,
  updateSettings: (partial) => set((s) => ({ settings: { ...s.settings, ...partial } })),

  walletAddress: null,
  walletBalance: 0,
  setWallet: (address, balance) => set({ walletAddress: address, walletBalance: balance }),

  isLoading: true,

  loadData: () => {
    const nodes = generateMockNodes()
    const recentTasks = generateMockEarnings(nodes.map((n) => n.nodeId))
    const dailyEarnings = generateMockDailyEarnings()
    const heatmapData = generateMockHeatmap()
    const networkStats = generateMockNetworkStats()

    const onlineNodes = nodes.filter((n) => n.status === 'online').length
    const offlineNodes = nodes.filter((n) => n.status === 'offline').length
    const syncingNodes = nodes.filter((n) => n.status === 'syncing').length
    const avgUptime = nodes.length > 0 ? nodes.reduce((sum, n) => sum + n.uptimeSeconds, 0) / nodes.length / 86400 * 100 : 0

    const todayEarnings = dailyEarnings[dailyEarnings.length - 1]?.earnings ?? 0
    const weekEarnings = dailyEarnings.slice(-7).reduce((s, d) => s + d.earnings, 0)
    const monthEarnings = dailyEarnings.reduce((s, d) => s + d.earnings, 0)
    const prevWeek = dailyEarnings.slice(-14, -7).reduce((s, d) => s + d.earnings, 0)
    const pctChange = prevWeek > 0 ? ((weekEarnings - prevWeek) / prevWeek) * 100 : 0

    set({
      nodes,
      selectedNodeId: nodes[0]?.nodeId ?? null,
      fleetSummary: {
        totalNodes: nodes.length,
        onlineNodes,
        offlineNodes,
        syncingNodes,
        totalComputeTflops: nodes.length * 42.5,
        avgUptime: Math.min(avgUptime, 99.7),
      },
      earningsStats: {
        today: todayEarnings,
        thisWeek: weekEarnings,
        thisMonth: monthEarnings,
        allTime: monthEarnings * 4.2,
        projectedDaily: todayEarnings * 1.1,
        projectedMonthly: weekEarnings * 4.3,
        percentChangeVsPrevPeriod: Math.round(pctChange * 10) / 10,
      },
      dailyEarnings,
      recentTasks,
      heatmapData,
      networkStats,
      isLoading: false,
    })
  },

  refreshData: async () => {
    set({ isLoading: true })
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800))
    get().loadData()
  },
}))
