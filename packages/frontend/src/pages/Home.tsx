import Reblend, { FC } from "reblendjs";
import { Button } from "../components/basics/Button";
import { Link } from "reblend-router";
import { routes } from "../lib/routes";

export const Home: FC = () => {
  const investments = () =>
    import("./Investments").then((m) => <m.Investments onlyFor="hot" />);

  return (
    <div class="flex flex-col gap-6">
      {/* Greeting and Add Cash */}
      <div class="flex flex-row items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="inline-flex items-center justify-center bg-neutral-100 rounded-full h-10 w-10">
            <i class="fas fa-user text-neutral-400 text-xl" />
          </span>
          <div>
            <div class="font-bold text-lg text-neutral-900">Hi, Emmanuel</div>
            <div class="text-neutral-400 text-sm">How are you doing today?</div>
          </div>
        </div>
        <div>
          <Button variant="secondary">
            <Link to={routes.wallet.redirectUri}>+ Add Cash</Link>
          </Button>
        </div>
      </div>

      {/* Wallet Cards */}
      <div
        class="flex flex-row gap-3 overflow-x-auto  scrollbar-hide hide-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div class="rounded-2xl bg-brand-800 text-white p-5 min-w-[240px] flex-1 relative">
          <div class="flex items-center gap-2 mb-2">
            <i class="fas fa-wallet text-2xl" />
            <span class="font-semibold">Flexi Wallet</span>
          </div>
          <div class="text-2xl font-bold tracking-wide">₦ 0.00</div>
        </div>
        <div class="rounded-2xl bg-brand-100 text-brand-900 p-5 min-w-[180px] flex-1 opacity-70">
          <div class="flex items-center gap-2 mb-2">
            <i class="fas fa-wallet text-xl" />
            <span class="font-semibold">Target Wallet</span>
          </div>
          <div class="text-xl font-bold">₦ 0.00</div>
        </div>
      </div>

      {/* Carousel Dots */}
      <div class="flex justify-center items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-neutral-900"></span>
        <span class="w-2 h-2 rounded-full bg-neutral-300"></span>
        <span class="w-2 h-2 rounded-full bg-neutral-300"></span>
      </div>

      {/* Complete Profile */}
      <div class="">
        <div class="uppercase text-xs font-bold text-neutral-500 tracking-wider">
          Complete your profile
        </div>
        <div class="bg-white rounded-2xl shadow-sm divide-y divide-neutral-100">
          <div class="flex items-center justify-between px-4 py-4">
            <span class="text-neutral-700">Update your bank information</span>
            <span class="text-success-500 text-xl">
              <i class="fas fa-check-circle" />
            </span>
          </div>
          <div class="flex items-center justify-between px-4 py-4">
            <span class="text-neutral-700">Verify your identity</span>
            <span class="text-success-500 text-xl">
              <i class="fas fa-check-circle" />
            </span>
          </div>
        </div>
      </div>

      {/* Save/Invest Cards */}
      <div class="flex flex-row flex-wrap gap-3">
        <div class="bg-neutral-200 rounded-2xl p-4 flex-1 min-w-[160px]">
          <div class="font-bold text-neutral-900 mb-1">Save for property</div>
          <div class="text-neutral-500 text-sm mb-2">
            Put away some money every month to pay your rent or buy property.
          </div>
          <span class="text-success-500 text-lg">
            <i class="fas fa-arrow-right" />
          </span>
        </div>
        <div class="bg-neutral-200 rounded-2xl p-4 flex-1 min-w-[160px]">
          <div class="font-bold text-neutral-900 mb-1">Invest in property</div>
          <div class="text-neutral-500 text-sm mb-2">
            Invest in carefully selected real estate projects, and earn
            interest.
          </div>
          <span class="text-brand-700 text-lg">
            <i class="fas fa-arrow-right" />
          </span>
        </div>
      </div>

      {/* Hot Deals Header */}
      <div class="flex flex-row items-center justify-between">
        <div class="font-bold text-xl text-neutral-900">Hot Deals</div>
        <Link
          to={routes.investments.redirectUri}
          class="text-secondary-600 font-semibold text-base"
        >
          See all &raquo;
        </Link>
      </div>

      {investments}
    </div>
  );
};
