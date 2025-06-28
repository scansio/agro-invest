import Reblend, { FC } from "reblendjs";

export const Home: FC = () => {
  return (
    <div class="bg-neutral-50 min-h-screen pb-4">
      {/* Greeting and Add Cash */}
      <div class="flex flex-row items-center justify-between px-4 pt-6 pb-2">
        <div class="flex items-center gap-3">
          <span class="inline-flex items-center justify-center bg-neutral-100 rounded-full h-10 w-10">
            <i class="fas fa-user text-neutral-400 text-xl" />
          </span>
          <div>
            <div class="font-bold text-lg text-neutral-900">Hi, Emmanuel</div>
            <div class="text-neutral-400 text-sm">How are you doing today?</div>
          </div>
        </div>
        <button class="bg-warning-50 text-warning-700 font-semibold rounded-xl px-6 py-3 shadow-sm text-base hover:bg-warning-100 transition">
          + Add Cash
        </button>
      </div>

      {/* Wallet Cards */}
      <div class="flex flex-row gap-3 px-4 mt-2 overflow-x-auto hide-scrollbar">
        <div class="rounded-2xl bg-brand-800 text-white p-5 min-w-[240px] flex-1 relative">
          <div class="flex items-center gap-2 mb-2">
            <i class="fas fa-wallet text-2xl" />
            <span class="font-semibold">Flexi Wallet</span>
          </div>
          <div class="text-2xl font-bold tracking-wide">₦ 0.00</div>
        </div>
        <div class="rounded-2xl bg-brand-100 text-purple-900 p-5 min-w-[180px] flex-1 opacity-70">
          <div class="flex items-center gap-2 mb-2">
            <i class="fas fa-wallet text-xl" />
            <span class="font-semibold">Target Wallet</span>
          </div>
          <div class="text-xl font-bold">₦ 0.00</div>
        </div>
      </div>

      {/* Carousel Dots */}
      <div class="flex justify-center items-center gap-2 mt-2 mb-4">
        <span class="w-3 h-3 rounded-full bg-neutral-900"></span>
        <span class="w-2 h-2 rounded-full bg-neutral-300"></span>
        <span class="w-2 h-2 rounded-full bg-neutral-300"></span>
      </div>

      {/* Complete Profile */}
      <div class="px-4 mt-2">
        <div class="uppercase text-xs font-bold text-neutral-500 mb-2 tracking-wider">
          Complete your profile
        </div>
        <div class="bg-white rounded-2xl shadow-sm divide-y divide-neutral-100">
          <div class="flex items-center justify-between px-4 py-4">
            <span class="text-neutral-700">Update your bank information</span>
            <span class="text-success-500 text-xl"><i class="fas fa-check-circle" /></span>
          </div>
          <div class="flex items-center justify-between px-4 py-4">
            <span class="text-neutral-700">Verify your identity</span>
            <span class="text-success-500 text-xl"><i class="fas fa-check-circle" /></span>
          </div>
        </div>
      </div>

      {/* Save/Invest Cards */}
      <div class="flex flex-row gap-3 px-4 mt-6">
        <div class="bg-neutral-100 rounded-2xl p-4 flex-1 min-w-[160px]">
          <div class="font-bold text-neutral-900 mb-1">Save for property</div>
          <div class="text-neutral-500 text-sm mb-2">
            Put away some money every month to pay your rent or buy property.
          </div>
          <span class="text-success-500 text-lg"><i class="fas fa-arrow-right" /></span>
        </div>
        <div class="bg-neutral-100 rounded-2xl p-4 flex-1 min-w-[160px]">
          <div class="font-bold text-neutral-900 mb-1">Invest in property</div>
          <div class="text-neutral-500 text-sm mb-2">
            Invest in carefully selected real estate projects, and earn interest.
          </div>
          <span class="text-brand-700 text-lg"><i class="fas fa-arrow-right" /></span>
        </div>
      </div>

      {/* Hot Deals Header */}
      <div class="flex flex-row items-center justify-between px-4 mt-8 mb-2">
        <div class="font-bold text-xl text-neutral-900">Hot Deals</div>
        <button class="text-warning-600 font-semibold text-base">See all &raquo;</button>
      </div>

      {/* Hot Deals Carousel */}
      <div class="flex flex-row gap-3 px-4 overflow-x-auto hide-scrollbar pb-4">
        <div class="relative min-w-[180px] max-w-[200px] rounded-2xl overflow-hidden shadow bg-white">
          <img src="/images/creek-holiday.jpg" alt="Creek Holiday Bungalow" class="w-full h-28 object-cover" />
          <span class="absolute top-2 right-2 bg-warning-100 text-warning-600 rounded-full px-2 py-1 text-xs font-bold">🔥</span>
          <div class="p-2 font-semibold text-neutral-900">Creek Holiday Bungalow</div>
        </div>
        <div class="relative min-w-[180px] max-w-[200px] rounded-2xl overflow-hidden shadow bg-white">
          <img src="/images/luxe-residence.jpg" alt="Luxe Residence" class="w-full h-28 object-cover" />
          <span class="absolute top-2 right-2 bg-warning-100 text-warning-600 rounded-full px-2 py-1 text-xs font-bold">🔥</span>
          <div class="p-2 font-semibold text-neutral-900">Luxe Residence</div>
        </div>
      </div>
    </div>
  );
};
