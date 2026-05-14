"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav, site } from "@/lib/site-config";
import { ThemeToggle } from "./ThemeToggle";

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:gap-6 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="shrink-0 text-base font-semibold tracking-tight text-[var(--color-text)] hover:text-[var(--color-accent)]"
        >
          {site.name}
        </Link>
        <nav aria-label="Primary" className="-mx-2 flex-1 overflow-x-auto px-2">
          <ul className="flex items-center gap-1 sm:gap-2">
            {primaryNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href} className="shrink-0">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={
                      "rounded-md px-2 py-1.5 text-sm transition-colors hover:text-[var(--color-accent)] sm:px-3 " +
                      (active
                        ? "text-[var(--color-accent)] font-medium"
                        : "text-[var(--color-text-muted)]")
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
