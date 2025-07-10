import Reblend, {  CSSProperties, ReblendElement, useEffect, useState } from "reblendjs";
import { IMAGE_BASE } from "../../lib/RestEndpoints";

export default function Accordion({
  children,
  title,
  headerStyle = {},
  bodyStyle = {},
  active: propsactive = false,
  onOpen: propsonOpen = () => {},
  onClose: propsonClose = () => {},
  containerStyle = {},
}: {
  children: ReblendElement;
  title: string;
  active?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  headerStyle?: CSSProperties;
  bodyStyle?: CSSProperties;
  containerStyle?: CSSProperties;
}) {
  const [active, setActive] = useState(propsactive);

  useEffect(() => {
    setActive(propsactive);
  }, [propsactive]);

  return (
    <div style={containerStyle}>
      <div
        class="flex flex-row justify-between align-items-center"
        style={{
          borderBottom: "1px solid red",
          padding: "5px",
          margin: "5px",
          cursor: "pointer",
          ...headerStyle,
        }}
        onclick={() => {
          if (active) {
            setActive(false);
            propsonClose();
          } else {
            setActive(true);
            propsonOpen();
          }
        }}
      >
        <b>{title}</b>
        <span>
          <img
            width={15}
            height={15}
            src={"/static/img/accordion.jpeg"}
            alt="accordion-icon"
            class="rounded-full"
            style={{
              transition: "transform 0.3s ease",
              transform: active ? "rotate(180deg)" : "",
            }}
          />
        </span>
      </div>
      {active ? (
        <div style={{ padding: "5px", margin: "5px", ...bodyStyle }}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
