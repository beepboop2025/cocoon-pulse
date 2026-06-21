import { describe, it, expect, beforeEach } from 'vitest'
import { useNodeStore } from '@/store/nodeStore'

// Snapshot of the pristine state so each test starts clean.
const initialState = useNodeStore.getState()

describe('useNodeStore', () => {
  beforeEach(() => {
    useNodeStore.setState(initialState, true)
  })

  describe('navigation + selection', () => {
    it('updates the active tab', () => {
      useNodeStore.getState().setActiveTab('earnings')
      expect(useNodeStore.getState().activeTab).toBe('earnings')
    })

    it('sets and clears the selected node', () => {
      useNodeStore.getState().setSelectedNode('cocoon-node-002')
      expect(useNodeStore.getState().selectedNodeId).toBe('cocoon-node-002')
      useNodeStore.getState().setSelectedNode(null)
      expect(useNodeStore.getState().selectedNodeId).toBeNull()
    })
  })

  describe('updateSettings', () => {
    it('shallow-merges top-level settings', () => {
      useNodeStore.getState().updateSettings({ displayCurrency: 'USD' })
      expect(useNodeStore.getState().settings.displayCurrency).toBe('USD')
      // theme untouched
      expect(useNodeStore.getState().settings.theme).toBe('dark')
    })

    it('deep-merges the nested alerts object without dropping siblings', () => {
      useNodeStore.getState().updateSettings({
        alerts: { tempThresholdValue: 90 } as never,
      })
      const alerts = useNodeStore.getState().settings.alerts
      expect(alerts.tempThresholdValue).toBe(90)
      // sibling flags survive the partial update
      expect(alerts.nodeOffline).toBe(true)
      expect(alerts.teeFailure).toBe(true)
    })
  })

  describe('setWallet', () => {
    it('stores address and balance together', () => {
      useNodeStore.getState().setWallet('EQabc', 12.5)
      expect(useNodeStore.getState().walletAddress).toBe('EQabc')
      expect(useNodeStore.getState().walletBalance).toBe(12.5)
    })
  })

  describe('loadData (derived aggregations)', () => {
    beforeEach(() => {
      useNodeStore.getState().loadData()
    })

    it('clears the loading flag and populates nodes', () => {
      const s = useNodeStore.getState()
      expect(s.isLoading).toBe(false)
      expect(s.nodes.length).toBe(4)
    })

    it('auto-selects the first node', () => {
      expect(useNodeStore.getState().selectedNodeId).toBe(
        useNodeStore.getState().nodes[0].nodeId,
      )
    })

    it('fleet status counts sum to the node total', () => {
      const f = useNodeStore.getState().fleetSummary
      expect(f.totalNodes).toBe(4)
      expect(f.onlineNodes + f.offlineNodes + f.syncingNodes).toBe(f.totalNodes)
    })

    it('caps average uptime at 99.7%', () => {
      expect(useNodeStore.getState().fleetSummary.avgUptime).toBeLessThanOrEqual(99.7)
    })

    it('derives total compute as 42.5 TFLOPs per node', () => {
      expect(useNodeStore.getState().fleetSummary.totalComputeTflops).toBeCloseTo(4 * 42.5, 5)
    })

    it('weekly earnings equal the sum of the last 7 daily entries', () => {
      const s = useNodeStore.getState()
      const expectedWeek = s.dailyEarnings.slice(-7).reduce((a, d) => a + d.earnings, 0)
      expect(s.earningsStats.thisWeek).toBeCloseTo(expectedWeek, 6)
    })

    it('today equals the most recent daily entry', () => {
      const s = useNodeStore.getState()
      const last = s.dailyEarnings[s.dailyEarnings.length - 1].earnings
      expect(s.earningsStats.today).toBeCloseTo(last, 6)
    })

    it('rounds percentChangeVsPrevPeriod to one decimal place', () => {
      const pct = useNodeStore.getState().earningsStats.percentChangeVsPrevPeriod
      expect(Math.round(pct * 10) / 10).toBe(pct)
    })

    it('projects daily earnings as today * 1.1', () => {
      const s = useNodeStore.getState()
      expect(s.earningsStats.projectedDaily).toBeCloseTo(s.earningsStats.today * 1.1, 6)
    })
  })

  describe('refreshData', () => {
    it('toggles isRefreshing back to false and reloads data', async () => {
      await useNodeStore.getState().refreshData()
      const s = useNodeStore.getState()
      expect(s.isRefreshing).toBe(false)
      expect(s.nodes.length).toBe(4)
    })
  })
})
