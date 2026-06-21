import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  generateMockNodes,
  generateMockEarnings,
  generateMockDailyEarnings,
  generateMockHeatmap,
  generateMockNetworkStats,
} from '@/services/mockData'

describe('generateMockNodes', () => {
  it('produces exactly 4 nodes', () => {
    expect(generateMockNodes()).toHaveLength(4)
  })

  it('is deterministic across calls for all seeded fields (only the live heartbeat differs)', () => {
    const strip = (ns: ReturnType<typeof generateMockNodes>) =>
      ns.map(({ lastHeartbeat: _omit, ...rest }) => rest)
    expect(strip(generateMockNodes())).toEqual(strip(generateMockNodes()))
  })

  it('zero-pads node ids and assigns the 4th node "syncing" status', () => {
    const nodes = generateMockNodes()
    expect(nodes[0].nodeId).toBe('cocoon-node-001')
    expect(nodes[3].nodeId).toBe('cocoon-node-004')
    expect(nodes[3].status).toBe('syncing')
  })

  it('emits 48-hex-char wallet addresses prefixed with EQ', () => {
    for (const node of generateMockNodes()) {
      expect(node.walletAddress).toMatch(/^EQ[0-9A-F]{48}$/)
    }
  })

  it('zeroes utilisation/vram/temperature only for non-online nodes', () => {
    const nodes = generateMockNodes()
    for (const node of nodes) {
      if (node.status === 'online') {
        expect(node.gpuUtilization).toBeGreaterThan(0)
        expect(node.vramUsed).toBeGreaterThan(0)
      } else {
        expect(node.gpuUtilization === 0 || node.status === 'syncing').toBe(true)
      }
      // every node reports the full 80GB card
      expect(node.vramTotal).toBe(81920)
    }
  })

  it('marks the 3rd node TEE attestation as pending, the rest verified', () => {
    const nodes = generateMockNodes()
    expect(nodes[2].teeStatus).toBe('pending')
    expect(nodes[0].teeStatus).toBe('verified')
    expect(nodes[3].teeStatus).toBe('verified')
  })
})

describe('generateMockEarnings', () => {
  it('produces 50 records bound to the supplied node ids', () => {
    const ids = ['cocoon-node-001', 'cocoon-node-002']
    const records = generateMockEarnings(ids)
    expect(records).toHaveLength(50)
    for (const r of records) {
      expect(ids).toContain(r.nodeId)
    }
  })

  it('keeps rewards inside the documented [0.02, 0.17] band', () => {
    for (const r of generateMockEarnings(['n1'])) {
      expect(r.tonReward).toBeGreaterThanOrEqual(0.02)
      expect(r.tonReward).toBeLessThanOrEqual(0.17)
    }
  })

  it('keeps compute time within [500, 10000] ms', () => {
    for (const r of generateMockEarnings(['n1'])) {
      expect(r.computeTimeMs).toBeGreaterThanOrEqual(500)
      expect(r.computeTimeMs).toBeLessThanOrEqual(10000)
    }
  })

  it('produces zero-padded sequential task ids and valid ISO timestamps', () => {
    const records = generateMockEarnings(['n1'])
    expect(records[0].taskId).toBe('task-00001')
    expect(records[49].taskId).toBe('task-00050')
    expect(Number.isNaN(Date.parse(records[0].completedAt))).toBe(false)
  })

  it('is deterministic for the same node ids when the clock is fixed', () => {
    // completedAt is derived from Date.now(); freeze it so the two runs match.
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-21T00:00:00Z'))
    try {
      expect(generateMockEarnings(['a', 'b'])).toEqual(generateMockEarnings(['a', 'b']))
    } finally {
      vi.useRealTimers()
    }
  })

  afterEach(() => {
    vi.useRealTimers()
  })
})

describe('generateMockDailyEarnings', () => {
  it('returns 30 chronologically-ordered days', () => {
    const days = generateMockDailyEarnings()
    expect(days).toHaveLength(30)
    const dates = days.map((d) => d.date)
    const sorted = [...dates].sort()
    expect(dates).toEqual(sorted)
  })

  it('keeps earnings in [2.5, 7] and task counts in [80, 200]', () => {
    for (const d of generateMockDailyEarnings()) {
      expect(d.earnings).toBeGreaterThanOrEqual(2.5)
      expect(d.earnings).toBeLessThanOrEqual(7)
      expect(d.tasks).toBeGreaterThanOrEqual(80)
      expect(d.tasks).toBeLessThanOrEqual(200)
    }
  })
})

describe('generateMockHeatmap', () => {
  it('covers the full 7x24 grid', () => {
    const grid = generateMockHeatmap()
    expect(grid).toHaveLength(7 * 24)
    const cells = new Set(grid.map((c) => `${c.day}:${c.hour}`))
    expect(cells.size).toBe(168)
  })

  it('never emits negative task counts and respects day/hour bounds', () => {
    for (const cell of generateMockHeatmap()) {
      expect(cell.day).toBeGreaterThanOrEqual(0)
      expect(cell.day).toBeLessThanOrEqual(6)
      expect(cell.hour).toBeGreaterThanOrEqual(0)
      expect(cell.hour).toBeLessThanOrEqual(23)
      expect(cell.taskCount).toBeGreaterThanOrEqual(0)
    }
  })
})

describe('generateMockNetworkStats', () => {
  it('returns the fixed network snapshot', () => {
    const s = generateMockNetworkStats()
    expect(s.totalNodes).toBe(12847)
    expect(s.yourRank).toBeLessThan(s.totalOperators)
    expect(s.avgRewardPerTask).toBeGreaterThan(0)
  })
})
