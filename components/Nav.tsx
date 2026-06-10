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

function linkClasses(active: boolean): string {
  return (
    "rounded-md px-2 py-1.5 text-sm transition-colors hover:text-[var(--color-accent)] sm:px-3 " +
    (active ? "text-[var(--color-accent)] font-medium" : "text-[var(--color-text-muted)]")
  );
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
        {/* Scrollable below lg; visible overflow at lg+ so the dropdown is not
            clipped by the scroll container. Below lg the parent link reaches a
            landing page that lists the same children. */}
        <nav aria-label="Primary" className="-mx-2 flex-1 overflow-x-auto px-2 lg:overflow-visible">
          <ul className="flex items-center gap-1 sm:gap-2">
            {primaryNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href} className="group relative shrink-0">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={linkClasses(active)}
                  >
                    {item.label}
                    {item.children ? (
                      <span aria-hidden="true" className="hidden lg:inline">
                        {" "}
                        &#x25BE;
                      </span>
                    ) : null}
                  </Link>
                  {item.children ? (
                    <ul className="absolute left-0 top-full z-50 hidden min-w-56 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] py-1 shadow-lg lg:group-focus-within:block lg:group-hover:block">
                      {item.children.map((child) => {
                        const childActive = isActive(pathname, child.href);
                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              aria-current={childActive ? "page" : undefined}
                              className={
                                "block px-4 py-2 text-sm transition-colors hover:text-[var(--color-accent)] " +
                                (childActive
                                  ? "text-[var(--color-accent)] font-medium"
                                  : "text-[var(--color-text-muted)]")
                              }
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
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
