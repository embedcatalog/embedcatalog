import { readFile, mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import React from "react"
import { loadEnvConfig } from "@next/env"
import { ImageResponse } from "next/og"
import { createClient } from "@supabase/supabase-js"

loadEnvConfig(process.cwd())

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY."
  )
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)
const embedKinds = ["license", "added", "organization"] as const
const embedThemes = ["light", "dark"] as const
type BuildProject = {
  id: string
  slug: string
  github_url: string | null
  socials: Record<string, string> | null
  is_premium: boolean
}

type CustomEmbedRow = {
  id: string
  project_id: string
  short_id: string
  title: string
  description: string
}

const outputRoot = join(process.cwd(), "out/embed")
const font = await readFile(
  join(process.cwd(), "assets/fonts/Geist-SemiBold.ttf")
)

function getEmbedSize(kind: (typeof embedKinds)[number]) {
  return kind === "organization"
    ? { width: 200, height: 48 }
    : kind === "added"
      ? { width: 200, height: 28 }
      : { width: 160, height: 28 }
}

function getEmbedTheme(theme: (typeof embedThemes)[number]) {
  return theme === "dark"
    ? { background: "#171717", border: "#344054", text: "#F9FAFB" }
    : { background: "#ffffff", border: "#D0D5DD", text: "#101828" }
}

function getCustomEmbedTheme(theme: (typeof embedThemes)[number]) {
  return theme === "dark"
    ? {
        background: "#171717",
        border: "#404040",
        text: "#fafafa",
        muted: "#a3a3a3",
      }
    : {
        background: "#ffffff",
        border: "#d4d4d4",
        text: "#171717",
        muted: "#737373",
      }
}

function parseGithubRepo(url: string | undefined) {
  if (!url) return null
  try {
    const parsed = new URL(url)
    if (
      parsed.hostname !== "github.com" &&
      parsed.hostname !== "www.github.com"
    ) {
      return null
    }
    const parts = parsed.pathname.split("/").filter(Boolean)
    return parts.length >= 2
      ? `${parts[0]}/${parts[1].replace(/\.git$/, "")}`
      : null
  } catch {
    return null
  }
}

async function getEmbedLines(
  project: {
    github_url: string | null
    socials: Record<string, string> | null
  },
  kind: (typeof embedKinds)[number]
) {
  if (kind === "added") return ["Added to: EmbedCatalog"]
  const repo = parseGithubRepo(project.github_url ?? project.socials?.github)
  if (!repo) {
    return kind === "organization"
      ? ["Organization: Unknown", "Created: Unknown"]
      : ["License: Unknown"]
  }
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: "application/vnd.github+json" },
    })
    if (!response.ok) throw new Error("GitHub request failed")
    const data = (await response.json()) as {
      license?: { spdx_id?: string | null } | null
      owner?: { login?: string | null } | null
      created_at?: string | null
    }
    const license =
      data.license?.spdx_id && data.license.spdx_id !== "NOASSERTION"
        ? data.license.spdx_id
        : "Unknown"
    const organization = data.owner?.login ?? "Unknown"
    const created = data.created_at
      ? new Date(data.created_at).toLocaleString("en-US", {
          month: "short",
          year: "numeric",
        })
      : "Unknown"
    return kind === "organization"
      ? [`Organization: ${organization}`, `Created: ${created}`]
      : [`License: ${license}`]
  } catch {
    return kind === "organization"
      ? ["Organization: Unknown", "Created: Unknown"]
      : ["License: Unknown"]
  }
}

async function generateEmbed(
  project: BuildProject,
  kind: (typeof embedKinds)[number],
  theme: (typeof embedThemes)[number]
) {
  const size = getEmbedSize(kind)
  const colors = getEmbedTheme(theme)
  const lines = await getEmbedLines(project, kind)
  const image = new ImageResponse(
    React.createElement(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: colors.background,
          border: `1px solid ${colors.border}`,
          borderRadius: 4,
          paddingLeft: 12,
          paddingRight: 12,
        },
      },
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: lines.length > 1 ? 2 : 0,
          },
        },
        ...lines.map((line) =>
          React.createElement(
            "div",
            {
              key: line,
              style: {
                display: "flex",
                color: colors.text,
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "Geist SemiBold",
                whiteSpace: "nowrap",
                lineHeight: 1.2,
              },
            },
            line
          )
        )
      )
    ),
    {
      ...size,
      fonts: [
        {
          name: "Geist SemiBold",
          data: font,
          style: "normal",
          weight: 600,
        },
      ],
    }
  )

  const fileName =
    theme === "light" ? `${kind}.png` : `${kind}.theme-${theme}.png`
  const projectDirectory = join(outputRoot, project.slug)
  await mkdir(projectDirectory, { recursive: true })
  await writeFile(
    join(projectDirectory, fileName),
    Buffer.from(await image.arrayBuffer())
  )
}

async function generateCustomEmbed(
  slug: string,
  embed: CustomEmbedRow,
  theme: (typeof embedThemes)[number]
) {
  const colors = getCustomEmbedTheme(theme)
  const image = new ImageResponse(
    React.createElement(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: colors.background,
          border: `1px solid ${colors.border}`,
          borderRadius: 4,
          padding: "14px 16px",
        },
      },
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            color: colors.text,
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "Geist SemiBold",
            lineHeight: 1.4,
          },
        },
        embed.title
      ),
      embed.description
        ? React.createElement(
            "div",
            {
              style: {
                display: "flex",
                marginTop: 4,
                color: colors.muted,
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "Geist SemiBold",
                lineHeight: 1.5,
              },
            },
            embed.description
          )
        : null
    ),
    {
      width: 320,
      height: 84,
      fonts: [
        {
          name: "Geist SemiBold",
          data: font,
          style: "normal",
          weight: 600,
        },
      ],
    }
  )

  const fileName =
    theme === "light"
      ? `${embed.short_id}.png`
      : `${embed.short_id}.theme-${theme}.png`
  const projectDirectory = join(outputRoot, slug)
  await mkdir(projectDirectory, { recursive: true })
  await writeFile(
    join(projectDirectory, fileName),
    Buffer.from(await image.arrayBuffer())
  )
}

const { data: projects, error } = await supabase
  .from("projects")
  .select("id, slug, github_url, socials, is_premium")
  .eq("status", "published")
  .order("created_at", { ascending: false })

if (error) throw new Error(`Failed to load projects: ${error.message}`)

const projectIds = projects.map((project) => project.id)
const slugById = new Map(projects.map((project) => [project.id, project.slug]))

const { data: customEmbeds, error: customEmbedsError } = await supabase
  .from("project_embeds")
  .select("id, project_id, short_id, title, description")
  .in("project_id", projectIds)

if (customEmbedsError) {
  throw new Error(`Failed to load custom embeds: ${customEmbedsError.message}`)
}

for (const project of projects) {
  const kinds = embedKinds.filter(
    (kind) => kind !== "organization" || project.is_premium
  )
  for (const kind of kinds) {
    for (const theme of embedThemes) {
      await generateEmbed(project, kind, theme)
    }
  }
}

for (const embed of customEmbeds as CustomEmbedRow[]) {
  const slug = slugById.get(embed.project_id)
  if (!slug) continue
  for (const theme of embedThemes) {
    await generateCustomEmbed(slug, embed, theme)
  }
}

console.log(`Generated embed PNGs for ${projects.length} published projects.`)
console.log(`Generated ${customEmbeds.length} custom embed PNGs.`)
