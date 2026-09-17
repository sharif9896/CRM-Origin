import { SkeletonBox, SkeletonCircle, SkeletonPageHeader, SkeletonText } from "./primitives";
import { repeat } from "./utils";

/** Cards per column, varied so the board does not look uniform while loading. */
const CARDS_PER_COLUMN = [4, 3, 3, 2];

const KanbanSkeleton = ({ columns = 4 }: { columns?: number }) => (
  <div className="p-3 lg:py-6 lg:px-0">
    <SkeletonPageHeader action={false} />

    <div className="grid grid-cols-12 gap-4 lg:gap-6 mb-4 lg:mb-6">
      {repeat(4).map((i) => (
        <div key={i} className="col-span-12 sm:col-span-6 xl:col-span-3">
          <div className="bg-white rounded-lg border border-border-color shadow-sm p-6 h-full">
            <SkeletonText className="w-28 mb-3" />
            <SkeletonBox className="h-8 w-32 mb-3" />
            <SkeletonBox className="h-1 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-12 gap-4 lg:gap-6 items-start">
      {repeat(columns).map((col) => (
        <div key={col} className="col-span-12 md:col-span-6 xl:col-span-3">
          <div className="bg-white-50 rounded-lg border border-border-color shadow-xs p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-border-color">
              <div>
                <SkeletonText className="w-24 mb-1.5" />
                <SkeletonText className="h-3 w-20" />
              </div>
              <SkeletonCircle className="size-6 shrink-0" />
            </div>

            <div className="space-y-3 flex-1">
              {repeat(CARDS_PER_COLUMN[col % CARDS_PER_COLUMN.length]).map((card) => (
                <div key={card} className="bg-white rounded-lg p-3 border border-border-color">
                  <SkeletonText className="w-full mb-2" />
                  <SkeletonText className="h-3 w-20 mb-3" />
                  <div className="flex items-center gap-2">
                    <SkeletonCircle className="w-6 h-6 shrink-0" />
                    <SkeletonText className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default KanbanSkeleton;
