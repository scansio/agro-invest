import Reblend, { FC, useRef, useState, useEffect } from "reblendjs";
import { Popper } from "./Popper";

export type AlertPopperProps = {
  reference: HTMLElement | null;
  open: boolean;
  message: string | React.ReactNode;
  variant?: "info" | "success" | "warning" | "danger";
  placement?: "top" | "bottom" | "left" | "right";
  onClose?: () => void;
  autoHideDuration?: number; // ms
};

const variantStyles: Record<string, string> = {
  info: "bg-info-100 text-info-800 border-info-300 dark:bg-info-900 dark:text-info-100 dark:border-info-700",
  success: "bg-success-100 text-success-800 border-success-300 dark:bg-success-900 dark:text-success-100 dark:border-success-700",
  warning: "bg-warning-100 text-warning-800 border-warning-300 dark:bg-warning-900 dark:text-warning-100 dark:border-warning-700",
  danger: "bg-danger-100 text-danger-800 border-danger-300 dark:bg-danger-900 dark:text-danger-100 dark:border-danger-700",
};

export const AlertPopper: FC<AlertPopperProps> = ({
  reference,
  open,
  message,
  variant = "info",
  placement = "top",
  onClose,
  autoHideDuration = 3000,
}) => {
  useEffect(() => {
    if (open && autoHideDuration) {
      const timer = setTimeout(() => {
        onClose && onClose();
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [open, autoHideDuration, onClose]);

  return (
    <Popper
      reference={reference}
      open={open}
      placement={placement}
      className={
        "border px-4 py-2 rounded shadow-lg font-medium text-sm flex items-center gap-2 " +
        (variantStyles[variant] || variantStyles.info)
      }
      onClose={onClose}
    >
      {message}
    </Popper>
  );
};
