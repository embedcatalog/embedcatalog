import type { Metadata } from "next"
import Link from "next/link"

import { PremiumDialog } from "components/premium-dialog"
import { SubmitProjectPanel } from "components/submit-project-panel"
import { siteConfig } from "lib/site"

export const metadata: Metadata = {
  title: "Submit a project",
  description:
    "Get your project listed. Start free or go premium for $40 — promotion in articles, X posts and other platforms.",
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
      "Get your project listed. Start free or go premium for $40 — promotion in articles, X posts and other platforms.",
    url: "/submit",
  },
}

export default function SubmitPage() {
  return (
    <main className="site-container py-16">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Submit a project
          </h1>
          <p className="mt-3 max-w-md text-muted-foreground">
            Create your project and send it for review. Listing is free.
          </p>
        </div>

        <div className="mt-10">
          <SubmitProjectPanel />
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border p-8 text-center">
          <h2 className="text-lg font-semibold">Want more reach?</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Premium adds promotion in articles, X posts and other platforms.
          </p>
          <PremiumDialog />
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          By submitting, you agree to the{" "}
          <Link
            href="/submission-terms"
            className="font-medium text-foreground underline underline-offset-4 hover:no-underline"
          >
            Project Submission Terms
          </Link>
          .
        </p>
      </div>
    </main>
  )
}
