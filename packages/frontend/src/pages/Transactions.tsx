import Reblend, { FC, useState } from "reblendjs";
import { Tab } from "../components/basics/Tab";

const sampleTransactions = [
  {
    id: 1,
    type: "savings",
    title: "Rent Savings",
    date: "2025-06-29",
    amount: 10000,
    status: "success",
  },
  {
    id: 2,
    type: "investment",
    title: "Luxe Residence",
    date: "2025-06-28",
    amount: 5000,
    status: "pending",
  },
  {
    id: 3,
    type: "savings",
    title: "Property Savings",
    date: "2025-06-27",
    amount: 20000,
    status: "success",
  },
  {
    id: 4,
    type: "investment",
    title: "Creek Holiday Bungalow",
    date: "2025-06-25",
    amount: 7000,
    status: "failed",
  },
];

export const Transactions: FC = () => {
  const [tab, setTab] = useState("all");
  const filtered =
    tab === "all"
      ? sampleTransactions
      : sampleTransactions.filter((t) => t.type === tab);

  const tabs = [
    { key: "all", label: "All" },
    { key: "savings", label: "Savings" },
    { key: "investment", label: "Investment" },
  ];

  return (
    <div class="">
      <div class="text-2xl font-bold text-neutral-900 mb-6">
        Transaction History
      </div>
      <Tab active={tab} tabs={tabs} onTab={setTab} />
      {filtered.length === 0 ? (
        <div class="flex flex-col items-center justify-center mt-12">
          <div class="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-16 text-neutral-400 text-xl text-center">
            You have no transactions.
          </div>
        </div>
      ) : (
        <div class="flex flex-col gap-4 mt-2">
          {filtered.map((tx) => (
            <div
              key={tx.id}
              class="rounded-2xl bg-white shadow-sm px-4 py-4 flex flex-row items-center justify-between"
            >
              <div>
                <div class="font-bold text-neutral-900 text-base">
                  {tx.title}
                </div>
                <div class="text-neutral-400 text-xs">{tx.date}</div>
              </div>
              <div class="flex flex-col items-end">
                <div
                  class={`font-bold text-lg ${
                    tx.amount > 0 ? "text-success-700" : "text-danger-700"
                  }`}
                >
                  ₦{tx.amount.toLocaleString()}
                </div>
                <span
                  class={`text-xs font-semibold mt-1 ${
                    tx.status === "success"
                      ? "text-success-600"
                      : tx.status === "pending"
                      ? "text-warning-600"
                      : "text-danger-600"
                  }`}
                >
                  {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
