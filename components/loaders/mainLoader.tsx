import Image from "next/image";

export default function MainLoader() {
  return (
    <div className="fixed inset-0 z-999999 flex items-center justify-center backdrop-blur-lg">
      <div className="relative flex items-center justify-center w-24 h-24 bg-second p-4 rounded-full">
        <div
          className="absolute w-full h-full rounded-full border-[3px] border-gray-100/10 border-r-(--color-accent) border-b-(--color-accent) animate-spin"
          style={{ animationDuration: "3s" }}
        />
        <div
          className="absolute w-full h-full rounded-full border-[3px] border-gray-100/10 border-t-(--color-accent) animate-spin"
          style={{ animationDuration: "2s", animationDirection: "reverse" }}
        />

        <div className="absolute inset-0 bg-linear-to-tr from-[#0ff]/10 via-transparent to-[#0ff]/5 animate-pulse rounded-full blur-sm" />

        <Image
          src="/icons/icon.png"
          alt="icon"
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-full object-contain shrink-0"
        />
      </div>
    </div>
  );
}
