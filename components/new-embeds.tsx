import Image from "next/image"
import Link from "next/link"
import { ArrowUp, Eye, UserRound } from "lucide-react"

import { getCustomEmbedSize } from "lib/embed"
import { cn } from "lib/utils"
import { createPublicServerClient } from "lib/supabase/server"

const EMBEDS_LIMIT = 6

async function getNewEmbeds() {
  const supabase = createPublicServerClient()
  const { data, error } = await supabase
    .from("standalone_embeds")
    .select("id, owner_id, slug, title, views_count, upvotes_count")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(EMBEDS_LIMIT)

  if (error) {
    console.error("Failed to load new embeds:", error.message)
    return []
  }

  const ownerIds = [...new Set((data ?? []).map((embed) => embed.owner_id))]
  if (ownerIds.length === 0) return []

  const { data: profiles, error: profilesError } = await supabase.rpc(
    "get_public_profiles",
    { p_profile_ids: ownerIds }
  )
  if (profilesError) {
    console.error("Failed to load embed creators:", profilesError.message)
    return []
  }

  const profilesById = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile])
  )

  return (data ?? []).flatMap((embed) => {
    const profile = profilesById.get(embed.owner_id)
    return profile ? [{ embed, profile }] : []
  })
}

function getThumbnailSrc(profileSlug: string, embedSlug: string, dark = false) {
  return `/user/${encodeURIComponent(profileSlug)}/embeds/${encodeURIComponent(embedSlug)}${dark ? ".theme-dark" : ""}.png`
}

async function NewEmbeds() {
  const items = await getNewEmbeds()
  const { width, height } = getCustomEmbedSize()

  return (
    <aside className="flex flex-col gap-4" aria-labelledby="new-embeds-title">
      <div className="flex items-center justify-between">
        <h2 id="new-embeds-title" className="text-sm font-medium">
          New embeds
        </h2>
        <Link
          href="/embeds"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          View all
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No embeds yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map(({ embed, profile }) => (
            <li key={embed.id}>
              <Link
                href={`/user/${encodeURIComponent(profile.slug)}/embed/${encodeURIComponent(embed.slug)}`}
                className="flex flex-col gap-2 rounded-lg border p-3 transition-colors hover:bg-accent"
              >
                {[false, true].map((dark) => (
                  <Image
                    key={String(dark)}
                    src={getThumbnailSrc(profile.slug, embed.slug, dark)}
                    alt={embed.title}
                    width={width}
                    height={height}
                    unoptimized
                    className={cn(
                      "h-auto w-full rounded-md border",
                      dark ? "hidden dark:block" : "dark:hidden"
                    )}
                  />
                ))}
                <span className="line-clamp-2 text-sm font-medium">
                  {embed.title}
                </span>
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted">
                    {profile.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt=""
                        width={20}
                        height={20}
                        unoptimized
                        className="size-full object-cover"
                      />
                    ) : (
                      <UserRound className="size-3" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    {profile.display_name || profile.slug}
                  </span>
                  <span
                    className="inline-flex items-center gap-1"
                    title="Upvotes"
                  >
                    <ArrowUp className="size-3" />
                    {embed.upvotes_count}
                  </span>
                  <span
                    className="inline-flex items-center gap-1"
                    title="Views"
                  >
                    <Eye className="size-3" />
                    {embed.views_count}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}

export { NewEmbeds }
