import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { Link001 } from "@/components/ui/skiper-ui/skiper40";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { name: "Search profiles", href: "/search" },
      { name: "Dashboard", href: "/dashboard" },
      { name: "Settings", href: "/settings" },
    ],
  },
  {
    title: "Platforms",
    links: [
      { name: "LeetCode", href: "https://leetcode.com", external: true },
      { name: "Codeforces", href: "https://codeforces.com", external: true },
      { name: "CodeChef", href: "https://codechef.com", external: true },
      { name: "AtCoder", href: "https://atcoder.jp", external: true },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="hairline-t">
      <div className="frame grid gap-12 py-16 md:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,1fr))]">
        <div>
          <Logo />
          <p className="mt-4 max-w-[30ch] text-body-sm text-ash">
            Unified competitive programming stats. An experimental project —
            figures are only as accurate as the platforms that publish them.
          </p>
        </div>

        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="eyebrow">{column.title}</p>
            <ul className="mt-5 flex flex-col gap-3 text-[13px]">
              {column.links.map((link) => (
                <li key={link.name}>
                  {"external" in link && link.external ? (
                    <Link001 href={link.href} className="text-ash hover:text-chalk">
                      {link.name}
                    </Link001>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-ash transition-colors hover:text-chalk"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="frame flex flex-col gap-3 py-6 text-[12px] text-smoke hairline-t sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} UNICC</p>
        <p>
          Built by{" "}
          <a
            href="https://github.com/LeveL-P1"
            target="_blank"
            rel="noreferrer"
            className="text-ash transition-colors hover:text-chalk"
          >
            Level-P1
          </a>
        </p>
      </div>
    </footer>
  );
}
