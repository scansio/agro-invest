import Reblend, { FC } from "reblendjs";

export const Policy: FC = () => {
  return (
    <div class="flex flex-col items-center">
      <div class="text-3xl font-bold mb-2">Policies & Terms</div>
      <div class="text-lg text-neutral-700 mb-6 text-center">
        Please read our policies, terms, and conditions carefully. By using
        AgroInvest, you agree to abide by these terms and our privacy practices.
      </div>
      <div class="w-full">
        <div class="mb-8">
          <div class="text-xl font-semibold text-neutral-900 mb-2">
            Privacy Policy
          </div>
          <div class="text-neutral-600 text-base">
            We respect your privacy and are committed to protecting your
            personal information. We only collect data necessary to provide our
            services and never share your information with third parties without
            your consent. For more details, please review our full privacy
            policy.
          </div>
        </div>
        <div class="mb-8">
          <div class="text-xl font-semibold text-neutral-900 mb-2">
            Terms of Service
          </div>
          <div class="text-neutral-600 text-base">
            By using AgroInvest, you agree to use the platform for lawful
            purposes only. You are responsible for maintaining the
            confidentiality of your account. We reserve the right to suspend or
            terminate accounts that violate our terms. Please review our full
            terms of service for more information.
          </div>
        </div>
        <div class="mb-8">
          <div class="text-xl font-semibold text-neutral-900 mb-2">
            User Responsibilities
          </div>
          <ul class="list-disc pl-6 text-neutral-600">
            <li>
              Provide accurate and up-to-date information during registration
              and transactions.
            </li>
            <li>Keep your login credentials secure and confidential.</li>
            <li>
              Use the platform in compliance with all applicable laws and
              regulations.
            </li>
            <li>
              Report any suspicious activity or unauthorized access immediately.
            </li>
          </ul>
        </div>
        <div class="mb-8">
          <div class="text-xl font-semibold text-neutral-900 mb-2">
            Risk Disclosure
          </div>
          <div class="text-neutral-600 text-base">
            All investments carry risk. Past performance is not indicative of
            future results. Please invest responsibly and seek professional
            advice if needed. AgroInvest is not liable for any losses incurred
            through the use of our platform.
          </div>
        </div>
        <div class="mb-8">
          <div class="text-xl font-semibold text-neutral-900 mb-2">
            Contact & Support
          </div>
          <div class="text-neutral-600 text-base">
            If you have any questions about our policies or need support, please
            contact us at{" "}
            <a
              href="mailto:support@agroinvest.com"
              class="text-brand-700 underline"
            >
              support@agroinvest.com
            </a>
            .
          </div>
        </div>
        <div class="text-xs text-neutral-400 mt-8 text-center">
          &copy; {new Date().getFullYear()} AgroInvest. All rights reserved.
        </div>
      </div>
    </div>
  );
};
