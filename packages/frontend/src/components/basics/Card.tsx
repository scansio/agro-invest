import Reblend, { FC } from "reblendjs";

export const Card: FC<Reblend.JSX.IntrinsicElements["div"]> = ({
  className = "",
  class: clazz,
  ...rest
}) => (
  <div
    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    {...rest}
    className={`bg-white rounded shadow-lg p-6 px-4 sm:px-6 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 ${className} ${clazz} overflow-auto scrollbar-hide`}
  />
);
