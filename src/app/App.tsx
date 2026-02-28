import { useEffect } from 'react'
import { TelegramProvider } from './providers/TelegramProvider'
import { TonConnectProvider } from './providers/TonConnectProvider'
import { Router } from './Router'
import { BottomNav } from '@/components/ui/BottomNav'
import { useNodeMetrics } from '@/hooks/useNodeMetrics'

function AppContent() {
  // Initialize data polling
  useNodeMetrics()

  return (
    <div className="min-h-screen bg-cocoon-dark">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-cocoon-dark/80 backdrop-blur-xl border-b border-cocoon-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cocoon-blue to-cocoon-green flex items-center justify-center">
              <span className="text-white text-xs font-bold">C</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-cocoon-text leading-tight">CocoonPulse</h1>
              <p className="text-[9px] text-cocoon-muted">GPU Node Dashboard</p>
            </div>
          </div>
          <OnlineIndicator />
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
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-cocoon-green/10">
      <span className="w-1.5 h-1.5 rounded-full bg-cocoon-green animate-pulse" />
      <span className="text-[10px] font-medium text-cocoon-green">Live</span>
    </div>
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
