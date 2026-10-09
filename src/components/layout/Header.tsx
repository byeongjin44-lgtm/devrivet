import Link from "next/link";
import { NAV_LINKS, SITE_NAME } from "@/lib/site-config";

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-mono text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          {SITE_NAME}
        </Link>
        <nav aria-label="Tools" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
