import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
}

export function Skeleton({ className = '', width, height }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, minHeight: height ?? 16 }}
    />
  )
}

export function CardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <Skeleton width={120} height={20} />
        <Skeleton width={60} height={24} className="rounded-full" />
      </div>
      <Skeleton width="100%" height={12} />
      <div className="flex gap-4">
        <Skeleton width={80} height={36} />
        <Skeleton width={80} height={36} />
        <Skeleton width={80} height={36} />
      </div>
      <Skeleton width="60%" height={12} />
    </motion.div>
  )
}
