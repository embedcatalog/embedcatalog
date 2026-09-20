"use client"

import * as React from "react"

import { ProjectsView } from "components/projects-view"
import { supabase } from "lib/supabase/client"
import { type Project } from "components/projects-grid"
import { getProjectImageUrl } from "lib/storage"

const NEW_PROJECT_WINDOW_MS = 14 * 24 * 60 * 60 * 1000

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />
}

function ProjectsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr]" aria-busy="true">
      <aside className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <SkeletonBlock className="h-4 w-16" />
          <SkeletonBlock className="h-3 w-10" />
        </div>
        <div>
          <SkeletonBlock className="mb-3 h-3 w-20" />
          <div className="flex flex-col gap-3">
            <SkeletonBlock className="h-4 w-14" />
            <SkeletonBlock className="h-4 w-14" />
          </div>
        </div>
        <div>
          <SkeletonBlock className="mb-3 h-3 w-12" />
          <SkeletonBlock className="h-4 w-24" />
        </div>
        <div>
          <SkeletonBlock className="mb-3 h-3 w-10" />
          <div className="flex flex-col gap-3">
            <SkeletonBlock className="h-4 w-20" />
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-4 w-16" />
          </div>
        </div>
      </aside>

      <div className="flex flex-col gap-4">
        <SkeletonBlock className="h-10 w-full max-w-sm" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="flex min-h-64 flex-col gap-6 rounded-xl border py-6"
            >
              <div className="flex flex-col gap-3 px-6">
                <SkeletonBlock className="h-5 w-2/3" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-5/6" />
              </div>
              <div className="flex flex-1 flex-col justify-end gap-5 px-6">
                <div className="flex gap-2">
                  <SkeletonBlock className="h-5 w-14" />
                  <SkeletonBlock className="h-5 w-20" />
                </div>
                <div className="flex items-center justify-between">
                  <SkeletonBlock className="h-3 w-24" />
                  <SkeletonBlock className="h-7 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

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
    images: (project.images ?? []).map(getProjectImageUrl),
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
      {loading ? <ProjectsSkeleton /> : <ProjectsView projects={projects} />}
    </>
  )
}

export { ProjectsPage }
