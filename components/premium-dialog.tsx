"use client"

import * as React from "react"
import { ArrowUpRight, Check, Code2, Newspaper, Share2, X } from "lucide-react"

import { Button } from "components/ui/button"

const EMAIL = "aanthonymaxgithub@gmail.com"
const TWITTER_HANDLE = "aanthonymax"
const TWITTER_URL = "https://x.com/aanthonymax"

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

const features = [
  "Everything in Free",
  "Featured in curated articles",
  "Promotion in X (Twitter) posts",
  "Promotion on other platforms",
  "Premium embeds",
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
]

function PremiumDialog() {
  const dialogRef = React.useRef<HTMLDialogElement>(null)

  return (
    <>
      <Button size="lg" onClick={() => dialogRef.current?.showModal()}>
        Learn about Premium
      </Button>

      <dialog
        ref={dialogRef}
        aria-labelledby="premium-dialog-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close()
        }}
        className="m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-xl border bg-background p-0 text-left text-foreground backdrop:bg-black/50"
      >
        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="premium-dialog-title"
                className="text-xl font-semibold tracking-tight"
              >
                Premium
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Full promotion through articles, X, and other platforms.
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Close"
              onClick={() => dialogRef.current?.close()}
            >
              <X />
            </Button>
          </div>

          <div className="rounded-xl border border-foreground/30 p-5 ring-1 ring-foreground/10">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg border text-primary">
                <PaypalIcon className="size-4" />
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-semibold tracking-tight">
                  $40
                </span>
                <span className="text-sm text-muted-foreground">one-time</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Payment is made via PayPal after we agree on the details.
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <ul className="divide-y rounded-xl border">
            {offerings.map((offer) => (
              <li key={offer.title} className="flex items-start gap-3 p-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border text-primary">
                  <offer.icon className="size-4" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="font-medium">{offer.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {offer.description}
                  </span>
                  {offer.links && (
                    <span className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
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
                </div>
              </li>
            ))}
          </ul>

          <div className="rounded-xl border p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Paid projects added</span>
              <span className="text-muted-foreground tabular-nums">
                0 of 15
              </span>
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
              In October 2026, due to the volume of work, we&rsquo;ll be able to
              add the first fifteen paid projects.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Want premium? Contact us by email or on X.
            </p>
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
                <span className="block text-sm font-medium">
                  DM on X (Twitter)
                </span>
                <span className="block truncate text-sm text-muted-foreground">
                  @{TWITTER_HANDLE}
                </span>
              </span>
            </a>
          </div>
        </div>
      </dialog>
    </>
  )
}

export { PremiumDialog }
