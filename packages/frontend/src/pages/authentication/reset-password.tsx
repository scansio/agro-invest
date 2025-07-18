import Reblend, { useEffect, useState } from "reblendjs";
import { alertError, alertSuccess } from "../../lib/misc";
import { SEND_FORGET_PASSWORD_MAIL } from "../../lib/RestEndpoints";
import fetcher from "../../lib/SharedFetcher";
import { RouteProps } from "reblend-router";
import { useScroll } from "../../lib/hooks";
import { Button } from "../../components/basics/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Label } from "../../components/basics/Label";
import { Input } from "../../components/basics/Input";

export function ResetPassword(props: RouteProps) {
  const [email, setEmail] = useState(props.query?.email || "");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0); // Timer state

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldownTime > 0) {
      timer = setTimeout(() => setCooldownTime(cooldownTime - 1), 1000);
    } else {
      setCooldown(false);
    }
    return () => clearTimeout(timer);
  }, [cooldownTime]);

  useScroll();

  const resendCode = (e: Reblend.FormEvent) => {
    e.preventDefault();

    if (cooldown) {
      alertError("Please wait before requesting another code.");
      return;
    }

    setLoading(true);
    setCooldown(true);
    setCooldownTime(60); // Set cooldown time to 60 seconds

    fetcher
      .fetch(SEND_FORGET_PASSWORD_MAIL + email)
      .then((data) => {
        if (data?.connection?.status) {
          alertSuccess("Verification code resent successfully.");
          setSent(true);
        } else {
          alertError(data?.connection?.message || "Error resending code.");
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
    <div class="">
      <div class="text-2xl font-bold text-neutral-900 mb-1">
        Forgot Password
      </div>
      <div class="text-neutral-500 mb-4">
        We Will Send You a Password Reset Link
      </div>

      <form onsubmit={resendCode} class="flex flex-col gap-4 mt-2">
        <div>
          <Label>Email</Label>
          <Input
            value={email}
            onchange={(e) => setEmail(e.target.value)}
            placeholder="example@site.com"
            type="email"
            required
            leftIcon={<FontAwesomeIcon icon={faEnvelope} />}
            rightIcon={
              <Button
                type="submit"
                disabled={sent}
                loading={loading}
                className="text-xs font-semibold"
              >
                Send
              </Button>
            }
          />
        </div>
      </form>
    </div>
  );
}
