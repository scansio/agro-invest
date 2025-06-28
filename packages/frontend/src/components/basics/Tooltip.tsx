import Reblend, { FC, ReblendNode, useRef, useState } from "reblendjs";
import { Popper } from "./Popper";
import { Placement } from "@popperjs/core";

export type TooltipProps = {
  content: ReblendNode;
  placement?: Placement;
  children: any;
  className?: string;
};

export const Tooltip: FC<TooltipProps> = ({
  content,
  placement = "top",
  children,
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null!);

  return (
    <>
      <Popper
        reference={ref.current}
        open={open}
        placement={placement}
        className={
          "text-xs px-2 py-1 bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900 " +
          className
        }
        onClose={() => setOpen(false)}
      >
        {"Guy place"}
      </Popper>
      <div
        ref={ref}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        tabIndex={0}
        aria-describedby={open ? "tooltip" : undefined}
      >
        {children}
      </div>
    </>
  );
};
