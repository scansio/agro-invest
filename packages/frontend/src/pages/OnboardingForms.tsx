import Reblend, { FC, useState } from "reblendjs";
import { Modal } from "../components/basics/Modal";
import { Button } from "../components/basics/Button";
import { Input } from "../components/basics/Input";
import { Select } from "../components/basics/Select";

export const OnboardingForms: FC = () => {
  const [step, setStep] = useState(0);
  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  // Helper for code input
  const handleCodeChange = (i: number, val: string) => {
    const newCode = [...code];
    newCode[i] = val.slice(0, 1);
    setCode(newCode);
  };

  return (
    <div class="flex flex-col gap-4 items-center justify-center">
      {/* Step 1: Little About You */}
      <Modal open={step === 0} onClose={() => {}} noCloseButton>
        <div class="flex flex-col items-center justify-center">
          <div class="w-16 h-1 bg-neutral-200 rounded-full mb-6" />
          <div class="text-2xl font-bold text-neutral-900 mb-6 text-left w-full">
            A little about you
          </div>
          <form
            class="w-full flex flex-col gap-4 mb-8"
            onSubmit={(e) => {
              e.preventDefault();
              setStep(1);
            }}
          >
            <Input
              placeholder="Your legal first name"
              value={firstName}
              onInput={(e) =>
                setFirstName((e.target as HTMLInputElement).value)
              }
              required
              type="text"
            />
            <Input
              placeholder="Your legal last name"
              value={lastName}
              onInput={(e) => setLastName((e.target as HTMLInputElement).value)}
              required
              type="text"
            />
            <Input
              placeholder="Date of birth"
              value={dob}
              onInput={(e) => setDob((e.target as HTMLInputElement).value)}
              required
              type="date"
            />
          </form>
          <div class="text-neutral-500 text-center mb-6">
            You must be 18 years or above to use AgroInvest!
          </div>
          <Button
            disabled={!firstName || !lastName || !dob}
            onClick={() => setStep(1)}
          >
            Continue
          </Button>
        </div>
      </Modal>

      {/* Step 2: Welcome + Phone */}
      <Modal open={step === 1} onClose={() => {}} noCloseButton>
        <div class="flex flex-col items-center justify-center  px-4">
          <div class="flex flex-row justify-center gap-4 mb-6">
            <span class="text-4xl">🎆</span>
            <span class="text-3xl">🎆</span>
            <span class="text-4xl">🎆</span>
          </div>
          <div class="text-center mb-2">
            <div class="text-2xl font-bold text-neutral-900">Welcome,</div>
            <div class="text-3xl font-extrabold text-warning-600">Emmanuel</div>
          </div>
          <div class="text-neutral-500 text-center mb-8">
            We are happy to be part of your wealth journey. Kindly verify your
            phone number.
          </div>
          <form
            class="flex flex-row items-center justify-center gap-2 mb-8"
            onSubmit={(e) => {
              e.preventDefault();
              setStep(2);
            }}
          >
            <div class="flex items-center bg-white border border-neutral-200 rounded-2xl px-4 py-3 min-w-[100px]">
              <span class="text-success-600 text-lg mr-2">🇳🇬</span>
              <span class="font-semibold text-neutral-700">+234</span>
            </div>
            <input
              class="bg-white border border-warning-400 rounded-2xl px-4 py-3 text-lg outline-none w-40"
              placeholder="907 123 4567"
              value={phone}
              onInput={(e) => setPhone((e.target as HTMLInputElement).value)}
              required
              type="tel"
            />
          </form>
          <button
            class="w-full bg-brand-300 text-white font-semibold rounded-2xl py-4 mb-4 disabled:opacity-40"
            disabled={!phone}
            onClick={() => setStep(2)}
          >
            Proceed
          </button>
          <button
            class="mt-6 text-neutral-800 text-base"
            onClick={() => setStep(3)}
          >
            Skip for now &raquo;
          </button>
        </div>
      </Modal>

      {/* Step 3: Verify Phone */}
      <Modal open={step === 2} onClose={() => {}} noCloseButton>
        <div class="flex flex-col items-center justify-center  px-4">
          <div class="text-neutral-700 text-lg text-center mb-8">
            Enter the 5 digit code sent to your phone number to continue.
          </div>
          <form
            class="flex flex-row gap-3 mb-8"
            onSubmit={(e) => {
              e.preventDefault();
              setStep(3);
            }}
          >
            {code.map((val, i) => (
              <input
                key={i}
                class={`w-14 h-14 text-center text-2xl border-2 rounded-2xl outline-none ${
                  i === 0 ? "border-support-400" : "border-neutral-200"
                } bg-neutral-50`}
                maxLength={1}
                value={val}
                onInput={(e) =>
                  handleCodeChange(i, (e.target as HTMLInputElement).value)
                }
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                required
              />
            ))}
          </form>
          <Button disabled={code.some((c) => !c)} onClick={() => setStep(3)}>
            Verify
          </Button>
          <div class="mt-8 text-center text-lg tracking-widest text-neutral-800">
            00:51
          </div>
        </div>
      </Modal>

      {/* Step 4: Bank Verification */}
      <Modal open={step === 3} onClose={() => {}} noCloseButton>
        <div class="flex flex-col items-center justify-center  px-4">
          <div class="flex flex-col items-center mb-8">
            <span class="bg-support-400 rounded-full p-6 mb-4">
              <svg width="64" height="64" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="32" fill="#3CCFCF" />
                <polyline
                  points="20,34 30,44 46,24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div class="text-xl font-bold text-neutral-900 text-center mb-2">
              Verify your bank account for withdrawals
            </div>
          </div>
          <form
            class="w-full flex flex-col gap-4 mb-8"
            onSubmit={(e) => {
              e.preventDefault(); /* handle submit */
            }}
          >
            <Select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              required
            >
              <option value="">— Select bank —</option>
              <option value="access">Access Bank</option>
              <option value="gtb">GTBank</option>
              <option value="zenith">Zenith Bank</option>
            </Select>
            <Input
              placeholder="Enter account number"
              value={accountNumber}
              onInput={(e) =>
                setAccountNumber((e.target as HTMLInputElement).value)
              }
              required
              type="text"
            />
            <Input
              placeholder="Account Name"
              value={accountName}
              onInput={(e) =>
                setAccountName((e.target as HTMLInputElement).value)
              }
              required
              type="text"
            />
          </form>
          <Button
            disabled={!bank || !accountNumber || !accountName}
            onClick={() => {
              /* handle finish */
            }}
          >
            Proceed
          </Button>
          <Button
            className="mt-6 text-neutral-800 text-base"
            onClick={() => setStep(0)}
          >
            Start Over
          </Button>
        </div>
      </Modal>
    </div>
  );
};
