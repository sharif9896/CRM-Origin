import { SkeletonBox, SkeletonCircle, SkeletonText } from "./primitives";
import { repeat } from "./utils";

type Props = {
  /** Detail pages hand-roll a header whose action slot holds two buttons. */
  actions?: number;
  /** invoiceDetails splits its columns at `lg`; the other detail pages split at `xl`. */
  breakpoint?: "lg" | "xl";
  /** Lead with an image gallery (property) instead of an avatar header card. */
  gallery?: boolean;
  /** Stat tiles in the header card; 0 hides the row. */
  tiles?: number;
  mainCards?: number;
  sideCards?: number;
};

const LabelValueCard = ({ rows = 4 }: { rows?: number }) => (
  <div className="space-y-3">
    {repeat(rows).map((i) => (
      <div key={i} className="flex items-center justify-between gap-3">
        <SkeletonText className="h-3 w-24" />
        <SkeletonText className="h-3 w-28" />
      </div>
    ))}
  </div>
);

const DetailSkeleton = ({
  actions = 2,
  breakpoint = "xl",
  gallery = false,
  tiles = 4,
  mainCards = 3,
  sideCards = 3,
}: Props) => {
  const main = breakpoint === "lg" ? "col-span-12 lg:col-span-8" : "col-span-12 xl:col-span-8";
  const side = breakpoint === "lg" ? "col-span-12 lg:col-span-4" : "col-span-12 xl:col-span-4";

  return (
    <div className="p-3 lg:py-6 lg:px-0">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <SkeletonBox className="h-7 lg:h-9 w-56 mb-2" />
          <div className="flex items-center gap-2">
            <SkeletonText className="w-20" />
            <SkeletonText className="w-16" />
            <SkeletonText className="w-24" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {repeat(actions).map((i) => (
            <SkeletonBox key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 lg:gap-6">
        <div className={main}>
          {gallery ? (
            <div className="bg-white-50 rounded-lg border border-border-color shadow-xs p-5 mb-4 lg:mb-6">
              <SkeletonBox className="h-[280px] md:h-[420px] w-full mb-3 rounded-lg" />
              <div className="grid grid-cols-4 gap-2">
                {repeat(4).map((i) => (
                  <SkeletonBox key={i} className="h-20 md:h-24 w-full rounded-lg" />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white-50 rounded-lg border border-border-color shadow-xs p-6 mb-4 lg:mb-6">
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="flex items-start gap-4">
                  <SkeletonBox className="w-24 h-24 rounded-lg shrink-0" />
                  <div>
                    <SkeletonBox className="h-7 w-44 mb-2" />
                    <SkeletonText className="w-28 mb-3" />
                    <div className="flex items-center gap-2 mb-3">
                      <SkeletonBox className="h-5 w-20 rounded-md" />
                      <SkeletonBox className="h-5 w-16 rounded-lg" />
                    </div>
                    <SkeletonText className="h-3 w-40 mb-1.5" />
                    <SkeletonText className="h-3 w-32" />
                  </div>
                </div>
              </div>

              {tiles > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {repeat(tiles).map((i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-white border border-border-color p-3 text-center"
                    >
                      <SkeletonBox className="h-6 w-14 mx-auto mb-2" />
                      <SkeletonText className="h-3 w-16 mx-auto" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {repeat(mainCards).map((i) => (
            <div
              key={i}
              className={`bg-white-50 rounded-lg border border-border-color shadow-xs p-6 ${
                i < mainCards - 1 ? "mb-4 lg:mb-6" : ""
              }`}
            >
              <SkeletonText className="w-40 mb-4" />
              <div className="space-y-4">
                {repeat(3).map((row) => (
                  <div key={row} className="flex items-start gap-3">
                    <SkeletonCircle className="size-10 shrink-0" />
                    <div className="flex-1">
                      <SkeletonText className="w-full mb-2" />
                      <SkeletonText className="h-3 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={side}>
          {repeat(sideCards).map((i) => (
            <div
              key={i}
              className={`bg-white-50 rounded-lg border border-border-color shadow-xs p-6 ${
                i < sideCards - 1 ? "mb-4 lg:mb-6" : ""
              }`}
            >
              <SkeletonText className="w-32 mb-4" />
              {i === sideCards - 1 ? (
                <div className="space-y-2">
                  {repeat(3).map((btn) => (
                    <SkeletonBox key={btn} className="h-10 w-full rounded-lg" />
                  ))}
                </div>
              ) : (
                <LabelValueCard />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailSkeleton;
