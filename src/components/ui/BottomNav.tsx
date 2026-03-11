import { LayoutDashboard, Wallet, BarChart3, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNodeStore } from '@/store/nodeStore'
import { hapticFeedback } from '@/services/telegram'
import type { Tab } from '@/types'

const TABS: Array<{ id: Tab; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'earnings', label: 'Earnings', icon: Wallet },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function BottomNav() {
  const { activeTab, setActiveTab } = useNodeStore()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.06]"
      style={{
        background: 'linear-gradient(180deg, rgba(8, 11, 26, 0.92) 0%, rgba(8, 11, 26, 0.98) 100%)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => {
                hapticFeedback('light')
                setActiveTab(id)
              }}
              className="relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full"
            >
              {/* Sliding top indicator */}
              {active && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-x-3 top-0 h-[2px] rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, transparent, #3742FA, transparent)',
                    boxShadow: '0 0 12px rgba(55, 66, 250, 0.4)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              {/* Icon glow background */}
              {active && (
                <motion.div
                  layoutId="activeTabGlow"
                  className="absolute w-10 h-10 rounded-xl top-2"
                  style={{
                    background: 'rgba(55, 66, 250, 0.08)',
                    boxShadow: '0 0 20px rgba(55, 66, 250, 0.1)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <motion.div
                animate={{
                  scale: active ? 1 : 0.9,
                  y: active ? -1 : 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Icon
                  size={20}
                  className={`relative z-10 transition-colors duration-200 ${
                    active ? 'text-cocoon-blue' : 'text-cocoon-muted'
                  }`}
                />
              </motion.div>
              <span
                className={`text-[10px] font-medium relative z-10 transition-colors duration-200 ${
                  active ? 'text-cocoon-blue' : 'text-cocoon-muted'
                }`}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
      {/* Safe area for iPhones */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
