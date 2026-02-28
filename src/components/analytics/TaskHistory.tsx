import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronDown } from 'lucide-react'
import { useNodeStore } from '@/store/nodeStore'
import { formatTon } from '@/utils/formatTon'
import { formatTaskTime, formatComputeTime } from '@/utils/timeUtils'
import type { EarningsRecord, TaskType } from '@/types'

type SortField = 'completedAt' | 'tonReward' | 'computeTimeMs' | 'taskType'

export function TaskHistory() {
  const { recentTasks } = useNodeStore()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortField>('completedAt')
  const [sortAsc, setSortAsc] = useState(false)
  const [typeFilter, setTypeFilter] = useState<TaskType | 'all'>('all')

  const filtered = useMemo(() => {
    let tasks = [...recentTasks]

    if (typeFilter !== 'all') {
      tasks = tasks.filter((t) => t.taskType === typeFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      tasks = tasks.filter(
        (t) => t.taskId.toLowerCase().includes(q) || t.taskType.includes(q) || t.nodeId.toLowerCase().includes(q),
      )
    }

    tasks.sort((a, b) => {
      let cmp = 0
      if (sortBy === 'completedAt') cmp = new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
      else if (sortBy === 'tonReward') cmp = a.tonReward - b.tonReward
      else if (sortBy === 'taskType') cmp = a.taskType.localeCompare(b.taskType)
      else cmp = a.computeTimeMs - b.computeTimeMs
      return sortAsc ? cmp : -cmp
    })

    return tasks
  }, [recentTasks, typeFilter, search, sortBy, sortAsc])

  const toggleSort = (field: SortField) => {
    if (sortBy === field) setSortAsc(!sortAsc)
    else { setSortBy(field); setSortAsc(false) }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4"
    >
      <h3 className="text-sm font-semibold text-cocoon-text mb-3">Task History</h3>

      {/* Search + filter */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-cocoon-muted" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs text-cocoon-text placeholder:text-cocoon-muted focus:outline-none focus:border-cocoon-blue/50"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as TaskType | 'all')}
          className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-xs text-cocoon-text focus:outline-none focus:border-cocoon-blue/50"
        >
          <option value="all">All Types</option>
          <option value="inference">Inference</option>
          <option value="translation">Translation</option>
          <option value="summarization">Summary</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Sort header */}
      <div className="grid grid-cols-[1fr_80px_70px_80px] gap-1 px-2 py-1.5 text-[10px] text-cocoon-muted font-medium border-b border-white/5">
        <SortHeader label="Task" field="completedAt" current={sortBy} asc={sortAsc} onToggle={toggleSort} />
        <SortHeader label="Type" field="taskType" current={sortBy} asc={sortAsc} onToggle={toggleSort} />
        <SortHeader label="Duration" field="computeTimeMs" current={sortBy} asc={sortAsc} onToggle={toggleSort} />
        <SortHeader label="Reward" field="tonReward" current={sortBy} asc={sortAsc} onToggle={toggleSort} />
      </div>

      {/* Rows */}
      <div className="max-h-80 overflow-y-auto">
        {filtered.map((task) => (
          <TaskRow key={task.taskId} task={task} />
        ))}
        {filtered.length === 0 && (
          <div className="py-8 text-center text-cocoon-muted text-xs">No tasks found</div>
        )}
      </div>
    </motion.div>
  )
}

function SortHeader({
  label,
  field,
  current,
  asc,
  onToggle,
}: {
  label: string
  field: SortField
  current: SortField
  asc: boolean
  onToggle: (f: SortField) => void
}) {
  const active = current === field
  return (
    <button
      onClick={() => onToggle(field)}
      className="flex items-center gap-0.5 text-left hover:text-cocoon-text transition-colors"
    >
      {label}
      {active && <ChevronDown size={10} className={`transition-transform ${asc ? 'rotate-180' : ''}`} />}
    </button>
  )
}

function TaskRow({ task }: { task: EarningsRecord }) {
  const typeBg: Record<string, string> = {
    inference: 'bg-purple-500/10 text-purple-400',
    translation: 'bg-cocoon-blue/10 text-cocoon-blue',
    summarization: 'bg-cocoon-green/10 text-cocoon-green',
    other: 'bg-white/5 text-cocoon-muted',
  }

  return (
    <div className="grid grid-cols-[1fr_80px_70px_80px] gap-1 px-2 py-2 text-xs hover:bg-white/[0.02] transition-colors border-b border-white/[0.03]">
      <div>
        <div className="font-mono text-cocoon-text text-[11px] truncate">{task.taskId}</div>
        <div className="text-[10px] text-cocoon-muted">{formatTaskTime(task.completedAt)}</div>
      </div>
      <div>
        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${typeBg[task.taskType] ?? ''}`}>
          {task.taskType}
        </span>
      </div>
      <div className="text-cocoon-muted font-mono self-center">{formatComputeTime(task.computeTimeMs)}</div>
      <div className="text-cocoon-gold font-mono font-semibold self-center text-right">
        +{formatTon(task.tonReward, 4)}
      </div>
    </div>
  )
}
