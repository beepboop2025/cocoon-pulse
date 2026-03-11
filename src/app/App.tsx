import { useEffect } from 'react'
import { TelegramProvider } from './providers/TelegramProvider'
import { TonConnectProvider } from './providers/TonConnectProvider'
import { Router } from './Router'
import { BottomNav } from '@/components/ui/BottomNav'
import { useNodeMetrics } from '@/hooks/useNodeMetrics'
import { useNodeStore } from '@/store/nodeStore'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'

function AppContent() {
  // Initialize data polling
  useNodeMetrics()
  const { isRefreshing } = useNodeStore()

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06]"
        style={{
          background: 'linear-gradient(180deg, rgba(8, 11, 26, 0.95) 0%, rgba(8, 11, 26, 0.85) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cocoon-blue via-indigo-500 to-cocoon-green flex items-center justify-center shadow-lg shadow-cocoon-blue/20">
              <span className="text-white text-xs font-bold tracking-tight">C</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-cocoon-text leading-tight tracking-tight">CocoonPulse</h1>
              <p className="text-[9px] text-cocoon-muted font-medium">GPU Node Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <RefreshIndicator isRefreshing={isRefreshing} />
            <OnlineIndicator />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 pt-4 pb-24">
        <Router />
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}

function OnlineIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-cocoon-green/20"
      style={{ background: 'rgba(0, 210, 106, 0.08)' }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-cocoon-green pulse-green" />
      <span className="text-[10px] font-semibold text-cocoon-green tracking-wide">Live</span>
    </div>
  )
}

function RefreshIndicator({ isRefreshing }: { isRefreshing: boolean }) {
  return (
    <AnimatePresence>
      {isRefreshing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex items-center gap-1 px-2 py-1 rounded-full"
          style={{ background: 'rgba(55, 66, 250, 0.1)' }}
        >
          <RefreshCw size={10} className="text-cocoon-blue animate-spin" />
          <span className="text-[9px] font-medium text-cocoon-blue">Syncing</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function App() {
  useEffect(() => {
    // Set viewport meta for mobile
    const meta = document.querySelector('meta[name="viewport"]')
    if (meta) {
      meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    }
  }, [])

  return (
    <TelegramProvider>
      <TonConnectProvider>
        <AppContent />
      </TonConnectProvider>
    </TelegramProvider>
  )
}
