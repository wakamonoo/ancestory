export default function FeaturedStoryLoader() {
  return (
    <div className="flex w-full items-stretch gap-8 animate-pulse">
      <div className="hidden md:block md:w-2/5 lg:w-1/3 bg-second" />
      <div className="w-full md:w-3/5 lg:w-2/3 flex flex-col gap-2">
        <div className="bg-second rounded h-6 w-40" />
        <div className="bg-second rounded h-5 w-28" />
        <div className="bg-second rounded h-10 w-32" />
        <div className="flex items-center gap-2">
          <div className="bg-second rounded h-5 w-5" />
          <div className="bg-second rounded h-5 w-28" />
        </div>
        <div className="bg-second rounded h-5 w-full" />
        <div className="bg-second rounded h-5 w-full" />
        <div className="bg-second rounded h-5 w-full" />
        <div className="bg-second rounded h-5 w-full hidden lg:block" />
        <div className="bg-second rounded h-5 w-50 hidden lg:block" />
        <div className="mt-4 bg-panel w-fit px-4 py-2 rounded">
          <div className="flex items-center gap-1">
            <div className="bg-second rounded h-5 w-5" />
            <div className="bg-second rounded h-5 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
}
