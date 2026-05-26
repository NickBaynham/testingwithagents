import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What data the testingwithagents.com site collects, why, and how to opt out. Short and plain.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-accent)]">
        Privacy
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--color-text)] sm:text-5xl">
        What this site knows about you.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-text-muted)]">
        Short version: very little. {site.name} runs this site as a portfolio, not a product, and
        treats every visitor like a guest.
      </p>

      <section aria-labelledby="data-heading" className="mt-12 space-y-4">
        <h2
          id="data-heading"
          className="text-2xl font-semibold tracking-tight text-[var(--color-text)]"
        >
          Data this site collects
        </h2>
        <ul className="list-disc space-y-2 pl-6 text-[var(--color-text-muted)]">
          <li>
            <strong>Server access logs.</strong> AWS Amplify and CloudFront log standard request
            data: timestamp, requested path, IP address, user agent, response status. These logs are
            retained on AWS&rsquo;s default schedule and are used to diagnose deployment issues.
          </li>
          <li>
            <strong>Page-view counts.</strong> If privacy-respecting analytics (Plausible or
            similar) is configured, it records anonymous, aggregate page-view counts with no
            cookies, no cross-site tracking, and no fingerprinting. There is currently no
            third-party analytics enabled.
          </li>
          <li>
            <strong>localStorage.</strong> A single key (<code>theme</code>) is written if you pick
            a theme in the toggle. It stores one of <code>light</code>, <code>dark</code>, or{" "}
            <code>warm</code>. Clear it any time from your browser settings.
          </li>
        </ul>
      </section>

      <section aria-labelledby="not-data-heading" className="mt-10 space-y-4">
        <h2
          id="not-data-heading"
          className="text-2xl font-semibold tracking-tight text-[var(--color-text)]"
        >
          What this site does not do
        </h2>
        <ul className="list-disc space-y-2 pl-6 text-[var(--color-text-muted)]">
          <li>No third-party advertising or retargeting cookies.</li>
          <li>No cross-site tracking.</li>
          <li>No newsletter signup or contact form (no email is collected on-site).</li>
          <li>No user accounts.</li>
        </ul>
      </section>

      <section aria-labelledby="contact-heading" className="mt-10 space-y-4">
        <h2
          id="contact-heading"
          className="text-2xl font-semibold tracking-tight text-[var(--color-text)]"
        >
          Questions or removal requests
        </h2>
        <p className="text-[var(--color-text-muted)]">
          Reach out via{" "}
          <a
            href={site.social.linkedin}
            rel="me noopener"
            className="text-[var(--color-accent)] underline underline-offset-4 hover:text-[var(--color-accent-hover)]"
          >
            LinkedIn
          </a>
          . If you would like access logs scrubbed, include the IP range and rough timeframe and
          I&rsquo;ll request removal from the upstream provider.
        </p>
        <p className="text-sm text-[var(--color-text-subtle)]">
          More on the project itself on the{" "}
          <Link
            href="/about/"
            className="text-[var(--color-accent)] underline underline-offset-4 hover:text-[var(--color-accent-hover)]"
          >
            About page
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
