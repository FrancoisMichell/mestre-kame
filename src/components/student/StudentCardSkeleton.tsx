import { Skeleton } from "../common/Skeleton";

export const StudentCardSkeleton = () => {
  return (
    <div className="flex flex-wrap items-center gap-3 md:gap-4 bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-2.5 md:p-4 border-l-4 border-gray-200">
      {/* Avatar skeleton */}
      <Skeleton
        variant="circle"
        width={40}
        height={40}
        className="md:w-14 md:h-14 shrink-0"
      />

      {/* Content skeleton */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Mobile layout */}
        <div className="md:hidden space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton width={120} height={14} />
            <Skeleton width={40} height={12} />
            <Skeleton width={60} height={12} />
          </div>
          <div className="flex gap-4">
            <Skeleton width={80} height={12} />
            <Skeleton width={80} height={12} />
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:block space-y-2">
          <Skeleton width="80%" height={20} />
          <Skeleton width="60%" height={16} />
          <Skeleton width="70%" height={16} />
        </div>
      </div>

      {/* Status badge skeleton */}
      <Skeleton
        variant="rectangle"
        width={70}
        height={24}
        className="rounded-full shrink-0"
      />
    </div>
  );
};
