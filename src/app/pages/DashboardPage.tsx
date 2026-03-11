import { WalletConnect } from '@/components/dashboard/WalletConnect'
import { FleetOverview } from '@/components/dashboard/FleetOverview'
import { QuickStats } from '@/components/dashboard/QuickStats'
import { NodeCard } from '@/components/dashboard/NodeCard'
import { useNodeStore } from '@/store/nodeStore'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { usePullToRefresh } from '@/hooks/usePullToRefresh'
import { motion } from 'framer-motion'

export function DashboardPage() {
  const { nodes, isLoading, isRefreshing } = useNodeStore()
  const { onTouchStart, onTouchEnd } = usePullToRefresh()

  return (
    <div
      className={`space-y-4 pb-4 ${isRefreshing ? 'refreshing-overlay is-refreshing' : ''}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <WalletConnect />

      {isLoading ? (
        <>
          <CardSkeleton delay={0} />
          <CardSkeleton delay={0.1} />
          <CardSkeleton delay={0.2} />
        </>
      ) : (
        <>
          <FleetOverview />
          <QuickStats />

          <div className="space-y-3">
            <motion.h2
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-xs font-semibold text-cocoon-muted uppercase tracking-widest px-1"
            >
              Your Nodes
            </motion.h2>
            {nodes.map((node, i) => (
              <NodeCard key={node.nodeId} node={node} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
