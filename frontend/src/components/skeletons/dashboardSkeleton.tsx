import { SkeletonBox, SkeletonCircle, SkeletonText } from "./primitives";
import { repeat } from "./utils";

const CARD = "bg-white-50 rounded-lg border border-border-color shadow-xs p-5";

const DashboardSkeleton = () => (
  <div className="p-3 lg:py-6 lg:px-0">
    <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
      <SkeletonBox className="h-7 lg:h-9 w-64" />
      <div className="flex items-center gap-2">
        <SkeletonBox className="h-9 w-44 rounded-lg" />
        <SkeletonBox className="h-9 w-28 rounded-lg" />
        <SkeletonBox className="h-9 w-36 rounded-full" />
      </div>
    </div>

    <div className="grid grid-cols-12 gap-4 lg:gap-6">
      <div className="col-span-12 xxl:col-span-8">
        <div className="grid grid-cols-12 gap-4 lg:gap-6 mb-4 lg:mb-6">
          <div className="col-span-12 lg:col-span-6">
            <div className={`${CARD} h-full`}>
              <SkeletonText className="w-28 mb-3" />
              <SkeletonBox className="h-9 w-40 mb-4" />
              <SkeletonBox className="h-6 w-full rounded-full" />
            </div>
          </div>
          {repeat(2).map((i) => (
            <div key={i} className="col-span-12 sm:col-span-6 lg:col-span-3">
              <div className={`${CARD} h-full flex flex-col justify-between gap-3`}>
                <SkeletonText className="w-20" />
                <SkeletonBox className="h-8 w-24" />
                <SkeletonText className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>

        <div className={`${CARD} mb-4 lg:mb-6`}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <SkeletonText className="w-40" />
            <SkeletonBox className="h-8 w-28 rounded-lg" />
          </div>
          <SkeletonBox className="w-full h-[280px] rounded-lg" />
        </div>

        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          <div className="col-span-12 lg:col-span-6">
            {repeat(3).map((i) => (
              <div key={i} className={`${CARD} ${i < 2 ? "mb-6" : ""}`}>
                <SkeletonText className="w-28 mb-3" />
                <SkeletonBox className="h-7 w-24 mb-3" />
                <SkeletonBox className="h-16 w-full rounded-lg" />
              </div>
            ))}
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className={`${CARD} h-full`}>
              <SkeletonText className="w-40 mb-4" />
              <SkeletonBox className="h-[35px] w-full rounded-full mb-4" />
              <div className="flex justify-center mb-5">
                <SkeletonCircle className="size-20" />
              </div>
              <div className="space-y-3 mb-5">
                {repeat(4).map((i) => (
                  <div key={i} className="flex items-center justify-between gap-3">
                    <SkeletonText className="h-3 w-24" />
                    <SkeletonText className="h-3 w-12" />
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-white border border-border-color p-5">
                <SkeletonText className="w-24 mb-2" />
                <SkeletonBox className="h-7 w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-12 xxl:col-span-4">
        <div className={`${CARD} mb-6`}>
          <div className="flex items-center justify-between gap-3 mb-6">
            <SkeletonText className="w-36" />
            <SkeletonText className="h-3 w-16" />
          </div>
          <div className="grid grid-cols-12 gap-6 mb-6">
            {repeat(2).map((i) => (
              <div key={i} className="col-span-12 xxl:col-span-12 xl:col-span-6 lg:col-span-6">
                <div className="border border-border-color rounded-xl p-5">
                  <SkeletonBox className="h-50 w-full rounded-lg mb-4" />
                  <SkeletonText className="w-3/4 mb-2" />
                  <SkeletonText className="h-3 w-1/2 mb-3" />
                  <SkeletonBox className="h-6 w-24" />
                </div>
              </div>
            ))}
          </div>
          <div className={CARD}>
            <SkeletonText className="w-32 mb-4" />
            <SkeletonBox className="h-[198px] w-full rounded-lg mb-4" />
            {repeat(2).map((i) => (
              <div key={i} className="flex items-center justify-between gap-3 mb-2">
                <SkeletonText className="h-3 w-24" />
                <SkeletonText className="h-3 w-10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-12 gap-4 lg:gap-6">
      <div className="col-span-12 xl:col-span-4 xxl:col-span-5">
        <div className={`${CARD} h-full`}>
          <SkeletonText className="w-32 mb-4" />
          {repeat(5).map((i) => (
            <div key={i} className="bg-gray-transparent p-1.5 rounded-lg mb-1.5">
              <div className="flex items-center justify-between gap-3 mb-2">
                <SkeletonText className="h-3 w-28" />
                <SkeletonText className="h-3 w-10" />
              </div>
              <SkeletonBox className="h-1.5 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-12 xl:col-span-8 xxl:col-span-7">
        <div className={`${CARD} mb-6`}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <SkeletonText className="w-28" />
            <SkeletonText className="h-3 w-16" />
          </div>
          <div className="space-y-4">
            {repeat(4).map((i) => (
              <div
                key={i}
                className="bg-white-50 rounded-lg border border-border-color p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <SkeletonCircle className="size-10 shrink-0" />
                  <div>
                    <SkeletonText className="w-32 mb-1.5" />
                    <SkeletonText className="h-3 w-20" />
                  </div>
                </div>
                <SkeletonBox className="h-6 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 mb-6">
      <div className="bg-white-50 rounded-lg border border-border-color shadow-xs overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border-color gap-2 flex-wrap">
          <SkeletonText className="w-32" />
          <SkeletonBox className="h-8 w-24 rounded-lg" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody>
              {repeat(5).map((row) => (
                <tr key={row}>
                  {repeat(6).map((col) => (
                    <td key={col} className="px-6 py-4 border-b border-border-color bg-white">
                      <SkeletonText className={col === 0 ? "w-32" : "w-20"} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-12 gap-4 lg:gap-6">
      <div className="col-span-12 xl:col-span-6">
        <div className={`${CARD} h-full`}>
          <SkeletonText className="w-40 mb-4" />
          <SkeletonBox className="h-100 w-full rounded-lg" />
        </div>
      </div>
      <div className="col-span-12 xl:col-span-6">
        <div className={`${CARD} mb-6`}>
          <SkeletonText className="w-40 mb-4" />
          <SkeletonBox className="h-[170px] w-full rounded-lg" />
        </div>
        <div className={CARD}>
          <SkeletonText className="w-40 mb-4" />
          <SkeletonBox className="h-[130px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

export default DashboardSkeleton;
