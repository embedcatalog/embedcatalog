import type { Metadata } from "next"

import { ProjectsView } from "components/projects-view"
import { getPublishedProjects } from "lib/supabase/projects"
import { siteConfig } from "lib/site"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore all projects. Filter by status and tags, and search by name or description.",
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
      "Explore all projects. Filter by status and tags, and search by name or description.",
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
      "Explore all projects. Filter by status and tags, and search by name or description.",
    images: ["/images/preview.png"],
  },
}

export default async function Page() {
  const projects = await getPublishedProjects()

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Projects{" "}
          <span className="font-normal text-muted-foreground">
            ({projects.length})
          </span>
        </h1>
      </div>
      <ProjectsView projects={projects} />
    </main>
  )
}
