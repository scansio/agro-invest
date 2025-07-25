import Reblend, { FC, useState } from "reblendjs";
import fetcher from "../../lib/SharedFetcher";
import { REQUEST_WITHDRAW } from "../../lib/RestEndpoints";
import { Button } from "../../components/basics/Button";
import { Input } from "../../components/basics/Input";
import { Modal } from "../../components/basics/Modal";

export const Withdraw: FC<{
  open: boolean;
  onClose: () => void;
  setShowAddWithdrawalMethod: () => void;
}> = ({ open, onClose, setShowAddWithdrawalMethod }) => {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [password, setPassword] = useState("");
  const [sms2fa, setSms2fa] = useState("");
  const [bookingWithdrawal, setBookingWithdrawal] = useState(false);

  function bookWithdrawal(e: Reblend.FormEvent) {
    e.preventDefault();
    setBookingWithdrawal(true);
    fetcher
      .fetch<{ authorization_url: string }>({
        url: REQUEST_WITHDRAW,
        data: {
          amount: withdrawAmount,
        },
      })
      .then((data) => {
        alert(data?.connection?.message);
      })
      .catch((err) => alert(err.message))
      .finally(() => setBookingWithdrawal(false));
  }

  return (
    <Modal open={open} onClose={onClose}>
      <form onsubmit={bookWithdrawal} class="flex flex-col gap-2">
        <div class="text-2xl font-bold text-neutral-900 mb-2">
          Withdraw Funds
        </div>
        <div class="text-neutral-700 mb-4">
          Available Balance: <span class="font-bold">₦0.00</span>
        </div>
        <Button
          variant="secondary"
          type="button"
          className="mb-4"
          onclick={() => (onClose(), setShowAddWithdrawalMethod())}
        >
          + Add Bank Details
        </Button>
        <Input
          placeholder="Enter amount (₦)"
          value={withdrawAmount}
          onchange={(e) =>
            setWithdrawAmount((e.target as HTMLInputElement).value)
          }
          type="number"
          required
        />
        <Input
          placeholder="Password"
          value={password}
          onchange={(e) => setPassword((e.target as HTMLInputElement).value)}
          type="password"
          required
        />
        {/* <Input
          placeholder="SMS 2FA"
          value={sms2fa}
          onchange={(e) => setSms2fa((e.target as HTMLInputElement).value)}
          type="text"
        />
        <Button variant="support" type="button" className="text-xs">
          Request Code
        </Button> */}
        {/* <div class="flex flex-row justify-between mb-2 text-neutral-700">
          <span>Fee:</span>
          <span class="font-bold line-through">₦0.00</span>
        </div>
        <div class="flex flex-row justify-between mb-6 text-neutral-700">
          <span>You get:</span>
          <span class="font-bold line-through">₦0.00</span>
        </div> */}
        <Button
          disabled={!withdrawAmount}
          type="submit"
          loading={bookingWithdrawal}
          className=""
        >
          Proceed
        </Button>
        <div class="mt-2 text-xs text-brand-900 w-60">
          Your withdrawal will be processed in 24 hours weekday, and within 48
          hours on weekends, except Sunday.
        </div>
      </form>
    </Modal>
  );
};
