import type { ReactNode } from "react";

type CTAButtonProps = {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  children: ReactNode;
};

export default function CTAButton({
  onClick,
  type = "button",
  children,
}: CTAButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="cursor-pointer flex items-center justify-center gap-2 p-4 rounded-lg bg-accent transition-all duration-200 hover:brightness-90 active:brightness-90"
    >
      {children}
    </button>
  );
}
