import Reblend, { FC, useState } from "reblendjs";
import { Tab } from "../components/basics/Tab";
import { IMAGE_BASE } from "../lib/RestEndpoints";

const myInvestments = [
  {
    id: 1,
    title: "Luxe Residence",
    image: "/static/img/profile_picture.jpg",
    shares: 10,
    value: 50000,
    returns: "9.0% p.a.",
    status: "active",
  },
  {
    id: 2,
    title: "Creek Holiday Bungalow",
    image: "/static/img/profile_picture.jpg",
    shares: 5,
    value: 25000,
    returns: "9.0% p.a.",
    status: "completed",
  },
];

export const MyInvest: FC = () => {
  const [tab, setTab] = useState("active");
  const tabs = [
    {
      key: "active",
      label: "Active",
    },
    {
      key: "completed",
      label: "Completed",
    },
  ];

  return (
      <div class="">
        <div class="text-2xl font-bold text-neutral-900 mb-1">
          My Investments
        </div>
        <div class="text-neutral-500 mb-4">
          Track your active and completed investments
        </div>
        <Tab active={tab} tabs={tabs} onTab={setTab} />
        <div class="flex flex-col gap-4">
          {myInvestments.map((inv) => (
            <div
              key={inv.id}
              class="relative rounded-2xl overflow-hidden shadow bg-white flex flex-row items-center gap-4 p-4"
            >
              <img
                src={IMAGE_BASE + inv.image}
                alt={inv.title}
                class="w-20 h-20 object-cover rounded-xl"
              />
              <div class="flex-1">
                <div class="font-bold text-lg text-neutral-900 mb-1">
                  {inv.title}
                </div>
                <div class="text-neutral-500 text-sm mb-1">
                  Shares:{" "}
                  <span class="font-semibold text-neutral-900">
                    {inv.shares}
                  </span>
                </div>
                <div class="text-neutral-500 text-sm mb-1">
                  Value:{" "}
                  <span class="font-semibold text-brand-900">
                    ₦{inv.value.toLocaleString()}
                  </span>
                </div>
                <div class="text-success-600 text-xs font-semibold">
                  Returns: {inv.returns}
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded text-xs font-bold ${
                  inv.status === "active"
                    ? "bg-success-100 text-success-700"
                    : "bg-neutral-200 text-neutral-600"
                }`}
              >
                {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
  );
};
