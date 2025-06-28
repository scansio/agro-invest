import Reblend, {
  FC,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "reblendjs";
import { createPopper, Instance, Placement } from "@popperjs/core";

export type PopperProps = {
  reference: HTMLElement | null;
  open: boolean;
  placement?: Placement;
  offset?: [number, number];
  className?: string;
  children: any;
  onClose?: () => void;
};

export const Popper: FC<PopperProps> = ({
  reference,
  open,
  placement = "top",
  offset = [0, 8],
  className = "",
  children,
  onClose,
}) => {
  const popperRef = useRef<HTMLDivElement>(null!);
  const popperInstance = useRef<Instance | null>(null);

  useEffect(() => {
    if (open && reference && popperRef.current) {
      popperInstance.current = createPopper(reference, popperRef.current, {
        placement,
        modifiers: [
          { name: "offset", options: { offset } },
          { name: "preventOverflow", options: { padding: 8 } },
        ],
      });
    }
    return () => {
      if (popperInstance.current) {
        popperInstance.current.destroy();
        popperInstance.current = null;
      }
    };
  }, [open, reference, placement, offset]);

  const handle = useCallback(function handle(e: MouseEvent) {
    if (
      popperRef.current &&
      !popperRef.current.contains(e.target as Node) &&
      reference &&
      !reference.contains(e.target as Node)
    ) {
      onClose && onClose();
    }
  });

  // Close on click outside
  useEffect(() => {
    if (!open) return;

    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open, reference, onClose]);

  return !open ? null : (
    <div
      ref={popperRef}
      className={
        "z-50 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded shadow-lg p-2 transition-all " +
        className
      }
      style={{ position: "absolute" }}
      role="tooltip"
    >
      Overlay
    </div>
  );
};
