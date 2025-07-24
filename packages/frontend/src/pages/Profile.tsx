import Reblend, {
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from "reblendjs";
import { Button } from "../components/basics/Button";
import { Input } from "../components/basics/Input";
import { Label } from "../components/basics/Label";
import { Select } from "../components/basics/Select";
import { CHANGE_PASSWORD, IMAGE_BASE, USER_BASE } from "../lib/RestEndpoints";
import { useAllowAthenticated, useScroll } from "../lib/hooks";
import { userContext } from "../lib/contexts";
import { alertError, alertSuccess } from "../lib/misc";
import fetcher from "../lib/SharedFetcher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faFileEdit,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

export const Profile: FC = () => {
  useAllowAthenticated();

  const [user] = useContext(userContext);
  const [firstname, setFirstName] = useState(user?.firstname);
  const [lastname, setLastName] = useState(user?.lastname);
  const [dob, setDob] = useState(user?.dob!);
  const [gender, setGender] = useState(user?.gender);
  const [address, setAddress] = useState(user?.address);
  const [status] = useState("Verification pending");

  const [oldpassword, setoldpassword] = useState("");
  const [newpassword, setnewpassword] = useState("");
  const [confirmnewpassword, setconfirmnewpassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null as any);
  const [selectedfile, setselectedfile] = useState<File | null>(null);
  const [changing, setChanging] = useState(false);
  useScroll();

  const [selectedFileObjectUrl, setselectedFileObjectUrl] = useState("");

  useEffect(({ previous }) => {
    if (previous && selectedFileObjectUrl) {
      URL.revokeObjectURL(selectedFileObjectUrl);
    }

    if (selectedfile) {
      setselectedFileObjectUrl(URL.createObjectURL(selectedfile));
    }

    return () => URL.revokeObjectURL(selectedFileObjectUrl);
  }, selectedfile?.name);

  const saveProfile = (e: Reblend.FormEvent) => {
    e.preventDefault();
    setChanging(true);

    const formData = new FormData();
    selectedfile && formData.append("avatar", selectedfile);

    Object.entries({
      uid: user?._id,
      firstname,
      lastname,
      dob,
      gender,
      address,
    }).forEach(([key, value]) => formData.append(key, value as any));

    const authData = {
      url: USER_BASE,
      method: "PATCH",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    };
    fetcher
      .fetch(authData)
      .then((data) => {
        if (data?.connection?.status) {
          userContext.update(data.data as any);
          alertSuccess(data?.connection?.message);
        } else {
          alertError(data?.connection?.message);
        }
      })
      .catch((err) => {
        alertError(err.message);
      })
      .finally(() => {
        setChanging(false);
      });
  };

  const changePassword = (e: Reblend.FormEvent) => {
    e.preventDefault();
    if (newpassword !== confirmnewpassword) {
      return alertError("Password mismatch");
    }
    setChanging(true);
    const authData = {
      url: CHANGE_PASSWORD,
      data: {
        uid: user?._id,
        oldPassword: oldpassword,
        newPassword: newpassword,
      },
    };
    fetcher
      .fetch(authData)
      .then((data) => {
        console.log("data", data);
        if (data?.connection?.status) {
          alertSuccess("Your just changed your password kindly re-login.");
        } else {
          alertError(data?.connection?.message);
        }
      })
      .catch((err) => {
        alertError(err.message);
      })
      .finally(() => {
        setChanging(false);
      });
  };

  return (
    <div class="flex flex-col gap-4">
      {/* Title */}
      <div class="text-2xl font-bold text-neutral-900 mb-2">Edit Profile</div>
      {/* Avatar */}
      <div class="flex flex-col items-center mt-2 mb-4">
        <div class="relative">
          <img
            src={
              selectedFileObjectUrl ||
              (user?.avatar
                ? IMAGE_BASE + user?.avatar
                : "/static/img/profile_picture.jpg")
            }
            alt="Avatar"
            class="inline-flex items-center justify-center bg-neutral-100 rounded-2xl h-32 w-32 mb-2 object-cover shadow-md"
          />
          <div
            class="absolute inset-0 flex items-center justify-center cursor-pointer"
            onclick={() => fileRef.current?.click()}
          >
            <FontAwesomeIcon
              className=" border border-white bg-slate-100 rounded-md p-1"
              icon={faFileEdit}
            />
          </div>
        </div>
        <input
          ref={fileRef}
          class="hidden"
          id="file-input"
          type="file"
          accept="image/jpeg, image/png, image/PNG, image/JPEG, image/jpg, image/JPG"
          onchange={(e) => setselectedfile(e.target.files?.item(0)!)}
        />
        <div class="text-xl font-bold text-neutral-900 text-center">
          {firstname} {lastname}
        </div>
        <span class="mt-2 px-3 py-1 rounded bg-warning-200 text-warning-800 text-xs font-semibold">
          {status}
        </span>
      </div>
      {/* Form */}
      <form class="flex flex-col gap-4 mt-2" onsubmit={saveProfile}>
        <div>
          <Label>Your legal first name</Label>
          <Input
            value={firstname}
            onchange={(e) => setFirstName((e.target as HTMLInputElement).value)}
            placeholder="First name"
            type="text"
            required
          />
        </div>
        <div>
          <Label>Your legal last name</Label>
          <Input
            value={lastname}
            onchange={(e) => setLastName((e.target as HTMLInputElement).value)}
            placeholder="Last name"
            type="text"
            required
          />
        </div>
        <div>
          <Label>Date of birth</Label>
          <Input
            value={dob}
            onchange={(e) => setDob(new Date(e.target.value))}
            placeholder="Date of birth"
            type="date"
            required
          />
        </div>
        <div>
          <Select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">— Gender —</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
        </div>
        <div>
          <Input
            value={address}
            onchange={(e) => setAddress((e.target as HTMLInputElement).value)}
            placeholder="Address"
            type="text"
            required
          />
        </div>
        <Button type="submit" variant="secondary" loading={changing}>
          Save
        </Button>
      </form>

      <form class="flex flex-col gap-4 mt-2" onsubmit={changePassword}>
        <hr />
        <div class="text-2xl font-bold text-neutral-900 mb-2">
          Change Password
        </div>

        <div>
          <Label>Old Password</Label>
          <Input
            value={oldpassword}
            onchange={(e) => setoldpassword(e.target.value)}
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
          <Label>New Password</Label>
          <Input
            required
            value={newpassword}
            onchange={(e) => setnewpassword(e.target.value)}
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
            required
            value={confirmnewpassword}
            onchange={(e) => setconfirmnewpassword(e.target.value)}
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
        <Button type="submit" loading={changing} variant="danger">
          Change password
        </Button>
      </form>
    </div>
  );
};
