import { Skeleton } from "@/components/ui/skeleton"

interface SkeletonPlaceholderProps {
  sectionTitle: string
  sectionScope: string
}

export function SkeletonPlaceholder({
  sectionTitle,
  sectionScope,
}: SkeletonPlaceholderProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {sectionTitle}
        </h1>
        <p className="text-sm text-muted-foreground">{sectionScope}</p>
      </div>

      {/* Skeleton Layout matching wireframe placeholder */}
      <div className="flex flex-col gap-8" aria-label={`${sectionTitle} skeleton placeholder`}>
        {/* Top bar skeleton: wide bar left + two circles right */}
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-8 w-full max-w-md rounded-full" />
          <div className="flex items-center gap-3 shrink-0">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="size-8 rounded-full" />
          </div>
        </div>

        {/* 3-column card skeleton strip */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="flex flex-col gap-3">
              <Skeleton className="h-36 w-full rounded-xl" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-4/5 rounded-full" />
                <Skeleton className="h-3 w-3/5 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* 4-row list skeleton */}
        <div className="flex flex-col gap-5 pt-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <Skeleton className="size-10 rounded-full shrink-0" />
                <div className="flex flex-col gap-2 flex-1 max-w-md">
                  <Skeleton className="h-3.5 w-3/4 rounded-full" />
                  <Skeleton className="h-3 w-1/2 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-7 w-28 rounded-full shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
