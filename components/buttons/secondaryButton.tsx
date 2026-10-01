import type { ReactNode } from "react";

type SecondaryButtonProps = {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  children: ReactNode;
  form?: string;
  disabled?: boolean;
};

export default function SecondaryButton({
  onClick,
  type = "button",
  children,
  form,
  disabled,
}: SecondaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      form={form}
      disabled={disabled}
      className={`w-full p-4 rounded-lg flex justify-center items-center gap-2 ${
        disabled
          ? "cursor-not-allowed bg-(--color-muted)/60"
          : "hover:brightness-90 cursor-pointer bg-muted"
      }`}
    >
      {children}
    </button>
  );
}
