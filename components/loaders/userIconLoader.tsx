export default function UserIconLoader() {
  return (
    <div className="relative w-6 h-6">
      <div
        className="absolute w-full h-full rounded-full border-[3px] border-gray-100/10 border-r-(--color-accent) border-b-(--color-accent) animate-spin"
        style={{ animationDuration: "3s" }}
      />
      <div
        className="absolute w-full h-full rounded-full border-[3px] border-gray-100/10 border-t-(--color-accent) animate-spin"
        style={{ animationDuration: "2s", animationDirection: "reverse" }}
      />

      <div className="absolute inset-0 bg-linear-to-tr from-[#0ff]/10 via-transparent to-[#0ff]/5 animate-pulse rounded-full blur-sm" />
    </div>
  );
}
