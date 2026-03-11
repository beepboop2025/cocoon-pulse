import { TaskHistory } from '@/components/analytics/TaskHistory'
import { TaskHeatmap } from '@/components/analytics/TaskHeatmap'
import { NetworkStats } from '@/components/analytics/NetworkStats'
import { Recommendations } from '@/components/analytics/Recommendations'
import { useNodeStore } from '@/store/nodeStore'
import { CardSkeleton } from '@/components/ui/Skeleton'

export function AnalyticsPage() {
  const { isLoading, isRefreshing } = useNodeStore()

  if (isLoading) {
    return (
      <div className="space-y-4 pb-4">
        <CardSkeleton delay={0} />
        <CardSkeleton delay={0.1} />
        <CardSkeleton delay={0.2} />
      </div>
    )
  }

  return (
    <div className={`space-y-4 pb-4 ${isRefreshing ? 'refreshing-overlay is-refreshing' : ''}`}>
      <TaskHistory />
      <TaskHeatmap />
      <NetworkStats />
      <Recommendations />
    </div>
  )
}
