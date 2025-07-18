import Reblend, { useState } from "reblendjs";
import fetcher from "../../lib/SharedFetcher";
import {
  SEND_FORGET_PASSWORD_MAIL,
  VERIFY_FORGET_PASSWORD,
} from "../../lib/RestEndpoints";
import { alertError, alertInfo, alertSuccess } from "../../lib/misc";
import { routes } from "../../lib/routes";
import { redirectTo, RouteProps } from "reblend-router";
import { Label } from "../../components/basics/Label";
import { Input } from "../../components/basics/Input";
import { Button } from "../../components/basics/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faLock } from "@fortawesome/free-solid-svg-icons";

export function EmailResetPassword(props: RouteProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changing, setChanging] = useState(false);
  const [showPass, setShowPass] = useState(false);

  function changePassword(e: Reblend.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return alertError("Password Mismatch");
    }

    setChanging(true);
    const authData = {
      url: VERIFY_FORGET_PASSWORD,
      data: {
        email: props.query?.email,
        code: props.query?.code,
        newPassword: password,
      },
    };
    fetcher
      .fetch(authData)
      .then((data) => {
        if (data?.connection?.status) {
          redirectTo(routes.login.redirectUri);
        }
        alertInfo(data?.connection?.message);
      })
      .catch((err) => {
        alertError(err.message);
      })
      .finally(() => {
        setChanging(false);
      });
  }

  return (
    <div class="">
      <div class="text-2xl font-bold text-neutral-900 mb-1">
        Forgot Password
      </div>
      <div class="text-neutral-500 mb-4">Please Type in Your New Password</div>

      <form onsubmit={changePassword} class="flex flex-col gap-4 mt-2">
        <div>
          <Label>Password</Label>
          <Input
            value={password}
            onchange={(e) => setPassword(e.target.value)}
            placeholder="Ab1234&&"
            required
            type={showPass ? "text" : "password"}
            leftIcon={<FontAwesomeIcon icon={faLock} />}
            rightIcon={
              <span
                onClick={() => setShowPass(!showPass)}
                className="cursor-pointer"
              >
                {showPass ? (
                  <FontAwesomeIcon icon={faEye} />
                ) : (
                  <FontAwesomeIcon icon={faEyeSlash} />
                )}
              </span>
            }
          />
        </div>
        <div>
          <Label>Confirm Password</Label>
          <Input
            value={confirmPassword}
            onchange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ab1234&&"
            required
            type={showPass ? "text" : "password"}
            leftIcon={<FontAwesomeIcon icon={faLock} />}
            rightIcon={
              <span
                onClick={() => setShowPass(!showPass)}
                className="cursor-pointer"
              >
                {showPass ? (
                  <FontAwesomeIcon icon={faEye} />
                ) : (
                  <FontAwesomeIcon icon={faEyeSlash} />
                )}
              </span>
            }
          />
        </div>
        <Button
          type="submit"
          disabled={!password || !confirmPassword}
          className="w-full mt-8"
          loading={changing}
        >
          Proceed
        </Button>
      </form>
    </div>
  );
}
