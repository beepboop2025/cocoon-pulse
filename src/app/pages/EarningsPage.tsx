import { EarningsCounter } from '@/components/earnings/EarningsCounter'
import { EarningsChart } from '@/components/earnings/EarningsChart'
import { TaskBreakdown } from '@/components/earnings/TaskBreakdown'
import { useNodeStore } from '@/store/nodeStore'
import { CardSkeleton } from '@/components/ui/Skeleton'

export function EarningsPage() {
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
      <EarningsCounter />
      <EarningsChart />
      <TaskBreakdown />
    </div>
  )
}
