import { motion } from 'framer-motion'
import { Coins, TrendingUp, TrendingDown, Calendar } from 'lucide-react'
import { useNodeStore } from '@/store/nodeStore'
import { formatTon } from '@/utils/formatTon'

export function EarningsCounter() {
  const { earningsStats } = useNodeStore()
  const pctChange = earningsStats.percentChangeVsPrevPeriod
  const isUp = pctChange >= 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card-highlight p-5 text-center"
    >
      <div className="text-cocoon-muted text-xs font-medium mb-2">Total Earnings</div>
      <motion.div
        key={earningsStats.allTime}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold font-mono text-cocoon-gold"
      >
        {formatTon(earningsStats.allTime, 2)}
      </motion.div>
      <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${isUp ? 'bg-cocoon-green/10 text-cocoon-green' : 'bg-cocoon-red/10 text-cocoon-red'}`}>
        {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {isUp ? '+' : ''}{pctChange}% this week
      </div>

      <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-white/5">
        <PeriodStat icon={<Calendar size={12} />} label="Today" value={earningsStats.today} />
        <PeriodStat icon={<Calendar size={12} />} label="This Week" value={earningsStats.thisWeek} />
        <PeriodStat icon={<Coins size={12} />} label="This Month" value={earningsStats.thisMonth} />
      </div>
    </motion.div>
  )
}

function PeriodStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-center gap-1 text-cocoon-muted text-[10px] mb-1">
        {icon}
        {label}
      </div>
      <div className="text-sm font-bold font-mono text-cocoon-text">
        {formatTon(value, 2)}
      </div>
    </div>
  )
}
