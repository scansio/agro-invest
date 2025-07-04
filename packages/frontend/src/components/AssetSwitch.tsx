import Reblend, { useMemo, useState } from "reblendjs";
import { IMAGE_BASE } from "../lib/RestEndpoints";
import { Modal } from "./basics/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearchMinus,
  faSearchPlus,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";

export default function AssetSwitch({
  assets,
  imageClass,
}: {
  assets?: string[];
  imageClass?: string;
}) {
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0);
  const [showNextPreviousButton, setShowNextPreviousButton] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showFull, setShowFull] = useState(false);

  const currentSrc = useMemo(() => {
    return Array.isArray(assets) && assets[currentAssetIndex]
      ? IMAGE_BASE + assets[currentAssetIndex]
      : "/agroinvest_icon.png";
  }, [currentAssetIndex]);

  const prevAsset = () =>
    setCurrentAssetIndex((prev) =>
      prev <= 0 ? (assets?.length || 0) - 1 : prev - 1
    );

  const nextAsset = () =>
    setCurrentAssetIndex((prev) =>
      prev + 1 >= (assets?.length || 0) ? 0 : prev + 1
    );

  const hasPrevAsset = useMemo(
    () => currentAssetIndex > assets?.length! - 1,
    currentAssetIndex
  );

  const hasNextAsset = useMemo(
    () => currentAssetIndex < assets?.length! - 1,
    currentAssetIndex
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
          class={
            "align-items-center justify-center w-full border rounded-lg object-cover " +
            imageClass
          }
          src={currentSrc}
          alt="Loading ..."
        />
        <div
          class="absolute top-0 bottom-0 w-full flex flex-row align-items-center justify-between"
          style="position: absolute !important;"
        >
          <span
            class={
              "flex items-center px-10 ml-10 bg-neutral-100 rounded-l-full " +
              (showNextPreviousButton && hasPrevAsset
                ? "opacity-50 cursor-pointer "
                : " opacity-0 ")
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
              "flex items-center px-10 mr-10 bg-neutral-100 rounded-r-full " +
              (showNextPreviousButton && hasNextAsset
                ? "opacity-50 cursor-pointer "
                : " opacity-0 ")
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
          <FontAwesomeIcon
            icon={faSearchPlus}
            onClick={zoomIn}
            className="cursor-pointer p-2 rounded-lg bg-neutral-300 hover:bg-neutral-400 m-1 text-white"
          />
          <FontAwesomeIcon
            icon={faSearchMinus}
            onClick={zoomOut}
            className="cursor-pointer p-2 rounded-lg bg-neutral-300 hover:bg-neutral-400 m-1 text-white"
          />
          <FontAwesomeIcon
            onClick={() => setShowFull(true)}
            className="fas fa-square cursor-pointer p-2 rounded-lg bg-neutral-300 hover:bg-neutral-400 m-1 text-white"
            icon={faSquare}
          />
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
