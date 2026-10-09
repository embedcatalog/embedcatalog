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

export default function AboutPage() {
  return (
    <main className="site-container py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">About</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {siteConfig.name} is a free project catalog where you can add
              yours and get access to interesting and practical embeds.
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

        <Image
          src="/images/photo2.png"
          alt="EmbedCatalog interface"
          width={1200}
          height={700}
          className="mt-8 w-full rounded-xl border"
        />

        <div className="mt-10 flex flex-col gap-10">
          <section>
            <h2 className="text-lg font-semibold">Briefly about the idea</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              While developing open source projects, one day I came up with the
              idea of making a website for practical pictures for projects,
              since I wanted to somehow highlight my project rather than adding
              default ones. I don&apos;t want to copy others, so I made a
              catalog where each project will have a relatively unique embed.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Features</h2>
            <div className="mt-5 flex flex-col gap-6">
              <div>
                <h3 className="font-medium">Catalog & discovery</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  Each published project is presented as a card with relevant
                  images and project information. The platform also tracks views
                  and upvotes.
                </p>
                <ul className="mt-3 list-disc space-y-1 pl-5 leading-relaxed text-muted-foreground">
                  <li>Search by name, description, or tag.</li>
                  <li>Filter by New projects or Premium projects.</li>
                  <li>Filter by one or more tags.</li>
                  <li>Sort by newest, oldest, most upvoted, or most viewed.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium">Custom embeds</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  Every project can design its own custom embed with a title,
                  description, and light or dark theme from the account
                  dashboard. The ready HTML snippet can be copied into a README
                  or website.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Project pages</h3>
                <ul className="mt-3 list-disc space-y-1 pl-5 leading-relaxed text-muted-foreground">
                  <li>Image carousel for screenshots.</li>
                  <li>
                    Live GitHub stats for stars, forks, contributors, and
                    license.
                  </li>
                  <li>Tags and social links for X, YouTube, and GitHub.</li>
                  <li>GitHub-flavored Markdown info sections.</li>
                  <li>Generated Open Graph images for shared links.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium">
                  Upvotes, impressions & moderation
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  Signed-in users can upvote a project once, while page views
                  are tracked as impressions and batched client-side. New
                  submissions enter a moderation queue where admins can approve,
                  reject, mark Premium, or edit listings before they go live.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold">How it works</h2>
            <Image
              src="/images/photo3.gif"
              alt="Creating a project in EmbedCatalog"
              width={1200}
              height={700}
              unoptimized
              className="mt-4 w-full rounded-xl border"
            />
            <p className="mt-2 leading-relaxed text-muted-foreground">
              List your project in the catalog, then copy embed badges for your
              README or website. Free embeds are available to every listed
              project. Premium unlocks exclusive badges and promotion across
              articles, X posts, and other channels.
            </p>
            <ol className="mt-4 list-decimal space-y-2 pl-5 leading-relaxed text-muted-foreground">
              <li>
                Create an account and fill in information about your project.
              </li>
              <li>
                Optionally add social links and one or more embed variations.
              </li>
              <li>
                Send it for review with an optional note for the moderators.
              </li>
              <li>
                Once approved, your project is published and its embeds become
                available to copy.
              </li>
              <li>Track impressions and upvotes as people discover it.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Embeds</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
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
                        <TableCell className="font-medium">
                          {embed.name}
                        </TableCell>
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
            <h3 className="mt-6 font-medium">Custom embeds</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Projects can also create a custom embed with their own title and
              description. For example:
            </p>
            <Link
              href="/projects/is-kit"
              className="mt-4 inline-flex rounded-md border p-3 transition-opacity hover:opacity-80"
            >
              <Image
                src="https://embedcatalog.com/embed/is-kit/5037b265.png"
                alt="Custom is-kit embed"
                width={320}
                height={84}
                unoptimized
              />
            </Link>
          </section>

          <section>
            <h2 className="text-lg font-semibold">
              What projects are suitable?
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 leading-relaxed text-muted-foreground">
              {suitableProjects.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Commercial ones are also taken into work.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">About premium</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Essentially, we are not focused on creating an audience on the
              platform, although this is also important. The idea is to work on
              a project periodically, like an ant working on its visibility. The
              platform accepts a certain number of premium projects per month,
              and the project team will simply add them to relevant articles and
              create content about them on other platforms. For example, tweets,
              etc.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              This flow allows us to work on projects as efficiently as
              possible. Also, if we move on to the next month, the number of
              projects will allow us to work on previous months&apos; projects.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">FAQ</h2>
            <div className="mt-4 flex flex-col divide-y rounded-xl border">
              <details className="group p-4">
                <summary className="cursor-pointer font-medium">
                  Is listing a project free?
                </summary>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  Yes. Free listings get a project page, base embed badges, and
                  a custom embed. Premium is optional and adds promotion and
                  extra embeds.
                </p>
              </details>
              <details className="group p-4">
                <summary className="cursor-pointer font-medium">
                  What happens after I submit a project?
                </summary>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  It enters a moderation queue as a draft. An admin reviews it
                  and publishes, rejects, or requests changes before it is shown
                  in the catalog.
                </p>
              </details>
              <details className="group p-4">
                <summary className="cursor-pointer font-medium">
                  Can I edit a project after it is published?
                </summary>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  Yes. From your account you can update details, images, embeds,
                  and the Markdown info section.
                </p>
              </details>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold">
              Is there a report on the work done?
            </h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Yes, of course they will.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Who is behind this</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              EmbedCatalog is built and maintained by{" "}
              <a
                href="https://x.com/aanthonymax"
                target="_blank"
                rel="noreferrer noopener"
                className="font-medium text-foreground underline underline-offset-4"
              >
                Anthony Max
              </a>
              . The full source is open on{" "}
              <a
                href="https://github.com/EmbedCatalog/embedcatalog"
                target="_blank"
                rel="noreferrer noopener"
                className="font-medium text-foreground underline underline-offset-4"
              >
                GitHub
              </a>{" "}
              under the AGPL-3.0 license.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Tech stack</h2>
            <div className="mt-4 overflow-hidden rounded-xl border">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Framework</TableCell>
                    <TableCell>
                      Next.js 16, App Router, server runtime
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Language</TableCell>
                    <TableCell>TypeScript</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Styling</TableCell>
                    <TableCell>Tailwind CSS v4, ShadCN-based UI</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Markdown</TableCell>
                    <TableCell>react-markdown and remark-gfm</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Backend</TableCell>
                    <TableCell>Supabase: Postgres, Auth, and Storage</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Icons</TableCell>
                    <TableCell>Lucide</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Project structure</h2>
            <pre className="mt-4 overflow-x-auto rounded-xl border bg-muted p-4 text-sm leading-relaxed">
              <code>{`app            Routes: catalog, project pages, account, submit, embeds
components     Shared cards, forms, embeds, markdown, and UI components
lib            Supabase clients, data mappers, and utilities
scripts        Build-time embed image generation and GitHub stats sync
public         Static assets, logo, and preview images`}</code>
            </pre>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Data synchronization</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              A scheduled GitHub Action runs the stats synchronization script
              daily to refresh each project&apos;s stars, forks, contributors,
              and license directly from the GitHub API.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Contributing</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Read the{" "}
              <a
                href="https://github.com/embedcatalog/embedcatalog/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noreferrer noopener"
                className="font-medium text-foreground underline underline-offset-4"
              >
                Contributing Guide
              </a>{" "}
              for the main steps. The platform is open to your ideas and code.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Star history</h2>
            <a
              href="https://www.star-history.com/?repos=embedcatalog%2Fembedcatalog&type=date&legend=top-left"
              target="_blank"
              rel="noreferrer noopener"
              className="mt-4 block overflow-hidden rounded-xl border"
            >
              <Image
                src="https://api.star-history.com/svg?repos=embedcatalog/embedcatalog&type=date&legend=top-left"
                alt="EmbedCatalog star history"
                width={900}
                height={500}
                unoptimized
                className="w-full"
              />
            </a>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Contribution</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              The platform is open to your ideas and code! Thanks to everyone
              who helps make it better.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">License</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              Source code released under the{" "}
              <a
                href="https://github.com/EmbedCatalog/embedcatalog/blob/main/LICENSE"
                target="_blank"
                rel="noreferrer noopener"
                className="font-medium text-foreground underline underline-offset-4"
              >
                AGPL-3.0 license
              </a>
              . The application code is completely open source.
            </p>
          </section>

          <section className="rounded-xl border p-5">
            <h2 className="text-lg font-semibold">
              Ready to list your project?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
      </div>
    </main>
  )
}
