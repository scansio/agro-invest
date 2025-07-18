import Reblend, { FC, useState } from "reblendjs";
import { Tab } from "../components/basics/Tab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { redirectTo } from "reblend-router";
import { routes } from "../lib/routes";
import { Input } from "../components/basics/Input";
import { IMAGE_BASE } from "../lib/RestEndpoints";

const coBuildDeals = [
  {
    id: 1,
    title: "Green Haven",
    slots: "2993/3000 Slots",
    roi: "20.00% in 24 months",
    price: "₦ 20,000.00 per slot",
    image: "/static/img/profile_picture.jpg",
    hot: true,
    status: "all",
  },
];
const propertyShares = [
  {
    id: 1,
    title: "Creek Holiday Bungalow",
    slots: "99960/100000 Slots",
    roi: "Up to 9.0 % ROI in 12 months",
    price: "₦ 5,000.00 per Share",
    image: "/static/img/profile_picture.jpg",
    hot: true,
    status: "all",
  },
  {
    id: 2,
    title: "Luxe Residence",
    slots: "149895/150000 Slots",
    roi: "Up to 9.0 % ROI in 12 months",
    price: "₦ 5,000.00 per Share",
    image: "/static/img/profile_picture.jpg",
    hot: true,
    status: "all",
  },
];

export const Investments: FC<{ onlyFor?: "hot" | "all" }> = ({ onlyFor }) => {
  const [tab1, setTab1] = useState("co-build");
  const [tab2, setTab2] = useState<string | typeof onlyFor>(onlyFor || "hot");
  const [dealTab, setDealTab] = useState("all");
  const [shareTab, setShareTab] = useState("all");
  const [search, setSearch] = useState("");
  const tabs1 = [
    {
      key: "co-build",
      label: "Co-build Deals",
    },
    {
      key: "shares",
      label: "Property Shares",
    },
  ];

  const tabs2 = [
    {
      key: "hot",
      label: "Hot",
    },
    {
      key: "Farm Land",
      label: "Farm Land",
    },
    {
      key: "Poutry",
      label: "Poutry",
    },
    {
      key: "Livestock",
      label: "Livestock",
    },
  ];

  return (
    <div class="">
      {onlyFor ? null : (
        <>
          <div class="text-2xl font-bold text-neutral-900 mb-1">Investment</div>
          <div class="text-neutral-500 mb-4">
            Join other users to invest in amazing opportunities
          </div>
          {/* <Tab active={tab1} tabs={tabs1} onTab={setTab1} /> */}

          <div class="mb-4">
            <Input
              leftIcon={<FontAwesomeIcon icon={faSearch} />}
              placeholder="Search"
              value={search}
              onchange={(e) => setSearch((e.target as HTMLInputElement).value)}
            />
          </div>
          {/* Tabs for All/Active/Completed or All/Owned */}
          <Tab active={tab2} tabs={tabs2} onTab={setTab2} />
        </>
      )}

      {/* Deals/Property Shares Cards */}
      <div class="flex flex-row flex-wrap gap-4">
        {tab1 === "co-build"
          ? dealTab === "all"
            ? coBuildDeals.map((deal) => (
                <div
                  key={deal.id}
                  class="relative w-full min-h-[220px] max-h-[260px] rounded-2xl overflow-hidden shadow bg-white"
                >
                  <img
                    src={IMAGE_BASE + deal.image}
                    alt={deal.title}
                    class="w-full h-32 object-cover"
                  />
                  {deal.hot && (
                    <span class="absolute top-2 right-2 bg-warning-100 text-warning-600 rounded-full px-2 py-1 text-xs font-bold">
                      🔥
                    </span>
                  )}
                  <div class="absolute top-2 left-2 text-xs text-white font-bold bg-black/30 px-2 py-1 rounded">
                    {deal.slots}
                  </div>
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent cursor-pointer hover:border border-brand"
                    onclick={() => redirectTo(routes.investment.redirectUri)}
                  />
                  <div class="absolute bottom-4 left-4 z-10">
                    <div class="text-lg font-bold text-white mb-1">
                      {deal.title}
                    </div>
                    <div class="text-white text-sm mb-1">{deal.roi}</div>
                    <div class="text-white font-bold">{deal.price}</div>
                  </div>
                </div>
              ))
            : null
          : null}
        {tab1 === "shares"
          ? shareTab === "all"
            ? propertyShares.map((share) => (
                <div
                  key={share.id}
                  class="relative min-w-[220px] max-w-[260px] rounded-2xl overflow-hidden shadow bg-white"
                >
                  <img
                    src={IMAGE_BASE + share.image}
                    alt={share.title}
                    class="w-full h-32 object-cover"
                  />
                  {share.hot && (
                    <span class="absolute top-2 right-2 bg-warning-100 text-warning-600 rounded-full px-2 py-1 text-xs font-bold">
                      🔥
                    </span>
                  )}
                  <div class="absolute top-2 left-2 text-xs text-white font-bold bg-black/30 px-2 py-1 rounded">
                    {share.slots}
                  </div>
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div class="absolute bottom-4 left-4 z-10">
                    <div class="text-lg font-bold text-white mb-1">
                      {share.title}
                    </div>
                    <div class="text-white text-sm mb-1">{share.roi}</div>
                    <div class="text-white font-bold">{share.price}</div>
                  </div>
                </div>
              ))
            : null
          : null}
      </div>
    </div>
  );
};
