import type { ReactNode } from "react";

type TransparentButtonProps = {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  children: ReactNode;
};

export default function TransparentButton({
  onClick,
  type = "button",
  children,
}: TransparentButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="cursor-pointer group w-fit flex gap-4 items-center justify-center transition-all duration-200"
    >
      {children}
    </button>
  );
}
