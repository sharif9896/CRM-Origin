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
  cards?: number;
  statCards?: number;
  /** Media-led cards (property tiles) lead with a wide image instead of an avatar. */
  variant?: "avatar" | "media";
  colSpan?: string;
};

const AvatarCard = () => (
  <div className="bg-white-50 rounded-lg border border-border-color shadow-xs p-5 h-full">
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="flex items-center gap-3">
        <SkeletonCircle className="w-14 h-14 shrink-0" />
        <div>
          <SkeletonText className="w-32 mb-2" />
          <SkeletonText className="h-3 w-24" />
        </div>
      </div>
      <SkeletonCircle className="size-9 shrink-0" />
    </div>

    <div className="flex items-center gap-2 mb-4">
      <SkeletonBox className="h-5 w-24 rounded-md" />
      <SkeletonBox className="h-5 w-16 rounded-lg" />
    </div>

    <div className="grid grid-cols-3 gap-2 mb-4">
      {repeat(3).map((i) => (
        <div key={i} className="rounded-lg bg-white border border-border-color p-2.5">
          <SkeletonText className="w-10 mx-auto mb-1.5" />
          <SkeletonText className="h-3 w-12 mx-auto" />
        </div>
      ))}
    </div>

    <div className="grid grid-cols-2 gap-2">
      <SkeletonBox className="h-9 rounded-full" />
      <SkeletonBox className="h-9 rounded-full" />
    </div>
  </div>
);

const MediaCard = () => (
  <div className="bg-white-50 rounded-lg border border-border-color shadow-xs overflow-hidden h-full">
    <SkeletonBox className="h-48 w-full rounded-none" />
    <div className="p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <SkeletonBox className="h-6 w-28" />
        <SkeletonBox className="h-5 w-16 rounded-lg" />
      </div>
      <SkeletonText className="w-full mb-2" />
      <SkeletonText className="h-3 w-3/4 mb-4" />
      <div className="flex items-center gap-4 pt-3 border-t border-border-color">
        {repeat(3).map((i) => (
          <SkeletonText key={i} className="h-3 w-14" />
        ))}
      </div>
    </div>
  </div>
);

const CardGridSkeleton = ({
  cards = 6,
  statCards = 4,
  variant = "avatar",
  colSpan = "col-span-12 md:col-span-6 xl:col-span-4",
}: Props) => (
  <div className="p-3 lg:py-6 lg:px-0">
    <SkeletonPageHeader />

    {statCards > 0 && <SkeletonStatCards count={statCards} />}

    <div className="bg-white-50 rounded-lg border border-border-color shadow-xs mb-4 lg:mb-6">
      <SkeletonToolbar />
    </div>

    <div className="grid grid-cols-12 gap-4 lg:gap-6">
      {repeat(cards).map((i) => (
        <div key={i} className={colSpan}>
          {variant === "media" ? <MediaCard /> : <AvatarCard />}
        </div>
      ))}
    </div>
  </div>
);

export default CardGridSkeleton;
