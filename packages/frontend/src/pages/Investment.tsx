import Reblend, { FC, useState } from "reblendjs";
import { Button } from "../components/basics/Button";
import { Modal } from "../components/basics/Modal";
import AssetSwitch from "../components/AssetSwitch";
import { useScroll } from "../lib/hooks";

const investment = {
  title: "Luxe Residence",
  price: 5000,
  priceText: "₦5,000.00 per Share",
  slots: 149895,
  totalSlots: 150000,
  image: "/static/img/profile_picture.jpg",
  minShare: 1,
  marketCap: "750 million",
  returns: "Upto 9.0 %",
  about: `ROI type: Quaterly Shared RENT.\nYou receive rent on your stake payable quarterly upon completion of the Project (waiting period), based on usage.\n\nLuxe Residence is an exquisite and visionary real estate property designed to redefine luxury living and is situated in the heart of Port Harcourt, Rivers State. This opulent residential development brought to you by a prestigious collaboration of architects, designers, and developers offers a collection of unmatched elegance meticulously crafted to embody modern sophistication and top-notch amenities. Luxe residence aims to elevate the standards of high-end living in a contemporary urban environment.\n\nInvest... Luxe Residence is an exclusive investment opportunity with 150,000 slots available for investors seeking to diversify their portfolios and capitalize on the real estate market potential. Here are the key investment benefits of securing a slot at Luxe Residence:`,
};

export const Investment: FC = () => {
  useScroll();
  const [buying, setBuying] = useState(false);
  const [shares, setShares] = useState(1);
  const total = shares * investment.price;

  return (
    <div class="flex flex-col gap-4">
      {/* Image Card */}
      <div class="">
        <div class="rounded-2xl overflow-hidden shadow bg-white">
          <AssetSwitch imageClass="w-full h-80" assets={[investment.image]} />
        </div>
      </div>
      {/* Title and Price */}
      <div class="flex flex-row items-center justify-between ">
        <div>
          <div class="text-xl font-bold text-neutral-900 mb-1">
            {investment.title}
          </div>
          <div class="text-neutral-500 text-sm">
            Minimum Share: {investment.minShare}
          </div>
        </div>
        <div class="text-right">
          <div class="font-bold text-brand-900 text-lg">
            {investment.priceText}
          </div>
          <div class="text-neutral-400 text-xs">
            {investment.slots.toLocaleString()}/
            {investment.totalSlots.toLocaleString()} Shares
          </div>
        </div>
      </div>
      {/* Shares Available */}
      <div class="">
        <div class="rounded-2xl border border-neutral-200 bg-white px-4 py-4 text-lg font-semibold text-neutral-700">
          Shares Available:{" "}
          <span class="font-bold text-2xl">
            {investment.slots.toLocaleString()}
          </span>
        </div>
      </div>
      {/* Market Cap & Returns */}
      <div class="flex flex-row items-center justify-between mt-6 mb-2">
        <div>
          <div class="text-xs font-bold text-neutral-500 mb-1">MARKET CAP</div>
          <div class="text-lg text-neutral-900">{investment.marketCap}</div>
        </div>
        <div class="text-right">
          <div class="text-xs font-bold text-neutral-500 mb-1">
            EST. ANNUAL RETURNS
          </div>
          <div class="text-lg text-neutral-900">{investment.returns}</div>
        </div>
      </div>
      {/* About Project */}
      <div class="">
        <div class="text-xs font-bold text-neutral-500 mb-1">
          ABOUT THIS PROJECT
        </div>
        <div class="text-neutral-700 whitespace-pre-line text-base mb-24">
          {investment.about}
        </div>
      </div>
      {/* Buy Shares Button */}
      <div className="fixed bottom-20 right-10 left-10 flex justify-center">
        <Button className="w-fit" onClick={() => setBuying(true)}>
          Buy Shares
        </Button>
      </div>
      {/* Buy Shares Modal */}
      <Modal open={buying} onClose={() => setBuying(false)}>
        <div class="flex flex-col gap-4">
          <div class="flex flex-row items-center justify-between">
            <div class="text-xl font-bold text-neutral-900">
              {investment.title}
            </div>
            <div class="font-bold text-brand-900 text-lg">
              ₦
              {investment.price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}{" "}
              <span class="text-sm font-normal">Per Share</span>
            </div>
          </div>
          <div class="text-neutral-700 mb-2">How many shares do you want?</div>
          <div class="flex flex-row items-center justify-between bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-4 mb-2">
            <button
              class="bg-neutral-100 rounded-xl w-12 h-12 flex items-center justify-center text-2xl text-brand-800"
              onClick={() => setShares(Math.max(1, shares - 1))}
            >
              -
            </button>
            <span class="text-2xl font-bold">{shares}</span>
            <button
              class="bg-neutral-100 rounded-xl w-12 h-12 flex items-center justify-center text-2xl text-brand-800"
              onClick={() => setShares(shares + 1)}
            >
              +
            </button>
          </div>
          <div class="text-center text-neutral-700">
            Shares Available:{" "}
            <span class="font-bold">{investment.slots.toLocaleString()}</span>
          </div>
          <div class="rounded-2xl border border-neutral-200 bg-white px-4 py-4 text-lg font-semibold text-brand-900">
            <div class="text-xs text-neutral-500 mb-1">Total Amount</div>₦
            {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div class="text-neutral-500 text-sm">
            By clicking "Continue to payment" below, you accept the{" "}
            <a href="#" class="text-warning-600 underline">
              Terms of this investment
            </a>
            .
          </div>
          <Button className="w-full">Continue to payment</Button>
        </div>
      </Modal>
    </div>
  );
};
