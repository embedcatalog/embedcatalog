import { parseGithubRepo } from "lib/github"
import { siteConfig } from "lib/site"
import { type Project } from "components/projects-grid"

export type EmbedTheme = "light" | "dark"
export type EmbedKind = "license" | "added" | "organization"

type GithubRepoMeta = {
  license: string | null
  organization: string | null
  createdAt: string | null
}

const themes = {
  light: {
    background: "#ffffff",
    border: "#D0D5DD",
    text: "#101828",
  },
  dark: {
    background: "#171717",
    border: "#344054",
    text: "#F9FAFB",
  },
} as const

const embedKinds: EmbedKind[] = ["license", "added", "organization"]
const embedThemes: EmbedTheme[] = ["light", "dark"]

function formatCreatedMonth(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return null
  }
  return date.toLocaleString("en-US", { month: "short", year: "numeric" })
}

async function fetchGithubRepoMeta(
  githubUrl: string | undefined
): Promise<GithubRepoMeta> {
  const empty: GithubRepoMeta = {
    license: null,
    organization: null,
    createdAt: null,
  }

  if (!githubUrl) {
    return empty
  }

  const repo = parseGithubRepo(githubUrl)
  if (!repo) {
    return empty
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: "application/vnd.github+json" },
      cache: "force-cache",
    })
    if (!res.ok) {
      return empty
    }

    const data = (await res.json()) as {
      license?: { spdx_id?: string | null } | null
      owner?: { login?: string | null } | null
      created_at?: string | null
    }

    const spdx = data.license?.spdx_id
    const license =
      spdx && spdx !== "NOASSERTION" ? spdx : null
    const organization = data.owner?.login ?? null
    const createdAt = data.created_at
      ? formatCreatedMonth(data.created_at)
      : null

    return { license, organization, createdAt }
  } catch {
    return empty
  }
}

function parseEmbedKind(kind: string): EmbedKind {
  if (kind === "added") {
    return "added"
  }
  if (kind === "organization") {
    return "organization"
  }
  return "license"
}

async function getEmbedLines(
  project: Project,
  kind: EmbedKind
): Promise<string[]> {
  if (kind === "added") {
    return [`Added to: ${siteConfig.name}`]
  }

  const meta = await fetchGithubRepoMeta(project.socials?.github)

  if (kind === "organization") {
    return [
      `Organization: ${meta.organization ?? "Unknown"}`,
      `Created: ${meta.createdAt ?? "Unknown"}`,
    ]
  }

  return [`License: ${meta.license ?? "Unknown"}`]
}

function getEmbedTheme(theme: EmbedTheme) {
  return themes[theme]
}

function getEmbedSize(kind: EmbedKind) {
  if (kind === "organization") {
    return { width: 200, height: 48 }
  }
  if (kind === "added") {
    return { width: 200, height: 28 }
  }
  return { width: 160, height: 28 }
}

function getPublicEmbedSrc(
  siteUrl: string,
  slug: string,
  kind: EmbedKind,
  theme: EmbedTheme
) {
  // Static hosts ignore ?theme= for file lookup, so dark uses a -dark file.
  const file = theme === "dark" ? `${kind}-dark.png` : `${kind}.png`
  return `${siteUrl}/embed/${slug}/${file}?theme=${theme}`
}

export {
  embedKinds,
  embedThemes,
  fetchGithubRepoMeta,
  getEmbedLines,
  getEmbedSize,
  getEmbedTheme,
  getPublicEmbedSrc,
  parseEmbedKind,
  themes,
}
