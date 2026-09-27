import type { ReactNode } from "react";

type ActionButtonProps = {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  children: ReactNode;
};

export default function ActionButton({
  onClick,
  type = "button",
  children,
}: ActionButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="cursor-pointer w-full py-2 px-4 bg-panel transition-all duration-200 hover:bg-(--color-panel)/80 active:bg-(--color-panel)/80 rounded flex justify-center items-center gap-1"
    >
      {children}
    </button>
  );
}
