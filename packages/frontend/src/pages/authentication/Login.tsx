import Reblend, { FC, useContext, useEffect, useState } from "reblendjs";
import { Button } from "../../components/basics/Button";
import IUser from "../../interfaces/IUser";
import { Input } from "../../components/basics/Input";
import { Label } from "../../components/basics/Label";
import { IMAGE_BASE } from "../../lib/RestEndpoints";
import { useScroll } from "../../lib/hooks";
import { Link, redirectTo } from "reblend-router";
import { LOGIN, USER_DETAIL } from "../../lib/RestEndpoints";
import { routes } from "../../lib/routes";
import fetcher from "../../lib/SharedFetcher";
import {
  authTokenContext,
  loginRedirectUrl,
  userContext,
} from "../../lib/contexts";
import { alertError } from "../../lib/misc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faEye, faEyeSlash, faLock } from "@fortawesome/free-solid-svg-icons";

export const Login: FC<{
  onLogin?: (user?: IUser, token?: string) => void;
}> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [auth] = useContext(authTokenContext);
  const [loginUrl] = useContext(loginRedirectUrl);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth && !onLogin) {
      redirectTo(
        routes?.home.redirectUri || routes.home.redirectUri || "dashboard"
      );
    }
  }, [auth, onLogin]);

  useScroll();

  const authorize = async (e: Reblend.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const authData = { url: LOGIN, data: { email, password } };
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
              if (onLogin) {
                onLogin(user, data.data);
              } else {
                redirectTo(loginUrl || routes.home.redirectUri);
              }
            } else {
              alertError("User details not found");
            }
          }
        } else {
          if (data?.connection.errorCode === 411) {
            redirectTo(routes.verifymail.redirectUri + email);
          }
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
      <div class="text-2xl font-bold text-neutral-900 mb-2">Sign in</div>
      {/* Avatar */}
      <div class="flex flex-col items-center mt-2 mb-4">
        <img
          src={IMAGE_BASE + "/static/img/profile_picture.jpg"}
          alt="Avatar"
          class="inline-flex items-center justify-center bg-neutral-100 rounded-2xl h-20 w-20 mb-2 object-cover"
        />
      </div>

      {/* Form */}
      <form class="flex flex-col gap-4 mt-2" onSubmit={authorize}>
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
        <Button
          type="submit"
          disabled={!email || !password}
          loading={loading}
          className="w-full mt-8"
        >
          Proceed
        </Button>
      </form>
    </div>
  );
};
