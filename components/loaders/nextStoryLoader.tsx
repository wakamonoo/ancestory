export default function NextStoryLoader() {
  return (
    <div className="flex flex-col gap-2 items-end animate-pulse">
      <div className="flex gap-2 items-center">
        <div className="w-4 h-4 bg-second rounded shrink-0" />
        <div className="w-8 h-4 bg-second rounded" />
      </div>
      <div className="flex flex-col gap-1 items-end">
        <div className="w-24 h-6 bg-second rounded" />
        <div className="w-36 h-4 bg-second rounded" />
      </div>
    </div>
  );
}
