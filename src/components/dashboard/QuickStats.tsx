import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Coins, Zap } from 'lucide-react'
import { useNodeStore } from '@/store/nodeStore'
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber'
import { Sparkline } from '@/components/ui/Sparkline'

const STAGGER_CHILDREN = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const CARD_CHILD = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
}

export function QuickStats() {
  const { earningsStats, settings, dailyEarnings } = useNodeStore()
  const pctChange = earningsStats.percentChangeVsPrevPeriod
  const isPositive = pctChange >= 0

  const todayAnim = useAnimatedNumber(earningsStats.today, { duration: 800, decimals: 2 })
  const weekAnim = useAnimatedNumber(earningsStats.thisWeek, { duration: 800, decimals: 2 })
  const projDailyAnim = useAnimatedNumber(earningsStats.projectedDaily, { duration: 800, decimals: 2 })
  const projMonthlyAnim = useAnimatedNumber(earningsStats.projectedMonthly, { duration: 800, decimals: 2 })

  // Mini sparkline data from last 7 days
  const sparkData = dailyEarnings.slice(-7).map((d) => d.earnings)

  return (
    <motion.div
      variants={STAGGER_CHILDREN}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-3"
    >
      <motion.div
        variants={CARD_CHILD}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card p-3.5 relative overflow-hidden"
      >
        <div className="flex items-center gap-1.5 text-cocoon-muted text-[11px] mb-1.5">
          <Coins size={12} className="text-cocoon-gold" />
          Today
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-lg font-bold font-mono gradient-text-gold tracking-tight">
              {todayAnim} TON
            </div>
            <div className={`flex items-center gap-0.5 text-[10px] mt-1 ${isPositive ? 'text-cocoon-green' : 'text-cocoon-red'}`}>
              {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {isPositive ? '+' : ''}{pctChange}% vs last week
            </div>
          </div>
          <Sparkline data={sparkData} color="#FECA57" />
        </div>
      </motion.div>

      <motion.div
        variants={CARD_CHILD}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card p-3.5 relative overflow-hidden"
      >
        <div className="flex items-center gap-1.5 text-cocoon-muted text-[11px] mb-1.5">
          <Coins size={12} className="text-cocoon-gold" />
          This Week
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-lg font-bold font-mono gradient-text-gold tracking-tight">
              {weekAnim} TON
            </div>
            <div className="text-[10px] text-cocoon-muted mt-1">
              {settings.displayCurrency === 'USD' ? `~$${(earningsStats.thisWeek * 2.4).toFixed(2)}` : 'All nodes combined'}
            </div>
          </div>
          <Sparkline data={sparkData} color="#FECA57" />
        </div>
      </motion.div>

      <motion.div
        variants={CARD_CHILD}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card p-3.5"
      >
        <div className="flex items-center gap-1.5 text-cocoon-muted text-[11px] mb-1.5">
          <Zap size={12} className="text-cocoon-blue" />
          Projected Daily
        </div>
        <div className="text-base font-bold font-mono gradient-text-blue tracking-tight">
          {projDailyAnim} TON
        </div>
      </motion.div>

      <motion.div
        variants={CARD_CHILD}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card p-3.5"
      >
        <div className="flex items-center gap-1.5 text-cocoon-muted text-[11px] mb-1.5">
          <Zap size={12} className="text-cocoon-blue" />
          Projected Monthly
        </div>
        <div className="text-base font-bold font-mono gradient-text-blue tracking-tight">
          {projMonthlyAnim} TON
        </div>
      </motion.div>
    </motion.div>
  )
}
