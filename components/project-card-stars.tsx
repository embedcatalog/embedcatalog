import { Star } from "lucide-react"

import { formatCount, parseGithubRepo } from "lib/github"

function ProjectCardStars({
  githubUrl,
  stars,
}: {
  githubUrl: string
  stars: number | null | undefined
}) {
  const repo = parseGithubRepo(githubUrl)

  if (!repo || stars == null) {
    return null
  }

  return (
    <a
      href={`https://github.com/${repo}/stargazers`}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`${formatCount(stars)} stars`}
      className="relative z-10 inline-flex h-7 items-center gap-1 rounded-md px-1.5 text-xs font-medium transition-colors hover:bg-accent hover:text-foreground"
    >
      <Star className="size-3.5" />
      <span className="tabular-nums">{formatCount(stars)}</span>
    </a>
  )
}

export { ProjectCardStars }
