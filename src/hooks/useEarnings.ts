import { useMemo, useState } from 'react'
import { useNodeStore } from '@/store/nodeStore'
import type { TimePeriod, TaskType } from '@/types'

export function useEarnings() {
  const { earningsStats, dailyEarnings, recentTasks } = useNodeStore()
  const [period, setPeriod] = useState<TimePeriod>('week')
  const [filterTaskType, setFilterTaskType] = useState<TaskType | 'all'>('all')

  const chartData = useMemo(() => {
    const sliceMap: Record<TimePeriod, number> = { day: 1, week: 7, month: 30, all: 30 }
    return dailyEarnings.slice(-(sliceMap[period] ?? 7))
  }, [dailyEarnings, period])

  const filteredTasks = useMemo(() => {
    if (filterTaskType === 'all') return recentTasks
    return recentTasks.filter((t) => t.taskType === filterTaskType)
  }, [recentTasks, filterTaskType])

  const taskStats = useMemo(() => {
    if (recentTasks.length === 0) return { avgReward: 0, avgDuration: 0, tasksPerHour: 0 }
    const totalReward = recentTasks.reduce((s, t) => s + t.tonReward, 0)
    const totalDuration = recentTasks.reduce((s, t) => s + t.computeTimeMs, 0)
    const timeSpanHours = recentTasks.length > 1
      ? (new Date(recentTasks[0]!.completedAt).getTime() - new Date(recentTasks[recentTasks.length - 1]!.completedAt).getTime()) / 3600000
      : 1
    return {
      avgReward: totalReward / recentTasks.length,
      avgDuration: totalDuration / recentTasks.length,
      tasksPerHour: timeSpanHours > 0 ? recentTasks.length / timeSpanHours : 0,
    }
  }, [recentTasks])

  return {
    earningsStats,
    chartData,
    filteredTasks,
    taskStats,
    period,
    setPeriod,
    filterTaskType,
    setFilterTaskType,
  }
}
