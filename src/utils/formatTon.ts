/**
 * Format TON amount with diamond symbol
 */
export function formatTon(amount: number, decimals = 3): string {
  return `${(Number(amount) || 0).toFixed(decimals)} TON`
}

/**
 * Format TON with compact notation for large values
 */
export function formatTonCompact(amount: number): string {
  const v = Number(amount) || 0
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M TON`
  if (v >= 1_000) return `${(v / 1_000).toFixed(2)}K TON`
  return formatTon(v)
}

/**
 * Approximate USD value (1 TON ~ $2.40 as mock rate)
 */
const TON_USD_RATE = 2.4

export function tonToUsd(amount: number): string {
  return `$${((Number(amount) || 0) * TON_USD_RATE).toFixed(2)}`
}

export function formatCurrency(amount: number, currency: 'TON' | 'USD'): string {
  return currency === 'TON' ? formatTon(amount) : tonToUsd(amount)
}
