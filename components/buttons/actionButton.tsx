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
      className="cursor-pointer w-full py-2 px-4 bg-(--color-panel)/60 transition-all duration-200 hover:bg-(--color-panel) active:bg-(--color-panel) rounded flex justify-center items-center gap-1"
    >
      {children}
    </button>
  );
}
