import type { EmbedTheme } from "lib/embed"
import { renderCustomEmbedImage } from "lib/embed-image"
import { createPublicServerClient } from "lib/supabase/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ login: string; file: string }> }
) {
  const { login, file } = await params
  const match = file.match(/^([a-zA-Z0-9_-]+)(?:\.theme-(dark))?\.png$/)
  if (!match) return new Response("Not found", { status: 404 })

  const [, embedSlug, darkTheme] = match
  const client = createPublicServerClient()
  const { data: profile } = await client
    .from("standalone_embed_profiles")
    .select("owner_id")
    .eq("slug", login)
    .maybeSingle()

  if (!profile) return new Response("Not found", { status: 404 })

  const { data: embed } = await client
    .from("standalone_embeds")
    .select("title, description")
    .eq("owner_id", profile.owner_id)
    .eq("slug", embedSlug)
    .eq("status", "approved")
    .maybeSingle()

  if (!embed) return new Response("Not found", { status: 404 })

  const theme: EmbedTheme = darkTheme ? "dark" : "light"
  const response = await renderCustomEmbedImage(
    embed.title,
    embed.description,
    theme
  )
  response.headers.set(
    "Cache-Control",
    "public, max-age=0, s-maxage=300, stale-while-revalidate=86400"
  )
  return response
}
