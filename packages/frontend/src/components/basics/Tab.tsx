import Reblend, { FC } from "reblendjs";

export const Tab: FC<{
  tabs: { label: string; key: string }[];
  active: string;
  onTab: (key: string) => void;
  className?: string;
}> = ({ tabs, active, onTab, className = "" }) => (
  <div class={`flex gap-2 border-b border-neutral-200 ${className}`}>
    {tabs.map((tab) => (
      <button
        class={`px-4 py-2 font-semibold ${
          active === tab.key
            ? "border-b-2 border-brand text-brand"
            : "text-neutral-500 hover:text-brand"
        }`}
        onClick={() => onTab(tab.key)}
      >
        {tab.label}
      </button>
    ))}
  </div>
);
