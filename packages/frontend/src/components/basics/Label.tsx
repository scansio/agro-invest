import Reblend, { DetailedHTMLProps, FC } from "reblendjs";

export type LabelProps = {
  className?: string;
} & Reblend.JSX.IntrinsicElements["label"];

export const Label: FC<LabelProps> = ({ className = "", ...rest }) => (
  <label
    {...rest}
    className={"block font-semibold mb-1 text-sm " + className}
  />
);
