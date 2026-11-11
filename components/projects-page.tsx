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

function ProjectsSkeleton({
  hero,
  sidebar,
  centerScrollRef,
  leftSidebarRef,
  rightSidebarRef,
}: {
  hero?: React.ReactNode
  sidebar?: React.ReactNode
  centerScrollRef: React.RefObject<HTMLDivElement | null>
  leftSidebarRef: React.RefObject<HTMLElement | null>
  rightSidebarRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <div
      className={
        sidebar
          ? "grid gap-6 md:grid-cols-[220px_1fr] lg:h-full lg:min-h-0 lg:grid-cols-[220px_minmax(0,1fr)_280px] lg:grid-rows-[minmax(0,1fr)]"
          : "grid gap-6 md:grid-cols-[220px_1fr] lg:h-full lg:min-h-0 lg:grid-rows-[minmax(0,1fr)]"
      }
      aria-busy="true"
    >
      <aside
        ref={leftSidebarRef}
        className="flex flex-col gap-6 lg:max-h-[calc(100dvh-6.5rem)] lg:overscroll-contain lg:overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <SkeletonBlock className="h-4 w-16" />
          <SkeletonBlock className="h-3 w-10" />
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

      <div
        ref={centerScrollRef}
        className="flex flex-col gap-4 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain"
      >
        {hero}
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-10 w-full max-w-sm" />
          <SkeletonBlock className="h-9 w-[150px] shrink-0" />
        </div>
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

      {sidebar && (
        <div
          ref={rightSidebarRef}
          className="md:col-span-2 lg:col-span-1 lg:max-h-[calc(100dvh-6.5rem)] lg:overscroll-contain lg:overflow-y-auto"
        >
          {sidebar}
        </div>
      )}
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
  github_stars: number | null
  github_forks: number | null
  github_contributors: number | null
  github_license: string | null
  github_stats_updated_at: string | null
  categories: string[] | null
  images: string[] | null
  tags: string[] | null
  socials: Record<string, string> | null
  info: unknown
  is_premium: boolean
  impressions_count: number
  upvotes_count: number
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
    githubStats: {
      stars: project.github_stars,
      forks: project.github_forks,
      contributors: project.github_contributors,
      license: project.github_license,
      updatedAt: project.github_stats_updated_at,
    },
    images: (project.images ?? []).map(getProjectImageUrl),
    categories: project.categories,
    tags: project.tags ?? [],
    createdAt: project.created_at,
    impressionsCount: project.impressions_count,
    upvotesCount: project.upvotes_count,
    info: typeof project.info === "string" ? project.info : undefined,
    socials: project.socials ?? undefined,
  }
}

function ProjectsPage({
  hero,
  sidebar,
}: {
  hero?: React.ReactNode
  sidebar?: React.ReactNode
}) {
  const centerScrollRef = React.useRef<HTMLDivElement>(null)
  const leftSidebarRef = React.useRef<HTMLElement>(null)
  const rightSidebarRef = React.useRef<HTMLDivElement>(null)
  const [projects, setProjects] = React.useState<Project[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    function handleWheel(event: WheelEvent) {
      if (!window.matchMedia("(min-width: 64rem)").matches || event.deltaY === 0) {
        return
      }

      const sidebarElement = event.currentTarget as HTMLElement
      const canScroll = (element: HTMLElement) => {
        const maxScroll = element.scrollHeight - element.clientHeight
        return event.deltaY > 0
          ? element.scrollTop < maxScroll
          : element.scrollTop > 0
      }

      let element = event.target instanceof HTMLElement ? event.target : null
      while (element && element !== sidebarElement) {
        const overflowY = window.getComputedStyle(element).overflowY
        if (
          (overflowY === "auto" || overflowY === "scroll") &&
          canScroll(element)
        ) {
          return
        }
        element = element.parentElement
      }

      if (canScroll(sidebarElement)) return

      event.preventDefault()
      if (centerScrollRef.current) {
        centerScrollRef.current.scrollTop += event.deltaY
      }
    }

    const sidebars = [leftSidebarRef.current, rightSidebarRef.current]
    for (const sidebarElement of sidebars) {
      sidebarElement?.addEventListener("wheel", handleWheel, { passive: false })
    }

    return () => {
      for (const sidebarElement of sidebars) {
        sidebarElement?.removeEventListener("wheel", handleWheel)
      }
    }
  }, [loading])

  React.useEffect(() => {
    let cancelled = false

    supabase
      .from("projects")
      .select(
        "id, slug, name, description, url, github_url, github_stars, github_forks, github_contributors, github_license, github_stats_updated_at, categories, images, tags, socials, info, is_premium, impressions_count, upvotes_count, created_at"
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

  const centerHeader = (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">
          Projects{" "}
          {!loading && (
            <span className="font-normal text-muted-foreground">
              ({projects.length})
            </span>
          )}
        </h2>
      </div>
      {hero}
    </>
  )

  return (
    loading ? (
      <ProjectsSkeleton
        hero={centerHeader}
        sidebar={sidebar}
        centerScrollRef={centerScrollRef}
        leftSidebarRef={leftSidebarRef}
        rightSidebarRef={rightSidebarRef}
      />
    ) : (
      <ProjectsView
        projects={projects}
        hero={centerHeader}
        sidebar={sidebar}
        centerScrollRef={centerScrollRef}
        leftSidebarRef={leftSidebarRef}
        rightSidebarRef={rightSidebarRef}
      />
    )
  )
}

export { ProjectsPage }
