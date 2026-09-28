export default function FeaturedStoryLoader() {
  return (
    <div className="flex w-full items-stretch gap-8 animate-pulse" aria-label="Loading featured story">
      <div className="skeleton hidden md:block md:w-2/5 lg:w-1/3 aspect-[4/3]" />
      <div className="w-full md:w-3/5 lg:w-2/3 flex flex-col gap-2">
        <div className="skeleton rounded h-5 w-36" />
        <div className="skeleton rounded h-4 w-28" />
        <div className="skeleton rounded h-10 w-3/4" />
        <div className="flex items-center gap-2">
          <div className="skeleton rounded-full h-4 w-4" />
          <div className="skeleton rounded h-4 w-28" />
        </div>
        <div className="skeleton rounded h-4 w-full" />
        <div className="skeleton rounded h-4 w-full" />
        <div className="skeleton rounded h-4 w-full" />
        <div className="skeleton rounded h-4 w-full hidden lg:block" />
        <div className="skeleton rounded h-4 w-1/2 hidden lg:block" />
        <div className="mt-4 bg-panel w-fit px-4 py-2 rounded">
          <div className="flex items-center gap-1">
            <div className="skeleton rounded h-5 w-5" />
            <div className="skeleton rounded h-5 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
}
