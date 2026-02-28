import { useState } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useEarnings } from '@/hooks/useEarnings'
import type { TimePeriod } from '@/types'
import { format } from 'date-fns'

const PERIODS: Array<{ id: TimePeriod; label: string }> = [
  { id: 'week', label: '7D' },
  { id: 'month', label: '30D' },
  { id: 'all', label: 'All' },
]

export function EarningsChart() {
  const { chartData, period, setPeriod } = useEarnings()
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  const activePoint = activeIdx !== null && activeIdx < chartData.length ? chartData[activeIdx] : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-cocoon-text">Earnings History</h3>
        <div className="flex gap-1 bg-white/5 rounded-lg p-0.5">
          {PERIODS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setPeriod(id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                period === id
                  ? 'bg-cocoon-blue text-white'
                  : 'text-cocoon-muted hover:text-cocoon-text'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {activePoint && (
        <div className="mb-2 text-center">
          <div className="text-[10px] text-cocoon-muted">
            {format(new Date(activePoint.date), 'MMM d, yyyy')}
          </div>
          <div className="text-lg font-bold font-mono text-cocoon-gold">
            {activePoint.earnings.toFixed(2)} TON
          </div>
          <div className="text-[10px] text-cocoon-muted">{activePoint.tasks} tasks</div>
        </div>
      )}

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            onMouseMove={(e) => {
              if (e?.activeTooltipIndex !== undefined && typeof e.activeTooltipIndex === 'number') setActiveIdx(e.activeTooltipIndex)
            }}
            onMouseLeave={() => setActiveIdx(null)}
          >
            <defs>
              <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FECA57" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#FECA57" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickFormatter={(d: string) => format(new Date(d), 'MMM d')}
              tick={{ fontSize: 10, fill: '#6b6b80' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#6b6b80' }}
              axisLine={false}
              tickLine={false}
              width={35}
              tickFormatter={(v: number) => `${v}`}
            />
            <Tooltip content={() => null} />
            <Area
              type="monotone"
              dataKey="earnings"
              stroke="#FECA57"
              strokeWidth={2}
              fill="url(#earningsGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#FECA57', stroke: '#0a0a0f', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
