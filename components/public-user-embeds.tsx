"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowUp,
  ArrowLeft,
  Eye,
  Images,
  Loader2,
  UserCheck,
  UserPlus,
  UserRound,
} from "lucide-react"

import { useAuth } from "components/auth-provider"
import { ProjectInfoMarkdown } from "components/project-info-markdown"
import { Button } from "components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card"
import type { Database } from "lib/supabase/database"
import { getPublicStandaloneEmbedSrc } from "lib/embed"
import { siteConfig } from "lib/site"
import type { StandaloneEmbedTheme } from "lib/standalone-embed-image"
import { supabase } from "lib/supabase/client"

type PublicEmbed = Pick<
  Database["public"]["Tables"]["standalone_embeds"]["Row"],
  | "id"
  | "slug"
  | "title"
  | "description"
  | "created_at"
  | "views_count"
  | "upvotes_count"
>

type PublicProfile =
  Database["public"]["Functions"]["get_public_profiles"]["Returns"][number]

function getSafeSocialUrl(value: string | undefined) {
  if (!value) return null

  try {
    const url = new URL(value)
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : null
  } catch {
    return null
  }
}

function UserFollow({ profileId }: { profileId: string }) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [followerCount, setFollowerCount] = React.useState<number | null>(null)
  const [isFollowing, setIsFollowing] = React.useState(false)
  const [resolvedUserId, setResolvedUserId] = React.useState<string | null>(
    null
  )
  const [loadedKey, setLoadedKey] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [loadError, setLoadError] = React.useState<string | null>(null)
  const requestInProgress = React.useRef(false)
  const requestKey = `${profileId}:${user?.id ?? "anonymous"}`

  React.useEffect(() => {
    let cancelled = false

    async function loadFollowState() {
      const followersRequest = supabase
        .from("user_follows")
        .select("follower_id", { count: "exact", head: true })
        .eq("followed_id", profileId)
      const followingRequest = user
        ? supabase
            .from("user_follows")
            .select("follower_id")
            .eq("follower_id", user.id)
            .eq("followed_id", profileId)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null })
      const [followersResult, followingResult] = await Promise.all([
        followersRequest,
        followingRequest,
      ])

      if (cancelled) return
      if (followersResult.error || followingResult.error) {
        setLoadError("Could not load follow status.")
        setLoadedKey(requestKey)
      } else {
        setFollowerCount(followersResult.count ?? 0)
        setIsFollowing(Boolean(followingResult.data))
        setResolvedUserId(user?.id ?? "anonymous")
        setLoadError(null)
        setError(null)
        setLoadedKey(requestKey)
      }
    }

    void loadFollowState()
    return () => {
      cancelled = true
    }
  }, [profileId, requestKey, user])

  async function toggleFollow() {
    if (!user) {
      router.push("/login")
      return
    }
    if (
      requestInProgress.current ||
      resolvedUserId !== user.id ||
      loadedKey !== requestKey
    ) {
      return
    }

    requestInProgress.current = true
    setSaving(true)
    setError(null)
    const nextIsFollowing = !isCurrentFollowing
    const result = nextIsFollowing
      ? await supabase
          .from("user_follows")
          .insert({ follower_id: user.id, followed_id: profileId })
      : await supabase
          .from("user_follows")
          .delete()
          .eq("follower_id", user.id)
          .eq("followed_id", profileId)

    if (result.error) {
      setError("Could not update follow status. Please try again.")
    } else {
      setIsFollowing(nextIsFollowing)
      setFollowerCount((count) =>
        Math.max(0, (count ?? 0) + (nextIsFollowing ? 1 : -1))
      )
    }

    setSaving(false)
    requestInProgress.current = false
  }

  const checkingFollow =
    authLoading ||
    loadedKey !== requestKey ||
    Boolean(user && resolvedUserId !== user.id) ||
    Boolean(loadError && loadedKey === requestKey)
  const isCurrentFollowing = loadedKey === requestKey && isFollowing
  const isOwnProfile = user?.id === profileId

  return (
    <div className="flex flex-wrap items-center gap-3">
      {!isOwnProfile && (
        <Button
          type="button"
          size="sm"
          variant={isCurrentFollowing ? "secondary" : "outline"}
          onClick={() => void toggleFollow()}
          disabled={checkingFollow || saving}
          aria-pressed={isCurrentFollowing}
        >
          {checkingFollow || saving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : isCurrentFollowing ? (
            <UserCheck className="size-4" />
          ) : (
            <UserPlus className="size-4" />
          )}
          {isCurrentFollowing ? "Following" : "Follow"}
        </Button>
      )}
      {loadedKey === requestKey && followerCount !== null && (
        <span className="text-sm text-muted-foreground">
          {followerCount.toLocaleString("en-US")}{" "}
          {followerCount === 1 ? "follower" : "followers"}
        </span>
      )}
      {(error || loadError) && (
        <p className="text-xs text-destructive" role="alert">
          {error ?? loadError}
        </p>
      )}
    </div>
  )
}

