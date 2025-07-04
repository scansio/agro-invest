import Reblend, { FC } from "reblendjs";

export const Button: FC<{
  variant?:
    | "primary"
    | "secondary"
    | "support"
    | "neutral"
    | "danger"
    | "success";
  disabled?: boolean;
  onClick?: () => void;
  children: Reblend.ReblendNode;
  className?: string;
}> = ({
  variant = "primary",
  disabled,
  onClick,
  children,
  className = "",
  ref,
}) => {
  const base = "px-4 py-2 rounded-lg font-medium focus:outline-none transition";
  const variants: Record<string, string> = {
    primary:
      "bg-brand text-white hover:bg-brand-600 focus:ring-2 focus:ring-brand-300 dark:bg-brand-400 dark:text-neutral-900 dark:hover:bg-brand-500 px-4 py-2 flex-1",
    secondary:
      "bg-secondary text-white hover:bg-secondary-600 focus:ring-2 focus:ring-secondary-200 dark:bg-secondary-400 dark:text-neutral-900 dark:hover:bg-secondary-500 px-4 py-2 flex-1",
    support:
      "bg-support text-white text-support-900 hover:bg-support-600 border border-support-400 dark:bg-support-400 dark:text-neutral-900 dark:hover:bg-support-500 px-4 py-2 flex-1",
    neutral:
      "bg-neutral-100 text-neutral-900 border border-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-600 px-4 py-2 flex-1",
    danger:
      "bg-danger text-white hover:bg-danger-600 focus:ring-2 focus:ring-danger-300 dark:bg-danger-400 dark:text-neutral-900 dark:hover:bg-danger-500 px-4 py-2 flex-1",
    success:
      "bg-success text-white hover:bg-success-600 focus:ring-2 focus:ring-success-300 dark:bg-success-400 dark:text-neutral-900 dark:hover:bg-success-500 px-4 py-2 flex-1",
  };

  const disabledStyle = "opacity-50 cursor-not-allowed";

  return (
    <button
      class={`${base} ${variants[variant]} ${
        disabled ? disabledStyle : ""
      } ${className}`}
      disabled={disabled}
      onClick={onClick}
      ref={ref}
    >
      {children}
    </button>
  );
};
