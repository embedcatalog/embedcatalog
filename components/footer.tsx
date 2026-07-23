import * as React from "react"
import Link from "next/link"

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

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Submit", href: "/submit" },
]

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/EmbedCatalog/embedcatalog",
    icon: GithubIcon,
  },
  { label: "Email", href: "mailto:aanthonymaxgithub@gmail.com", icon: MailIcon },
  { label: "X", href: "https://x.com/aanthonymax", icon: XIcon },
]

function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row">
          <div>
            <Link href="/" className="flex items-center font-semibold">
              <span>{siteConfig.name}</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              {siteConfig.slogan}
            </p>
          </div>

          <nav>
            <h3 className="text-sm font-medium">Pages</h3>
            <ul className="mt-3 space-y-2">
              {navLinks.map((link) => (
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
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
          <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {siteConfig.name} All rights
              reserved.
            </p>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy Notice
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms of Service
            </Link>
            <Link
              href="/submission-terms"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Submission Terms
            </Link>
          </div>
          <div className="flex items-center gap-1">
            {socialLinks.map((social) => {
              const isExternal = social.href.startsWith("http")
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer noopener" : undefined}
                  className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <social.icon className="size-4" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
