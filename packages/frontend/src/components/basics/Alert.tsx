import { Placement } from "@popperjs/core";
import Reblend, {
  createContext,
  FC,
  rand,
  useContext,
  useEffectAfter,
  useMemo,
  useRef,
} from "reblendjs";
import { Popper } from "./Popper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faInfoCircle,
  faStopCircle,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";

export type AlertConfig = {
  autoHide?: boolean;
  autoHideDuration?: number;
  placement?: Placement;
  type?: AlertType;
};

type AlertContext = {
  [alertId: string]: {
    content: Reblend.ReblendNode;
    config: AlertConfig;
  };
};

const alertContext = createContext<AlertContext>({});

export type AlertType = "info" | "warning" | "danger" | "success";

export const Alert: FC<{
  type?: AlertType;
  children: Reblend.ReblendNode;
  className?: string;
  onClose?: () => void;
}> = ({ type = "info", children, className = "", onClose }) => {
  const base = "border-l-4 rounded p-4 flex items-center gap-2 mb-2 relative";
  const variants: Record<string, string> = {
    info: "bg-info-100 text-info-900 border-info-300 dark:bg-info-700 dark:text-info-50 dark:border-info-400",
    warning:
      "bg-warning-100 text-warning-900 border-warning-300 dark:bg-warning-700 dark:text-warning-50 dark:border-warning-400",
    danger:
      "bg-danger-100 text-danger-900 border-danger-300 dark:bg-danger-700 dark:text-danger-50 dark:border-danger-400",
    success:
      "bg-success-100 text-success-900 border-success-300 dark:bg-success-700 dark:text-success-50 dark:border-success-400",
  };
  const icons = {
    info: <FontAwesomeIcon icon={faInfoCircle} />,
    warning: <FontAwesomeIcon icon={faWarning} />,
    danger: <FontAwesomeIcon icon={faStopCircle} />,
    success: <FontAwesomeIcon icon={faCheckCircle} />,
  };

  return (
    <div class={`${base} ${variants[type]} ${className}`}>
      <span class="text-xl">{icons[type]}</span>
      <span>{children}</span>
      {onClose && (
        <button
          class="absolute -top-5 -right-4 text-neutral-400 font-black hover:text-neutral-700 text-lg px-2 py-1 rounded focus:outline-none"
          onClick={onClose}
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
};

const containerPositions: Record<Placement, string> = {
  top: "top-0 left-1/2 transform -translate-x-1/2 fixed",
  "top-start": "top-0 left-0 fixed",
  "top-end": "top-0 right-0 fixed",
  bottom: "bottom-0 left-1/2 transform -translate-x-1/2 fixed",
  "bottom-start": "bottom-0 left-0 fixed",
  "bottom-end": "bottom-0 right-0 fixed",
  left: "top-1/2 left-0 transform -translate-y-1/2 fixed",
  right: "top-1/2 right-0 transform -translate-y-1/2 fixed",
  "left-start": "top-0 left-0 fixed",
  "left-end": "bottom-0 left-0 fixed",
  "right-start": "top-0 right-0 fixed",
  "right-end": "bottom-0 right-0 fixed",
} as any;

export const AlertContainer: FC<{
  position?: keyof typeof containerPositions;
}> = ({ position = "top-end" }) => {
  const [alerts] = useContext(alertContext);
  const numAlerts = useMemo(() => Object.keys(alerts).length, [alerts]);
  const ref = useRef<HTMLSpanElement>(null as any);

  // Auto-close logic
  useEffectAfter(() => {
    Object.entries(alerts).forEach(([key, option]) => {
      const duration =
        option.config.autoHide || option.config.autoHideDuration
          ? option.config.autoHideDuration ?? 3000
          : 0;

      if (duration && duration > 0) {
        setTimeout(() => {
          closeAlert(key);
        }, duration);
      }
    });
  }, numAlerts);

  const alertsView = useMemo(() => {
    return Object.entries(alerts)
      .sort(([, a], [, b]) => {
        const order: AlertType[] = ["info", "warning", "danger", "success"];
        return (
          order.indexOf(a.config.type || "info") -
          order.indexOf(b.config.type || "info")
        );
      })
      .map(([key, option]) => {
        return (
          <Alert
            key={key}
            type={option.config.type}
            onClose={() => {
              closeAlert(key);
            }}
          >
            {option.content}
          </Alert>
        );
      });
  }, [alerts]);

  return (
    <>
      <span className={containerPositions[position]} ref={ref}></span>
      <Popper
        reference={ref.current}
        open={!!numAlerts}
        placement={
          position === "top-end"
            ? "bottom-start"
            : position === "bottom-start"
            ? "top-end"
            : position
        }
        className="p-5"
      >
        {alertsView}
      </Popper>
    </>
  );
};

export const closeAlert = (alertId: number | string) => {
  const copy = { ...alertContext.getValue() };
  delete copy[alertId];
  alertContext.update(copy);
};

export const message = (
  msg: Reblend.ReblendNode,
  type: AlertType = "info",
  config?: AlertConfig
) => {
  const alertId = rand(100, 900);

  alertContext.update({
    ...alertContext.getValue(),
    [alertId]: {
      content: msg,
      config: { ...(config || {}), type },
    },
  });

  return alertId;
};
