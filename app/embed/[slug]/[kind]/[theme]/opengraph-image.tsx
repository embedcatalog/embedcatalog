import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

import { type Project } from "components/projects-grid"
import projectsData from "data/projects.json"
import {
  embedKinds,
  embedThemes,
  getEmbedLines,
  getEmbedSize,
  getEmbedTheme,
  parseEmbedKind,
  type EmbedTheme,
} from "lib/embed"
import { siteConfig } from "lib/site"

const projects = projectsData as Project[]

export const dynamic = "force-static"
export const alt = "EmbedCatalog embed"
export const contentType = "image/png"

export function generateStaticParams() {
  return projects.flatMap((project) =>
    embedKinds.flatMap((kind) =>
      embedThemes.map((theme) => ({
        slug: project.slug,
        kind,
        theme,
      }))
    )
  )
}

export default async function EmbedImage({
  params,
}: {
  params: Promise<{ slug: string; kind: string; theme: string }>
}) {
  const { slug, kind: kindParam, theme: themeParam } = await params
  const kind = parseEmbedKind(kindParam)
  const theme: EmbedTheme = themeParam === "dark" ? "dark" : "light"
  const size = getEmbedSize(kind)
  const project = projects.find((item) => item.slug === slug)
  const lines = project
    ? await getEmbedLines(project, kind)
    : kind === "added"
      ? [`Added to: ${siteConfig.name}`]
      : kind === "organization"
        ? ["Organization: Unknown", "Created: Unknown"]
        : ["License: Unknown"]
  const colors = getEmbedTheme(theme)

  const font = await readFile(
    join(process.cwd(), "assets/fonts/Geist-SemiBold.ttf")
  )

  return new ImageResponse(
    (
      <div
        style={{
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
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: lines.length > 1 ? 2 : 0,
          }}
        >
          {lines.map((line) => (
            <div
              key={line}
              style={{
                display: "flex",
                color: colors.text,
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "Geist SemiBold",
                whiteSpace: "nowrap",
                lineHeight: 1.2,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
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
}
