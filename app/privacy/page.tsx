import type { Metadata } from "next"

import { siteConfig } from "lib/site"

export const metadata: Metadata = {
  title: "Privacy Notice",
  description:
    "How EmbedCatalog collects, uses, stores, and shares personal data.",
  keywords: ["privacy", "privacy notice", "data protection", "personal data"],
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: `Privacy Notice | ${siteConfig.name}`,
    description: "How EmbedCatalog processes personal data.",
    url: "/privacy",
  },
}

export default function PrivacyPage() {
  return (
    <main className="site-container py-10">
      <h1 className="text-2xl font-semibold">Privacy Notice</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: September 19, 2026
      </p>
      <div className="mt-6 flex flex-col gap-8 leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            1. Who is responsible for your data?
          </h2>
          <p className="mt-2">
            EmbedCatalog is operated by Anton Maklakov, an individual operator
            based in Kazakhstan. For privacy questions, requests, or complaints,
            email{" "}
            <a
              className="text-foreground underline underline-offset-4"
              href="mailto:aanthonymaxgithub@gmail.com"
            >
              aanthonymaxgithub@gmail.com
            </a>
            .
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            2. Information we collect
          </h2>
          <p className="mt-2">
            Depending on how you use the service, we may process:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              Account information, such as your email address, user ID,
              authentication records, and account timestamps.
            </li>
            <li>
              Project information you submit, including a project name,
              description, URL, tags, social links, images, embed content,
              moderation comments, and publication status.
            </li>
            <li>
              Messages and support information you send to us by email or other
              contact channels.
            </li>
            <li>
              Technical information needed to provide and protect the service,
              such as device, browser, log, approximate location, and IP-related
              information processed by our providers.
            </li>
            <li>
              Analytics information, such as pages viewed, referral information,
              approximate location, device information, and interaction events,
              if Google Analytics is enabled and you consent where consent is
              required.
            </li>
          </ul>
          <p className="mt-2">
            Please do not submit passwords, payment-card details, government
            identifiers, or sensitive personal data in project fields or
            messages.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            3. Why we use information
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              To create and authenticate accounts, provide account features, and
              keep the service secure.
            </li>
            <li>
              To store, review, publish, display, and manage project submissions
              and embeds.
            </li>
            <li>
              To respond to requests, administer paid submissions, prevent
              abuse, and enforce our Terms.
            </li>
            <li>
              To understand service usage and improve the website through
              analytics where permitted.
            </li>
            <li>
              To comply with legal obligations and establish, exercise, or
              defend legal claims.
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            4. Legal bases
          </h2>
          <p className="mt-2">
            Where the GDPR or a similar law applies, we rely on contract or
            steps requested before contract for accounts and submissions,
            legitimate interests for security and service administration,
            consent for non-essential analytics, and legal obligations where
            applicable. You may withdraw consent at any time; withdrawal does
            not affect earlier processing.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            5. Service providers and public content
          </h2>
          <p className="mt-2">
            We use Supabase for authentication, database hosting, and related
            infrastructure. Supabase may process account and project data on our
            behalf. We may use Google Analytics for measurement if it is
            enabled. Google and Supabase process data under their own terms and
            privacy documentation. We may also use hosting, email, payment,
            security, and legal providers as needed to operate the service.
          </p>
          <p className="mt-2">
            Published project information, project URLs, social links, embeds,
            and other content selected for publication are public and may be
            indexed, copied, cached, or displayed by third parties. Do not
            submit information you want to keep private.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            6. Cookies, analytics, and external links
          </h2>
          <p className="mt-2">
            The service may use essential cookies or local storage for
            authentication, security, preferences, and basic operation. If
            Google Analytics or another non-essential tracker is used, we will
            request consent where required and provide a way to refuse or
            withdraw it. External websites, including project websites and
            social networks, have their own privacy practices and are not
            controlled by us.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            7. Retention and security
          </h2>
          <p className="mt-2">
            We retain account data while your account is active and for a
            reasonable period afterward where needed for security, legal,
            accounting, dispute, or backup purposes. Published content may
            remain in backups or third-party caches for a limited period after
            removal. We use reasonable technical and organizational measures,
            but no internet service can guarantee absolute security.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            8. Your rights
          </h2>
          <p className="mt-2">
            Subject to applicable law, you may request access to, correction or
            deletion of, restriction of, or portability of your personal data,
            and you may object to processing or withdraw consent. You may also
            complain to the data-protection authority in your country. Contact
            us at the email above; we may need to verify your identity and will
            respond within the period required by law.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            9. International transfers and children
          </h2>
          <p className="mt-2">
            Our providers may process information in countries other than
            Kazakhstan or your home country. We use contractual or other
            safeguards where required by applicable law. The service is not
            directed to children under 13, or the higher minimum age required
            where you live. If you believe a child provided personal data,
            contact us.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">10. Changes</h2>
          <p className="mt-2">
            We may update this Notice when the service or applicable
            requirements change. The revised version will be posted on this page
            with a new update date.
          </p>
        </section>
      </div>
    </main>
  )
}
