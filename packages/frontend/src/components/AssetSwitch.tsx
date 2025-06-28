import Reblend, { useMemo, useState } from "reblendjs";
import { IMAGE_BASE } from "../lib/RestEndpoints";
import { Modal } from "./basics/Modal";

export default function AssetSwitch({ assets }: { assets?: string[] }) {
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0);
  const [showNextPreviousButton, setShowNextPreviousButton] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showFull, setShowFull] = useState(false);

  const currentSrc = useMemo(() => {
    return Array.isArray(assets) && assets[currentAssetIndex]
      ? IMAGE_BASE + assets[currentAssetIndex]
      : "/masssee_icon.png";
  }, [currentAssetIndex]);

  const prevAsset = () =>
    setCurrentAssetIndex((prev) =>
      prev <= 0 ? (assets?.length || 0) - 1 : prev - 1
    );

  const nextAsset = () =>
    setCurrentAssetIndex((prev) =>
      prev + 1 >= (assets?.length || 0) ? 0 : prev + 1
    );

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 2)); // Max zoom level: 2x
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5)); // Min zoom level: 0.5x

  return (
    <>
      <div
        class=""
        onmouseover={() => {
          setShowNextPreviousButton(true);
        }}
        onmouseout={() => setShowNextPreviousButton(false)}
        style={{
          transform: `scale(${zoomLevel})`,
          transition: "transform 0.3s ease-in-out",
          ...(showFull || zoomLevel <= 1 ? {} : { zIndex: 99999 }),
        }}
      >
        <img
          class="align-items-center justify-center w-full border rounded-lg"
          src={currentSrc}
          alt="Loading ..."
        />
        <div
          class="absolute top-0 bottom-0 w-full flex flex-row align-items-center justify-between"
          style="position: absolute !important;"
        >
          <span
            class={
              "px-10 ml-10 opacity-2 bg-gray-100 cursor-pointer rounded-l-full " +
              (showNextPreviousButton ? "opacity-50 pointer" : "")
            }
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
            }}
            onclick={prevAsset}
          >
            {"<<"}
          </span>
          <span
            class={
              "px-10 mr-10 opacity-2 bg-gray-100 cursor-pointer rounded-r-full " +
              (showNextPreviousButton ? "opacity-50 pointer" : "")
            }
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
            }}
            onclick={nextAsset}
          >
            {">>"}
          </span>
        </div>
        <div
          class="flex flex-row absolute top-0 right-0 gap-2"
          style="position: absolute !important;"
        >
          <i
            onclick={zoomIn}
            class="fas fa-search-plus cursor-pointer p-2 rounded-lg bg-gray-400 hover:bg-gray-500 m-1 text-white"
          ></i>
          <i
            onclick={zoomOut}
            class="fas fa-search-minus cursor-pointer p-2 rounded-lg bg-gray-400 hover:bg-gray-500 m-1 text-white"
          ></i>
          <i
            onclick={() => setShowFull(true)}
            class="fas fa-square cursor-pointer p-2 rounded-lg bg-gray-400 hover:bg-gray-500 m-1 text-white"
          ></i>
        </div>
      </div>
      <Modal open={showFull} fullScreen onClose={() => setShowFull(false)}>
        <img
          src={currentSrc}
          style={showFull ? { width: "90vw" } : {}}
          alt="Loading ..."
        />
      </Modal>
    </>
  );
}
