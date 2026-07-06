import * as React from "react"
import type { Metadata } from "next"
import Link from "next/link"

import { CopyBlock } from "components/copy-block"
import { siteConfig } from "lib/site"

const EMAIL = "aanthonymaxgithub@gmail.com"
const TWITTER_HANDLE = "aanthonymax"
const TWITTER_URL = "https://x.com/aanthonymax"

export const metadata: Metadata = {
  title: "Submit a project",
  description:
    "Get your project listed. Reach out by email or on X — the listing fee is $40 via PayPal.",
  keywords: [
    "submit project",
    "list project",
    "add project",
    "project listing",
  ],
  alternates: { canonical: "/submit" },
  openGraph: {
    title: `Submit a project | ${siteConfig.name}`,
    description:
      "Get your project listed. Reach out by email or on X — the listing fee is $40 via PayPal.",
    url: "/submit",
  },
}

function PaypalIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.048.288-.076.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
    </svg>
  )
}

function MailIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function XIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
    </svg>
  )
}

export default function SubmitPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="flex flex-col items-center text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl border text-primary">
          <PaypalIcon className="size-8" />
        </span>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          Submit a project
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Reach out by email or on X to get your project listed. The listing fee
          is{" "}
          <span className="font-semibold text-foreground">$40 via PayPal</span>.
        </p>
      </div>

      <div className="mt-8 rounded-xl border p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Projects added</span>
          <span className="tabular-nums text-muted-foreground">0 of 15</span>
        </div>
        <div
          className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={0}
          aria-valuemin={0}
          aria-valuemax={15}
        >
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: "0%" }}
          />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          In July 2026, due to the volume of work, we&rsquo;ll be able to add the
          first fifteen projects.
        </p>
      </div>

      <div className="mt-8 rounded-xl border p-5 text-left">
        <p className="text-sm font-medium">In your message, please include</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Prepare an object with a title, tags, a short description, and a URL.
          The project details page and images will be discussed with you
          (usually prepared by the website owner). Optionally, you can add links
          to social media: Twitter, YouTube, and GitHub.
        </p>
        <CopyBlock
          className="mt-3"
          code={`{
  title: "My awesome project",
  tags: ["design", "frontend"],
  short_description: "A short summary of what it does.",
  url: "https://example.com/my-awesome-project",
  socials?: {
    "twitter": "https://x.com/username",
    "youtube": "https://youtube.com/@channel",
    "github": "https://github.com/user/repo"
  }
}`}
        />
      </div>

      <div className="mt-10 flex flex-col gap-3">
        <a
          href={`mailto:${EMAIL}`}
          className="flex items-center gap-4 rounded-xl border p-4 transition-colors hover:bg-accent"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border text-muted-foreground">
            <MailIcon className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-medium">Email</span>
            <span className="block truncate text-sm text-muted-foreground">
              {EMAIL}
            </span>
          </span>
        </a>

        <a
          href={TWITTER_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center gap-4 rounded-xl border p-4 transition-colors hover:bg-accent"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border text-muted-foreground">
            <XIcon className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-medium">DM on X (Twitter)</span>
            <span className="block truncate text-sm text-muted-foreground">
              @{TWITTER_HANDLE}
            </span>
          </span>
        </a>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        By submitting, you agree to the{" "}
        <Link
          href="/submission-terms"
          className="font-medium text-foreground underline underline-offset-4"
        >
          Project Submission Terms
        </Link>
        .
      </p>
    </main>
  )
}
