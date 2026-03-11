import { useEffect, useRef, useState } from 'react'

interface AnimatedNumberOptions {
  duration?: number
  decimals?: number
}

/**
 * Smoothly animate a number from its previous value to a new target.
 * Uses requestAnimationFrame for 60fps counting.
 */
export function useAnimatedNumber(
  target: number,
  { duration = 600, decimals = 0 }: AnimatedNumberOptions = {},
): string {
  const [display, setDisplay] = useState(target)
  const prevRef = useRef(target)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const from = prevRef.current
    const to = target
    prevRef.current = target

    if (from === to) return

    const startTime = performance.now()

    function step(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = from + (to - from) * eased

      setDisplay(current)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        setDisplay(to)
      }
    }

    rafRef.current = requestAnimationFrame(step)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [target, duration])

  return display.toFixed(decimals)
}
