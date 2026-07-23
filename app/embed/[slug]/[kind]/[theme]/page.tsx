import { notFound, redirect } from "next/navigation"

import { type Project } from "components/projects-grid"
import projectsData from "data/projects.json"
import {
  embedKinds,
  embedThemes,
  type EmbedKind,
  type EmbedTheme,
} from "lib/embed"

const projects = projectsData as Project[]

export const dynamic = "force-static"

export function generateStaticParams() {
  return projects.flatMap((project) =>
    embedKinds.flatMap((kind) =>
      embedThemes.map((theme) => ({
        slug: project.slug,
        kind,
        theme,
      }))
    )
  )
}

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ slug: string; kind: string; theme: string }>
}) {
  const { slug, kind, theme } = await params
  const project = projects.find((item) => item.slug === slug)

  if (
    !project ||
    !embedKinds.includes(kind as EmbedKind) ||
    !embedThemes.includes(theme as EmbedTheme)
  ) {
    notFound()
  }

  redirect(`/projects/${project.slug}`)
}
