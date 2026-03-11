import { motion, AnimatePresence } from 'framer-motion'
import { Bell, DollarSign, Palette, Download, Plus, Trash2, Edit3 } from 'lucide-react'
import { useNodeStore } from '@/store/nodeStore'
import { hapticFeedback } from '@/services/telegram'

const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const SECTION = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

export function SettingsPanel() {
  const { settings, updateSettings, nodes, walletAddress, walletBalance } = useNodeStore()

  return (
    <motion.div
      variants={STAGGER}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Wallet Info */}
      <motion.div
        variants={SECTION}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card-highlight p-4"
      >
        <h3 className="text-[11px] font-semibold text-cocoon-muted uppercase tracking-widest mb-3">Wallet</h3>
        {walletAddress ? (
          <div>
            <div className="text-xs font-mono text-cocoon-text break-all opacity-80">{walletAddress}</div>
            <div className="text-lg font-bold font-mono gradient-text-gold mt-2">
              {walletBalance.toFixed(2)} TON
            </div>
          </div>
        ) : (
          <div className="text-xs text-cocoon-muted">No wallet connected</div>
        )}
      </motion.div>

      {/* Node Management */}
      <motion.div
        variants={SECTION}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[11px] font-semibold text-cocoon-muted uppercase tracking-widest">Nodes</h3>
          <button className="flex items-center gap-1 text-[11px] text-cocoon-blue font-semibold btn-press px-2 py-1 rounded-lg hover:bg-cocoon-blue/10 transition-colors duration-200">
            <Plus size={12} />
            Add Node
          </button>
        </div>
        <div className="space-y-2">
          {nodes.map((node, i) => (
            <motion.div
              key={node.nodeId}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors duration-200"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
              }}
            >
              <div>
                <div className="text-xs font-semibold text-cocoon-text">{node.name}</div>
                <div className="text-[10px] font-mono text-cocoon-muted">{node.nodeId}</div>
              </div>
              <div className="flex items-center gap-1.5">
                <button className="p-2 rounded-lg hover:bg-white/5 text-cocoon-muted transition-colors duration-200 btn-press">
                  <Edit3 size={12} />
                </button>
                <button className="p-2 rounded-lg hover:bg-cocoon-red/10 text-cocoon-muted hover:text-cocoon-red transition-colors duration-200 btn-press">
                  <Trash2 size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        variants={SECTION}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card p-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg"
            style={{ background: 'rgba(55, 66, 250, 0.08)', border: '1px solid rgba(55, 66, 250, 0.1)' }}
          >
            <Bell size={13} className="text-cocoon-blue" />
          </div>
          <h3 className="text-[11px] font-semibold text-cocoon-muted uppercase tracking-widest">Notifications</h3>
        </div>
        <div className="space-y-3.5">
          <Toggle
            label="Node goes offline"
            checked={settings.alerts.nodeOffline}
            onChange={(v) => updateSettings({ alerts: { ...settings.alerts, nodeOffline: v } })}
          />
          <Toggle
            label="GPU temperature high"
            checked={settings.alerts.tempThreshold}
            onChange={(v) => updateSettings({ alerts: { ...settings.alerts, tempThreshold: v } })}
          />
          <AnimatePresence>
            {settings.alerts.tempThreshold && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2 pl-4 pb-1">
                  <span className="text-[11px] text-cocoon-muted font-medium">Threshold:</span>
                  <input
                    type="number"
                    value={settings.alerts.tempThresholdValue}
                    onChange={(e) => {
                      const val = Math.min(100, Math.max(50, Number(e.target.value) || 85))
                      updateSettings({ alerts: { ...settings.alerts, tempThresholdValue: val } })
                    }}
                    className="w-16 px-2.5 py-1.5 text-xs font-mono text-cocoon-text rounded-lg"
                  />
                  <span className="text-[11px] text-cocoon-muted font-medium">°C</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <Toggle
            label="Earnings drop below average"
            checked={settings.alerts.earningsDrop}
            onChange={(v) => updateSettings({ alerts: { ...settings.alerts, earningsDrop: v } })}
          />
          <Toggle
            label="TEE attestation failure"
            checked={settings.alerts.teeFailure}
            onChange={(v) => updateSettings({ alerts: { ...settings.alerts, teeFailure: v } })}
          />
        </div>
      </motion.div>

      {/* Display */}
      <motion.div
        variants={SECTION}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card p-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg"
            style={{ background: 'rgba(254, 202, 87, 0.08)', border: '1px solid rgba(254, 202, 87, 0.1)' }}
          >
            <DollarSign size={13} className="text-cocoon-gold" />
          </div>
          <h3 className="text-[11px] font-semibold text-cocoon-muted uppercase tracking-widest">Display</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-cocoon-text font-medium">Currency</span>
            <div className="flex gap-0.5 rounded-xl p-0.5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.04)' }}
            >
              {(['TON', 'USD'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    hapticFeedback('light')
                    updateSettings({ displayCurrency: c })
                  }}
                  className={`relative px-3.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 ${
                    settings.displayCurrency === c
                      ? 'text-cocoon-dark'
                      : 'text-cocoon-muted'
                  }`}
                >
                  {settings.displayCurrency === c && (
                    <motion.div
                      layoutId="currencyPill"
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: 'linear-gradient(135deg, #FECA57, #FF9F43)',
                        boxShadow: '0 2px 8px rgba(254, 202, 87, 0.3)',
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{c}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-cocoon-text font-medium">Theme</span>
            <div className="flex gap-0.5 rounded-xl p-0.5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.04)' }}
            >
              {(['dark', 'light', 'telegram'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    hapticFeedback('light')
                    updateSettings({ theme: t })
                  }}
                  className={`relative px-2.5 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all duration-200 ${
                    settings.theme === t
                      ? 'text-white'
                      : 'text-cocoon-muted'
                  }`}
                >
                  {settings.theme === t && (
                    <motion.div
                      layoutId="themePill"
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: 'linear-gradient(135deg, rgba(55, 66, 250, 0.6), rgba(55, 66, 250, 0.4))',
                        boxShadow: '0 2px 8px rgba(55, 66, 250, 0.3)',
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{t}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Export */}
      <motion.div
        variants={SECTION}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg"
            style={{ background: 'rgba(0, 210, 106, 0.08)', border: '1px solid rgba(0, 210, 106, 0.1)' }}
          >
            <Palette size={13} className="text-cocoon-green" />
          </div>
          <h3 className="text-[11px] font-semibold text-cocoon-muted uppercase tracking-widest">Data</h3>
        </div>
        <button
          onClick={() => {
            hapticFeedback('medium')
            // CSV export would call exportEarningsCsv API
            alert('Export feature coming soon!')
          }}
          className="flex items-center gap-2.5 w-full py-3 px-4 rounded-xl text-xs font-medium text-cocoon-text transition-all duration-200 btn-press"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <Download size={14} className="text-cocoon-green" />
          Export Earnings (CSV)
        </button>
      </motion.div>
    </motion.div>
  )
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-cocoon-text font-medium">{label}</span>
      <button
        onClick={() => {
          hapticFeedback('light')
          onChange(!checked)
        }}
        className={`toggle-track relative w-10 h-[22px] rounded-full transition-all duration-300 ${
          checked ? 'toggle-track-active' : ''
        }`}
        style={{
          background: checked
            ? 'linear-gradient(135deg, rgba(55, 66, 250, 0.7), rgba(55, 66, 250, 0.5))'
            : 'rgba(255, 255, 255, 0.08)',
          border: `1px solid ${checked ? 'rgba(55, 66, 250, 0.3)' : 'rgba(255, 255, 255, 0.06)'}`,
        }}
      >
        <motion.div
          layout
          className="absolute top-[2px] w-4 h-4 rounded-full shadow-sm"
          style={{
            left: checked ? 20 : 2,
            background: checked
              ? '#fff'
              : 'rgba(255, 255, 255, 0.5)',
            boxShadow: checked
              ? '0 1px 4px rgba(0,0,0,0.2), 0 0 8px rgba(55, 66, 250, 0.2)'
              : '0 1px 2px rgba(0,0,0,0.1)',
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  )
}
