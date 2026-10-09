"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Images, Loader2 } from "lucide-react"

import { Button } from "components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card"
import type { Database } from "lib/supabase/database"
import type { StandaloneEmbedTheme } from "lib/standalone-embed-image"
import { supabase } from "lib/supabase/client"

type PublicEmbed = Pick<
  Database["public"]["Tables"]["standalone_embeds"]["Row"],
  "id" | "slug" | "title" | "description" | "created_at"
>

function PublicEmbedCard({
  profileSlug,
  embed,
}: {
  profileSlug: string
  embed: PublicEmbed
}) {
  const [theme, setTheme] = React.useState<StandaloneEmbedTheme>("light")
  const [useLegacyPath, setUseLegacyPath] = React.useState(false)
  const suffix = theme === "dark" ? ".theme-dark" : ""
  const path = useLegacyPath
    ? `user/${profileSlug}/${embed.slug}${suffix}.png`
    : `user/${profileSlug}/embeds/${embed.slug}${suffix}.png`
  const { data } = supabase.storage.from("standalone-embeds").getPublicUrl(path)

  return (
    <Card className="gap-4 py-4 shadow-none">
      <CardHeader className="px-4">
        <CardTitle className="text-sm font-medium">{embed.title}</CardTitle>
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
          src={data.publicUrl}
          alt={embed.title}
          width={320}
          height={84}
          unoptimized
          onError={() => setUseLegacyPath(true)}
        />
      </CardContent>
    </Card>
  )
}

function PublicUserEmbeds({ login }: { login: string }) {
  const [embeds, setEmbeds] = React.useState<PublicEmbed[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false

    async function loadProfile() {
      const { data: profile, error: profileError } = await supabase
        .from("standalone_embed_profiles")
        .select("owner_id, slug")
        .eq("slug", login)
        .maybeSingle()

      if (cancelled) return
      if (profileError || !profile) {
        setError("This profile could not be found.")
        setLoading(false)
        return
      }

      const { data, error: embedsError } = await supabase
        .from("standalone_embeds")
        .select("id, slug, title, description, created_at")
        .eq("owner_id", profile.owner_id)
        .eq("status", "approved")
        .is("project_id", null)
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
          <header className="mt-6 border-b pb-6">
            <p className="text-sm text-muted-foreground">Public profile</p>
            <h1 className="mt-1 text-2xl font-semibold">{login}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Custom embeds not linked to a project.
            </p>
          </header>

          {embeds.length === 0 ? (
            <Card className="mt-8 max-w-xl">
              <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                <Images className="size-8 text-muted-foreground" />
                <p className="font-medium">No public embeds yet</p>
                <p className="text-sm text-muted-foreground">
                  Approved custom embeds will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
