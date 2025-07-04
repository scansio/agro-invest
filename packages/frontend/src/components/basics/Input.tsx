import Reblend, { DetailedHTMLProps, FC, ReblendNode } from "reblendjs";

export type InputProps = {
  className?: string;
  leftIcon?: ReblendNode;
  rightIcon?: ReblendNode;
  loading?: boolean;
} & Reblend.JSX.IntrinsicElements["input"];

export const Input: FC<InputProps> = ({
  className = "",
  leftIcon,
  rightIcon,
  loading,
  ...rest
}) => (
  <div class="relative w-full">
    {!leftIcon ? null : (
      <span className="text-neutral-900 text-base absolute left-0 top-0 bottom-0 flex items-center ml-2">
        {leftIcon}
      </span>
    )}
    <input
      type="text"
      placeholder="Text input"
      {...rest}
      className={`flex-grow form-input w-full rounded-lg shadow bg-neutral-50 border border-neutral-200 p-3 text-neutral-900 text-base ${
        leftIcon ? "pl-8" : ""
      } ${rightIcon ? "pr-8" : ""} ${className}`}
      disabled={loading}
    />
    {!rightIcon ? null : (
      <span className=" absolute right-0 top-0 bottom-0 flex items-center mr-2">
        {rightIcon}
      </span>
    )}
  </div>
);
