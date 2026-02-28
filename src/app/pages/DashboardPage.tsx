import { WalletConnect } from '@/components/dashboard/WalletConnect'
import { FleetOverview } from '@/components/dashboard/FleetOverview'
import { QuickStats } from '@/components/dashboard/QuickStats'
import { NodeCard } from '@/components/dashboard/NodeCard'
import { useNodeStore } from '@/store/nodeStore'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { usePullToRefresh } from '@/hooks/usePullToRefresh'

export function DashboardPage() {
  const { nodes, isLoading } = useNodeStore()
  const { onTouchStart, onTouchEnd } = usePullToRefresh()

  return (
    <div
      className="space-y-4 pb-4"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <WalletConnect />

      {isLoading ? (
        <>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </>
      ) : (
        <>
          <FleetOverview />
          <QuickStats />

          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-cocoon-muted uppercase tracking-wider px-1">
              Your Nodes
            </h2>
            {nodes.map((node, i) => (
              <NodeCard key={node.nodeId} node={node} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
