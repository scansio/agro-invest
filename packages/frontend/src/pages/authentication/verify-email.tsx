import Reblend, { useContext, useState, useEffect } from "reblendjs";
import {
  SEND_VERIFICATION_MAIL,
  USER_DETAIL,
  VERIFY_MAIL,
} from "../../lib/RestEndpoints";
import fetcher from "../../lib/SharedFetcher";
import {
  authTokenContext,
  loginRedirectUrl,
  userContext,
} from "../../lib/contexts";
import { redirectTo } from "reblend-router";
import { alertError, alertSuccess } from "../../lib/misc";
import { routes } from "../../lib/routes";
import IUser from "../../interfaces/IUser";
import { useScroll } from "../../lib/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCode,
  faEnvelope,
  faListNumeric,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../components/basics/Button";
import { Label } from "../../components/basics/Label";
import { Input } from "../../components/basics/Input";

export function VerifyEmail({
  params,
}: {
  params?: {
    email: string;
    code: string;
  };
}) {
  const [editEmail, setEmail] = useState(params?.email);
  const [editCode, setEditCode] = useState(params?.code || "");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0); // Timer state
  useScroll();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldownTime > 0) {
      timer = setTimeout(() => setCooldownTime(cooldownTime - 1), 1000);
    } else {
      setCooldown(false);
    }
    return () => clearTimeout(timer);
  }, [cooldownTime]);

  const verifyEmail = async (e: Reblend.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const authData = {
      url: VERIFY_MAIL,
      data: { email: editEmail, code: editCode },
    };

    fetcher
      .fetch<string>(authData)
      .then(async (data) => {
        if (data?.connection?.status) {
          const userDetail = await fetcher.fetch<IUser>({
            url: USER_DETAIL,
            method: "GET",
            headers: {
              Authorization: data.data,
            },
          });
          if (userDetail?.connection?.status) {
            const user = userDetail.data;
            if (user) {
              await authTokenContext.update(data.data);
              await userContext.update(user);
            }
          }
          redirectTo(loginRedirectUrl.getValue() || routes.home.redirectUri);
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

  const resendCode = () => {
    if (cooldown) {
      alertError("Please wait before requesting another code.");
      return;
    }

    setLoading(true);
    setCooldown(true);
    setCooldownTime(60); // Set cooldown time to 60 seconds

    fetcher
      .fetch(SEND_VERIFICATION_MAIL + editEmail)
      .then((data) => {
        if (data?.connection?.status) {
          alertSuccess("Verification code resent successfully.");
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
        Verify Your Email
      </div>
      <div class="text-neutral-500 mb-4">
        We sent you a verification code to your email.
      </div>

      <form onsubmit={verifyEmail} class="flex flex-col mt-2 gap-4">
        <div>
          <Label>Email</Label>
          <Input
            value={editEmail}
            onchange={(e) => setEmail(e.target.value)}
            placeholder="example@site.com"
            required
            type="email"
            leftIcon={<FontAwesomeIcon icon={faEnvelope} />}
            rightIcon={
              <Button
                disabled={!!cooldownTime}
                loading={loading}
                onclick={resendCode}
                variant="support"
                className="text-xs font-semibold"
              >
                {cooldownTime || "Resend"}
              </Button>
            }
          />
        </div>

        <div>
          <Label>Code</Label>
          <Input
            value={editCode}
            onchange={(e) => setEditCode(e.target.value)}
            placeholder="1231231"
            type="number"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={!editCode}
          className="w-full mt-8"
          loading={loading}
        >
          Proceed
        </Button>
      </form>
    </div>
  );
}
