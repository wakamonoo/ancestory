import type { ReactNode } from "react";

type RegularButtonProps = {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  children: ReactNode;
  form?: string;
  disabled?: boolean;
};

export default function RegularButton({
  onClick,
  type = "button",
  children,
  form,
  disabled,
}: RegularButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      form={form}
      disabled={disabled}
      className={`mt-2 w-full py-2 px-4 rounded flex justify-center items-center gap-2 ${
        disabled
          ? "cursor-not-allowed bg-(--color-accent)/60"
          : "hover:bg-(--color-accent)/80 cursor-pointer bg-accent"
      }`}
    >
      {children}
    </button>
  );
}
