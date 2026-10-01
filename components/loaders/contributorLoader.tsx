import { FaImage } from "react-icons/fa";

export default function ContributorLoader() {
  return (
    <div className="flex items-center gap-2 animate-pulse w-full">
      <div className="p-0.5 rounded-full border-2 border-panel">
        <div className="flex items-center justify-center w-18 h-18 rounded-full border border-panel bg-second overflow-hidden shrink-0">
          <FaImage className="text-4xl text-(--color-panel)" />
        </div>
      </div>
      <div className="flex flex-col gap-1 items-start w-full">
        <div className="h-6 w-32 bg-second rounded" />
        <div className="h-4 w-16 bg-second rounded" />
      </div>
    </div>
  );
}
