"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, Loader2, Plus, Trash2 } from "lucide-react"

import { useAuth } from "components/auth-provider"
import { useNotification } from "components/notification-provider"
import { Button } from "components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card"
import { Input } from "components/ui/input"
import { Label } from "components/ui/label"
import { Textarea } from "components/ui/textarea"
import { supabase } from "lib/supabase/client"

type Embed = {
  id: number
  shortId?: string
  title: string
  description: string
}

type ProjectStatus = "draft" | "pending" | "published" | "rejected"

const defaultEmbed = (id: number): Embed => ({
  id,
  title: "Built with EmbedCatalog",
  description: "A project worth checking out.",
})

const colors = {
  background: "#ffffff",
  border: "#d4d4d4",
  text: "#171717",
  muted: "#737373",
}

function EditEmbedsForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get("id")
  const { user, loading, isAdmin } = useAuth()
  const { notify } = useNotification()
  const [projectName, setProjectName] = React.useState("")
  const [status, setStatus] = React.useState<ProjectStatus | null>(null)
  const [embeds, setEmbeds] = React.useState<Embed[]>([])
  const [hasPendingChanges, setHasPendingChanges] = React.useState(false)
  const [fetching, setFetching] = React.useState(true)
  const [fetchError, setFetchError] = React.useState<string | null>(null)
  const [saveError, setSaveError] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    if (!loading && !user) router.replace("/login")
  }, [loading, router, user])

  React.useEffect(() => {
    if (!user || !projectId) return

    let cancelled = false

    async function load() {
      let query = supabase
        .from("projects")
        .select("id, name, status")
        .eq("id", projectId as string)

      if (!isAdmin) query = query.eq("owner_id", user!.id)

      const { data: project, error } = await query.single()
      if (cancelled) return

      if (error || !project) {
        setFetchError(error?.message ?? "Project not found.")
        setFetching(false)
        return
      }

      const { data: pendingEdit } = await supabase
        .from("project_edit_requests")
        .select("id")
        .eq("project_id", project.id)
        .eq("status", "pending")
        .maybeSingle()

      const { data: projectEmbeds, error: embedsError } = await supabase
        .from("project_embeds")
        .select("id, short_id, title, description, position")
        .eq("project_id", project.id)
        .order("position", { ascending: true })

      if (cancelled) return

      if (embedsError) {
        setFetchError(embedsError.message)
        setFetching(false)
        return
      }

      setProjectName(project.name)
      setStatus(project.status)
      setHasPendingChanges(Boolean(pendingEdit))
      setEmbeds(
        (projectEmbeds ?? []).map((embed, index) => ({
          id: index + 1,
          shortId: embed.short_id,
          title: embed.title,
          description: embed.description,
        }))
      )
      setFetching(false)
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [projectId, user, isAdmin])

  if (loading || !user) {
    return (
      <div className="flex min-h-[70svh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!projectId) {
    return (
      <main className="site-container py-8 sm:py-12">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/account/projects">
            <ChevronLeft className="size-4" />
            My projects
          </Link>
        </Button>
        <p className="mt-6 text-sm text-destructive" role="alert">
          Missing project id.
        </p>
      </main>
    )
  }

  if (fetching) {
    return (
      <div className="flex min-h-[70svh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (fetchError) {
    return (
      <main className="site-container py-8 sm:py-12">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/account/projects">
            <ChevronLeft className="size-4" />
            My projects
          </Link>
        </Button>
        <p className="mt-6 text-sm text-destructive" role="alert">
          {fetchError}
        </p>
      </main>
    )
  }

  const editingLocked = (status === "pending" || hasPendingChanges) && !isAdmin
  const needsModeration = status === "published" && !isAdmin

  function updateEmbed(id: number, changes: Partial<Embed>) {
    setEmbeds((current) =>
      current.map((embed) =>
        embed.id === id ? { ...embed, ...changes } : embed
      )
    )
  }

  async function saveEmbeds() {
    setSaving(true)
    setSaveError(null)

    const payload = embeds.map((embed, position) => ({
      title: embed.title.trim() || projectName,
      description: embed.description.trim(),
      position,
      ...(embed.shortId ? { short_id: embed.shortId } : {}),
    }))

    if (needsModeration) {
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .select(
          "name, description, url, github_url, tags, socials, images, info"
        )
        .eq("id", projectId as string)
        .single()

      if (projectError || !project) {
        setSaving(false)
        setSaveError(projectError?.message ?? "Project not found.")
        return
      }

      const { error } = await supabase.from("project_edit_requests").insert({
        ...project,
        info: typeof project.info === "string" ? project.info : null,
        project_id: projectId as string,
        owner_id: user!.id,
        embeds: payload,
      })

      setSaving(false)

      if (error) {
        setSaveError(error.message)
        return
      }

      notify("Changes sent for moderation.")
      router.push("/account/projects")
      return
    }

    const { error: deleteError } = await supabase
      .from("project_embeds")
      .delete()
      .eq("project_id", projectId as string)

    if (deleteError) {
      setSaving(false)
      setSaveError(deleteError.message)
      return
    }

    const { error: insertError } = payload.length
      ? await supabase.from("project_embeds").insert(
          payload.map((embed) => ({
            ...embed,
            project_id: projectId as string,
          }))
        )
      : { error: null }

    setSaving(false)

    if (insertError) {
      setSaveError(`Embeds were not saved: ${insertError.message}`)
      return
    }

    notify("Embeds updated successfully.")
    router.push(`/account/edit-project?id=${projectId}`)
  }

  return (
    <main className="site-container py-8 sm:py-12">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/account/edit-project?id=${projectId}`}>
            <ChevronLeft className="size-4" />
            Edit project
          </Link>
        </Button>
        <h1 className="mt-4 text-2xl font-semibold">Embed editor</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {editingLocked
            ? "This project is waiting for moderation and cannot be edited."
            : `Manage embeds for ${projectName}.`}
        </p>
      </div>

      <fieldset disabled={editingLocked} className="min-w-0">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold">Embeds</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create as many variations as you need.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() =>
                  setEmbeds((current) => [...current, defaultEmbed(Date.now())])
                }
              >
                <Plus className="size-4" />
                Add embed
              </Button>
            </div>
            {embeds.length === 0 && (
              <p className="text-sm text-muted-foreground">No embeds yet.</p>
            )}
            {embeds.map((embed, index) => (
              <Card key={embed.id}>
                <CardHeader>
                  <CardTitle className="text-lg">Embed {index + 1}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    aria-label={`Remove embed ${index + 1}`}
                    onClick={() =>
                      setEmbeds((current) =>
                        current.filter((item) => item.id !== embed.id)
                      )
                    }
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </CardHeader>
                <CardContent className="grid gap-5">
                  <div className="grid gap-2">
                    <Label htmlFor={`embed-title-${embed.id}`}>Title</Label>
                    <Input
                      id={`embed-title-${embed.id}`}
                      value={embed.title}
                      onChange={(event) =>
                        updateEmbed(embed.id, { title: event.target.value })
                      }
                      maxLength={80}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`embed-description-${embed.id}`}>
                      Description
                    </Label>
                    <Textarea
                      id={`embed-description-${embed.id}`}
                      value={embed.description}
                      onChange={(event) =>
                        updateEmbed(embed.id, {
                          description: event.target.value,
                        })
                      }
                      maxLength={160}
                    />
                  </div>
                </CardContent>
                <CardContent className="border-t pt-6">
                  <div className="flex min-h-32 items-center justify-center rounded-md border border-dashed bg-muted/40 p-5">
                    <div
                      className="w-full max-w-xs rounded border p-4"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                        color: colors.text,
                      }}
                    >
                      <p className="text-sm leading-5 font-semibold">
                        {embed.title || projectName || "Untitled embed"}
                      </p>
                      {embed.description && (
                        <p
                          className="mt-1 text-xs leading-[18px]"
                          style={{ color: colors.muted }}
                        >
                          {embed.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <aside className="lg:sticky lg:top-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Save embeds</CardTitle>
                <CardDescription>
                  {needsModeration
                    ? "Changes will be sent for moderation before they are published."
                    : "Changes are applied immediately."}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {saveError && (
                  <p className="text-sm text-destructive" role="alert">
                    {saveError}
                  </p>
                )}
                <Button
                  onClick={() => void saveEmbeds()}
                  disabled={saving || editingLocked}
                >
                  {saving && <Loader2 className="size-4 animate-spin" />}
                  {saving ? "Saving" : "Save embeds"}
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </fieldset>
    </main>
  )
}

function EditEmbedsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-[70svh] items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <EditEmbedsForm />
    </React.Suspense>
  )
}

export default EditEmbedsPage
