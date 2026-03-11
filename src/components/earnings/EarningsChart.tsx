import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useEarnings } from '@/hooks/useEarnings'
import type { TimePeriod } from '@/types'
import { format } from 'date-fns'

const PERIODS: Array<{ id: TimePeriod; label: string }> = [
  { id: 'week', label: '7D' },
  { id: 'month', label: '30D' },
  { id: 'all', label: 'All' },
]

function GlassTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-tooltip">
      <div className="text-[10px] text-cocoon-muted mb-0.5">
        {label ? format(new Date(label), 'MMM d, yyyy') : ''}
      </div>
      <div className="text-sm font-bold font-mono gradient-text-gold">
        {payload[0]?.value?.toFixed(2)} TON
      </div>
      {payload[0]?.payload?.tasks !== undefined && (
        <div className="text-[10px] text-cocoon-muted mt-0.5">{payload[0].payload.tasks} tasks</div>
      )}
    </div>
  )
}

export function EarningsChart() {
  const { chartData, period, setPeriod } = useEarnings()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-cocoon-text tracking-tight">Earnings History</h3>
        <div className="flex gap-0.5 rounded-xl p-0.5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.04)' }}
        >
          {PERIODS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setPeriod(id)}
              className={`relative px-3 py-1 rounded-lg text-[11px] font-semibold transition-all duration-200 ${
                period === id
                  ? 'text-white'
                  : 'text-cocoon-muted hover:text-cocoon-text'
              }`}
            >
              {period === id && (
                <motion.div
                  layoutId="chartPeriod"
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(55, 66, 250, 0.6), rgba(55, 66, 250, 0.4))',
                    boxShadow: '0 2px 8px rgba(55, 66, 250, 0.3)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={period}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="h-48"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FECA57" stopOpacity={0.25} />
                  <stop offset="50%" stopColor="#FECA57" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="#FECA57" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="earningsStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FF9F43" />
                  <stop offset="50%" stopColor="#FECA57" />
                  <stop offset="100%" stopColor="#FF9F43" />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 6"
                stroke="rgba(255,255,255,0.03)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickFormatter={(d: string) => format(new Date(d), 'MMM d')}
                tick={{ fontSize: 10, fill: '#6e7191' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#6e7191' }}
                axisLine={false}
                tickLine={false}
                width={35}
                tickFormatter={(v: number) => `${v}`}
              />
              <Tooltip
                content={<GlassTooltip />}
                cursor={{
                  stroke: 'rgba(254, 202, 87, 0.2)',
                  strokeWidth: 1,
                  strokeDasharray: '4 4',
                }}
              />
              <Area
                type="monotone"
                dataKey="earnings"
                stroke="url(#earningsStroke)"
                strokeWidth={2.5}
                fill="url(#earningsGrad)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: '#FECA57',
                  stroke: '#080b1a',
                  strokeWidth: 2,
                  style: { filter: 'drop-shadow(0 0 6px rgba(254, 202, 87, 0.5))' },
                }}
                animationDuration={800}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
