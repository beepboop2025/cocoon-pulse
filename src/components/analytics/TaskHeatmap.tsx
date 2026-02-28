import { motion } from 'framer-motion'
import { useNodeStore } from '@/store/nodeStore'
import { DAY_NAMES } from '@/utils/timeUtils'

export function TaskHeatmap() {
  const { heatmapData } = useNodeStore()

  const maxCount = Math.max(...heatmapData.map((d) => d.taskCount), 1)

  const getColor = (count: number) => {
    const intensity = count / maxCount
    if (intensity === 0) return 'bg-white/[0.02]'
    if (intensity < 0.25) return 'bg-cocoon-blue/10'
    if (intensity < 0.5) return 'bg-cocoon-blue/25'
    if (intensity < 0.75) return 'bg-cocoon-blue/50'
    return 'bg-cocoon-blue/80'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-4"
    >
      <h3 className="text-sm font-semibold text-cocoon-text mb-3">Task Volume Heatmap</h3>
      <p className="text-[10px] text-cocoon-muted mb-4">Tasks by hour and day of week (UTC)</p>

      <div className="overflow-x-auto -mx-1 px-1">
        <div className="min-w-[420px]">
          {/* Hour labels */}
          <div className="flex gap-[2px] mb-1 ml-8">
            {Array.from({ length: 24 }, (_, h) => (
              <div key={h} className="flex-1 text-center text-[8px] text-cocoon-muted">
                {h % 3 === 0 ? `${h}` : ''}
              </div>
            ))}
          </div>

          {/* Grid */}
          {Array.from({ length: 7 }, (_, day) => (
            <div key={day} className="flex items-center gap-[2px] mb-[2px]">
              <div className="w-7 text-right text-[9px] text-cocoon-muted pr-1">{DAY_NAMES[day]}</div>
              {Array.from({ length: 24 }, (_, hour) => {
                const cell = heatmapData.find((d) => d.day === day && d.hour === hour)
                const count = cell?.taskCount ?? 0
                return (
                  <div
                    key={hour}
                    className={`flex-1 aspect-square rounded-[3px] ${getColor(count)} transition-colors`}
                    title={`${DAY_NAMES[day]} ${hour}:00 — ${count} tasks`}
                  />
                )
              })}
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center justify-end gap-1 mt-3">
            <span className="text-[9px] text-cocoon-muted">Less</span>
            {['bg-white/[0.02]', 'bg-cocoon-blue/10', 'bg-cocoon-blue/25', 'bg-cocoon-blue/50', 'bg-cocoon-blue/80'].map((c, i) => (
              <div key={i} className={`w-3 h-3 rounded-[2px] ${c}`} />
            ))}
            <span className="text-[9px] text-cocoon-muted">More</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
