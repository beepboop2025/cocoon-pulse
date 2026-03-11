import { motion } from 'framer-motion'
import { Lightbulb, Clock, ArrowUpCircle, Shield } from 'lucide-react'
import { useNodeStore } from '@/store/nodeStore'

interface Recommendation {
  icon: React.ReactNode
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const CHILD = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

export function Recommendations() {
  const { fleetSummary, nodes } = useNodeStore()

  const recommendations: Recommendation[] = []

  // Uptime recommendation
  if (fleetSummary.avgUptime < 99) {
    recommendations.push({
      icon: <Clock size={16} />,
      title: 'Improve Uptime',
      description: `Your uptime is ${fleetSummary.avgUptime.toFixed(1)}%. Nodes with 99%+ uptime earn 23% more on average.`,
      priority: fleetSummary.avgUptime < 95 ? 'high' : 'medium',
    })
  }

  // Peak hours
  recommendations.push({
    icon: <Clock size={16} />,
    title: 'Peak Demand Hours',
    description: 'Peak task demand is 2-6 AM UTC. Ensure your nodes are online during these hours for maximum earnings.',
    priority: 'medium',
  })

  // VRAM upgrade
  const lowVramNodes = nodes.filter((n) => n.vramTotal < 49152)
  if (lowVramNodes.length > 0) {
    recommendations.push({
      icon: <ArrowUpCircle size={16} />,
      title: 'VRAM Upgrade',
      description: `${lowVramNodes.length} node(s) have <48GB VRAM. Nodes with 80GB+ receive 40% more inference tasks.`,
      priority: 'low',
    })
  }

  // TEE attestation
  const pendingTee = nodes.filter((n) => n.teeStatus !== 'verified')
  if (pendingTee.length > 0) {
    recommendations.push({
      icon: <Shield size={16} />,
      title: 'TEE Attestation',
      description: `${pendingTee.length} node(s) have unverified TEE status. Verified nodes are prioritized for sensitive workloads.`,
      priority: 'high',
    })
  }

  if (recommendations.length === 0) return null

  const priorityStyle = {
    high: {
      border: 'rgba(255, 71, 87, 0.15)',
      bg: 'rgba(255, 71, 87, 0.04)',
      icon: 'text-cocoon-red',
      glow: '0 0 16px rgba(255, 71, 87, 0.06)',
    },
    medium: {
      border: 'rgba(254, 202, 87, 0.15)',
      bg: 'rgba(254, 202, 87, 0.04)',
      icon: 'text-cocoon-gold',
      glow: '0 0 16px rgba(254, 202, 87, 0.06)',
    },
    low: {
      border: 'rgba(55, 66, 250, 0.15)',
      bg: 'rgba(55, 66, 250, 0.04)',
      icon: 'text-cocoon-blue',
      glow: '0 0 16px rgba(55, 66, 250, 0.06)',
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg"
          style={{ background: 'rgba(254, 202, 87, 0.08)', border: '1px solid rgba(254, 202, 87, 0.1)' }}
        >
          <Lightbulb size={14} className="text-cocoon-gold" />
        </div>
        <h3 className="text-sm font-semibold text-cocoon-text tracking-tight">Recommendations</h3>
      </div>

      <motion.div
        variants={STAGGER}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        {recommendations.map((rec, i) => {
          const style = priorityStyle[rec.priority]
          return (
            <motion.div
              key={i}
              variants={CHILD}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-xl p-3.5"
              style={{
                background: style.bg,
                border: `1px solid ${style.border}`,
                boxShadow: style.glow,
              }}
            >
              <div className="flex items-start gap-2.5">
                <span className={`mt-0.5 ${style.icon}`}>{rec.icon}</span>
                <div>
                  <div className="text-xs font-semibold text-cocoon-text">{rec.title}</div>
                  <div className="text-[11px] text-cocoon-muted mt-1 leading-relaxed">{rec.description}</div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
