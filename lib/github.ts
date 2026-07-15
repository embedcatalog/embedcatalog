function parseGithubRepo(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname !== "github.com" && parsed.hostname !== "www.github.com") {
      return null
    }

    const parts = parsed.pathname.split("/").filter(Boolean)
    if (parts.length < 2) {
      return null
    }

    const owner = parts[0]
    const repo = parts[1].replace(/\.git$/, "")
    if (!owner || !repo) {
      return null
    }

    return `${owner}/${repo}`
  } catch {
    return null
  }
}

function formatCount(count: number) {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`
  }
  return String(count)
}

function parseLinkHeaderTotal(linkHeader: string | null): number | null {
  if (!linkHeader) {
    return null
  }

  const last = linkHeader
    .split(",")
    .map((part) => part.trim())
    .find((part) => part.includes('rel="last"'))

  if (!last) {
    return null
  }

  const match = last.match(/[?&]page=(\d+)/)
  if (!match) {
    return null
  }

  return Number(match[1])
}

export { parseGithubRepo, formatCount, parseLinkHeaderTotal }
