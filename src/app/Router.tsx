import { AnimatePresence, motion } from 'framer-motion'
import { useNodeStore } from '@/store/nodeStore'
import { DashboardPage } from './pages/DashboardPage'
import { EarningsPage } from './pages/EarningsPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { SettingsPage } from './pages/SettingsPage'

const PAGE_VARIANTS = {
  initial: { opacity: 0, y: 12, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.99 },
}

export function Router() {
  const { activeTab } = useNodeStore()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        variants={PAGE_VARIANTS}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {activeTab === 'dashboard' && <DashboardPage />}
        {activeTab === 'earnings' && <EarningsPage />}
        {activeTab === 'analytics' && <AnalyticsPage />}
        {activeTab === 'settings' && <SettingsPage />}
      </motion.div>
    </AnimatePresence>
  )
}
