import Reblend, { FC, useContext, useEffect, useState } from "reblendjs";
import { Link, redirectTo } from "reblend-router";
import { authTokenContext, loginRedirectUrl } from "../../lib/contexts";
import { routes } from "../../lib/routes";
import fetcher from "../../lib/SharedFetcher";
import { alertError, alertSuccess } from "../../lib/misc";
import { USER_BASE } from "../../lib/RestEndpoints";
import { useScroll } from "../../lib/hooks";
import { Button } from "../../components/basics/Button";
import { Input } from "../../components/basics/Input";
import { Label } from "../../components/basics/Label";
import { IMAGE_BASE } from "../../lib/RestEndpoints";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

export const Signup: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [auth] = useContext(authTokenContext);
  const [loading, setLoading] = useState(false);
  const [loginUrl] = useContext(loginRedirectUrl);

  useScroll();

  useEffect(() => {
    if (auth) {
      redirectTo(loginUrl || routes.home.redirectUri);
    }
  }, [auth]);

  const create = async (e: Reblend.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const authData = {
      url: USER_BASE,
      data: { email, password },
    };
    fetcher
      .fetch(authData)
      .then((data) => {
        if (data?.connection?.status) {
          redirectTo(routes.verifymail.redirectUri + email);
          alertSuccess(
            "Registration successful! Please check your email for verification code."
          );
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
    <div class="">
      {/* Title */}
      <div class="text-2xl font-bold text-neutral-900 mb-2">Sign up</div>
      {/* Avatar */}
      <div class="flex flex-col items-center mt-2 mb-4">
        <img
          src={IMAGE_BASE + "/static/img/profile_picture.jpg"}
          alt="Avatar"
          class="inline-flex items-center justify-center bg-neutral-100 rounded-2xl h-20 w-20 mb-2 object-cover"
        />
      </div>

      {/* Form */}
      <form onSubmit={create} class="flex flex-col gap-4 mt-2">
        <div>
          <Label>Email</Label>
          <Input
            value={email}
            onchange={(e) => setEmail(e.target.value)}
            placeholder="example@site.com"
            type="email"
            leftIcon={<FontAwesomeIcon icon={faEnvelope} />}
          />
        </div>
        <div>
          <Label>Password</Label>
          <Input
            value={password}
            onchange={(e) => setPassword(e.target.value)}
            placeholder="Ab1234&&"
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
          disabled={!email || !password || !confirmPassword}
          className="w-full mt-8"
          loading={loading}
        >
          Proceed
        </Button>
      </form>
    </div>
  );
};
