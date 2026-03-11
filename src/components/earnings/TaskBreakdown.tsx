import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Globe, FileText, Brain, MoreHorizontal } from 'lucide-react'
import { useEarnings } from '@/hooks/useEarnings'
import { formatTon } from '@/utils/formatTon'
import { formatTaskTime, formatComputeTime } from '@/utils/timeUtils'
import type { TaskType } from '@/types'

const TASK_TYPE_CONFIG: Record<TaskType, { icon: typeof Zap; color: string; bg: string; label: string }> = {
  inference: { icon: Brain, color: 'text-purple-400', bg: 'rgba(168, 85, 247, 0.08)', label: 'Inference' },
  translation: { icon: Globe, color: 'text-cocoon-blue', bg: 'rgba(55, 66, 250, 0.08)', label: 'Translation' },
  summarization: { icon: FileText, color: 'text-cocoon-green', bg: 'rgba(0, 210, 106, 0.08)', label: 'Summary' },
  other: { icon: MoreHorizontal, color: 'text-cocoon-muted', bg: 'rgba(255, 255, 255, 0.04)', label: 'Other' },
}

const FILTERS: Array<{ id: TaskType | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'inference', label: 'Inference' },
  { id: 'translation', label: 'Translate' },
  { id: 'summarization', label: 'Summary' },
  { id: 'other', label: 'Other' },
]

export function TaskBreakdown() {
  const { filteredTasks, filterTaskType, setFilterTaskType, taskStats } = useEarnings()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card p-4"
    >
      <h3 className="text-sm font-semibold text-cocoon-text mb-3 tracking-tight">Task Breakdown</h3>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <StatChip label="Avg Reward" value={formatTon(taskStats.avgReward, 4)} />
        <StatChip label="Avg Duration" value={formatComputeTime(taskStats.avgDuration)} />
        <StatChip label="Tasks/hr" value={taskStats.tasksPerHour.toFixed(1)} />
      </div>

      {/* Filter pills */}
      <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 -mx-1 px-1">
        {FILTERS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setFilterTaskType(id)}
            className={`relative shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200 ${
              filterTaskType === id
                ? 'text-white'
                : 'text-cocoon-muted hover:text-cocoon-text'
            }`}
            style={{
              background: filterTaskType === id
                ? 'linear-gradient(135deg, rgba(55, 66, 250, 0.5), rgba(55, 66, 250, 0.3))'
                : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${filterTaskType === id ? 'rgba(55, 66, 250, 0.3)' : 'rgba(255, 255, 255, 0.04)'}`,
              boxShadow: filterTaskType === id ? '0 2px 8px rgba(55, 66, 250, 0.2)' : 'none',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="space-y-1 max-h-72 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {filteredTasks.slice(0, 20).map((task, i) => {
            const cfg = TASK_TYPE_CONFIG[task.taskType]
            const Icon = cfg.icon
            return (
              <motion.div
                key={task.taskId}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ delay: i * 0.02, duration: 0.3 }}
                className="flex items-center gap-3 py-2.5 px-2.5 rounded-xl hover:bg-white/[0.03] transition-colors duration-200"
              >
                <div
                  className={`p-1.5 rounded-lg ${cfg.color}`}
                  style={{ background: cfg.bg, border: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-cocoon-text">{cfg.label}</span>
                    <span className="text-[10px] text-cocoon-muted font-mono">{formatComputeTime(task.computeTimeMs)}</span>
                  </div>
                  <div className="text-[10px] text-cocoon-muted">{formatTaskTime(task.completedAt)}</div>
                </div>
                <div className="text-xs font-bold font-mono gradient-text-gold">
                  +{formatTon(task.tonReward, 4)}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-xl p-2.5 text-center"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.04)',
      }}
    >
      <div className="text-[10px] text-cocoon-muted font-medium">{label}</div>
      <div className="text-xs font-bold font-mono text-cocoon-text mt-0.5">{value}</div>
    </div>
  )
}
