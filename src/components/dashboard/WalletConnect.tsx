import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, LogOut, ExternalLink } from 'lucide-react'
import { useNodeStore } from '@/store/nodeStore'
import { hapticFeedback } from '@/services/telegram'

export function WalletConnect() {
  const [tonConnectUI] = useTonConnectUI()
  const wallet = useTonWallet()
  const { setWallet, walletAddress } = useNodeStore()

  useEffect(() => {
    if (wallet) {
      const address = wallet.account.address
      // Mock balance — in production, query TON Center API
      setWallet(address, 1247.85)
    } else {
      setWallet(null, 0)
    }
  }, [wallet, setWallet])

  const handleConnect = () => {
    hapticFeedback('medium')
    tonConnectUI.openModal()
  }

  const handleDisconnect = () => {
    hapticFeedback('medium')
    tonConnectUI.disconnect()
  }

  return (
    <AnimatePresence mode="wait">
      {walletAddress ? (
        <motion.div
          key="connected"
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card p-3.5 flex items-center gap-3"
        >
          <div className="p-2 rounded-xl"
            style={{
              background: 'rgba(0, 210, 106, 0.08)',
              border: '1px solid rgba(0, 210, 106, 0.12)',
            }}
          >
            <Wallet size={18} className="text-cocoon-green" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] text-cocoon-muted font-medium">Connected</div>
            <div className="text-xs font-mono text-cocoon-text truncate">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </div>
          </div>
          <button
            onClick={handleDisconnect}
            className="p-2 rounded-xl hover:bg-white/5 text-cocoon-muted hover:text-cocoon-red transition-all duration-200 btn-press"
          >
            <LogOut size={16} />
          </button>
        </motion.div>
      ) : (
        <motion.button
          key="disconnected"
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={handleConnect}
          className="w-full glass-card-highlight p-4 flex items-center justify-center gap-2.5 btn-press"
          whileTap={{ scale: 0.98 }}
        >
          <div className="p-1.5 rounded-lg"
            style={{
              background: 'rgba(55, 66, 250, 0.12)',
              border: '1px solid rgba(55, 66, 250, 0.15)',
            }}
          >
            <Wallet size={16} className="text-cocoon-blue" />
          </div>
          <span className="text-sm font-semibold text-cocoon-text">Connect TON Wallet</span>
          <ExternalLink size={14} className="text-cocoon-muted" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
