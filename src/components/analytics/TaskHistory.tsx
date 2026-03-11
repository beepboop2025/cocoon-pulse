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
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card p-4"
    >
      <h3 className="text-sm font-semibold text-cocoon-text mb-3 tracking-tight">Task History</h3>

      {/* Search + filter */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cocoon-muted" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-xs text-cocoon-text placeholder:text-cocoon-muted rounded-xl"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as TaskType | 'all')}
          className="px-3 py-2.5 text-xs rounded-xl"
        >
          <option value="all">All Types</option>
          <option value="inference">Inference</option>
          <option value="translation">Translation</option>
          <option value="summarization">Summary</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Sort header */}
      <div
        className="grid grid-cols-[1fr_80px_70px_80px] gap-1 px-2 py-2 text-[10px] text-cocoon-muted font-semibold border-b border-white/[0.04] rounded-t-lg"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        <SortHeader label="Task" field="completedAt" current={sortBy} asc={sortAsc} onToggle={toggleSort} />
        <SortHeader label="Type" field="taskType" current={sortBy} asc={sortAsc} onToggle={toggleSort} />
        <SortHeader label="Duration" field="computeTimeMs" current={sortBy} asc={sortAsc} onToggle={toggleSort} />
        <SortHeader label="Reward" field="tonReward" current={sortBy} asc={sortAsc} onToggle={toggleSort} />
      </div>

      {/* Rows */}
      <div className="max-h-80 overflow-y-auto">
        {filtered.map((task, i) => (
          <TaskRow key={task.taskId} task={task} index={i} />
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
      className={`flex items-center gap-0.5 text-left transition-colors duration-200 ${
        active ? 'text-cocoon-blue' : 'hover:text-cocoon-text'
      }`}
    >
      {label}
      {active && (
        <ChevronDown
          size={10}
          className={`transition-transform duration-200 ${asc ? 'rotate-180' : ''}`}
        />
      )}
    </button>
  )
}

function TaskRow({ task, index }: { task: EarningsRecord; index: number }) {
  const typeBg: Record<string, { bg: string; text: string }> = {
    inference: { bg: 'rgba(168, 85, 247, 0.08)', text: 'text-purple-400' },
    translation: { bg: 'rgba(55, 66, 250, 0.08)', text: 'text-cocoon-blue' },
    summarization: { bg: 'rgba(0, 210, 106, 0.08)', text: 'text-cocoon-green' },
    other: { bg: 'rgba(255, 255, 255, 0.04)', text: 'text-cocoon-muted' },
  }

  const cfg = typeBg[task.taskType] ?? typeBg.other!

  return (
    <div className="grid grid-cols-[1fr_80px_70px_80px] gap-1 px-2 py-2.5 text-xs hover:bg-white/[0.02] transition-colors duration-200 border-b border-white/[0.02]">
      <div>
        <div className="font-mono text-cocoon-text text-[11px] truncate">{task.taskId}</div>
        <div className="text-[10px] text-cocoon-muted">{formatTaskTime(task.completedAt)}</div>
      </div>
      <div>
        <span
          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold ${cfg.text}`}
          style={{
            background: cfg.bg,
            border: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          {task.taskType}
        </span>
      </div>
      <div className="text-cocoon-muted font-mono self-center">{formatComputeTime(task.computeTimeMs)}</div>
      <div className="font-mono font-bold self-center text-right gradient-text-gold">
        +{formatTon(task.tonReward, 4)}
      </div>
    </div>
  )
}
