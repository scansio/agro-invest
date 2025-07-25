import Reblend, { FC, useEffect, useState } from "reblendjs";
import fetcher from "../../lib/SharedFetcher";
import { GENERATE_DEPOSIT } from "../../lib/RestEndpoints";
import { faHome, faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../../components/basics/Button";
import { Input } from "../../components/basics/Input";
import { Modal } from "../../components/basics/Modal";

export const Deposit: FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const [generatingDeposit, setGeneratingDeposit] = useState(false);
  const [authorization_url, setauthorization_url] = useState("");
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("wallet");

  useEffect(() => {
    if (authorization_url) {
      window.open(authorization_url, "_blank");
    }
  }, [authorization_url]);

  function generateDeposit(e: Reblend.FormEvent) {
    e.preventDefault();
    setGeneratingDeposit(true);
    fetcher
      .fetch<{ authorization_url: string }>({
        url: GENERATE_DEPOSIT,
        data: {
          amount: amount,
          baseCallbackURL: "/scheduling",
        },
      })
      .then((data) => {
        if (data?.connection?.status) {
          setauthorization_url(data.data.authorization_url);
        } else {
          alert(data?.connection?.message);
        }
      })
      .catch((err) => alert(err.message))
      .finally(() => setGeneratingDeposit(false));
  }

  return (
    <Modal open={open} onClose={onClose}>
      <form onsubmit={generateDeposit} class="flex flex-col gap-4 items-center justify-center">
        <div class="w-16 h-1 bg-neutral-200 rounded-full" />
        <div class="text-2xl font-bold text-neutral-900 w-full">
          How much do you want to add
        </div>
        <Input
          placeholder="Enter amount (₦)"
          value={amount}
          onchange={(e) => setAmount((e.target as HTMLInputElement).value)}
          type="number"
          required
        />
        <div class="w-full text-lg font-semibold text-neutral-700">
          Destination
        </div>
        <div class="flex flex-row gap-4 w-full">
          <button
          type="button"
            class={`flex-1 rounded-2xl border px-4 py-4 flex flex-col items-start ${
              destination === "wallet"
                ? "border-warning-400 bg-warning-50 shadow"
                : "border-neutral-200 bg-white"
            }`}
            onClick={() => setDestination("wallet")}
          >
            <span class="inline-flex items-center justify-center bg-neutral-100 rounded-xl h-8 w-8 mb-2">
              <FontAwesomeIcon
                className="text-brand-700 text-lg"
                icon={faHome}
              />
            </span>
            <span class="font-bold text-neutral-900">Wallet</span>
            <span class="text-neutral-400 text-sm text-left">
              Withdraw any time
            </span>
          </button>
          <button
          type="button"
            class={`flex-1 rounded-2xl border px-4 py-4 flex flex-col items-start ${
              destination === "savings"
                ? "border-brand-400 bg-brand-50 shadow"
                : "border-neutral-200 bg-white"
            }`}
            //onClick={() => setDestination("savings")}
          >
            <span class="inline-flex items-center justify-center bg-neutral-100 rounded-xl h-8 w-8 mb-2">
              <FontAwesomeIcon
                className="text-brand-700 text-lg"
                icon={faWallet}
              />
            </span>
            <span class="font-bold text-neutral-900">Savings</span>
            <span class="text-neutral-400 text-sm text-left">
              Earn interest
            </span>
          </button>
        </div>
        <Button
          className="w-full"
          type="submit"
          disabled={!amount}
          loading={generatingDeposit}
        >
          Continue
        </Button>
      </form>
    </Modal>
  );
};
