import Reblend, { FC, useState, useRef } from "reblendjs";
import { Button } from "./components/basics/Button";
import { Alert } from "./components/basics/Alert";
import { Card } from "./components/basics/Card";
import { Tab } from "./components/basics/Tab";
import { Panel } from "./components/basics/Panel";
import { Modal } from "./components/basics/Modal";
import { Pane } from "./components/basics/Pane";
import { Nav } from "./components/basics/Nav";
import { Tooltip } from "./components/basics/Tooltip";
import { AlertPopper } from "./components/basics/AlertPopper";

const buttons = [
  "primary",
  "secondary",
  "support",
  "neutral",
  "danger",
  "success",
];

const alerts = ["info", "warning", "danger", "success"];

export const ComponentsSample: FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState("support");

  return (
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-bold mb-4">Component Sample</h1>

      <hr class="py-10 " />
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Buttons State</h2>
        <div className="flex flex-row gap-4 items-center">
          {buttons.map((button) => (
            <div key={button}>
              <label className="text-lg font-bold mb-2 block">
                {button.charAt(0).toUpperCase() + button.slice(1)} Button
              </label>
              <div class="flex flex-col gap-1">
                <Button variant={button as any}>Enabled</Button>
                <Button variant={button as any} disabled>
                  Disabled
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr class="py-10 " />
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Alerts</h2>
        <div className="flex flex-row gap-4 items-center">
          {alerts.map((alert) => (
            <div key={alert}>
              <label className="text-lg font-bold mb-2 block">
                {alert.charAt(0).toUpperCase() + alert.slice(1)} Alert
              </label>
              <div class="flex flex-col gap-1">
                <Alert type={alert as any}>
                  {" "}
                  This is an alert component sample
                </Alert>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr class="py-10 " />
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Navs</h2>
        <div className="flex flex-row gap-4 items-center">
          <Nav
            items={[
              { label: "primary", href: "#" },
              { label: "secondary", href: "#" },
              { label: "support", href: "#" },
              { label: "neutral", href: "#" },
              { label: "danger", href: "#" },
              { label: "success", href: "#" },
            ]}
          />
        </div>
      </section>

      <hr class="py-10 " />
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Navs</h2>
        <div className="flex flex-row gap-4 items-center">
          <Tab
            active={activeTab}
            onTab={(tab) => setActiveTab(tab)}
            tabs={[
              { label: "primary", key: "primary" },
              { label: "secondary", key: "secondary" },
              { label: "support", key: "support" },
              { label: "neutral", key: "neutral" },
              { label: "danger", key: "danger" },
              { label: "success", key: "success" },
            ]}
            className="bg-animate transition-all"
          />
        </div>
      </section>

      <hr class="py-10 " />
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Cards</h2>
        <Card>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Alerts</h2>
            <div className="flex flex-row gap-4 items-center">
              {alerts.map((alert) => (
                <div key={alert}>
                  <label className="text-lg font-bold mb-2 block">
                    {alert.charAt(0).toUpperCase() + alert.slice(1)} Alert
                  </label>
                  <div class="flex flex-col gap-1">
                    <Alert type={alert as any}>
                      {" "}
                      This is an alert component sample
                    </Alert>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Card>
      </section>

      <hr class="py-10 " />
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Pane</h2>
        <Pane>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Alerts</h2>
            <div className="flex flex-row gap-4 items-center">
              {alerts.map((alert) => (
                <div key={alert}>
                  <label className="text-lg font-bold mb-2 block">
                    {alert.charAt(0).toUpperCase() + alert.slice(1)} Alert
                  </label>
                  <div class="flex flex-col gap-1">
                    <Alert type={alert as any}>
                      {" "}
                      This is an alert component sample
                    </Alert>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Pane>
      </section>

      <hr class="py-10 " />
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Panel</h2>
        <Panel>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Alerts</h2>
            <div className="flex flex-row gap-4 items-center">
              {alerts.map((alert) => (
                <div key={alert}>
                  <label className="text-lg font-bold mb-2 block">
                    {alert.charAt(0).toUpperCase() + alert.slice(1)} Alert
                  </label>
                  <div class="flex flex-col gap-1">
                    <Alert type={alert as any}>
                      {" "}
                      This is an alert component sample
                    </Alert>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Panel>
      </section>

      <hr class="py-10 " />
      <section className="mb-8">
        <h2
          className="text-2xl font-semibold mb-2 cursor-pointer transition-all duration-100"
          onclick={() => setOpenModal(true)}
        >
          {openModal ? "Close" : "Open"} Modal
        </h2>
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Alerts</h2>
            <div className="flex flex-row gap-4 items-center">
              {alerts.map((alert) => (
                <div key={alert}>
                  <label className="text-lg font-bold mb-2 block">
                    {alert.charAt(0).toUpperCase() + alert.slice(1)} Alert
                  </label>
                  <div class="flex flex-col gap-1">
                    <Alert type={alert as any}>
                      {" "}
                      This is an alert component sample
                    </Alert>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Modal>
      </section>

      <hr class="py-10 " />
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          Popper-based Tooltip & AlertPopper
        </h2>
        <div className="flex flex-row gap-8 items-center">
          {/* Tooltip Sample */}
          <div className="flex flex-col items-center gap-2">
            <label className="text-lg font-bold mb-2 block">Tooltip</label>
            <Tooltip content="This is a tooltip!" placement="top">
              <Button variant="primary">Hover me</Button>
            </Tooltip>
          </div>
          {/* AlertPopper Sample */}
          <PopperAlertSample />
        </div>
      </section>
    </div>
  );
};

// PopperAlertSample component for demo
const PopperAlertSample = () => {
  const btnRef = useRef(null);
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center gap-2">
      <label className="text-lg font-bold mb-2 block">AlertPopper</label>
      <Button
        ref={btnRef}
        variant="danger"
        onClick={() => setOpen((v) => !v)}
      >
        Toggle AlertPopper
      </Button>
      <AlertPopper
        reference={btnRef.current}
        open={open}
        message={"This is an alert popper!"}
        variant="danger"
        placement="bottom"
        onClose={() => setOpen(false)}
        autoHideDuration={2500}
      />
    </div>
  );
};
