"use client"

import * as React from "react"

import { type ProjectGithubStatsData } from "components/projects-grid"
import { formatCount, parseGithubRepo } from "lib/github"
import { supabase } from "lib/supabase/client"

function ProjectGithubStats({
  projectId,
  githubUrl,
  initialStats,
}: {
  projectId: string
  githubUrl: string
  initialStats?: ProjectGithubStatsData
}) {
  const repo = parseGithubRepo(githubUrl)
  const [stats, setStats] = React.useState<ProjectGithubStatsData | null>(
    initialStats ?? null
  )

  React.useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const { data } = await supabase
          .from("projects")
          .select(
            "github_stars, github_forks, github_contributors, github_license, github_stats_updated_at"
          )
          .eq("id", projectId)
          .maybeSingle()

        if (cancelled || !data) return

        setStats({
          stars: data.github_stars,
          forks: data.github_forks,
          contributors: data.github_contributors,
          license: data.github_license,
          updatedAt: data.github_stats_updated_at,
        })
      } catch {
        // Keep the build-time stats if Supabase is temporarily unavailable.
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [projectId])

  if (!repo || !stats || stats.stars === null || stats.forks === null) {
    return null
  }

  const items: { href: string; label: string; value: string }[] = [
    {
      href: `https://github.com/${repo}/stargazers`,
      label: "Stars",
      value: formatCount(stats.stars),
    },
    {
      href: `https://github.com/${repo}/forks`,
      label: "Forks",
      value: formatCount(stats.forks),
    },
    ...(stats.contributors !== null
      ? [
          {
            href: `https://github.com/${repo}/graphs/contributors`,
            label: "Contributors",
            value: formatCount(stats.contributors),
          },
        ]
      : []),
    ...(stats.license
      ? [
          {
            href: `https://github.com/${repo}#license`,
            label: "License",
            value: stats.license,
          },
        ]
      : []),
  ]

  return (
    <div className="mt-4 flex overflow-hidden rounded-lg border">
      {items.map((item, index) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`${item.value} ${item.label.toLowerCase()}`}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 px-4 py-3 transition-colors hover:bg-accent ${
            index > 0 ? "border-l" : ""
          }`}
        >
          <span className="text-base font-semibold text-foreground tabular-nums">
            {item.value}
          </span>
          <span className="text-xs text-muted-foreground">{item.label}</span>
        </a>
      ))}
    </div>
  )
}

export { ProjectGithubStats }
