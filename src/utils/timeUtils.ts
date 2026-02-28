import { formatDistanceToNow, format } from 'date-fns'

/**
 * Format uptime from seconds to human-readable
 */
export function formatUptime(seconds: number): string {
  const s = Number(seconds) || 0
  const days = Math.floor(s / 86400)
  const hours = Math.floor((s % 86400) / 3600)
  if (days > 0) return `${days}d ${hours}h`
  const mins = Math.floor((s % 3600) / 60)
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

/**
 * Format relative time (e.g., "2 minutes ago")
 */
export function timeAgo(iso: string): string {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true })
  } catch {
    return 'unknown'
  }
}

/**
 * Format timestamp for task list
 */
export function formatTaskTime(iso: string): string {
  try {
    return format(new Date(iso), 'MMM d, HH:mm')
  } catch {
    return 'unknown'
  }
}

/**
 * Format compute time in ms to human-readable
 */
export function formatComputeTime(ms: number): string {
  const v = Number(ms) || 0
  if (v < 1000) return `${Math.round(v)}ms`
  return `${(v / 1000).toFixed(1)}s`
}

/**
 * Day of week short names
 */
export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
