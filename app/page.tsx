import type { Metadata } from "next"

import { ProjectsView } from "components/projects-view"
import { type Project } from "components/projects-grid"
import projectsData from "data/projects.json"
import { siteConfig } from "lib/site"

const projects = projectsData as Project[]

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

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Projects{" "}
          <span className="text-muted-foreground font-normal">
            ({projects.length})
          </span>
        </h1>
      </div>
      <ProjectsView projects={projects} />
    </main>
  )
}
