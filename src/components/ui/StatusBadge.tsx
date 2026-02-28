import type { NodeStatus, TeeStatus } from '@/types'

const STATUS_CONFIG: Record<NodeStatus, { color: string; label: string; dot: string }> = {
  online: { color: 'bg-cocoon-green/15 text-cocoon-green', label: 'Online', dot: 'bg-cocoon-green' },
  syncing: { color: 'bg-cocoon-gold/15 text-cocoon-gold', label: 'Syncing', dot: 'bg-cocoon-gold' },
  offline: { color: 'bg-cocoon-red/15 text-cocoon-red', label: 'Offline', dot: 'bg-cocoon-red' },
}

const TEE_CONFIG: Record<TeeStatus, { color: string; label: string }> = {
  verified: { color: 'bg-cocoon-green/15 text-cocoon-green', label: 'TEE Verified' },
  pending: { color: 'bg-cocoon-gold/15 text-cocoon-gold', label: 'TEE Pending' },
  failed: { color: 'bg-cocoon-red/15 text-cocoon-red', label: 'TEE Failed' },
}

export function StatusBadge({ status }: { status: NodeStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
      {cfg.label}
    </span>
  )
}

export function TeeBadge({ status }: { status: TeeStatus }) {
  const cfg = TEE_CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${cfg.color}`}>
      {cfg.label}
    </span>
  )
}
