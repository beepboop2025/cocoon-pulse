import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Coins, Zap } from 'lucide-react'
import { useNodeStore } from '@/store/nodeStore'
import { formatTon } from '@/utils/formatTon'

export function QuickStats() {
  const { earningsStats, settings } = useNodeStore()
  const pctChange = earningsStats.percentChangeVsPrevPeriod
  const isPositive = pctChange >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-2 gap-3"
    >
      <div className="glass-card p-3">
        <div className="flex items-center gap-1.5 text-cocoon-muted text-[11px] mb-1">
          <Coins size={12} className="text-cocoon-gold" />
          Today
        </div>
        <div className="text-lg font-bold font-mono text-cocoon-gold count-animate">
          {formatTon(earningsStats.today, 2)}
        </div>
        <div className={`flex items-center gap-0.5 text-[10px] mt-1 ${isPositive ? 'text-cocoon-green' : 'text-cocoon-red'}`}>
          {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {isPositive ? '+' : ''}{pctChange}% vs last week
        </div>
      </div>

      <div className="glass-card p-3">
        <div className="flex items-center gap-1.5 text-cocoon-muted text-[11px] mb-1">
          <Coins size={12} className="text-cocoon-gold" />
          This Week
        </div>
        <div className="text-lg font-bold font-mono text-cocoon-gold count-animate">
          {formatTon(earningsStats.thisWeek, 2)}
        </div>
        <div className="text-[10px] text-cocoon-muted mt-1">
          {settings.displayCurrency === 'USD' ? `~$${(earningsStats.thisWeek * 2.4).toFixed(2)}` : 'All nodes combined'}
        </div>
      </div>

      <div className="glass-card p-3">
        <div className="flex items-center gap-1.5 text-cocoon-muted text-[11px] mb-1">
          <Zap size={12} className="text-cocoon-blue" />
          Projected Daily
        </div>
        <div className="text-base font-bold font-mono text-cocoon-blue">
          {formatTon(earningsStats.projectedDaily, 2)}
        </div>
      </div>

      <div className="glass-card p-3">
        <div className="flex items-center gap-1.5 text-cocoon-muted text-[11px] mb-1">
          <Zap size={12} className="text-cocoon-blue" />
          Projected Monthly
        </div>
        <div className="text-base font-bold font-mono text-cocoon-blue">
          {formatTon(earningsStats.projectedMonthly, 2)}
        </div>
      </div>
    </motion.div>
  )
}
