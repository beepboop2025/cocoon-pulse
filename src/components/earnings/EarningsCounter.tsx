import { motion } from 'framer-motion'
import { Coins, TrendingUp, TrendingDown, Calendar } from 'lucide-react'
import { useNodeStore } from '@/store/nodeStore'
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber'
import { Sparkline } from '@/components/ui/Sparkline'

export function EarningsCounter() {
  const { earningsStats, dailyEarnings } = useNodeStore()
  const pctChange = earningsStats.percentChangeVsPrevPeriod
  const isUp = pctChange >= 0

  const allTimeAnim = useAnimatedNumber(earningsStats.allTime, { duration: 1200, decimals: 2 })
  const sparkData = dailyEarnings.slice(-14).map((d) => d.earnings)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card-highlight p-5 text-center relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(254, 202, 87, 0.08), transparent)',
        }}
      />

      <div className="relative">
        <div className="text-cocoon-muted text-xs font-semibold mb-2 uppercase tracking-widest">Total Earnings</div>
        <motion.div
          key={earningsStats.allTime}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl font-bold font-mono gradient-text-gold tracking-tight"
        >
          {allTimeAnim} TON
        </motion.div>

        {/* Sparkline below main number */}
        <div className="flex justify-center mt-2 mb-1">
          <Sparkline data={sparkData} color="#FECA57" width={100} height={24} />
        </div>

        <div
          className={`inline-flex items-center gap-1 mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
            isUp ? 'text-cocoon-green' : 'text-cocoon-red'
          }`}
          style={{
            background: isUp ? 'rgba(0, 210, 106, 0.08)' : 'rgba(255, 71, 87, 0.08)',
            border: `1px solid ${isUp ? 'rgba(0, 210, 106, 0.15)' : 'rgba(255, 71, 87, 0.15)'}`,
          }}
        >
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {isUp ? '+' : ''}{pctChange}% this week
        </div>

        <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-white/[0.04]">
          <PeriodStat icon={<Calendar size={12} />} label="Today" value={earningsStats.today} />
          <PeriodStat icon={<Calendar size={12} />} label="This Week" value={earningsStats.thisWeek} />
          <PeriodStat icon={<Coins size={12} />} label="This Month" value={earningsStats.thisMonth} />
        </div>
      </div>
    </motion.div>
  )
}

function PeriodStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  const animValue = useAnimatedNumber(value, { duration: 800, decimals: 2 })

  return (
    <div>
      <div className="flex items-center justify-center gap-1 text-cocoon-muted text-[10px] mb-1 font-medium">
        {icon}
        {label}
      </div>
      <div className="text-sm font-bold font-mono text-cocoon-text">
        {animValue} TON
      </div>
    </div>
  )
}
