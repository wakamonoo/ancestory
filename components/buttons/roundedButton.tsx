import type { ReactNode } from "react";

type RoundedButtonProps = {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  children: ReactNode;
  form?: string;
  disabled?: boolean;
};

export default function RoundedButton({
  onClick,
  type = "button",
  children,
  form,
  disabled,
}: RoundedButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      form={form}
      disabled={disabled}
      className={`mt-2 w-full py-2 px-4 rounded-full flex justify-center items-center gap-1 ${
        disabled
          ? "cursor-not-allowed bg-(--color-accent)/60"
          : "hover:brightness-90 cursor-pointer bg-accent"
      }`}
    >
      {children}
    </button>
  );
}
