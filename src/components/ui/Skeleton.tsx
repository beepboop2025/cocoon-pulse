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

export function CardSkeleton() {
  return (
    <div className="glass-card p-4 space-y-3">
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
    </div>
  )
}
