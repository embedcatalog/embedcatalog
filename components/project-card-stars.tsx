"use client"

import * as React from "react"
import { Star } from "lucide-react"

import { formatCount, parseGithubRepo } from "lib/github"

function ProjectCardStars({ githubUrl }: { githubUrl: string }) {
  const repo = React.useMemo(() => parseGithubRepo(githubUrl), [githubUrl])
  const [stars, setStars] = React.useState<number | null>(null)

  React.useEffect(() => {
    if (!repo) {
      return
    }

    let cancelled = false

    async function load() {
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}`, {
          headers: { Accept: "application/vnd.github+json" },
          cache: "no-store",
        })
        if (!res.ok) {
          return
        }
        const data = (await res.json()) as { stargazers_count?: number }
        if (!cancelled && typeof data.stargazers_count === "number") {
          setStars(data.stargazers_count)
        }
      } catch {
        // ignore network errors
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [repo])

  if (!repo || stars === null) {
    return null
  }

  return (
    <a
      href={`https://github.com/${repo}/stargazers`}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`${formatCount(stars)} stars`}
      className="hover:bg-accent hover:text-foreground relative z-10 inline-flex h-7 items-center gap-1 rounded-md px-1.5 text-xs font-medium transition-colors"
    >
      <Star className="size-3.5" />
      <span className="tabular-nums">{formatCount(stars)}</span>
    </a>
  )
}

export { ProjectCardStars }
