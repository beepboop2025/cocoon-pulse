import { motion } from 'framer-motion'
import { useNodeStore } from '@/store/nodeStore'
import { DAY_NAMES } from '@/utils/timeUtils'

export function TaskHeatmap() {
  const { heatmapData } = useNodeStore()

  const maxCount = Math.max(...heatmapData.map((d) => d.taskCount), 1)

  const getColor = (count: number): string => {
    const intensity = count / maxCount
    if (intensity === 0) return 'rgba(255,255,255,0.02)'
    if (intensity < 0.25) return 'rgba(55, 66, 250, 0.12)'
    if (intensity < 0.5) return 'rgba(55, 66, 250, 0.28)'
    if (intensity < 0.75) return 'rgba(55, 66, 250, 0.5)'
    return 'rgba(55, 66, 250, 0.75)'
  }

  const getBorder = (count: number): string => {
    const intensity = count / maxCount
    if (intensity === 0) return 'rgba(255,255,255,0.02)'
    if (intensity < 0.5) return 'rgba(55, 66, 250, 0.08)'
    return 'rgba(55, 66, 250, 0.15)'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card p-4"
    >
      <h3 className="text-sm font-semibold text-cocoon-text mb-1 tracking-tight">Task Volume Heatmap</h3>
      <p className="text-[10px] text-cocoon-muted mb-4 font-medium">Tasks by hour and day of week (UTC)</p>

      <div className="overflow-x-auto -mx-1 px-1">
        <div className="min-w-[420px]">
          {/* Hour labels */}
          <div className="flex gap-[2px] mb-1.5 ml-8">
            {Array.from({ length: 24 }, (_, h) => (
              <div key={h} className="flex-1 text-center text-[8px] text-cocoon-muted font-medium">
                {h % 3 === 0 ? `${h}` : ''}
              </div>
            ))}
          </div>

          {/* Grid */}
          {Array.from({ length: 7 }, (_, day) => (
            <div key={day} className="flex items-center gap-[2px] mb-[2px]">
              <div className="w-7 text-right text-[9px] text-cocoon-muted pr-1 font-medium">{DAY_NAMES[day]}</div>
              {Array.from({ length: 24 }, (_, hour) => {
                const cell = heatmapData.find((d) => d.day === day && d.hour === hour)
                const count = cell?.taskCount ?? 0
                return (
                  <motion.div
                    key={hour}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: (day * 24 + hour) * 0.002,
                      duration: 0.3,
                    }}
                    className="flex-1 aspect-square rounded-[4px] transition-colors duration-300"
                    style={{
                      background: getColor(count),
                      border: `1px solid ${getBorder(count)}`,
                      boxShadow: count / maxCount > 0.5
                        ? '0 0 6px rgba(55, 66, 250, 0.15)'
                        : 'none',
                    }}
                    title={`${DAY_NAMES[day]} ${hour}:00 — ${count} tasks`}
                  />
                )
              })}
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center justify-end gap-1.5 mt-3">
            <span className="text-[9px] text-cocoon-muted font-medium">Less</span>
            {[0, 0.1, 0.3, 0.6, 0.9].map((intensity, i) => (
              <div
                key={i}
                className="w-3.5 h-3.5 rounded-[3px]"
                style={{
                  background: intensity === 0
                    ? 'rgba(255,255,255,0.02)'
                    : `rgba(55, 66, 250, ${intensity * 0.8})`,
                  border: `1px solid rgba(55, 66, 250, ${intensity * 0.2})`,
                }}
              />
            ))}
            <span className="text-[9px] text-cocoon-muted font-medium">More</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
