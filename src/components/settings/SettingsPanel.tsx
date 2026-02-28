import { motion } from 'framer-motion'
import { Bell, DollarSign, Palette, Download, Plus, Trash2, Edit3 } from 'lucide-react'
import { useNodeStore } from '@/store/nodeStore'
import { hapticFeedback } from '@/services/telegram'

export function SettingsPanel() {
  const { settings, updateSettings, nodes, walletAddress, walletBalance } = useNodeStore()

  return (
    <div className="space-y-4">
      {/* Wallet Info */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-highlight p-4"
      >
        <h3 className="text-xs font-semibold text-cocoon-muted uppercase tracking-wider mb-3">Wallet</h3>
        {walletAddress ? (
          <div>
            <div className="text-xs font-mono text-cocoon-text break-all">{walletAddress}</div>
            <div className="text-lg font-bold font-mono text-cocoon-gold mt-2">
              {walletBalance.toFixed(2)} TON
            </div>
          </div>
        ) : (
          <div className="text-xs text-cocoon-muted">No wallet connected</div>
        )}
      </motion.div>

      {/* Node Management */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-cocoon-muted uppercase tracking-wider">Nodes</h3>
          <button className="flex items-center gap-1 text-[11px] text-cocoon-blue font-medium">
            <Plus size={12} />
            Add Node
          </button>
        </div>
        <div className="space-y-2">
          {nodes.map((node) => (
            <div key={node.nodeId} className="flex items-center justify-between py-2 px-2 bg-white/[0.03] rounded-lg">
              <div>
                <div className="text-xs font-medium text-cocoon-text">{node.name}</div>
                <div className="text-[10px] font-mono text-cocoon-muted">{node.nodeId}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg hover:bg-white/5 text-cocoon-muted">
                  <Edit3 size={12} />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-cocoon-red/10 text-cocoon-muted hover:text-cocoon-red">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Bell size={14} className="text-cocoon-blue" />
          <h3 className="text-xs font-semibold text-cocoon-muted uppercase tracking-wider">Notifications</h3>
        </div>
        <div className="space-y-3">
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
          {settings.alerts.tempThreshold && (
            <div className="flex items-center gap-2 pl-4">
              <span className="text-[11px] text-cocoon-muted">Threshold:</span>
              <input
                type="number"
                value={settings.alerts.tempThresholdValue}
                onChange={(e) => {
                  const val = Math.min(100, Math.max(50, Number(e.target.value) || 85))
                  updateSettings({ alerts: { ...settings.alerts, tempThresholdValue: val } })
                }}
                className="w-16 bg-white/5 border border-white/10 rounded px-2 py-1 text-xs font-mono text-cocoon-text focus:outline-none focus:border-cocoon-blue/50"
              />
              <span className="text-[11px] text-cocoon-muted">°C</span>
            </div>
          )}
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
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <DollarSign size={14} className="text-cocoon-gold" />
          <h3 className="text-xs font-semibold text-cocoon-muted uppercase tracking-wider">Display</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-cocoon-text">Currency</span>
            <div className="flex gap-1 bg-white/5 rounded-lg p-0.5">
              {(['TON', 'USD'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    hapticFeedback('light')
                    updateSettings({ displayCurrency: c })
                  }}
                  className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                    settings.displayCurrency === c
                      ? 'bg-cocoon-gold text-cocoon-dark'
                      : 'text-cocoon-muted'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-cocoon-text">Theme</span>
            <div className="flex gap-1 bg-white/5 rounded-lg p-0.5">
              {(['dark', 'light', 'telegram'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    hapticFeedback('light')
                    updateSettings({ theme: t })
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-all ${
                    settings.theme === t
                      ? 'bg-cocoon-blue text-white'
                      : 'text-cocoon-muted'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Export */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Palette size={14} className="text-cocoon-green" />
          <h3 className="text-xs font-semibold text-cocoon-muted uppercase tracking-wider">Data</h3>
        </div>
        <button
          onClick={() => {
            hapticFeedback('medium')
            // CSV export would call exportEarningsCsv API
            alert('Export feature coming soon!')
          }}
          className="flex items-center gap-2 w-full py-2.5 px-3 bg-white/5 rounded-lg text-xs text-cocoon-text hover:bg-white/10 transition-colors"
        >
          <Download size={14} />
          Export Earnings (CSV)
        </button>
      </motion.div>
    </div>
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
      <span className="text-xs text-cocoon-text">{label}</span>
      <button
        onClick={() => {
          hapticFeedback('light')
          onChange(!checked)
        }}
        className={`relative w-9 h-5 rounded-full transition-colors ${
          checked ? 'bg-cocoon-blue' : 'bg-white/10'
        }`}
      >
        <motion.div
          layout
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
          style={{ left: checked ? 18 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  )
}
