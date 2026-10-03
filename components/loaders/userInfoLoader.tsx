import { FaImage } from "react-icons/fa";

export default function UserInfoLoader() {
  return (
    <div className="relative p-8 md:px-16 lg:px-32 xl:px-64 flex items-center gap-4 min-h-64 max-h-84 animate-pulse">
      <div className="flex items-center justify-center w-32 h-32 rounded-full bg-second overflow-hidden shrink-0">
        <FaImage className="text-4xl text-(--color-panel)" />
      </div>
      <div className="flex flex-col gap-1">
        <div className="h-6 w-32 bg-second rounded" />
        <div className="h-5 w-50 bg-second rounded" />
        <div className="mt-4 flex items-center gap-4">
          <div className="flex flex-col gap-1 items-center">
            <div className="h-5 w-5 bg-second rounded" />
            <div className="h-4 w-12 bg-second rounded" />
          </div>
          <div className="h-8 w-px bg-(--color-accent)/10" />
          <div className="h-5 w-24 bg-second rounded" />
        </div>
      </div>
    </div>
  );
}
