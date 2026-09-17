import { SkeletonBox, SkeletonPageHeader, SkeletonStatCards, SkeletonText } from "./primitives";
import { repeat } from "./utils";

const CARD = "bg-white-50 rounded-lg border border-border-color shadow-xs p-6 h-full";

/** Reports: stat cards, a 8/4 + 4/8 chart grid, then a summary table. */
const ChartsSkeleton = () => (
  <div className="p-3 lg:py-6 lg:px-0">
    <SkeletonPageHeader action={false} />
    <SkeletonStatCards count={4} />

    <div className="grid grid-cols-12 gap-4 lg:gap-6 mb-4 lg:mb-6">
      {[
        { span: "col-span-12 xl:col-span-8", height: "h-[300px]" },
        { span: "col-span-12 xl:col-span-4", height: "h-[280px]" },
        { span: "col-span-12 xl:col-span-4", height: "h-[280px]" },
        { span: "col-span-12 xl:col-span-8", height: "h-[290px]" },
      ].map((chart, i) => (
        <div key={i} className={chart.span}>
          <div className={CARD}>
            <SkeletonText className="w-44 mb-4" />
            <SkeletonBox className={`${chart.height} w-full rounded-lg`} />
          </div>
        </div>
      ))}
    </div>

    <div className="bg-white-50 rounded-lg border border-border-color shadow-xs p-6">
      <SkeletonText className="w-40 mb-4" />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] bg-white">
          <thead>
            <tr>
              {repeat(5).map((i) => (
                <th key={i} className="px-6 py-3">
                  <SkeletonText className={i === 0 ? "w-16" : "w-20 ms-auto"} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {repeat(3).map((row) => (
              <tr key={row}>
                {repeat(5).map((col) => (
                  <td key={col} className="px-6 py-4">
                    <SkeletonText className={col === 0 ? "w-20" : "w-16 ms-auto"} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default ChartsSkeleton;
