import Reblend, { FC, Portal } from "reblendjs";
import { Card } from "./Card";

export const Modal: FC<{
  open: boolean;
  onClose: () => void;
  className?: string;
  children: Reblend.ReblendNode;
  noBackdropClose?: boolean;
  fullScreen?: boolean;
  noCloseButton?: boolean;
}> = ({
  open,
  onClose,
  className = "",
  children,
  noBackdropClose,
  noCloseButton,
  fullScreen,
}) => {
  // Backdrop click handler
  const handleBackdropClick = (e: any) => {
    if (noBackdropClose) return;
    // Only close if the click is on the backdrop, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return open ? (
    <Portal portal={document.body}>
      <div
        class={`fixed inset-0 z-50 flex flex-col sm:items-center justify-between bg-black bg-opacity-40 `}
        onClick={handleBackdropClick}
        style={fullScreen ? { width: "100vw", height: "100vh" } : {}}
      >
        <div></div>
        <div class="relative m-4">
          <Card
            class={`relative overscroll-none ${className || ""} ${
              fullScreen ? "w-full h-full max-h-screen max-w-screen" : ""
            }`}
            onClick={(e) => e.stopPropagation()}
            style={fullScreen ? { width: "100vw", height: "100vh" } : {}}
          >
            {children}
          </Card>

          {noCloseButton ? null : (
            <button
              class="absolute top-0 right-0 text-neutral-400 text-xl font-extrabold hover:text-neutral-900 bg-white px-2 rounded-full border"
              onClick={onClose}
            >
              &times;
            </button>
          )}
        </div>
        <div class="py-6 sm:py-0"></div>
      </div>
    </Portal>
  ) : null;
};
