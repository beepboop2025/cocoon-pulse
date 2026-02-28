import { TaskHistory } from '@/components/analytics/TaskHistory'
import { TaskHeatmap } from '@/components/analytics/TaskHeatmap'
import { NetworkStats } from '@/components/analytics/NetworkStats'
import { Recommendations } from '@/components/analytics/Recommendations'
import { useNodeStore } from '@/store/nodeStore'
import { CardSkeleton } from '@/components/ui/Skeleton'

export function AnalyticsPage() {
  const { isLoading } = useNodeStore()

  if (isLoading) {
    return (
      <div className="space-y-4 pb-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-4">
      <TaskHistory />
      <TaskHeatmap />
      <NetworkStats />
      <Recommendations />
    </div>
  )
}
