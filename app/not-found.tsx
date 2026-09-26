"use client"

import * as React from "react"
import Link from "next/link"

import { Button } from "components/ui/button"
import { ProjectDetail } from "components/project-detail"
import { type Project } from "components/projects-grid"
import { supabase } from "lib/supabase/client"
import { type CustomEmbed } from "components/project-embeds"
import { getProjectImageUrl } from "lib/storage"

function NotFoundMessage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center sm:px-6">
      <p className="text-sm font-semibold text-primary">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Page not found
      </h1>
      <p className="mt-3 text-muted-foreground">
        The page you are looking for doesn&rsquo;t exist or has been moved.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/submit">Submit a project</Link>
        </Button>
      </div>
    </main>
  )
}

function NotFound() {
  const [project, setProject] = React.useState<Project | null>(null)
  const [customEmbeds, setCustomEmbeds] = React.useState<CustomEmbed[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isProjectPath, setIsProjectPath] = React.useState(false)

  React.useEffect(() => {
    const path = window.location.pathname
    const match = path.match(/^\/projects\/([^/]+)\/?$/)

    if (!match) {
      setIsProjectPath(false)
      setLoading(false)
      return
    }

    setIsProjectPath(true)
    const slug = decodeURIComponent(match[1])
    let cancelled = false

    async function loadProject() {
      const { data, error } = await supabase
        .from("projects")
        .select(
          "id, slug, name, description, url, github_url, github_stars, github_forks, github_contributors, github_license, github_stats_updated_at, images, tags, socials, info, is_premium, impressions_count, upvotes_count, created_at"
        )
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle()

      if (cancelled) return
      if (error || !data) {
        setLoading(false)
        return
      }

      const project: Project = {
        id: data.id,
        slug: data.slug,
        name: data.name,
        description: data.description,
        isNew:
          Date.now() - new Date(data.created_at).getTime() <
          14 * 24 * 60 * 60 * 1000,
        premium: data.is_premium,
        url: data.url,
        githubUrl: data.github_url ?? data.socials?.github,
        githubStats: {
          stars: data.github_stars,
          forks: data.github_forks,
          contributors: data.github_contributors,
          license: data.github_license,
          updatedAt: data.github_stats_updated_at,
        },
        images: (data.images ?? []).map(getProjectImageUrl),
        tags: data.tags ?? [],
        createdAt: data.created_at,
        impressionsCount: data.impressions_count,
        upvotesCount: data.upvotes_count,
        info: typeof data.info === "string" ? data.info : undefined,
        socials: data.socials ?? undefined,
      }

      const { data: embeds } = await supabase
        .from("project_embeds")
        .select("id, short_id, title, description")
        .eq("project_id", project.id)
        .order("position", { ascending: true })

      if (cancelled) return
      setProject(project)
      setCustomEmbeds(
        (embeds ?? []).map((embed) => ({
          id: embed.id,
          shortId: embed.short_id,
          title: embed.title,
          description: embed.description,
        }))
      )
      setLoading(false)
    }

    void loadProject()
    return () => {
      cancelled = true
    }
  }, [])

  if (isProjectPath && loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
        Loading project...
      </div>
    )
  }

  if (isProjectPath && project) {
    return <ProjectDetail project={project} customEmbeds={customEmbeds} />
  }

  return <NotFoundMessage />
}

export default NotFound
