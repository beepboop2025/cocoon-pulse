import { motion } from 'framer-motion'
import { Globe, Cpu, Trophy, Users, Zap, Hash } from 'lucide-react'
import { useNodeStore } from '@/store/nodeStore'
import { formatTon } from '@/utils/formatTon'

export function NetworkStats() {
  const { networkStats } = useNodeStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <Globe size={16} className="text-cocoon-blue" />
        <h3 className="text-sm font-semibold text-cocoon-text">Cocoon Network</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <NetworkStat
          icon={<Cpu size={14} />}
          label="Active Nodes"
          value={networkStats.totalNodes.toLocaleString()}
          color="text-cocoon-blue"
        />
        <NetworkStat
          icon={<Zap size={14} />}
          label="Tasks Today"
          value={formatCompact(networkStats.totalTasksToday)}
          color="text-cocoon-green"
        />
        <NetworkStat
          icon={<Hash size={14} />}
          label="All-Time Tasks"
          value={formatCompact(networkStats.totalTasksAllTime)}
          color="text-cocoon-muted"
        />
        <NetworkStat
          icon={<Zap size={14} />}
          label="Avg Reward"
          value={formatTon(networkStats.avgRewardPerTask, 4)}
          color="text-cocoon-gold"
        />
      </div>

      {/* Your rank */}
      <div className="mt-4 pt-3 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-cocoon-gold" />
            <div>
              <div className="text-xs font-medium text-cocoon-text">Your Rank</div>
              <div className="text-[10px] text-cocoon-muted">Among {networkStats.totalOperators.toLocaleString()} operators</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold font-mono text-cocoon-gold">
              #{networkStats.yourRank}
            </div>
            <div className="text-[10px] text-cocoon-muted">
              Top {((networkStats.yourRank / networkStats.totalOperators) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Compute */}
      <div className="mt-3 pt-3 border-t border-white/5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-cocoon-muted flex items-center gap-1">
            <Users size={12} />
            Network Compute
          </span>
          <span className="font-mono font-semibold text-cocoon-text">
            {formatCompact(networkStats.networkComputeTflops)} TFLOPS
          </span>
        </div>
      </div>
    </motion.div>
  )
}

function NetworkStat({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
}) {
  return (
    <div className="bg-white/[0.03] rounded-lg p-3">
      <div className={`flex items-center gap-1.5 text-[10px] text-cocoon-muted mb-1`}>
        <span className={color}>{icon}</span>
        {label}
      </div>
      <div className={`text-sm font-bold font-mono ${color}`}>{value}</div>
    </div>
  )
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}
