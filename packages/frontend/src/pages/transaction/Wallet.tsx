import Reblend, { FC, useContext, useState } from "reblendjs";
import { Modal } from "../../components/basics/Modal";
import { Button } from "../../components/basics/Button";
import { Input } from "../../components/basics/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faHome,
  faKey,
  faUser,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { IMAGE_BASE } from "../../lib/RestEndpoints";
import { useAllowAthenticated } from "../../lib/hooks";
import { Link } from "reblend-router";
import { routes } from "../../lib/routes";
import { userContext } from "../../lib/contexts";
import { Deposit } from "./Deposit";
import { Withdraw } from "./Withdraw";
import { WithdrawalMethod } from "./WithdrawalMethod";

export const Wallet: FC = () => {
  useAllowAthenticated();
  const [user] = useContext(userContext);

  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showSaveFunds, setShowSaveFunds] = useState(false);
  const [showAddWithdrawalMethod, setShowAddWithdrawalMethod] = useState(false);

  return (
    <div class="min-h-screen flex flex-col gap-4 bg-neutral-50 pb-4">
      {/* Wallet Header */}
      <div class="flex flex-row items-center justify-between">
        <Link
          to={routes.profile.redirectUri}
          className="flex items-center gap-3"
        >
          <img
            src={
              user?.avatar
                ? IMAGE_BASE + user?.avatar
                : "/static/img/profile_picture.jpg"
            }
            alt="Avatar"
            class="inline-flex items-center justify-center bg-neutral-100 rounded-full h-10 w-10 object-cover"
          />
          <div>
            <div class="font-bold text-lg text-neutral-900">Hi, Emmanuel</div>
            <div class="text-neutral-400 text-sm">How are you doing today?</div>
          </div>
        </Link>
        <div>
          <Button variant="secondary" onClick={() => setShowAddFunds(true)}>
            + Add Cash
          </Button>
        </div>
      </div>

      {/* Wallet Cards */}
      <div
        class="flex flex-row gap-4 overflow-x-auto scrollbar-hide hide-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div class="rounded-2xl bg-brand-900 text-white p-5 min-w-[240px] flex-1 relative">
          <div class="flex items-center gap-2 mb-2">
            <i class="fas fa-wallet text-2xl" />
            <span class="font-semibold">Wallet</span>
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

      {/* Actions */}
      <div class="flex flex-row flex-wrap gap-4 mt-6">
        <Button variant="primary" onClick={() => setShowAddFunds(true)}>
          Add Funds
        </Button>
        {/* 
        <Button variant="success" onClick={() => setShowSaveFunds(true)}>
          Save Funds
        </Button> */}
        <Button variant="support" onClick={() => setShowWithdraw(true)}>
          Withdraw
        </Button>
      </div>

      <div class="flex flex-row gap-4">
        <button
          class="bg-neutral-200 text-neutral-700 font-semibold rounded-xl px-6 py-3 flex-1"
          onClick={() => setShowAddWithdrawalMethod(true)}
        >
          Add Withdrawal Method
        </button>
      </div>

      {/* Add Funds Modal */}
      <Deposit open={showAddFunds} onClose={() => setShowAddFunds(false)} />

      {/* Withdraw Funds Modal */}
      <Withdraw
        open={showWithdraw}
        onClose={() => setShowWithdraw(false)}
        setShowAddWithdrawalMethod={() => setShowAddWithdrawalMethod(true)}
      />

      {/* Save Funds Modal */}
      <Modal open={showSaveFunds} onClose={() => setShowSaveFunds(false)}>
        <div class="flex flex-col items-center justify-center">
          <div class="w-16 h-1 bg-neutral-200 rounded-full mb-6" />
          <div class="text-2xl font-bold text-neutral-900 mb-6 w-full">
            What would you like to save for?
          </div>
          <div class="w-full flex flex-col gap-4">
            <button class="flex items-center gap-4 bg-success-50 border border-success-100 rounded-2xl px-4 py-4">
              <span class="inline-flex items-center justify-center bg-brand-100 rounded-xl h-10 w-10">
                <FontAwesomeIcon
                  className="text-success-700 text-xl"
                  icon={faKey}
                />
              </span>
              <div class="flex flex-col items-start">
                <span class="font-bold text-neutral-900">Save for rent</span>
                <span class="text-neutral-400 text-sm text-left">
                  Save towards your next rent with ease
                </span>
              </div>
              <span class="ml-auto text-neutral-400 text-2xl">&gt;</span>
            </button>
            <button class="flex items-center gap-4 bg-brand-50 border border-brand-100 rounded-2xl px-4 py-4">
              <span class="inline-flex items-center justify-center bg-brand-100 rounded-xl h-10 w-10">
                <FontAwesomeIcon
                  className="text-brand-700 text-xl"
                  icon={faHome}
                />
              </span>
              <div class="flex flex-col items-start">
                <span class="font-bold text-neutral-900">
                  Save for property
                </span>
                <span class="text-neutral-400 text-sm text-left">
                  Save for your next property
                </span>
              </div>
              <span class="ml-auto text-neutral-400 text-2xl">&gt;</span>
            </button>
            <button class="flex items-center gap-4 bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-4">
              <span class="inline-flex items-center justify-center bg-brand-100 rounded-xl h-10 w-10">
                <FontAwesomeIcon
                  className="text-brand-700 text-xl"
                  icon={faUser}
                />
              </span>
              <div class="flex flex-col items-start">
                <span class="font-bold text-neutral-900">Savings Circle</span>
                <span class="text-neutral-400 text-sm text-left">
                  Save together with friends and earn interest.
                </span>
              </div>
              <span class="ml-auto text-neutral-400 text-2xl">&gt;</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Withdrawal Method Modal */}
      <WithdrawalMethod
        open={showAddWithdrawalMethod}
        onClose={() => setShowAddWithdrawalMethod(false)}
      />
    </div>
  );
};
