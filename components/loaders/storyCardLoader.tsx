export default function StoryCardLoader() {
  return (
    <div className="story-card flex flex-col items-start gap-3 p-3 rounded-sm animate-pulse">
      <div className="skeleton w-full aspect-3/2" />
      <div className="min-w-0 w-full px-2 flex flex-col gap-2">
        <div className="skeleton h-7 w-3/4 rounded-sm" />

        <div className="flex items-center gap-2">
          <div className="skeleton h-4 w-4 rounded-full" />
          <div className="skeleton h-4 w-24 rounded-sm" />
        </div>

        <div className="h-px w-full bg-(--color-border)" />
        <div className="skeleton h-3 w-16 rounded-sm" />
      </div>
    </div>
  );
}
