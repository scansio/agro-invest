import Reblend, { FC } from "reblendjs";

export const Panel: FC<{
  className?: string;
  children: Reblend.ReblendNode;
}> = ({ className = "", children }) => (
  <div
    class={`bg-neutral-50 border border-neutral-200 rounded p-4 ${className}`}
  >
    {children}
  </div>
);
