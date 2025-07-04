import Reblend, { FC } from "reblendjs";

export const Pane: FC<{
  className?: string;
  children: Reblend.ReblendNode;
}> = ({ className = "", children }) => (
  <div
    class={`bg-neutral-100 border border-neutral-300 rounded p-2 scrollbar-hide ${className} overflow-auto`}
    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
  >
    <style>
      {`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}
    </style>
    {children}
  </div>
);
