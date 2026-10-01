import { FaImage } from "react-icons/fa";

export default function StoryPageLoader() {
  return (
    <div className="w-full animate-pulse">
      <div className="flex items-center justify-center w-full aspect-video bg-second shrink-0">
        <FaImage className="text-4xl text-(--color-panel)" />
      </div>
      <div className="p-4">
        <div className="h-4 w-18 bg-second rounded" />
        <div className="my-4 h-10 w-32 bg-second rounded" />
        <div className="flex flex-wrap items-center gap-x-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-second" />
            <div className="h-5 w-24 bg-second" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-second" />
            <div className="h-5 w-24 bg-second" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-second" />
            <div className="h-5 w-24 bg-second" />
          </div>
        </div>
        <div className="my-8 flex flex-col gap-6">
          <div className="h-5 w-full bg-second" />
          <div className="h-5 w-full bg-second" />
          <div className="h-5 w-full bg-second" />
          <div className="h-5 w-full bg-second" />
          <div className="h-6 w-24 bg-second" />
        </div>
      </div>
    </div>
  );
}
