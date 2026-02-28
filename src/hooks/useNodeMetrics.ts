import { useEffect, useRef } from 'react'
import { useNodeStore } from '@/store/nodeStore'

const POLL_INTERVAL = 30_000 // 30 seconds

/**
 * Hook that initializes node data and sets up polling
 */
export function useNodeMetrics() {
  const { loadData, refreshData, isLoading, nodes } = useNodeStore()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    loadData()

    intervalRef.current = setInterval(() => {
      refreshData().catch(() => {
        // Silently handle refresh errors - data will be stale but UI won't break
      })
    }, POLL_INTERVAL)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [loadData, refreshData])

  return { isLoading, nodes }
}
