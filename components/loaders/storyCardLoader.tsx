export default function StoryCardLoader() {
  return (
    <div className="flex flex-row md:flex-col items-center md:items-start gap-2 p-2 rounded animate-pulse">
      <div className="w-1/2 md:w-full aspect-3/2 object-cover bg-second" />
      <div className="min-w-0 w-full px-2 flex flex-col gap-2">
        <div className="h-8 w-32 rounded bg-second" />

        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-second" />
          <div className="h-5 w-24 bg-second" />
        </div>

        <div className="h-px w-full bg-brown" />
        <div className="h-4 w-12 bg-second" />
      </div>
    </div>
  );
}
