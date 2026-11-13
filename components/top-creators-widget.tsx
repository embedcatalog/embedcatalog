import Image from "next/image"
import Link from "next/link"
import { ArrowUp, Eye, UserRound } from "lucide-react"

import type { Database } from "lib/supabase/database"
import { createPublicServerClient } from "lib/supabase/server"

const CREATORS_LIMIT = 5
const EMBEDS_PAGE_SIZE = 1000

type CreatorStats = {
  views: number
  upvotes: number
}

type CreatorProfile =
  Database["public"]["Functions"]["get_public_profiles"]["Returns"][number]

async function getTopCreators() {
  const supabase = createPublicServerClient()
  const statsByOwner = new Map<string, CreatorStats>()

  for (let offset = 0; ; offset += EMBEDS_PAGE_SIZE) {
    const { data, error } = await supabase
      .from("standalone_embeds")
      .select("owner_id, views_count, upvotes_count")
      .eq("status", "approved")
      .range(offset, offset + EMBEDS_PAGE_SIZE - 1)

    if (error) {
      console.error("Failed to load creator embed stats:", error.message)
      return { creators: [], error: "Could not load top creators." }
    }

    for (const embed of data ?? []) {
      const stats = statsByOwner.get(embed.owner_id) ?? {
        views: 0,
        upvotes: 0,
      }
      stats.views += embed.views_count
      stats.upvotes += embed.upvotes_count
      statsByOwner.set(embed.owner_id, stats)
    }

    if (!data || data.length < EMBEDS_PAGE_SIZE) break
  }

  const ownerIds = [...statsByOwner.keys()]
  if (ownerIds.length === 0) return { creators: [], error: null }

  const profileResults = await Promise.all(
    Array.from({ length: Math.ceil(ownerIds.length / 100) }, (_, index) =>
      supabase.rpc("get_public_profiles", {
        p_profile_ids: ownerIds.slice(index * 100, (index + 1) * 100),
      })
    )
  )

  const profiles: CreatorProfile[] = []
  for (const { data, error } of profileResults) {
    if (error) {
      console.error("Failed to load creator profiles:", error.message)
      return { creators: [], error: "Could not load top creators." }
    }
    profiles.push(...(data ?? []))
  }

  const creators = profiles
    .flatMap((profile) => {
      const stats = statsByOwner.get(profile.id)
      return stats ? [{ profile, stats }] : []
    })
    .sort(
      (a, b) =>
        b.stats.upvotes - a.stats.upvotes || b.stats.views - a.stats.views
    )
    .slice(0, CREATORS_LIMIT)

  return { creators, error: null }
}

async function TopCreatorsWidget() {
  const { creators, error } = await getTopCreators()

  return (
    <aside className="flex flex-col gap-4" aria-labelledby="top-creators-title">
      <div className="flex items-center justify-between">
        <h2 id="top-creators-title" className="text-sm font-medium">
          Top creators
        </h2>
        <Link
          href="/top-creators"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          View all
        </Link>
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : creators.length === 0 ? (
        <p className="text-sm text-muted-foreground">No creators yet.</p>
      ) : (
        <ol className="flex flex-col gap-2">
          {creators.map(({ profile, stats }, index) => (
            <li key={profile.id}>
              <Link
                href={`/user/${encodeURIComponent(profile.slug)}`}
                className="flex items-center gap-2 rounded-lg border p-2 transition-colors hover:bg-accent"
              >
                <span className="w-5 shrink-0 text-center text-xs text-muted-foreground tabular-nums">
                  {index + 1}
                </span>
                <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted">
                  {profile.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt=""
                      width={32}
                      height={32}
                      unoptimized
                      className="size-full object-cover"
                    />
                  ) : (
                    <UserRound className="size-4 text-muted-foreground" />
                  )}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  {profile.display_name || profile.slug}
                </span>
                <span
                  className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground"
                  aria-label={`${stats.upvotes.toLocaleString("en-US")} upvotes`}
                  title="Total upvotes"
                >
                  <ArrowUp className="size-3" />
                  {stats.upvotes.toLocaleString("en-US")}
                </span>
                <span
                  className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground"
                  aria-label={`${stats.views.toLocaleString("en-US")} views`}
                  title="Total views"
                >
                  <Eye className="size-3" />
                  {stats.views.toLocaleString("en-US")}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </aside>
  )
}

export { TopCreatorsWidget }
