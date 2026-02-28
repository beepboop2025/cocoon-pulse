import { motion } from 'framer-motion'
import { Lightbulb, Clock, ArrowUpCircle, Shield } from 'lucide-react'
import { useNodeStore } from '@/store/nodeStore'

interface Recommendation {
  icon: React.ReactNode
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
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

  const priorityColor = {
    high: 'border-cocoon-red/30 bg-cocoon-red/5',
    medium: 'border-cocoon-gold/30 bg-cocoon-gold/5',
    low: 'border-cocoon-blue/30 bg-cocoon-blue/5',
  }

  const priorityIconColor = {
    high: 'text-cocoon-red',
    medium: 'text-cocoon-gold',
    low: 'text-cocoon-blue',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb size={16} className="text-cocoon-gold" />
        <h3 className="text-sm font-semibold text-cocoon-text">Recommendations</h3>
      </div>

      <div className="space-y-2">
        {recommendations.map((rec, i) => (
          <div key={i} className={`rounded-lg border p-3 ${priorityColor[rec.priority]}`}>
            <div className="flex items-start gap-2">
              <span className={`mt-0.5 ${priorityIconColor[rec.priority]}`}>{rec.icon}</span>
              <div>
                <div className="text-xs font-semibold text-cocoon-text">{rec.title}</div>
                <div className="text-[11px] text-cocoon-muted mt-0.5 leading-relaxed">{rec.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
