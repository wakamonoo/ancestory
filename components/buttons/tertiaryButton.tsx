import type { ReactNode } from "react";

type TertiaryButtonProps = {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  children: ReactNode;
};

export default function TertiaryButton({
  onClick,
  type = "button",
  children,
}: TertiaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="cursor-pointer group w-full py-2 px-4 flex gap-4 items-center justify-center transition-all duration-200)"
    >
      {children}
    </button>
  );
}
