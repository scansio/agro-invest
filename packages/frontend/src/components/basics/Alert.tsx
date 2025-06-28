import Reblend, { FC } from "reblendjs";

export const Alert: FC<{
  type?: "info" | "warning" | "danger" | "success";
  children: Reblend.ReblendNode;
  className?: string;
}> = ({ type = "info", children, className = "" }) => {
  const base = "border-l-4 rounded p-4 flex items-center gap-2 mb-2";
  const variants: Record<string, string> = {
    info: "bg-info-100 text-info-900 border-info-300 dark:bg-info-700 dark:text-info-50 dark:border-info-400",
    warning: "bg-warning-100 text-warning-900 border-warning-300 dark:bg-warning-700 dark:text-warning-50 dark:border-warning-400",
    danger: "bg-danger-100 text-danger-900 border-danger-300 dark:bg-danger-700 dark:text-danger-50 dark:border-danger-400",
    success: "bg-success-100 text-success-900 border-success-300 dark:bg-success-700 dark:text-success-50 dark:border-success-400",
  };
  const icons = {
    info: "ℹ️",
    warning: "⚠️",
    danger: "⛔",
    success: "✅",
  };
  return (
    <div class={`${base} ${variants[type]} ${className}`}>
      <span class="text-xl">{icons[type]}</span>
      <span>{children}</span>
    </div>
  );
};
