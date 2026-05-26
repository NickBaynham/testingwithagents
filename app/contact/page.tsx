import type { Metadata } from "next";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach Nick Baynham about QA Automation, SDET, AI-Augmented QA, Test Automation Architect, and Quality Engineering roles.",
  alternates: { canonical: "/contact" },
};

const channels = [
  {
    label: "LinkedIn",
    detail: "linkedin.com/in/nickbaynham",
    href: site.social.linkedin,
    note: "Best for role inquiries, freelance, or speaking. DMs welcome from recruiters and hiring managers - please mention the role.",
  },
  {
    label: "GitHub",
    detail: "github.com/NickBaynham",
    href: site.social.github,
    note: "Where projects, experiments, and the source for this site live.",
  },
] as const;

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-accent)]">
        Contact
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--color-text)] sm:text-5xl">
        Let&rsquo;s talk.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-text-muted)]">
        The fastest way to reach me is LinkedIn. I prioritize messages from recruiters and hiring
        managers working on Senior QA Automation, SDET, AI-Augmented QA, Test Automation Architect,
        and Quality Engineering roles.
      </p>

      <ul className="mt-10 space-y-6">
        {channels.map((channel) => (
          <li
            key={channel.label}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-xl font-semibold tracking-tight text-[var(--color-text)]">
                {channel.label}
              </h2>
              <a
                href={channel.href}
                rel="me noopener"
                className="text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
              >
                {channel.detail}
              </a>
            </div>
            <p className="mt-2 text-[var(--color-text-muted)]">{channel.note}</p>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-[var(--color-text-subtle)]">
        A scheduling link is planned for Phase 6. Until then, please propose a couple of times by
        LinkedIn DM and I&rsquo;ll confirm.
      </p>
    </div>
  );
}
