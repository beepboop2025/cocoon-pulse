import { motion } from 'framer-motion'
import { Server, Wifi, WifiOff, RefreshCw } from 'lucide-react'
import { useNodeStore } from '@/store/nodeStore'
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber'

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export function FleetOverview() {
  const { fleetSummary } = useNodeStore()

  return (
    <motion.div
      variants={CARD_VARIANTS}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card-highlight p-4"
    >
      <h2 className="text-[11px] font-semibold text-cocoon-muted uppercase tracking-widest mb-3">
        Fleet Overview
      </h2>
      <div className="grid grid-cols-4 gap-3">
        <FleetStat
          icon={<Server size={16} />}
          value={fleetSummary.totalNodes}
          label="Total"
          color="text-cocoon-blue"
          delay={0.1}
        />
        <FleetStat
          icon={<Wifi size={16} />}
          value={fleetSummary.onlineNodes}
          label="Online"
          color="text-cocoon-green"
          delay={0.15}
        />
        <FleetStat
          icon={<WifiOff size={16} />}
          value={fleetSummary.offlineNodes}
          label="Offline"
          color="text-cocoon-red"
          delay={0.2}
        />
        <FleetStat
          icon={<RefreshCw size={16} />}
          value={fleetSummary.avgUptime}
          label="Uptime"
          color="text-cocoon-gold"
          delay={0.25}
          suffix="%"
          decimals={1}
        />
      </div>
    </motion.div>
  )
}

function FleetStat({
  icon,
  value,
  label,
  color,
  delay = 0,
  suffix = '',
  decimals = 0,
}: {
  icon: React.ReactNode
  value: number
  label: string
  color: string
  delay?: number
  suffix?: string
  decimals?: number
}) {
  const animatedValue = useAnimatedNumber(value, { duration: 800, decimals })

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="text-center"
    >
      <div className={`flex items-center justify-center mb-1.5 ${color} opacity-70`}>{icon}</div>
      <div className={`text-lg font-bold font-mono ${color} tracking-tight`}>
        {animatedValue}{suffix}
      </div>
      <div className="text-[10px] text-cocoon-muted font-medium">{label}</div>
    </motion.div>
  )
}
