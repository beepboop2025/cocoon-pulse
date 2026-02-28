import { AnimatePresence, motion } from 'framer-motion'
import { useNodeStore } from '@/store/nodeStore'
import { DashboardPage } from './pages/DashboardPage'
import { EarningsPage } from './pages/EarningsPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { SettingsPage } from './pages/SettingsPage'

const PAGE_VARIANTS = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
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
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'dashboard' && <DashboardPage />}
        {activeTab === 'earnings' && <EarningsPage />}
        {activeTab === 'analytics' && <AnalyticsPage />}
        {activeTab === 'settings' && <SettingsPage />}
      </motion.div>
    </AnimatePresence>
  )
}
