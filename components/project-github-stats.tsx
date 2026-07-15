"use client"

import * as React from "react"

import { formatCount, parseGithubRepo, parseLinkHeaderTotal } from "lib/github"

type GithubStats = {
  stars: number
  forks: number
  contributors: number | null
  license: string | null
}

function ProjectGithubStats({ githubUrl }: { githubUrl: string }) {
  const repo = React.useMemo(() => parseGithubRepo(githubUrl), [githubUrl])
  const [stats, setStats] = React.useState<GithubStats | null>(null)

  React.useEffect(() => {
    if (!repo) {
      return
    }

    let cancelled = false

    async function load() {
      try {
        const headers = { Accept: "application/vnd.github+json" }

        const [repoRes, contributorsRes] = await Promise.all([
          fetch(`https://api.github.com/repos/${repo}`, {
            headers,
            cache: "no-store",
          }),
          fetch(
            `https://api.github.com/repos/${repo}/contributors?per_page=1&anon=true`,
            {
              headers,
              cache: "no-store",
            }
          ),
        ])

        if (!repoRes.ok || cancelled) {
          return
        }

        const repoData = (await repoRes.json()) as {
          stargazers_count?: number
          forks_count?: number
          license?: { spdx_id?: string | null } | null
        }

        let contributors: number | null = null
        if (contributorsRes.ok) {
          const fromLink = parseLinkHeaderTotal(
            contributorsRes.headers.get("Link")
          )
          if (fromLink !== null) {
            contributors = fromLink
          } else {
            const list = (await contributorsRes.json()) as unknown[]
            if (Array.isArray(list)) {
              contributors = list.length
            }
          }
        }

        if (
          cancelled ||
          typeof repoData.stargazers_count !== "number" ||
          typeof repoData.forks_count !== "number"
        ) {
          return
        }

        const license =
          repoData.license?.spdx_id && repoData.license.spdx_id !== "NOASSERTION"
            ? repoData.license.spdx_id
            : null

        setStats({
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          contributors,
          license,
        })
      } catch {
        // ignore network errors
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [repo])

  if (!repo || !stats) {
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
          className={`hover:bg-accent flex flex-1 flex-col items-center justify-center gap-0.5 px-4 py-3 transition-colors ${
            index > 0 ? "border-l" : ""
          }`}
        >
          <span className="text-foreground text-base font-semibold tabular-nums">
            {item.value}
          </span>
          <span className="text-muted-foreground text-xs">{item.label}</span>
        </a>
      ))}
    </div>
  )
}

export { ProjectGithubStats }
