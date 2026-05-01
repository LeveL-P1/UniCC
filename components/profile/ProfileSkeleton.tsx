'use client'

export function ProfileSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Skeleton */}
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 animate-pulse">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-muted" />
          <div className="flex-1 space-y-3">
            <div className="h-8 w-48 bg-muted rounded-lg" />
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-4 w-64 bg-muted rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-24 bg-muted rounded-lg" />
            <div className="h-9 w-20 bg-muted rounded-lg" />
          </div>
        </div>
      </div>

      {/* Bento Grid Skeleton */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Stats Overview */}
        <div className="md:col-span-2 lg:col-span-1 lg:row-span-2 rounded-2xl border border-border bg-card p-6 animate-pulse">
          <div className="h-6 w-32 bg-muted rounded mb-6" />
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 bg-muted rounded" />
                  <div className="h-6 w-16 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Cards */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 animate-pulse">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-muted" />
              <div className="space-y-2">
                <div className="h-5 w-24 bg-muted rounded" />
                <div className="h-3 w-16 bg-muted rounded" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="h-4 w-12 bg-muted rounded" />
                <div className="h-6 w-16 bg-muted rounded" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-12 bg-muted rounded" />
                <div className="h-4 w-20 bg-muted rounded" />
              </div>
            </div>
          </div>
        ))}

        {/* Activity Heatmap */}
        <div className="md:col-span-2 lg:col-span-2 rounded-2xl border border-border bg-card p-6 animate-pulse">
          <div className="h-6 w-24 bg-muted rounded mb-4" />
          <div className="h-32 bg-muted rounded" />
        </div>

        {/* Rating Chart */}
        <div className="md:col-span-2 lg:col-span-3 rounded-2xl border border-border bg-card p-6 animate-pulse">
          <div className="h-6 w-32 bg-muted rounded mb-4" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    </div>
  )
}
