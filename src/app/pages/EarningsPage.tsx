import { EarningsCounter } from '@/components/earnings/EarningsCounter'
import { EarningsChart } from '@/components/earnings/EarningsChart'
import { TaskBreakdown } from '@/components/earnings/TaskBreakdown'
import { useNodeStore } from '@/store/nodeStore'
import { CardSkeleton } from '@/components/ui/Skeleton'

export function EarningsPage() {
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
      <EarningsCounter />
      <EarningsChart />
      <TaskBreakdown />
    </div>
  )
}
