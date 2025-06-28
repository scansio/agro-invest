import Reblend, { FC } from "reblendjs";

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
    <div
      class={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-all duration-200${
        fullScreen ? " w-full h-full" : ""
      }`}
      onClick={handleBackdropClick}
      style={fullScreen ? { width: "100vw", height: "100vh" } : {}}
    >
      <div
        class={`bg-white rounded shadow-lg p-8 relative ${className || ""} ${
          fullScreen ? "w-full h-full flex flex-col justify-center" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
        style={fullScreen ? { maxWidth: "100vw", maxHeight: "100vh" } : {}}
      >
        {noCloseButton ? null : (
          <button
            class="absolute top-1 right-2 text-neutral-400 text-xl font-extrabold hover:text-neutral-900"
            onClick={onClose}
          >
            &times;
          </button>
        )}
        {children}
      </div>
    </div>
  ) : null;
};
