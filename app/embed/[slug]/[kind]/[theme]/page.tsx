import { notFound, redirect } from "next/navigation"

import { getPublishedProjects } from "lib/supabase/projects"
import {
  embedKinds,
  embedThemes,
  type EmbedKind,
  type EmbedTheme,
} from "lib/embed"

export const dynamic = "force-static"

export async function generateStaticParams() {
  const projects = await getPublishedProjects()
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
  const projects = await getPublishedProjects()
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
