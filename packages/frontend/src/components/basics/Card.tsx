import Reblend, { FC } from "reblendjs";

export const Card: FC<{ className?: string; children: Reblend.ReblendNode }> = ({ className = "", children }) => (
  <div class={`bg-white rounded shadow-lg p-6 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 ${className}`}>{children}</div>
);
