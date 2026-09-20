"use client"

import * as React from "react"

import { ProjectsView } from "components/projects-view"
import { supabase } from "lib/supabase/client"
import { type Project } from "components/projects-grid"

const NEW_PROJECT_WINDOW_MS = 14 * 24 * 60 * 60 * 1000

function mapProject(project: {
  id: string
  slug: string
  name: string
  description: string
  url: string
  github_url: string | null
  images: string[] | null
  tags: string[] | null
  socials: Record<string, string> | null
  info: unknown
  is_premium: boolean
  created_at: string
}): Project {
  return {
    id: project.id,
    slug: project.slug,
    name: project.name,
    description: project.description,
    isNew:
      Date.now() - new Date(project.created_at).getTime() <
      NEW_PROJECT_WINDOW_MS,
    premium: project.is_premium,
    url: project.url,
    githubUrl: project.github_url ?? project.socials?.github,
    images: project.images ?? [],
    tags: project.tags ?? [],
    createdAt: project.created_at,
    info: (project.info as Project["info"]) ?? undefined,
    socials: project.socials ?? undefined,
  }
}

function ProjectsPage() {
  const [projects, setProjects] = React.useState<Project[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false

    supabase
      .from("projects")
      .select(
        "id, slug, name, description, url, github_url, images, tags, socials, info, is_premium, created_at"
      )
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (cancelled) return
        setProjects((data ?? []).map(mapProject))
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Projects{" "}
          {!loading && (
            <span className="font-normal text-muted-foreground">
              ({projects.length})
            </span>
          )}
        </h1>
      </div>
      {loading ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          Loading projects...
        </div>
      ) : (
        <ProjectsView projects={projects} />
      )}
    </>
  )
}

export { ProjectsPage }
