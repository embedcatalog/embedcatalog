import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { notFound } from "next/navigation"

import { getPublishedProjects } from "lib/supabase/projects"
import {
  embedKinds,
  embedThemes,
  getEmbedLines,
  getEmbedSize,
  getEmbedTheme,
  parseEmbedKind,
  type EmbedTheme,
} from "lib/embed"

export const dynamic = "force-static"
export const alt = "EmbedCatalog embed"
export const contentType = "image/png"

export async function generateStaticParams() {
  const projects = await getPublishedProjects()
  return projects.flatMap((project) =>
    embedKinds
      .filter((kind) => kind !== "organization" || project.premium)
      .flatMap((kind) =>
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
  const projects = await getPublishedProjects()
  const project = projects.find((item) => item.slug === slug)

  if (!project || (kind === "organization" && !project.premium)) {
    notFound()
  }

  const lines = await getEmbedLines(project, kind)
  const colors = getEmbedTheme(theme)

  const font = await readFile(
    join(process.cwd(), "assets/fonts/Geist-SemiBold.ttf")
  )

  return new ImageResponse(
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
    </div>,
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
