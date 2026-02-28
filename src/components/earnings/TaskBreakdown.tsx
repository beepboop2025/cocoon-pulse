import { motion } from 'framer-motion'
import { Zap, Globe, FileText, Brain, MoreHorizontal } from 'lucide-react'
import { useEarnings } from '@/hooks/useEarnings'
import { formatTon } from '@/utils/formatTon'
import { formatTaskTime, formatComputeTime } from '@/utils/timeUtils'
import type { TaskType } from '@/types'

const TASK_TYPE_CONFIG: Record<TaskType, { icon: typeof Zap; color: string; label: string }> = {
  inference: { icon: Brain, color: 'text-purple-400', label: 'Inference' },
  translation: { icon: Globe, color: 'text-cocoon-blue', label: 'Translation' },
  summarization: { icon: FileText, color: 'text-cocoon-green', label: 'Summary' },
  other: { icon: MoreHorizontal, color: 'text-cocoon-muted', label: 'Other' },
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
      transition={{ delay: 0.2 }}
      className="glass-card p-4"
    >
      <h3 className="text-sm font-semibold text-cocoon-text mb-3">Task Breakdown</h3>

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
            className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
              filterTaskType === id
                ? 'bg-cocoon-blue text-white'
                : 'bg-white/5 text-cocoon-muted'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {filteredTasks.slice(0, 20).map((task, i) => {
          const cfg = TASK_TYPE_CONFIG[task.taskType]
          const Icon = cfg.icon
          return (
            <motion.div
              key={task.taskId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-white/[0.03] transition-colors"
            >
              <div className={`p-1.5 rounded-lg bg-white/5 ${cfg.color}`}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-cocoon-text">{cfg.label}</span>
                  <span className="text-[10px] text-cocoon-muted font-mono">{formatComputeTime(task.computeTimeMs)}</span>
                </div>
                <div className="text-[10px] text-cocoon-muted">{formatTaskTime(task.completedAt)}</div>
              </div>
              <div className="text-xs font-bold font-mono text-cocoon-gold">
                +{formatTon(task.tonReward, 4)}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/[0.03] rounded-lg p-2 text-center">
      <div className="text-[10px] text-cocoon-muted">{label}</div>
      <div className="text-xs font-bold font-mono text-cocoon-text mt-0.5">{value}</div>
    </div>
  )
}
