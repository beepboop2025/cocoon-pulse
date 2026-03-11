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

  // Temperature gauge position (0-100 mapped to bar width)
  const tempPct = Math.min(100, Math.max(0, ((node.temperature - 20) / 80) * 100))

  // Status glow color
  const statusGlow = node.status === 'online'
    ? '0 0 24px rgba(0, 210, 106, 0.08)'
    : node.status === 'syncing'
    ? '0 0 24px rgba(254, 202, 87, 0.08)'
    : '0 0 24px rgba(255, 71, 87, 0.06)'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className="glass-card p-4 space-y-3"
      style={{ boxShadow: statusGlow }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-cocoon-text tracking-tight">{node.name}</h3>
          <p className="text-[11px] text-cocoon-muted mt-0.5 font-medium">{node.gpuModel}</p>
        </div>
        <StatusBadge status={node.status} />
      </div>

      {/* GPU utilization bar */}
      <div>
        <div className="flex items-center justify-between text-[11px] mb-2">
          <span className="text-cocoon-muted flex items-center gap-1 font-medium">
            <Cpu size={12} />
            GPU Usage
          </span>
          <span className={`font-mono font-bold ${gpuColor}`}>
            {node.gpuUtilization}%
          </span>
        </div>
        <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.03)' }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${node.gpuUtilization}%` }}
            transition={{ duration: 1, delay: 0.2 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full"
            style={{
              background: node.gpuUtilization > 85
                ? 'linear-gradient(90deg, #3742FA, #00D26A)'
                : node.gpuUtilization > 50
                ? 'linear-gradient(90deg, #3742FA, #FECA57)'
                : 'linear-gradient(90deg, #3742FA, #6e7191)',
              boxShadow: node.gpuUtilization > 50
                ? '0 0 12px rgba(55, 66, 250, 0.3)'
                : 'none',
            }}
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
        <div className="bg-white/[0.03] rounded-xl p-2 text-center"
          style={{ border: '1px solid rgba(255,255,255,0.03)' }}
        >
          <div className="flex items-center justify-center gap-1 text-cocoon-muted text-[10px] mb-1.5 font-medium">
            <Thermometer size={12} />
            Temp
          </div>
          <div className={`text-sm font-bold font-mono ${tempColor}`}>{node.temperature}°C</div>
          {/* Temperature gauge bar */}
          <div className="h-1 mt-1.5 rounded-full overflow-hidden temp-gauge opacity-40">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${100 - tempPct}%` }}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.08 }}
              className="h-full bg-cocoon-dark/80 float-right rounded-full"
            />
          </div>
        </div>
        <MetricItem
          icon={<Clock size={12} />}
          label="Uptime"
          value={formatUptime(node.uptimeSeconds)}
        />
      </div>

      {/* TEE status */}
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
        <TeeBadge status={node.teeStatus} />
        <span className="text-[10px] text-cocoon-muted font-mono opacity-60">
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
    <div className="bg-white/[0.03] rounded-xl p-2 text-center"
      style={{ border: '1px solid rgba(255,255,255,0.03)' }}
    >
      <div className="flex items-center justify-center gap-1 text-cocoon-muted text-[10px] mb-1 font-medium">
        {icon}
        {label}
      </div>
      <div className={`text-sm font-bold font-mono ${valueColor}`}>{value}</div>
      {sub && <div className="text-[9px] text-cocoon-muted mt-0.5">{sub}</div>}
    </div>
  )
}
