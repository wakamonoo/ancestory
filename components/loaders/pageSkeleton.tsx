import StoryCardLoader from "@/components/loaders/storyCardLoader";

type PageSkeletonProps = { variant?: "home" | "archive" | "story" | "profile" };

export default function PageSkeleton({
  variant = "archive",
}: PageSkeletonProps) {
  if (variant === "story") {
    return (
      <div
        className="mx-auto w-full max-w-5xl animate-pulse py-12"
        role="status"
        aria-label="Loading story"
      >
        <div className="skeleton mb-8 h-4 w-16 rounded" />
        <div className="skeleton mb-4 h-4 w-40 rounded" />
        <div className="skeleton mb-5 h-12 w-3/4 rounded" />
        <div className="mb-8 flex gap-4">
          <div className="skeleton h-4 w-24 rounded" />
          <div className="skeleton h-4 w-28 rounded" />
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="skeleton aspect-[4/3] rounded-sm" />
          <div className="space-y-3 pt-1">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="skeleton h-4 rounded"
                style={{ width: `${i % 4 === 3 ? 62 : 100}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "profile") {
    return (
      <div className="animate-pulse py-12" role="status" aria-label="Loading profile">
        <div className="skeleton flex min-h-64 items-end gap-5 p-8">
          <div className="skeleton h-24 w-24 rounded-full" />
          <div className="space-y-3">
            <div className="skeleton h-7 w-48 rounded" />
            <div className="skeleton h-4 w-64 rounded" />
          </div>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => <StoryCardLoader key={i} />)}
        </div>
      </div>
    );
  }

  if (variant === "home") {
    return (
      <div className="animate-pulse py-10" role="status" aria-label="Loading AnceStory">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="space-y-5">
            <div className="skeleton h-4 w-48 rounded" />
            <div className="skeleton h-16 w-full rounded" />
            <div className="skeleton h-4 w-full max-w-md rounded" />
            <div className="skeleton h-4 w-4/5 max-w-md rounded" />
            <div className="skeleton h-10 w-40 rounded-sm" />
          </div>
          <div className="skeleton aspect-[4/3] rounded-sm" />
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <div className="skeleton aspect-[4/3] rounded-sm" />
          <div className="space-y-4 pt-4">
            <div className="skeleton h-4 w-32 rounded" />
            <div className="skeleton h-10 w-3/4 rounded" />
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="skeleton h-4 w-full rounded" />
            ))}
          </div>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => <StoryCardLoader key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pulse py-12" role="status" aria-label="Loading archive">
      <div className="page-intro mb-6 space-y-3"><div className="skeleton h-4 w-28 rounded" /><div className="skeleton h-10 w-64 rounded" /></div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }, (_, i) => <StoryCardLoader key={i} />)}</div>
    </div>
  );
}
