export default function MainLoader() {
  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center backdrop-blur-lg">
      <div className="flex items-center justify-center bg-second w-16 h-20 rounded-tl-4xl rounded-tr-4xl p-2">
        <div className="relative w-12 h-16 rounded-tl-4xl rounded-tr-4xl bg-accent animate-pulse">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-second w-4 h-12 rounded-tl-2xl rounded-tr-2xl" />
        </div>
      </div>
    </div>
  );
}
