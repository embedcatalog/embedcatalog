import * as React from "react"
import Link from "next/link"

import { NewsletterSubscription } from "components/newsletter-subscription"
import { siteConfig } from "lib/site"

function GithubIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.086 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.776.42-1.305.762-1.605-2.665-.303-5.466-1.334-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.873.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.624-5.48 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .32.216.694.825.576C20.565 22.296 24 17.797 24 12.5 24 5.87 18.627.5 12 .5z" />
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

function DiscordIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19.738 5.034a18.27 18.27 0 0 0-4.493-1.39.068.068 0 0 0-.072.034c-.194.344-.41.793-.56 1.148a16.9 16.9 0 0 0-5.226 0 11.6 11.6 0 0 0-.568-1.148.07.07 0 0 0-.072-.034 18.22 18.22 0 0 0-4.493 1.39.064.064 0 0 0-.03.025C1.365 9.23.58 13.296.973 17.312c.002.02.013.038.03.05a18.4 18.4 0 0 0 5.51 2.78.07.07 0 0 0 .076-.025c.424-.58.802-1.192 1.127-1.832a.068.068 0 0 0-.037-.095 12.1 12.1 0 0 1-1.72-.82.069.069 0 0 1-.007-.115c.116-.087.232-.177.342-.268a.066.066 0 0 1 .069-.01c3.61 1.65 7.52 1.65 11.087 0a.066.066 0 0 1 .07.01c.11.091.226.181.343.268a.069.069 0 0 1-.006.115c-.55.324-1.128.598-1.722.82a.068.068 0 0 0-.036.096c.331.64.709 1.25 1.126 1.83a.068.068 0 0 0 .076.026 18.34 18.34 0 0 0 5.52-2.78.068.068 0 0 0 .03-.049c.47-4.64-.786-8.67-3.32-12.25a.054.054 0 0 0-.03-.024ZM8.02 14.85c-1.087 0-1.984-.998-1.984-2.224 0-1.226.88-2.224 1.984-2.224 1.112 0 2 .998 1.983 2.224 0 1.226-.88 2.224-1.983 2.224Zm7.96 0c-1.087 0-1.983-.998-1.983-2.224 0-1.226.88-2.224 1.983-2.224 1.112 0 2 .998 1.984 2.224 0 1.226-.872 2.224-1.984 2.224Z" />
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

const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "Projects", href: "/" },
      { label: "Browse embeds", href: "/embeds" },
      { label: "Top creators", href: "/top-creators" },
      { label: "Hacktoberfest 2026", href: "/hacktoberfest-2026" },
    ],
  },
  {
    title: "Create",
    links: [
      { label: "Submit a project", href: "/submit" },
      { label: "Create a project", href: "/account/create-project" },
      { label: "Create a custom embed", href: "/account/create-embed" },
    ],
  },
  {
    title: "Information",
    links: [{ label: "About EmbedCatalog", href: "/about" }],
  },
]

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/EmbedCatalog/embedcatalog",
    icon: GithubIcon,
  },
  {
    label: "Discord",
    href: "https://discord.gg/KFunMep36n",
    icon: DiscordIcon,
  },
  {
    label: "Email",
    href: "mailto:aanthonymaxgithub@gmail.com",
    icon: MailIcon,
  },
  { label: "X", href: "https://x.com/aanthonymax", icon: XIcon },
]

function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="site-container py-12">
        <div className="grid gap-10 border-b pb-10 sm:grid-cols-2 lg:grid-cols-[minmax(18rem,1.6fr)_repeat(3,minmax(0,1fr))]">
          <div className="max-w-md">
            <Link href="/" className="flex items-center font-semibold">
              <span>{siteConfig.name}</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              {siteConfig.slogan}
            </p>
            <div className="mt-5 flex items-center gap-1">
              {socialLinks.map((social) => {
                const isExternal = social.href.startsWith("http")
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    title={social.label}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noreferrer noopener" : undefined}
                    className="flex size-9 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-accent hover:text-accent-foreground"
                  >
                    <social.icon className="size-4" />
                  </a>
                )
              })}
            </div>
            <NewsletterSubscription
              variant="footer"
              description={null}
              subscriberCount={false}
              className="mt-5 max-w-sm"
            />
          </div>

          {footerGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h3 className="text-sm font-medium">{group.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-center text-sm text-muted-foreground sm:text-left">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 sm:justify-end">
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="/submission-terms"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Submission terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
