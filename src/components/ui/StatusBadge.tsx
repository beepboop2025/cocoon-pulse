import type { NodeStatus, TeeStatus } from '@/types'

const STATUS_CONFIG: Record<NodeStatus, { bg: string; text: string; label: string; dot: string; pulse: string }> = {
  online: {
    bg: 'bg-cocoon-green/10',
    text: 'text-cocoon-green',
    label: 'Online',
    dot: 'bg-cocoon-green',
    pulse: 'pulse-green',
  },
  syncing: {
    bg: 'bg-cocoon-gold/10',
    text: 'text-cocoon-gold',
    label: 'Syncing',
    dot: 'bg-cocoon-gold',
    pulse: 'pulse-gold',
  },
  offline: {
    bg: 'bg-cocoon-red/10',
    text: 'text-cocoon-red',
    label: 'Offline',
    dot: 'bg-cocoon-red',
    pulse: 'pulse-red',
  },
}

const TEE_CONFIG: Record<TeeStatus, { bg: string; text: string; label: string }> = {
  verified: { bg: 'bg-cocoon-green/10', text: 'text-cocoon-green', label: 'TEE Verified' },
  pending: { bg: 'bg-cocoon-gold/10', text: 'text-cocoon-gold', label: 'TEE Pending' },
  failed: { bg: 'bg-cocoon-red/10', text: 'text-cocoon-red', label: 'TEE Failed' },
}

export function StatusBadge({ status }: { status: NodeStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}
      style={{
        border: '1px solid currentColor',
        borderColor: status === 'online'
          ? 'rgba(0, 210, 106, 0.2)'
          : status === 'syncing'
          ? 'rgba(254, 202, 87, 0.2)'
          : 'rgba(255, 71, 87, 0.2)',
      }}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${cfg.pulse}`} />
      {cfg.label}
    </span>
  )
}

export function TeeBadge({ status }: { status: TeeStatus }) {
  const cfg = TEE_CONFIG[status]
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}
      style={{
        border: '1px solid currentColor',
        borderColor: status === 'verified'
          ? 'rgba(0, 210, 106, 0.15)'
          : status === 'pending'
          ? 'rgba(254, 202, 87, 0.15)'
          : 'rgba(255, 71, 87, 0.15)',
      }}
    >
      {cfg.label}
    </span>
  )
}
