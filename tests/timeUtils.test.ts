import { describe, it, expect } from 'vitest'
import {
  formatUptime,
  formatComputeTime,
  timeAgo,
  formatTaskTime,
  DAY_NAMES,
} from '@/utils/timeUtils'

describe('formatUptime', () => {
  it('renders days + hours when over a day', () => {
    // 2 days, 3 hours, plus stray minutes that must be dropped
    const secs = 2 * 86400 + 3 * 3600 + 47 * 60
    expect(formatUptime(secs)).toBe('2d 3h')
  })

  it('renders hours + minutes when under a day', () => {
    const secs = 5 * 3600 + 12 * 60
    expect(formatUptime(secs)).toBe('5h 12m')
  })

  it('renders just minutes when under an hour', () => {
    expect(formatUptime(45 * 60)).toBe('45m')
  })

  it('floors partial units rather than rounding', () => {
    // 1h 59m 59s -> still 1h 59m, never 2h
    expect(formatUptime(3600 + 59 * 60 + 59)).toBe('1h 59m')
  })

  it('coerces bad input to 0m', () => {
    expect(formatUptime(NaN)).toBe('0m')
    expect(formatUptime(undefined as unknown as number)).toBe('0m')
  })
})

describe('formatComputeTime', () => {
  it('keeps sub-second values in ms and rounds them', () => {
    expect(formatComputeTime(842.6)).toBe('843ms')
  })

  it('converts >= 1000ms to seconds with one decimal', () => {
    expect(formatComputeTime(2500)).toBe('2.5s')
  })

  it('treats exactly 1000ms as 1.0s (>= boundary)', () => {
    expect(formatComputeTime(1000)).toBe('1.0s')
  })

  it('guards bad input', () => {
    expect(formatComputeTime(NaN)).toBe('0ms')
  })
})

describe('timeAgo', () => {
  it('returns "unknown" for an unparseable date instead of throwing', () => {
    expect(timeAgo('not-a-date')).toBe('unknown')
  })

  it('produces a relative suffix for a valid recent ISO string', () => {
    const oneHourAgo = new Date(Date.now() - 3600_000).toISOString()
    expect(timeAgo(oneHourAgo)).toMatch(/ago$/)
  })
})

describe('formatTaskTime', () => {
  it('returns "unknown" for an invalid date', () => {
    expect(formatTaskTime('garbage')).toBe('unknown')
  })

  it('formats a valid ISO string as "MMM d, HH:mm"', () => {
    // Use an explicit local datetime so the pattern (not the tz) is asserted
    const out = formatTaskTime('2026-03-09T14:05:00')
    expect(out).toMatch(/^[A-Z][a-z]{2} \d{1,2}, \d{2}:\d{2}$/)
  })
})

describe('DAY_NAMES', () => {
  it('lists 7 weekday short names starting Monday', () => {
    expect(DAY_NAMES).toHaveLength(7)
    expect(DAY_NAMES[0]).toBe('Mon')
    expect(DAY_NAMES[6]).toBe('Sun')
  })
})
