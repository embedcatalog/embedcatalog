import * as React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import {
  AppWindow,
  ArrowRight,
  ArrowUpRight,
  Link as LinkIcon,
  Monitor,
  Newspaper,
  PlusCircle,
  Server,
  Share2,
  Wrench,
} from "lucide-react"

import { Button } from "components/ui/button"
import { ProjectsView } from "components/projects-view"
import { type Project } from "components/projects-grid"
import projectsData from "data/projects.json"
import { siteConfig } from "lib/site"

const projects = projectsData as Project[]

export const metadata: Metadata = {
  title: "Promote your projects",
  description:
    "A place to promote your projects on social media. Get featured in articles, tweets and other platforms — submit once, no subscription.",
  keywords: [
    "promote project",
    "project promotion",
    "submit project",
    "twitter promotion",
    "projects directory",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: `Promote your projects | ${siteConfig.name}`,
    description:
      "A place to promote your projects on social media. Get featured in articles, tweets and other platforms — submit once, no subscription.",
    url: "/",
  },
}

function XIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
    </svg>
  )
}

function GithubIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.086 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.776.42-1.305.762-1.605-2.665-.303-5.466-1.334-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.873.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.624-5.48 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .32.216.694.825.576C20.565 22.296 24 17.797 24 12.5 24 5.87 18.627.5 12 .5z" />
    </svg>
  )
}

type Offering = {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  links?: { label: string; href: string }[]
}

const projectTypes = [
  { icon: GithubIcon, label: "Open source" },
  { icon: Server, label: "Service" },
  { icon: Wrench, label: "Developer tool" },
  { icon: AppWindow, label: "Web app" },
  { icon: LinkIcon, label: "Package" },
  { icon: Monitor, label: "Other technical" },
]

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
    icon: PlusCircle,
    title: "Listed on the platform",
    description:
      "Your project is added to the directory so people can discover it any time.",
  },
]

export default function Page() {
  return (
    <main>
      <section className="border-b">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="mb-4 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
            Get discovered.
          </span>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            A place to promote your projects
          </h1>
          <p className="mt-4 max-w-xl text-lg text-pretty text-muted-foreground">
            Share them on social media with the help of our platform.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/submit">
                Submit a project
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/projects">Browse projects</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="projects" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
          <p className="mt-1 text-muted-foreground">
            List of interesting projects.
          </p>
        </div>
        <ProjectsView projects={projects} showFilters={false} />
      </section>

      <section className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              What we offer
            </h2>
            <p className="mt-2 text-muted-foreground">
              Everything you need to get your project in front of people.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {offerings.map((offer) => (
              <div
                key={offer.title}
                className="rounded-xl border bg-card p-6 transition-colors hover:border-foreground/20"
              >
                <span className="flex size-11 items-center justify-center rounded-lg border text-primary">
                  <offer.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-medium">{offer.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {offer.description}
                </p>
                {offer.links && (
                  <ul className="mt-4 flex flex-col gap-2">
                    {offer.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="group flex items-start gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:underline"
                        >
                          <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Which project fits?
            </h2>
            <p className="mt-3 text-lg text-pretty text-muted-foreground">
              Whether you have a technical product, a service, a developer tool,
              an app, or something else — if you&apos;re proud of it, it fits
              right in.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {projectTypes.map((type) => (
              <div
                key={type.label}
                className="flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center transition-colors hover:border-foreground/20"
              >
                <span className="flex size-11 items-center justify-center rounded-lg border text-primary">
                  <type.icon className="size-5" />
                </span>
                <span className="text-sm font-medium">{type.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Reviews
            </h2>
            <p className="mt-2 text-muted-foreground">
              What people say about promoting their projects with us.
            </p>
          </div>
          <div className="mx-auto max-w-md">
            <div className="rounded-xl border border-dashed bg-card p-8 text-center">
              <p className="font-medium">No reviews yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Be the first to share your experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            Submit your project, pay once
          </h2>
          <p className="mt-3 text-lg text-pretty text-muted-foreground">
            No subscription, no hidden fees. A single one-time payment and your
            project is in the works.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/submit">
                Submit
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
