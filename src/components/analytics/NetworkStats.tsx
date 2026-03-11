import { motion } from 'framer-motion'
import { Globe, Cpu, Trophy, Users, Zap, Hash } from 'lucide-react'
import { useNodeStore } from '@/store/nodeStore'
import { formatTon } from '@/utils/formatTon'
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber'

const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const CHILD = {
  hidden: { opacity: 0, y: 10, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
}

export function NetworkStats() {
  const { networkStats } = useNodeStore()
  const rankAnim = useAnimatedNumber(networkStats.yourRank, { duration: 1000, decimals: 0 })
  const topPct = ((networkStats.yourRank / networkStats.totalOperators) * 100).toFixed(1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card p-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg"
          style={{ background: 'rgba(55, 66, 250, 0.1)', border: '1px solid rgba(55, 66, 250, 0.12)' }}
        >
          <Globe size={14} className="text-cocoon-blue" />
        </div>
        <h3 className="text-sm font-semibold text-cocoon-text tracking-tight">Cocoon Network</h3>
      </div>

      <motion.div
        variants={STAGGER}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-2.5"
      >
        <NetworkStat
          icon={<Cpu size={14} />}
          label="Active Nodes"
          value={networkStats.totalNodes.toLocaleString()}
          color="text-cocoon-blue"
          bgColor="rgba(55, 66, 250, 0.06)"
        />
        <NetworkStat
          icon={<Zap size={14} />}
          label="Tasks Today"
          value={formatCompact(networkStats.totalTasksToday)}
          color="text-cocoon-green"
          bgColor="rgba(0, 210, 106, 0.06)"
        />
        <NetworkStat
          icon={<Hash size={14} />}
          label="All-Time Tasks"
          value={formatCompact(networkStats.totalTasksAllTime)}
          color="text-cocoon-muted"
          bgColor="rgba(255, 255, 255, 0.02)"
        />
        <NetworkStat
          icon={<Zap size={14} />}
          label="Avg Reward"
          value={formatTon(networkStats.avgRewardPerTask, 4)}
          color="text-cocoon-gold"
          bgColor="rgba(254, 202, 87, 0.06)"
        />
      </motion.div>

      {/* Your rank */}
      <div className="mt-4 pt-3 border-t border-white/[0.04]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg"
              style={{ background: 'rgba(254, 202, 87, 0.08)', border: '1px solid rgba(254, 202, 87, 0.1)' }}
            >
              <Trophy size={16} className="text-cocoon-gold" />
            </div>
            <div>
              <div className="text-xs font-semibold text-cocoon-text">Your Rank</div>
              <div className="text-[10px] text-cocoon-muted font-medium">Among {networkStats.totalOperators.toLocaleString()} operators</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold font-mono gradient-text-gold">
              #{rankAnim}
            </div>
            <div
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(254, 202, 87, 0.08)', color: '#FECA57' }}
            >
              Top {topPct}%
            </div>
          </div>
        </div>
      </div>

      {/* Compute */}
      <div className="mt-3 pt-3 border-t border-white/[0.04]">
        <div className="flex items-center justify-between text-xs">
          <span className="text-cocoon-muted flex items-center gap-1.5 font-medium">
            <Users size={12} />
            Network Compute
          </span>
          <span className="font-mono font-bold text-cocoon-text">
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
  bgColor,
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
  bgColor: string
}) {
  return (
    <motion.div
      variants={CHILD}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl p-3"
      style={{
        background: bgColor,
        border: '1px solid rgba(255, 255, 255, 0.04)',
      }}
    >
      <div className="flex items-center gap-1.5 text-[10px] text-cocoon-muted mb-1.5 font-medium">
        <span className={color}>{icon}</span>
        {label}
      </div>
      <div className={`text-sm font-bold font-mono ${color}`}>{value}</div>
    </motion.div>
  )
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}
