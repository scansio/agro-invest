import Reblend, { FC } from "reblendjs";

export const Pane: FC<{
  className?: string;
  children: Reblend.ReblendNode;
}> = ({ className = "", children }) => (
  <div
    class={`bg-neutral-100 border border-neutral-300 rounded p-2 ${className}`}
  >
    {children}
  </div>
);
