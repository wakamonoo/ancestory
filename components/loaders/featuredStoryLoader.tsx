import { FaImage } from "react-icons/fa";

export default function FeaturedStoryLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[2.5fr_1.5fr] items-start w-full gap-2 md:gap-8 mt-4 animate-pulse">
      <div className="flex items-center justify-center w-full aspect-21/9 bg-second shrink-0">
        <FaImage className="text-4xl text-(--color-panel)" />
      </div>
      <div className="w-full flex flex-col">
        <div className="my-2 h-10 w-32 bg-second rounded" />
        <div className="my-4 flex flex-wrap gap-x-8 gap-y-2">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-second" />
            <div className="h-5 w-24 bg-second" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-second rounded" />
            <div className="h-5 w-24 bg-second rounded" />
          </div>
        </div>
        <div className="my-2 h-4 w-18 bg-second rounded" />
        <div className="h-px w-full bg-(--color-accent)/10 my-2" />
        <div className="flex flex-col gap-1 my-2">
          <div className="h-6 w-full bg-second rounded" />
          <div className="h-6 w-full bg-second rounded" />
          <div className="h-6 w-full bg-second rounded" />
          <div className="h-6 w-full bg-second rounded hidden lg:block" />
          <div className="h-6 w-full bg-second rounded hidden lg:block" />
        </div>
      </div>
    </div>
  );
}
