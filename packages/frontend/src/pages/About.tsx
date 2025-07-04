import Reblend, { FC } from "reblendjs";

export const About: FC = () => {
  return (
    <div class="flex flex-col items-center">
      <img
        src="/logo192.png"
        alt="AgroInvest Logo"
        class="w-20 h-20 mb-4 rounded-full shadow"
      />
      <div class="text-3xl font-bold mb-2">AgroInvest</div>
      <div class="text-lg text-neutral-700 mb-6 text-center">
        Empowering you to save, invest, and grow your wealth through real estate
        and property-backed opportunities. Our mission is to make financial
        growth accessible, transparent, and rewarding for everyone.
      </div>
      <div class="w-full">
        <div class="mb-6">
          <div class="text-xl font-semibold text-neutral-900 mb-2">
            Our Vision
          </div>
          <div class="text-neutral-600">
            To be Africa's most trusted platform for property-backed savings and
            investment, enabling financial freedom for all.
          </div>
        </div>
        <div class="mb-6">
          <div class="text-xl font-semibold text-neutral-900 mb-2">
            Our Values
          </div>
          <ul class="list-disc pl-6 text-neutral-600">
            <li>Transparency</li>
            <li>Security</li>
            <li>Accessibility</li>
            <li>Growth</li>
            <li>Community</li>
          </ul>
        </div>
        <div class="mb-6">
          <div class="text-xl font-semibold text-neutral-900 mb-2">
            Contact Us
          </div>
          <div class="text-neutral-600">
            Email:{" "}
            <a
              href="mailto:support@agroinvest.com"
              class="text-brand-700 underline"
            >
              support@agroinvest.com
            </a>
            <br />
            Phone:{" "}
            <a href="tel:+2348000000000" class="text-brand-700 underline">
              +234 800 000 0000
            </a>
          </div>
        </div>
        <div class="text-xs text-neutral-400 mt-8 text-center">
          &copy; {new Date().getFullYear()} AgroInvest. All rights reserved.
        </div>
      </div>
    </div>
  );
};
