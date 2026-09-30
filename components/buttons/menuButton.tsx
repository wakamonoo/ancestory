import type { ReactNode } from "react";

type MenuButtonProps = {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  children: ReactNode;
  form?: string;
  disabled?: boolean;
};

export default function MenuButton({
  onClick,
  type = "button",
  children,
  form,
  disabled,
}: MenuButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      form={form}
      disabled={disabled}
      className="cursor-pointer flex items-center gap-4 p-2 bg-second rounded transition-all duration-200 hover:bg-(--color-panel) active:bg-(--color-panel)"
    >
      {children}
    </button>
  );
}
