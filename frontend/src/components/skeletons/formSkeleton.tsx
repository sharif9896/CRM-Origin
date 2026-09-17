import { SkeletonBox, SkeletonPageHeader, SkeletonText } from "./primitives";
import { repeat } from "./utils";

type Props = {
  /** Field count per form group; one entry per group. */
  groups?: number[];
  /** Right rail: photo dropzone above the tips card. */
  upload?: boolean;
  tips?: boolean;
};

const FieldSkeleton = () => (
  <div>
    <SkeletonText className="h-3 w-24 mb-2" />
    <SkeletonBox className="h-10 w-full rounded-lg" />
  </div>
);

const FormSkeleton = ({ groups = [5, 4, 2], upload = true, tips = true }: Props) => (
  <div className="p-3 lg:py-6 lg:px-0">
    <SkeletonPageHeader action={false} />

    <div className="grid grid-cols-12 gap-4 lg:gap-6">
      <div className="col-span-12 xl:col-span-8">
        <div className="bg-white-50 rounded-lg border border-border-color shadow-xs p-6">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border-color">
            <SkeletonBox className="size-12 rounded-lg shrink-0" />
            <div>
              <SkeletonBox className="h-6 w-44 mb-2" />
              <SkeletonText className="h-3 w-64" />
            </div>
          </div>

          {groups.map((fieldCount, groupIndex) => (
            <div
              key={groupIndex}
              className={
                groupIndex < groups.length - 1
                  ? "mb-6 pb-6 border-b border-border-color"
                  : "mb-6"
              }
            >
              <SkeletonText className="w-40 mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {repeat(fieldCount).map((i) => (
                  <FieldSkeleton key={i} />
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-center gap-2">
            <SkeletonBox className="h-10 w-24 rounded-lg" />
            <SkeletonBox className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </div>

      <div className="col-span-12 xl:col-span-4">
        {upload && (
          <div className="bg-white-50 rounded-lg border border-border-color shadow-xs p-6 mb-4 lg:mb-6">
            <SkeletonText className="w-28 mb-4" />
            <div className="border-2 border-dashed border-border-color rounded-lg p-6 flex flex-col items-center">
              <SkeletonBox className="size-10 mb-3" />
              <SkeletonText className="w-40 mb-2" />
              <SkeletonText className="h-3 w-28 mb-3" />
              <SkeletonBox className="h-9 w-28 rounded-lg" />
            </div>
          </div>
        )}

        {tips && (
          <div className="bg-white-50 rounded-lg border border-border-color shadow-xs p-6">
            <SkeletonText className="w-24 mb-4" />
            <div className="space-y-3">
              {repeat(3).map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <SkeletonBox className="size-4 shrink-0 rounded-full" />
                  <SkeletonText className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default FormSkeleton;
