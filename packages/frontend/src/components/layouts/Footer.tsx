import Reblend, { FC } from "reblendjs";
import { Docker } from "./Docker";

export type FooterProps = {
  isMobile?: boolean;
};

export const Footer: FC<FooterProps> = ({ isMobile }) => {
  return isMobile ? (
    <Docker />
  ) : (
    <footer class="w-full bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 shadow-sm px-6 py-4 flex flex-row items-center justify-between transition-colors duration-300">
      {/* Left: Brand/Logo */}
      <div class="flex items-center gap-2">
        <img
          src="/logo192.png"
          alt="Brand Logo"
          class="h-8 w-8 rounded-full shadow"
        />
        <span class="text-lg font-semibold text-brand-700 dark:text-brand-200 tracking-tight">
          AgroInvest
        </span>
      </div>
      {/* Center: Copyright */}
      <div class="text-sm text-neutral-500 dark:text-neutral-400">
        © {new Date().getFullYear()} AgroInvest. All rights reserved.
      </div>
      {/* Right: Socials/Links */}
      <div class="flex items-center gap-4">
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-brand-500 transition-colors"
          aria-label="Twitter"
        >
          <i class="fab fa-twitter text-xl"></i>
        </a>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-brand-500 transition-colors"
          aria-label="Facebook"
        >
          <i class="fab fa-facebook text-xl"></i>
        </a>
        <a
          href="mailto:info@agroinvest.com"
          class="hover:text-brand-500 transition-colors"
          aria-label="Email"
        >
          <i class="fas fa-envelope text-xl"></i>
        </a>
      </div>
    </footer>
  );
};
