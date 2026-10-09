import { getPublishedProjects } from "lib/supabase/projects"
import {
  getEmbedLines,
  getEmbedSize,
  type EmbedKind,
  type EmbedTheme,
} from "lib/embed"
import { renderCustomEmbedImage, renderEmbedImage } from "lib/embed-image"
import { createPublicServerClient } from "lib/supabase/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function imageResponse(response: Response) {
  response.headers.set(
    "Cache-Control",
    "public, max-age=0, s-maxage=300, stale-while-revalidate=86400"
  )
  return response
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; kind: string }> }
) {
  const { slug, kind: file } = await params
  const defaultMatch = file.match(
    /^(license|added|organization)(?:\.theme-(dark))?\.png$/
  )
  const customMatch = file.match(/^([a-zA-Z0-9_-]+)(?:\.theme-(dark))?\.png$/)

  if (!defaultMatch && !customMatch) {
    return new Response("Not found", { status: 404 })
  }

  if (defaultMatch) {
    const embedKind = defaultMatch[1] as EmbedKind
    const theme: EmbedTheme = defaultMatch[2] ? "dark" : "light"
    const project = (await getPublishedProjects()).find(
      (item) => item.slug === slug
    )

    if (!project || (embedKind === "organization" && !project.premium)) {
      return new Response("Not found", { status: 404 })
    }

    const response = await renderEmbedImage(
      await getEmbedLines(project, embedKind),
      getEmbedSize(embedKind),
      theme
    )
    return imageResponse(response)
  }

  if (!customMatch) return new Response("Not found", { status: 404 })

  const [, shortId, darkTheme] = customMatch
  const client = createPublicServerClient()
  const { data: project } = await client
    .from("projects")
    .select("id")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()

  if (!project) return new Response("Not found", { status: 404 })

  const { data: embed } = await client
    .from("project_embeds")
    .select("title, description")
    .eq("project_id", project.id)
    .eq("short_id", shortId)
    .maybeSingle()

  if (!embed) return new Response("Not found", { status: 404 })

  const theme: EmbedTheme = darkTheme ? "dark" : "light"
  return imageResponse(
    await renderCustomEmbedImage(embed.title, embed.description, theme)
  )
}
