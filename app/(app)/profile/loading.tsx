export default function Loading() {
  return (
    <div className="max-w-lg space-y-6">
      <div className="h-8 w-32 bg-muted rounded animate-pulse" />
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-muted animate-pulse" />
        <div className="flex-1 h-10 bg-muted rounded animate-pulse" />
      </div>
      <div className="space-y-3">
        <div className="h-10 bg-muted rounded animate-pulse" />
        <div className="h-10 bg-muted rounded animate-pulse" />
      </div>
    </div>
  )
}