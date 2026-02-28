import { TonConnectUIProvider } from '@tonconnect/ui-react'
import type { ReactNode } from 'react'

const MANIFEST_URL = import.meta.env.VITE_TON_MANIFEST_URL ?? '/tonconnect-manifest.json'

interface TonConnectProviderProps {
  children: ReactNode
}

export function TonConnectProvider({ children }: TonConnectProviderProps) {
  return (
    <TonConnectUIProvider manifestUrl={MANIFEST_URL}>
      {children}
    </TonConnectUIProvider>
  )
}
