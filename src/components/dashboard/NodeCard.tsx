import { motion } from 'framer-motion'
import { Cpu, Thermometer, Clock, HardDrive } from 'lucide-react'
import type { NodeMetrics } from '@/types'
import { StatusBadge, TeeBadge } from '@/components/ui/StatusBadge'
import { formatUptime } from '@/utils/timeUtils'

interface NodeCardProps {
  node: NodeMetrics
  index: number
}

export function NodeCard({ node, index }: NodeCardProps) {
  const vramPct = node.vramTotal > 0 ? Math.round((node.vramUsed / node.vramTotal) * 100) : 0
  const tempColor = node.temperature > 80 ? 'text-cocoon-red' : node.temperature > 65 ? 'text-cocoon-gold' : 'text-cocoon-green'
  const gpuColor = node.gpuUtilization > 85 ? 'text-cocoon-green' : node.gpuUtilization > 50 ? 'text-cocoon-gold' : 'text-cocoon-muted'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="glass-card p-4 space-y-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-cocoon-text">{node.name}</h3>
          <p className="text-[11px] text-cocoon-muted mt-0.5">{node.gpuModel}</p>
        </div>
        <StatusBadge status={node.status} />
      </div>

      {/* GPU utilization bar */}
      <div>
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span className="text-cocoon-muted flex items-center gap-1">
            <Cpu size={12} />
            GPU Usage
          </span>
          <span className={`font-mono font-semibold ${gpuColor}`}>
            {node.gpuUtilization}%
          </span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${node.gpuUtilization}%` }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="h-full rounded-full bg-gradient-to-r from-cocoon-blue to-cocoon-green"
          />
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-3 gap-2">
        <MetricItem
          icon={<HardDrive size={12} />}
          label="VRAM"
          value={`${vramPct}%`}
          sub={`${(node.vramUsed / 1024).toFixed(1)}/${(node.vramTotal / 1024).toFixed(0)} GB`}
        />
        <MetricItem
          icon={<Thermometer size={12} />}
          label="Temp"
          value={`${node.temperature}°C`}
          valueColor={tempColor}
        />
        <MetricItem
          icon={<Clock size={12} />}
          label="Uptime"
          value={formatUptime(node.uptimeSeconds)}
        />
      </div>

      {/* TEE status */}
      <div className="flex items-center justify-between pt-1 border-t border-white/5">
        <TeeBadge status={node.teeStatus} />
        <span className="text-[10px] text-cocoon-muted font-mono">
          {node.nodeId}
        </span>
      </div>
    </motion.div>
  )
}

function MetricItem({
  icon,
  label,
  value,
  sub,
  valueColor = 'text-cocoon-text',
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
  valueColor?: string
}) {
  return (
    <div className="bg-white/[0.03] rounded-lg p-2 text-center">
      <div className="flex items-center justify-center gap-1 text-cocoon-muted text-[10px] mb-1">
        {icon}
        {label}
      </div>
      <div className={`text-sm font-semibold font-mono ${valueColor}`}>{value}</div>
      {sub && <div className="text-[9px] text-cocoon-muted mt-0.5">{sub}</div>}
    </div>
  )
}
