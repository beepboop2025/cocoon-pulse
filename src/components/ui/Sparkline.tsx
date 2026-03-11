import { useMemo } from 'react'

interface SparklineProps {
  data: number[]
  color?: string
  width?: number
  height?: number
}

/**
 * Lightweight SVG sparkline micro-chart.
 * No dependencies — pure SVG path rendering.
 */
export function Sparkline({
  data,
  color = '#FECA57',
  width = 48,
  height = 24,
}: SparklineProps) {
  const { linePath, areaPath } = useMemo(() => {
    if (data.length < 2) return { linePath: '', areaPath: '' }

    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    const padding = 2

    const points = data.map((v, i) => ({
      x: padding + (i / (data.length - 1)) * (width - padding * 2),
      y: padding + (1 - (v - min) / range) * (height - padding * 2),
    }))

    const line = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(' ')

    const area = `${line} L ${points[points.length - 1]!.x.toFixed(1)} ${height} L ${points[0]!.x.toFixed(1)} ${height} Z`

    return { linePath: line, areaPath: area }
  }, [data, width, height])

  if (data.length < 2) return null

  return (
    <svg width={width} height={height} className="flex-shrink-0 opacity-80">
      <defs>
        <linearGradient id={`spark-grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path
        d={areaPath}
        fill={`url(#spark-grad-${color.replace('#', '')})`}
      />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
