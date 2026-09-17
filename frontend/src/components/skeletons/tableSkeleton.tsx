import {
  SkeletonBox,
  SkeletonCircle,
  SkeletonPageHeader,
  SkeletonStatCards,
  SkeletonText,
  SkeletonToolbar,
} from "./primitives";
import { repeat } from "./utils";

type Props = {
  /** Data columns, excluding the trailing action column. */
  cols?: number;
  rows?: number;
  statCards?: number;
  /** First cell shows an avatar beside two lines of text. */
  avatarColumn?: boolean;
  action?: boolean;
};

const TableSkeleton = ({
  cols = 5,
  rows = 8,
  statCards = 4,
  avatarColumn = true,
  action = true,
}: Props) => (
  <div className="p-3 lg:py-6 lg:px-0">
    <SkeletonPageHeader action={action} />

    {statCards > 0 && <SkeletonStatCards count={statCards} />}

    <div className="grid grid-cols-1">
      <div className="bg-white-50 rounded-lg border border-border-color shadow-xs overflow-hidden">
        <SkeletonToolbar />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-light">
                {repeat(cols).map((i) => (
                  <th key={i} className="px-6 py-3 text-start">
                    <SkeletonText className="w-20" />
                  </th>
                ))}
                <th className="px-6 py-3 text-end">
                  <SkeletonText className="w-12 ms-auto" />
                </th>
              </tr>
            </thead>
            <tbody>
              {repeat(rows).map((row) => (
                <tr key={row}>
                  {repeat(cols).map((col) => (
                    <td key={col} className="px-6 py-4 border-b border-border-color bg-white">
                      {col === 0 && avatarColumn ? (
                        <div className="flex items-center gap-3">
                          <SkeletonCircle className="w-9 h-9 shrink-0" />
                          <div className="flex-1">
                            <SkeletonText className="w-32 mb-1.5" />
                            <SkeletonText className="h-3 w-40" />
                          </div>
                        </div>
                      ) : (
                        <SkeletonText className={col % 2 === 0 ? "w-28" : "w-20"} />
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 border-b border-border-color bg-white">
                    <div className="flex items-center justify-end gap-2.5">
                      <SkeletonCircle className="size-9" />
                      <SkeletonCircle className="size-9" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default TableSkeleton;
