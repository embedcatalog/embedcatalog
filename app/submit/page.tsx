import * as React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowUpRight,
  Check,
  Code2,
  Newspaper,
  PlusCircle,
  Share2,
} from "lucide-react"

import { CopyBlock } from "components/copy-block"
import { Button } from "components/ui/button"
import { cn } from "lib/utils"
import { siteConfig } from "lib/site"

const EMAIL = "aanthonymaxgithub@gmail.com"
const TWITTER_HANDLE = "aanthonymax"
const TWITTER_URL = "https://x.com/aanthonymax"

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

type Plan = {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  highlighted?: boolean
}

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get listed in the catalog so people can find your project.",
    features: ["Listed on the platform", "Discoverable in the catalog"],
  },
  {
    name: "Premium",
    price: "$40",
    period: "one-time",
    description: "Full promotion through articles, X, and other platforms.",
    features: [
      "Everything in Free",
      "Featured in curated articles",
      "Promotion in X (Twitter) posts",
      "Promotion on other platforms",
      "Premium embeds",
    ],
    highlighted: true,
  },
]

type Offering = {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  links?: { label: string; href: string }[]
}

const offerings: Offering[] = [
  {
    icon: Newspaper,
    title: "Featured in articles",
    description:
      "Your project gets collected and highlighted in curated articles on the platform.",
    links: [
      {
        label: "12 Open Source Gems To Become The Ultimate Developer",
        href: "https://dev.to/anthonymax/12-open-source-gems-to-become-the-ultimate-developer-8cc",
      },
      {
        label: "9 Open Source Gems To Become The Ultimate Developer",
        href: "https://dev.to/anthonymax/9-open-source-gems-to-become-the-ultimate-developer-2pnb",
      },
    ],
  },
  {
    icon: XIcon,
    title: "Promotion in X posts",
    description:
      "We promote your project through posts on X (Twitter) to reach a wider audience.",
  },
  {
    icon: Share2,
    title: "Promotion on other platforms",
    description:
      "Your project is shared in other relevant channels and communities (Medium, daily.dev, etc).",
  },
  {
    icon: Code2,
    title: "Premium embeds",
    description:
      "Get exclusive embed badges for your README and website — organization, created date, and more.",
  },
  {
    icon: PlusCircle,
    title: "Listed on the platform",
    description:
      "Your project is added to the catalog so people can discover it any time.",
  },
]

export default function SubmitPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Submit a project
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Pick a plan and reach out by email or on X to get your project listed.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "flex flex-col rounded-xl border p-6",
              plan.highlighted &&
                "border-foreground/30 ring-1 ring-foreground/10"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {plan.highlighted && (
                  <span className="flex size-9 items-center justify-center rounded-lg border text-primary">
                    <PaypalIcon className="size-4" />
                  </span>
                )}
                <h2 className="font-medium">{plan.name}</h2>
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-4xl font-semibold tracking-tight">
                {plan.price}
              </span>
              <span className="text-sm text-muted-foreground">
                {plan.period}
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {plan.description}
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              asChild
              className="mt-6"
              variant={plan.highlighted ? "default" : "outline"}
            >
              <a href="#get-started">Get started</a>
            </Button>
          </div>
        ))}
      </div>

      <section className="mt-16">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            What we offer
          </h2>
          <p className="mt-2 text-muted-foreground">
            Everything you need to get your project in front of people.
          </p>
        </div>
        <ul className="mt-8 divide-y rounded-xl border">
          {offerings.map((offer) => (
            <li
              key={offer.title}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 p-4"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border text-primary">
                <offer.icon className="size-4" />
              </span>
              <span className="font-medium">{offer.title}</span>
              <span className="min-w-0 flex-1 text-sm text-muted-foreground">
                {offer.description}
              </span>
              {offer.links && (
                <span className="flex w-full flex-wrap gap-x-4 gap-y-1 pl-12 sm:w-auto sm:pl-0">
                  {offer.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group inline-flex items-center gap-1 text-xs font-medium text-foreground underline-offset-4 hover:underline"
                    >
                      <ArrowUpRight className="size-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
                      {link.label}
                    </a>
                  ))}
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 rounded-xl border p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Paid projects added</span>
          <span className="text-muted-foreground tabular-nums">0 of 15</span>
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
          In July 2026, due to the volume of work, we&rsquo;ll be able to add
          the first fifteen paid projects.
        </p>
      </div>

      <div
        id="get-started"
        className="mt-8 scroll-mt-20 rounded-xl border p-5 text-left"
      >
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

      <div id="contact" className="mt-10 flex scroll-mt-20 flex-col gap-3">
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
