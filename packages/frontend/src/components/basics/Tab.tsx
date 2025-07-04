import Reblend, { FC } from "reblendjs";

export const Tab: FC<{
  tabs: { label: string; key: string }[];
  active: string;
  onTab: (key: string) => void;
  className?: string;
  type?: "line" | "button";
}> = ({ tabs, active, onTab, className = "", type = "button" }) =>
  type == "button" ? (
    <div
      class={`flex flex-row gap-0 mb-8 overflow-x-auto scrollbar-hide ${className}`}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>
        {`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}
      </style>
      {tabs.map((tab, index, arr) => (
        <button
          class={`flex-1 ${
            index == 0
              ? "rounded-l-2xl"
              : index === arr.length - 1
              ? "rounded-r-2xl"
              : ""
          } py-2 px-1 font-semibold text-xs ${
            active === tab.key
              ? "bg-success-600 text-white"
              : "bg-white text-neutral-400 border border-neutral-200"
          }`}
          onClick={() => onTab(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  ) : (
    <div
      class={`flex gap-2 border-b border-neutral-200 overflow-x-auto scrollbar-hide ${className}`}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>
        {`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}
      </style>{" "}
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
