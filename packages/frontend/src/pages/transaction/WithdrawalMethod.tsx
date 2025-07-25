import Reblend, {
  FC,
  rand,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "reblendjs";
import { faHome, faSpinner, faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../../components/basics/Button";
import { Input } from "../../components/basics/Input";
import { Modal } from "../../components/basics/Modal";
import fetcher from "../../lib/SharedFetcher";
import { alertError, alertSuccess } from "../../lib/misc";
import { BANK_DETAIL, CREATE_BANK_DETAIL } from "../../lib/RestEndpoints";
import { useScroll } from "../../lib/hooks";
import IBankDetail from "../../interfaces/IBankDetail";
import { userContext } from "../../lib/contexts";
import { Label } from "../../components/basics/Label";

export const WithdrawalMethod: FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const [user] = useContext(userContext);
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [update, setUpdate] = useReducer<
    IBankDetail | null,
    IBankDetail | null
  >((_preveious, current) => {
    setBankName(current?.bankName || "");
    setAccountName(current?.accountName || "");
    setAccountNumber(current?.accountNumber || "");
    return current;
  }, null);
  const [r, reload] = useReducer(() => rand(1234, 5678), 0);
  useScroll();

  useEffect(() => {
    if (user?._id) {
      setLoadingDetail(true);
      fetcher
        .fetch<IBankDetail>(BANK_DETAIL + user?._id)
        .then((data) => {
          if (data?.connection?.status) {
            data.data?._id && setUpdate(data.data);
          } else {
            setUpdate(null);
          }
          setLoadingDetail(false);
        })
        .catch(() => {
          setLoadingDetail(false);
          setUpdate(null);
        });
    } else {
      setUpdate(null);
    }
  }, [user?._id, r]);

  const createOrUpdate = async (e: Reblend.FormEvent) => {
    e.preventDefault();
    if (!confirm) {
      alert(
        "Please confirm that your detail is correct by clicking the confirmation button"
      );
      return;
    }
    setLoading(true);
    const authData = {
      url: CREATE_BANK_DETAIL,
      method: update ? "PATCH" : "POST",
      data: {
        _id: update?._id,
        bankName,
        accountName,
        accountNumber,
      },
    };
    fetcher
      .fetch(authData)
      .then((data) => {
        if (data?.connection?.status) {
          reload(0);
          alertSuccess(data.connection.message);
        } else {
          alertError(data?.connection?.message || "Error");
        }
      })
      .catch((err) => {
        alertError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div class="flex flex-col items-center justify-center gap-4">
        <div class="w-16 h-1 bg-neutral-200 rounded-full" />
        <div class="text-2xl font-bold text-neutral-900 w-full">
          Add Withdrawal Method{" "}
          {loadingDetail ? (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          ) : null}
        </div>
        <form onsubmit={createOrUpdate} class="w-full flex flex-col gap-4">
          <Input
            placeholder="Bank Name"
            type="text"
            value={bankName}
            onchange={(e) => setBankName(e.target.value)}
          />
          <Input
            placeholder="Account Name"
            type="text"
            value={accountName}
            onchange={(e) => setAccountName(e.target.value)}
          />
          <Input
            placeholder="Account Number"
            type="number"
            value={accountNumber}
            onchange={(e) => setAccountNumber(e.target.value)}
          />
          <div className="flex flex-row items-center gap-4">
            <input
              id="checkbox"
              type="checkbox"
              checked={confirm}
              onchange={() => setConfirm((prev) => !prev)}
            />
            <label for="checkbox">
              I confirm that all information provided here is legitimate and
              correct.
            </label>
          </div>
          <Button
            type="submit"
            disabled={!bankName || !accountName || !accountNumber}
            loading={loading}
          >
            Save Method
          </Button>
        </form>
      </div>
    </Modal>
  );
};
