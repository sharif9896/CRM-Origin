import { SkeletonBox, SkeletonPageHeader, SkeletonText } from "./primitives";
import { repeat } from "./utils";

type Props = {
  tabs?: number;
  fields?: number;
};

/** Settings: a full-width card with a tab bar above a single form panel. */
const TabsSkeleton = ({ tabs = 4, fields = 4 }: Props) => (
  <div className="p-3 lg:py-6 lg:px-0">
    <SkeletonPageHeader action={false} />

    <div className="grid grid-cols-12 gap-4 lg:gap-6">
      <div className="col-span-12">
        <div className="bg-white-50 rounded-lg border border-border-color shadow-xs overflow-hidden">
          <div className="flex flex-wrap border-b border-border-color bg-white">
            {repeat(tabs).map((i) => (
              <div key={i} className="flex items-center px-6 py-4">
                <SkeletonBox className="size-4 me-2 rounded" />
                <SkeletonText className="w-20" />
              </div>
            ))}
          </div>

          <div className="p-6">
            <SkeletonText className="w-36 mb-4" />
            <div className="space-y-6">
              {repeat(fields).map((i) => (
                <div key={i}>
                  <SkeletonText className="h-3 w-28 mb-2" />
                  <SkeletonBox className="h-10 w-full max-w-md rounded-lg" />
                </div>
              ))}
              <SkeletonBox className="h-10 w-32 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TabsSkeleton;
