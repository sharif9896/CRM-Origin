import { repeat } from "./utils";

/**
 * `skeleton-glass` (style.css) supplies the frosted tint and shimmer sweep;
 * only shape belongs here.
 */
const BASE = "skeleton-glass rounded";

export const SkeletonBox = ({ className = "" }: { className?: string }) => (
  <div className={`${BASE} ${className}`} />
);

export const SkeletonText = ({ className = "w-full" }: { className?: string }) => (
  <div className={`${BASE} h-3.5 ${className}`} />
);

export const SkeletonCircle = ({ className = "size-10" }: { className?: string }) => (
  <div className={`skeleton-glass rounded-full ${className}`} />
);

export const SkeletonButton = ({ className = "w-28" }: { className?: string }) => (
  <div className={`skeleton-glass rounded-full h-9 ${className}`} />
);

/** Page title + breadcrumb trail, mirroring <PageHeader />. */
export const SkeletonPageHeader = ({ action = true }: { action?: boolean }) => (
  <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
    <div>
      <SkeletonBox className="h-7 lg:h-9 w-48 mb-2" />
      <div className="flex items-center gap-2">
        <SkeletonText className="w-20" />
        <SkeletonText className="w-24" />
      </div>
    </div>
    {action && <SkeletonButton className="w-32" />}
  </div>
);

/**
 * Stat card row. The app uses several stat-card variants (accent, blob, plain,
 * solid, progress) that share this 12-col grid and card footprint.
 */
export const SkeletonStatCards = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-12 gap-4 lg:gap-6 mb-4 lg:mb-6">
    {repeat(count).map((i) => (
      <div key={i} className="col-span-12 sm:col-span-6 xxl:col-span-3">
        <div className="bg-white rounded-xl border border-border-color shadow-sm p-5 h-full">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <SkeletonText className="w-24 mb-3" />
              <SkeletonBox className="h-8 w-28 mb-3" />
              <SkeletonBox className="h-6 w-24 rounded-lg" />
            </div>
            <SkeletonBox className="size-12 rounded-lg shrink-0" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

/** Search field + filter row, mirroring <TableToolbar />. */
export const SkeletonToolbar = () => (
  <div className="flex items-center justify-between flex-wrap gap-3 p-4">
    <SkeletonBox className="h-10 w-full sm:w-64 rounded-lg" />
    <SkeletonBox className="h-10 w-36 rounded-lg" />
  </div>
);
