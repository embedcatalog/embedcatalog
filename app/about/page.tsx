import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { Button } from "components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table"
import { siteConfig } from "lib/site"

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about EmbedCatalog — a free project catalog with practical embeds for READMEs and websites.",
  keywords: [
    "about",
    "embedcatalog",
    "project catalog",
    "embeds",
    "open source",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About | ${siteConfig.name}`,
    description:
      "Learn about EmbedCatalog — a free project catalog with practical embeds for READMEs and websites.",
    url: "/about",
  },
}

const suitableProjects = [
  "Open source",
  "Service",
  "Developer tool",
  "Web app",
  "Package",
  "Other technical",
]

const embeds = [
  {
    name: "License",
    plan: "Free",
    kind: "license",
    width: 160,
    height: 28,
  },
  {
    name: "Added to",
    plan: "Free",
    kind: "added",
    width: 200,
    height: 28,
  },
  {
    name: "Organization",
    plan: "Premium",
    kind: "organization",
    width: 200,
    height: 48,
  },
]

const techStack = ["Next.js v16 (App Router)", "Tailwind v4", "ShadCN"]

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">About</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            {siteConfig.name} is a free project catalog where you can add yours
            and get access to interesting and practical embeds.
          </p>
        </div>
        <Image
          src="/images/logo.png"
          alt={siteConfig.name}
          width={160}
          height={160}
          className="size-28 shrink-0 object-contain sm:size-36"
        />
      </div>

      <div className="mt-10 flex flex-col gap-10">
        <section>
          <h2 className="text-lg font-semibold">Briefly about the idea</h2>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            While developing open source projects, one day I came up with the
            idea of making a website for practical pictures for projects, since
            I wanted to somehow highlight my project rather than adding default
            ones. I don&apos;t want to copy others, so I made a catalog where
            each project will have a relatively unique embed.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">How it works</h2>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            List your project in the catalog, then copy embed badges for your
            README or website. Free embeds are available to every listed
            project. Premium unlocks exclusive badges and promotion across
            articles, X posts, and other channels.
          </p>
          <ol className="text-muted-foreground mt-4 list-decimal space-y-2 pl-5 leading-relaxed">
            <li>Submit your project with a title, tags, description, and URL.</li>
            <li>Get listed in the catalog so people can discover you.</li>
            <li>Copy embeds from your project page and drop them into your docs.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Embeds</h2>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            The platform currently has the following list of embeds:
          </p>
          <div className="mt-4 rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Embed</TableHead>
                  <TableHead>Light</TableHead>
                  <TableHead>Dark</TableHead>
                  <TableHead>Plan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {embeds.map((embed) => {
                  const lightSrc = `https://embedcatalog.com/embed/hmpl/${embed.kind}.png`
                  const darkSrc = `https://embedcatalog.com/embed/hmpl/${embed.kind}.theme-dark.png`
                  return (
                    <TableRow key={embed.name}>
                      <TableCell className="font-medium">{embed.name}</TableCell>
                      <TableCell>
                        <Link
                          href="/projects/hmpl"
                          className="inline-flex transition-opacity hover:opacity-80"
                        >
                          <Image
                            src={lightSrc}
                            alt={`${embed.name} light`}
                            width={embed.width}
                            height={embed.height}
                            unoptimized
                            className="w-auto"
                            style={{ height: embed.height }}
                          />
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          href="/projects/hmpl"
                          className="inline-flex transition-opacity hover:opacity-80"
                        >
                          <Image
                            src={darkSrc}
                            alt={`${embed.name} dark`}
                            width={embed.width}
                            height={embed.height}
                            unoptimized
                            className="w-auto"
                            style={{ height: embed.height }}
                          />
                        </Link>
                      </TableCell>
                      <TableCell>{embed.plan}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold">What projects are suitable?</h2>
          <ul className="text-muted-foreground mt-3 list-disc space-y-1 pl-5 leading-relaxed">
            {suitableProjects.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Commercial ones are also taken into work.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">About premium</h2>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            Essentially, we are not focused on creating an audience on the
            platform, although this is also important. The idea is to work on a
            project periodically, like an ant working on its visibility. The
            platform accepts a certain number of premium projects per month, and
            the project team will simply add them to relevant articles and create
            content about them on other platforms. For example, tweets, etc.
          </p>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            This flow allows us to work on projects as efficiently as possible.
            Also, if we move on to the next month, the number of projects will
            allow us to work on previous months&apos; projects.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">
            Is there a report on the work done?
          </h2>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            Yes, of course they will.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Who is behind this</h2>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            EmbedCatalog is built and maintained by{" "}
            <a
              href="https://x.com/aanthonymax"
              target="_blank"
              rel="noreferrer noopener"
              className="text-foreground font-medium underline underline-offset-4"
            >
              Anthony Max
            </a>
            . The full source is open on{" "}
            <a
              href="https://github.com/EmbedCatalog/embedcatalog"
              target="_blank"
              rel="noreferrer noopener"
              className="text-foreground font-medium underline underline-offset-4"
            >
              GitHub
            </a>{" "}
            under the AGPL-3.0 license.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Tech stack</h2>
          <ul className="text-muted-foreground mt-3 list-disc space-y-1 pl-5 leading-relaxed">
            {techStack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Contribution</h2>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            The platform is open to your ideas and code! Thanks to everyone who
            helps make it better.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">License</h2>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            Source code released under the AGPL-3.0 license. The application code
            is completely open source.
          </p>
        </section>

        <section className="rounded-xl border p-5">
          <h2 className="text-lg font-semibold">Ready to list your project?</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Start free or go Premium for embeds and promotion.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/submit">Submit a project</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Browse projects</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  )
}
