import { motion } from 'framer-motion'
import { Server, Wifi, WifiOff, RefreshCw } from 'lucide-react'
import { useNodeStore } from '@/store/nodeStore'

export function FleetOverview() {
  const { fleetSummary } = useNodeStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card-highlight p-4"
    >
      <h2 className="text-xs font-semibold text-cocoon-muted uppercase tracking-wider mb-3">
        Fleet Overview
      </h2>
      <div className="grid grid-cols-4 gap-3">
        <FleetStat
          icon={<Server size={16} />}
          value={fleetSummary.totalNodes}
          label="Total"
          color="text-cocoon-blue"
        />
        <FleetStat
          icon={<Wifi size={16} />}
          value={fleetSummary.onlineNodes}
          label="Online"
          color="text-cocoon-green"
        />
        <FleetStat
          icon={<WifiOff size={16} />}
          value={fleetSummary.offlineNodes}
          label="Offline"
          color="text-cocoon-red"
        />
        <FleetStat
          icon={<RefreshCw size={16} />}
          value={`${fleetSummary.avgUptime.toFixed(1)}%`}
          label="Uptime"
          color="text-cocoon-gold"
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
}: {
  icon: React.ReactNode
  value: string | number
  label: string
  color: string
}) {
  return (
    <div className="text-center">
      <div className={`flex items-center justify-center mb-1 ${color}`}>{icon}</div>
      <div className={`text-lg font-bold font-mono ${color}`}>{value}</div>
      <div className="text-[10px] text-cocoon-muted">{label}</div>
    </div>
  )
}
