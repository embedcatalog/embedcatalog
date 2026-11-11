const REPO = "embedcatalog/embedcatalog"

export type GithubContributor = {
  login: string
  avatarUrl: string
  url: string
  contributions: number
}

async function githubFetch<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO}${path}`,
      { headers: { Accept: "application/vnd.github+json" } }
    )
    if (!response.ok) {
      console.error(`GitHub request failed: ${path} ${response.status}`)
      return null
    }
    return (await response.json()) as T
  } catch (error) {
    console.error("GitHub request failed:", error)
    return null
  }
}

async function getContributors(): Promise<GithubContributor[]> {
  const data = await githubFetch<
    {
      login: string
      avatar_url: string
      html_url: string
      contributions: number
      type: string
    }[]
  >("/contributors?per_page=100")

  return (data ?? [])
    .filter((contributor) => contributor.type === "User")
    .map((contributor) => ({
      login: contributor.login,
      avatarUrl: contributor.avatar_url,
      url: contributor.html_url,
      contributions: contributor.contributions,
    }))
}

export { getContributors }
