import type { Metadata } from "next"
import { Suspense } from "react"

import { HomeHero } from "components/home-hero"
import { NewEmbeds } from "components/new-embeds"
import { ProjectsPage } from "components/projects-page"
import { TopCreatorsWidget } from "components/top-creators-widget"
import { siteConfig } from "lib/site"

export const revalidate = 300

export const metadata: Metadata = {
  title: { absolute: `Projects | ${siteConfig.name}` },
  description:
    "Explore all projects. Filter by category, status, and tags, and search by name or description.",
  keywords: [
    "projects",
    "project catalog",
    "filter projects",
    "tags",
    "status",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: `Projects | ${siteConfig.name}`,
    description:
      "Explore all projects. Filter by category, status, and tags, and search by name or description.",
    url: "/",
    images: [
      {
        url: "/images/preview.png",
        width: 1071,
        height: 602,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Projects | ${siteConfig.name}`,
    description:
      "Explore all projects. Filter by category, status, and tags, and search by name or description.",
    images: ["/images/preview.png"],
  },
}

export default function Page() {
  return (
    <main className="site-container py-10 lg:h-[calc(100dvh-3.5rem)] lg:overflow-hidden lg:overscroll-none lg:py-6">
      <Suspense fallback={null}>
        <ProjectsPage
          hero={<HomeHero />}
          sidebar={
            <div className="flex flex-col gap-8">
              <NewEmbeds />
              <TopCreatorsWidget />
            </div>
          }
        />
      </Suspense>
    </main>
  )
}
