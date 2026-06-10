import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site-config";
import { PageHero } from "./primitives";

const description =
  "Two open-source, full-stack test automation platforms built in public: one in Python, one in TypeScript, both driving Playwright across UI, REST API, and MongoDB layers with the same phased engineering approach.";

export const metadata: Metadata = {
  title: "Test Automation Reference Implementations",
  description,
  alternates: { canonical: "/reference-implementations" },
  openGraph: {
    type: "website",
    title: `Test Automation Reference Implementations — ${site.name}`,
    description,
    url: `${site.url}/reference-implementations`,
    images: [{ url: "/og/default.png", width: 1200, height: 630, alt: site.name }],
  },
};

const implementations = [
  {
    href: "/reference-implementations/python-playwright",
    name: "Python Playwright",
    stack: "Python 3.14, PDM, Pydantic, httpx, pymongo, pytest, Allure",
    status: "Complete: UI, API, and database layers with a full-stack scenario",
    blurb:
      "A beginner-friendly, end-to-end guide: page objects across a host-aware browser matrix, a typed REST client with schema assertions, MongoDB seeding and state verification, and one scenario that chains all three layers.",
  },
  {
    href: "/reference-implementations/typescript-playwright",
    name: "TypeScript Playwright",
    stack: "TypeScript, Node 24, pnpm, Zod, @playwright/test, Vitest, Allure",
    status: "UI layer shipped; API and database layers in progress",
    blurb:
      "The same platform rebuilt natively in TypeScript: strict-mode compiler, Zod-validated configuration, host-aware browser installation, and Playwright Test's built-in failure artifacts.",
  },
] as const;

export default function ReferenceImplementationsPage() {
  return (
    <main id="main" className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <PageHero
        eyebrow="Reference implementations"
        title="Test Automation Reference Implementations"
        intro={
          <>
            Two mirrored, open-source test automation platforms built in public with the same phased
            engineering approach: quality gates first, then UI testing, then REST API testing, then
            database state verification — finished with a full-stack scenario that chains all three
            layers. Pick the language your team works in; the concepts transfer one-to-one.
          </>
        }
      />

      <ul className="mt-12 grid gap-6 sm:grid-cols-2">
        {implementations.map((impl) => (
          <li
            key={impl.href}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm"
          >
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text)]">
              <Link href={impl.href} className="hover:text-[var(--color-accent)]">
                {impl.name}
              </Link>
            </h2>
            <p className="mt-2 font-mono text-xs text-[var(--color-text-subtle)]">{impl.stack}</p>
            <p className="mt-3 text-sm font-medium text-[var(--color-accent)]">{impl.status}</p>
            <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">{impl.blurb}</p>
            <p className="mt-5">
              <Link
                href={impl.href}
                className="text-sm font-medium text-[var(--color-accent)] underline underline-offset-2 hover:no-underline"
              >
                Read the guide
              </Link>
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
