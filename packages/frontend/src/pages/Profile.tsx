import Reblend, { FC, useState } from "reblendjs";
import { Button } from "../components/basics/Button";
import { Input } from "../components/basics/Input";
import { Label } from "../components/basics/Label";
import { Select } from "../components/basics/Select";

export const Profile: FC = () => {
  // Example state (replace with real data/fetch as needed)
  const [firstName, setFirstName] = useState("Emmanuel");
  const [lastName, setLastName] = useState("Elom");
  const [dob, setDob] = useState("1990-01-17");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [status] = useState("Verification pending");

  return (
    <div class="">
      {/* Title */}
      <div class="text-2xl font-bold text-neutral-900 mb-2">Edit Profile</div>
      {/* Avatar */}
      <div class="flex flex-col items-center mt-2 mb-4">
        <span class="inline-flex items-center justify-center bg-neutral-100 rounded-2xl h-20 w-20 mb-2">
          <i class="fas fa-user text-brand-800 text-5xl" />
        </span>
        <div class="text-xl font-bold text-neutral-900 text-center">
          {firstName} {lastName}
        </div>
        <span class="mt-2 px-3 py-1 rounded bg-warning-200 text-warning-800 text-xs font-semibold">
          {status}
        </span>
      </div>
      {/* Form */}
      <form class="flex flex-col gap-4 mt-2">
        <div>
          <Label>Your legal first name</Label>
          <Input
            value={firstName}
            onInput={(e) => setFirstName((e.target as HTMLInputElement).value)}
            placeholder="First name"
            type="text"
          />
        </div>
        <div>
          <Label>Your legal last name</Label>
          <Input
            value={lastName}
            onInput={(e) => setLastName((e.target as HTMLInputElement).value)}
            placeholder="Last name"
            type="text"
          />
        </div>
        <div>
          <Label>Date of birth</Label>
          <Input
            value={dob}
            onInput={(e) => setDob((e.target as HTMLInputElement).value)}
            placeholder="Date of birth"
            type="date"
          />
        </div>
        <div>
          <Select
            value={gender}
            onChange={(e) => setGender((e.target as HTMLSelectElement).value)}
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
            onInput={(e) => setAddress((e.target as HTMLInputElement).value)}
            placeholder="Address"
            type="text"
          />
        </div>
      </form>
      <Button className="w-full mt-8" disabled={false}>
        Save
      </Button>
    </div>
  );
};
