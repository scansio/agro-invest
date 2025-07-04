import Reblend, { DetailedHTMLProps, FC } from "reblendjs";

export type SelectProps = {
  className?: string;
} & Reblend.JSX.IntrinsicElements["select"];

export const Select: FC<SelectProps> = ({ className = "", ...rest }) => (
  <select
    {...rest}
    className={
      "form-select w-full rounded-lg shadow bg-neutral-50 border border-neutral-200 p-3 text-neutral-900 text-base " +
      className
    }
  />
);
