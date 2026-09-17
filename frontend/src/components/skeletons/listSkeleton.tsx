import {
  SkeletonBox,
  SkeletonPageHeader,
  SkeletonText,
  SkeletonToolbar,
} from "./primitives";
import { repeat } from "./utils";

/** Row-per-record list (appointments), where each row is a block rather than a table row. */
const ListSkeleton = ({ rows = 6 }: { rows?: number }) => (
  <div className="p-3 lg:py-6 lg:px-0">
    <SkeletonPageHeader />

    <div className="grid grid-cols-1">
      <div className="bg-white-50 rounded-lg border border-border-color shadow-xs overflow-hidden">
        <SkeletonToolbar />

        <div className="divide-y divide-border-color">
          {repeat(rows).map((i) => (
            <div key={i} className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <SkeletonBox className="w-10 h-10 rounded-lg shrink-0" />
                    <div className="flex-1">
                      <SkeletonText className="w-52 mb-2" />
                      <SkeletonText className="h-3 w-36" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap ps-13 max-lg:ps-0 mt-3">
                    {repeat(3).map((meta) => (
                      <SkeletonText key={meta} className="h-3 w-24" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <SkeletonBox className="h-6 w-20 rounded-lg" />
                  <SkeletonBox className="size-9 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3 p-4">
          <SkeletonText className="w-48" />
          <div className="flex items-center gap-2">
            {repeat(4).map((i) => (
              <SkeletonBox key={i} className="size-9 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ListSkeleton;
