import { useRef, useCallback } from 'react'
import { useNodeStore } from '@/store/nodeStore'

export function usePullToRefresh() {
  const { refreshData, isLoading } = useNodeStore()
  const startY = useRef(0)
  const pulling = useRef(false)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0]?.clientY ?? 0
      pulling.current = true
    }
  }, [])

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!pulling.current || isLoading) return
      const endY = e.changedTouches[0]?.clientY ?? 0
      const delta = endY - startY.current
      if (delta > 80) {
        // Haptic feedback if available
        window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium')
        refreshData().catch(() => {})
      }
      pulling.current = false
    },
    [isLoading, refreshData],
  )

  return { onTouchStart, onTouchEnd, isLoading }
}
