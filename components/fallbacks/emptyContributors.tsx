import { LuUsers } from "react-icons/lu";

export default function EmptyContributors() {
  return (
    <div className="flex w-full py-16 items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-second">
          <LuUsers className="text-2xl text-brand shrink-0" />
        </div>
        <p className="font-tall text-base font-semibold text-normal">
          No conntributors yet.
        </p>
        <p className="mt-2 max-w-sm text-sm text-muted leading-tight text-center">
          The people behind these stories will appear here as the community grows.
        </p>
      </div>
    </div>
  );
}
