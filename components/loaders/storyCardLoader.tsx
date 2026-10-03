import { FaImage } from "react-icons/fa";

export default function StoryCardLoader() {
  return (
    <div className="flex flex-row sm:flex-col items-center sm:items-start gap-2 animate-pulse">
      <div className="flex items-center justify-center w-1/2  sm:w-full aspect-3/2 object-cover bg-second shrink-0">
        <FaImage className="text-4xl text-(--color-panel)" />
      </div>
      <div className="min-w-0 w-full px-2 flex flex-col gap-2">
        <div className="h-7 w-32 rounded bg-second" />

        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-second" />
          <div className="h-5 w-24 bg-second" />
        </div>
        <div className="h-px w-full bg-(--color-accent)/40" />
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-second" />
          <div className="h-5 w-18 bg-second" />
        </div>
      </div>
    </div>
  );
}