function PublicEmbedCard({
  profileSlug,
  embed,
}: {
  profileSlug: string
  embed: PublicEmbed
}) {
  const [theme, setTheme] = React.useState<StandaloneEmbedTheme>("light")
  const src = getPublicStandaloneEmbedSrc(
    siteConfig.url,
    profileSlug,
    embed.slug,
    theme
  )

  return (
    <Card className="gap-4 py-4 shadow-none">
      <CardHeader className="px-4">
        <CardTitle className="text-sm font-medium">
          <Link
            href={`/user/${encodeURIComponent(profileSlug)}/embed/${encodeURIComponent(embed.slug)}`}
            className="hover:underline"
          >
            {embed.title}
          </Link>
        </CardTitle>
        {embed.description && (
          <CardDescription>{embed.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-4">
        <div
          className="flex items-center gap-2"
          role="group"
          aria-label="Embed theme"
        >
          <Button
            type="button"
            size="sm"
            variant={theme === "light" ? "secondary" : "ghost"}
            aria-pressed={theme === "light"}
            onClick={() => setTheme("light")}
          >
            Light
          </Button>
          <Button
            type="button"
            size="sm"
            variant={theme === "dark" ? "secondary" : "ghost"}
            aria-pressed={theme === "dark"}
            onClick={() => setTheme("dark")}
          >
            Dark
          </Button>
        </div>
        <Image
          src={src}
          alt={embed.title}
          width={320}
          height={84}
          unoptimized
        />
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Eye className="size-3.5" aria-hidden="true" />
            {embed.views_count.toLocaleString("en-US")}
          </span>
          <span className="inline-flex items-center gap-1">
            <ArrowUp className="size-3.5" aria-hidden="true" />
            {embed.upvotes_count.toLocaleString("en-US")}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function PublicUserEmbeds({ login }: { login: string }) {
  const [profile, setProfile] = React.useState<PublicProfile | null>(null)
  const [bio, setBio] = React.useState("")
  const [embeds, setEmbeds] = React.useState<PublicEmbed[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false

    async function loadProfile() {
      const { data: profiles, error: profileError } = await supabase.rpc(
        "get_public_profiles",
        { p_profile_slug: login }
      )
      const profile = profiles?.[0]

      if (cancelled) return
      if (profileError || !profile) {
        setError("This profile could not be found.")
        setLoading(false)
        return
      }
      setProfile(profile)

      const { data: bioData } = await supabase.rpc("get_public_profile_bio", {
        p_profile_id: profile.id,
      })
      if (cancelled) return
      setBio(bioData ?? "")

      const { data, error: embedsError } = await supabase
        .from("standalone_embeds")
        .select(
          "id, slug, title, description, created_at, views_count, upvotes_count"
        )
        .eq("owner_id", profile.id)
        .eq("status", "approved")
        .order("created_at", { ascending: false })

      if (cancelled) return
      if (embedsError) {
        setError("Could not load this profile's embeds.")
      } else {
        setEmbeds(data ?? [])
      }
      setLoading(false)
    }

    void loadProfile()
    return () => {
      cancelled = true
    }
  }, [login])

  return (
    <main className="site-container py-8 sm:py-12">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/">
          <ArrowLeft className="size-4" />
          Projects
        </Link>
      </Button>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <p className="mt-8 text-sm text-muted-foreground" role="status">
          {error}
        </p>
      ) : (
        <>
          <header className="mt-6 flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted text-muted-foreground">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt=""
                    width={48}
                    height={48}
                    unoptimized
                    className="size-full object-cover"
                  />
                ) : (
                  <UserRound className="size-5" />
                )}
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-xl font-semibold">
                  {profile?.display_name || login}
                </h1>
                <p className="truncate text-sm text-muted-foreground">
                  @{login}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <nav
                aria-label="Social networks"
                className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm"
              >
                {[
                  {
                    label: "GitHub",
                    value: profile?.socials?.github,
                    icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5">
                        <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.086 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.776.42-1.305.762-1.605-2.665-.303-5.466-1.334-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.873.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.624-5.48 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .32.216.694.825.576C20.565 22.296 24 17.797 24 12.5 24 5.87 18.627.5 12 .5z" />
                      </svg>
                    ),
                  },
                  {
                    label: "Twitter",
                    value: profile?.socials?.twitter,
                    icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
                      </svg>
                    ),
                  },
                  {
                    label: "YouTube",
                    value: profile?.socials?.youtube,
                    icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5">
                        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12Z" />
                      </svg>
                    ),
                  },
                ].map(({ label, value, icon }) => {
                  const href = getSafeSocialUrl(value)
                  return href ? (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      title={label}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {icon}
                    </a>
                  ) : null
                })}
              </nav>
              {profile && <UserFollow profileId={profile.id} />}
            </div>
          </header>

          <ProjectInfoMarkdown content={bio} className="mt-5" />

          <nav
            role="tablist"
            aria-label="Profile sections"
            className="mt-5 flex border-b"
          >
            <button
              id="profile-embeds-tab"
              type="button"
              role="tab"
              aria-selected="true"
              aria-controls="profile-embeds-panel"
              className="flex items-center gap-2 border-b-2 border-foreground px-1 pb-3 text-sm font-medium"
            >
              Embeds
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {embeds.length}
              </span>
            </button>
          </nav>

          {embeds.length === 0 ? (
            <Card
              id="profile-embeds-panel"
              role="tabpanel"
              aria-labelledby="profile-embeds-tab"
              className="mt-6 max-w-xl"
            >
              <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                <Images className="size-8 text-muted-foreground" />
                <p className="font-medium">No public embeds yet</p>
                <p className="text-sm text-muted-foreground">
                  Published custom embeds will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <section
              id="profile-embeds-panel"
              role="tabpanel"
              aria-labelledby="profile-embeds-tab"
              className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {embeds.map((embed) => (
                <PublicEmbedCard
                  key={embed.id}
                  profileSlug={login}
                  embed={embed}
                />
              ))}
            </section>
          )}
        </>
      )}
    </main>
  )
}

export { PublicUserEmbeds }
