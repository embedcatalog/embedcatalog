"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Loader2 } from "lucide-react"

import { useAuth } from "components/auth-provider"
import { Button } from "components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card"
import { ProjectEmbedEditor } from "components/project-embed-editor"
import type { CreateProjectEmbed } from "app/account/create-project/draft-context"
import { supabase } from "lib/supabase/client"

const maximumEmbedsPerSubmission = 20

function createAnonymousProfileSlug() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12)
}

const defaultEmbed = (id: number): CreateProjectEmbed => ({
  id,
  title: "Built with EmbedCatalog",
  description: "A project worth checking out.",
  theme: "light",
})

function CreateEmbedPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [profileSlug, setProfileSlug] = React.useState<string | null>(null)
  const [embeds, setEmbeds] = React.useState<CreateProjectEmbed[]>(() => [
    defaultEmbed(Date.now()),
  ])
  const [fetchingProfile, setFetchingProfile] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [notice, setNotice] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!loading && !user) router.replace("/login")
  }, [loading, router, user])

  React.useEffect(() => {
    if (!user) return

    let cancelled = false

    async function loadProfile() {
      const { data: existingProfile, error: profileError } = await supabase
        .from("standalone_embed_profiles")
        .select("owner_id, slug, created_at")
        .eq("owner_id", user!.id)
        .maybeSingle()

      if (cancelled) return

      let currentProfile = existingProfile
      if (!currentProfile && !profileError) {
        for (let attempt = 0; attempt < 5; attempt += 1) {
          const { data, error: createError } = await supabase
            .from("standalone_embed_profiles")
            .insert({
              owner_id: user!.id,
              slug: createAnonymousProfileSlug(),
            })
            .select("owner_id, slug, created_at")
            .single()

          if (cancelled) return
          if (!createError && data) {
            currentProfile = data
            break
          }
          if (createError?.code !== "23505") {
            setError(createError?.message ?? "Could not create a profile ID.")
            setFetchingProfile(false)
            return
          }
        }

        if (!currentProfile) {
          setError("Could not generate a unique profile ID. Please try again.")
          setFetchingProfile(false)
          return
        }
      }

      if (profileError || !currentProfile) {
        setError(profileError?.message ?? "Could not create a profile slug.")
      } else {
        setProfileSlug(currentProfile.slug)
      }
      setFetchingProfile(false)
    }

    void loadProfile()
    return () => {
      cancelled = true
    }
  }, [user])

  if (loading || !user || fetchingProfile) {
    return (
      <div className="flex min-h-[70svh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  async function submitEmbeds() {
    if (!user || !profileSlug) return
    if (embeds.length === 0) {
      setError("Add at least one embed.")
      return
    }
    if (embeds.length > maximumEmbedsPerSubmission) {
      setError(`Submit up to ${maximumEmbedsPerSubmission} embeds at a time.`)
      return
    }
    if (embeds.some((embed) => !embed.title.trim())) {
      setError("Enter a title for each embed.")
      return
    }

    setSaving(true)
    setError(null)
    setNotice(null)

    const rows = embeds.map((embed) => ({
      owner_id: user.id,
      slug: crypto.randomUUID().slice(0, 8),
      title: embed.title.trim(),
      description: embed.description.trim(),
      status: "pending" as const,
    }))

    const { data, error: insertError } = await supabase
      .from("standalone_embeds")
      .insert(rows)
      .select(
        "id, owner_id, slug, title, description, project_id, status, created_at"
      )

    setSaving(false)
    if (insertError || !data) {
      setError(insertError?.message ?? "Could not submit the embeds.")
      return
    }

    setEmbeds([])
    setNotice(
      `${data.length} embed${data.length === 1 ? "" : "s"} submitted for review.`
    )
  }

  return (
    <main className="site-container py-8 sm:py-12">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/account">
            <ChevronLeft className="size-4" />
            Account
          </Link>
        </Button>
        <h1 className="mt-4 text-2xl font-semibold">Create embed</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Design up to {maximumEmbedsPerSubmission} custom image embeds for
          review.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <ProjectEmbedEditor
          embeds={embeds}
          onEmbedsChange={setEmbeds}
          maxEmbeds={maximumEmbedsPerSubmission}
        />

        <aside className="lg:sticky lg:top-20">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Submit embeds</CardTitle>
              <CardDescription>
                Each approved embed gets its own image URL under your profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}
              {notice && (
                <p className="text-sm text-muted-foreground" role="status">
                  {notice}
                </p>
              )}
              <Button
                type="button"
                onClick={() => void submitEmbeds()}
                disabled={saving || embeds.length === 0 || !profileSlug}
              >
                {saving && <Loader2 className="size-4 animate-spin" />}
                {saving ? "Submitting" : "Submit for review"}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/account/embeds">My embeds</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}

export default CreateEmbedPage
