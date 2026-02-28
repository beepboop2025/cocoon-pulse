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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-cocoon-dark/90 backdrop-blur-xl border-t border-cocoon-border">
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
              {active && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-x-2 top-0 h-0.5 bg-cocoon-blue rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <Icon
                size={20}
                className={active ? 'text-cocoon-blue' : 'text-cocoon-muted'}
              />
              <span
                className={`text-[10px] font-medium ${active ? 'text-cocoon-blue' : 'text-cocoon-muted'}`}
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
