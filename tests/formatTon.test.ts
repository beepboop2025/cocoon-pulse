import { describe, it, expect } from 'vitest'
import {
  formatTon,
  formatTonCompact,
  tonToUsd,
  formatCurrency,
} from '@/utils/formatTon'

describe('formatTon', () => {
  it('formats with 3 decimals and the TON suffix by default', () => {
    expect(formatTon(1.23456)).toBe('1.235 TON')
  })

  it('honours a custom decimal count', () => {
    expect(formatTon(1.23456, 1)).toBe('1.2 TON')
    expect(formatTon(2, 0)).toBe('2 TON')
  })

  it('coerces non-finite / non-numeric input to 0', () => {
    // Number(NaN) || 0 -> 0
    expect(formatTon(NaN)).toBe('0.000 TON')
    expect(formatTon(undefined as unknown as number)).toBe('0.000 TON')
  })

  it('rounds at the requested precision (banker-agnostic toFixed)', () => {
    expect(formatTon(0.0005, 3)).toBe('0.001 TON')
  })
})

describe('formatTonCompact', () => {
  it('uses M notation for millions', () => {
    expect(formatTonCompact(2_500_000)).toBe('2.50M TON')
  })

  it('uses K notation for thousands', () => {
    expect(formatTonCompact(1500)).toBe('1.50K TON')
  })

  it('falls back to full formatting below 1000', () => {
    expect(formatTonCompact(999.5)).toBe('999.500 TON')
  })

  it('treats exactly 1000 and 1_000_000 as the higher bucket (>= boundary)', () => {
    expect(formatTonCompact(1000)).toBe('1.00K TON')
    expect(formatTonCompact(1_000_000)).toBe('1.00M TON')
  })
})

describe('tonToUsd', () => {
  it('multiplies by the mock 2.4 rate and prefixes $', () => {
    expect(tonToUsd(10)).toBe('$24.00')
  })

  it('guards against bad input', () => {
    expect(tonToUsd(NaN)).toBe('$0.00')
  })
})

describe('formatCurrency', () => {
  it('dispatches to TON formatting', () => {
    expect(formatCurrency(5, 'TON')).toBe('5.000 TON')
  })

  it('dispatches to USD formatting', () => {
    expect(formatCurrency(5, 'USD')).toBe('$12.00')
  })
})
