import { Link } from "reblend-router";
import Reblend, { FC } from "reblendjs";

export type NavProps = {
  items: { label: string; href: string }[];
  className?: string;
};

export const Nav: FC<NavProps> = ({ items, className = "" }) => (
  <nav class={`flex gap-4 items-center ${className}`}>
    {items.map((item) => (
      <Link href={item.href} class="text-brand font-semibold hover:underline">
        {item.label}
      </Link>
    ))}
  </nav>
);
