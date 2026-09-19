"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Check,
  ChevronLeft,
  Copy,
  Loader2,
  Moon,
  Plus,
  Sun,
  Trash2,
} from "lucide-react"

import { useAuth } from "components/auth-provider"
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

type Theme = "light" | "dark"
type Embed = { id: number; title: string; description: string; theme: Theme }

const defaultEmbed = (id: number): Embed => ({
  id,
  title: "Built with EmbedCatalog",
  description: "A project worth checking out.",
  theme: "light",
})

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    }
    return entities[character]
  })
}

function EditProjectForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get("id")
  const { user, loading, isAdmin } = useAuth()
  const [title, setTitle] = React.useState("")
  const [projectUrl, setProjectUrl] = React.useState("")
  const [shortDescription, setShortDescription] = React.useState("")
  const [tagsInput, setTagsInput] = React.useState("")
  const [imagesInput, setImagesInput] = React.useState("")
  const [twitterUrl, setTwitterUrl] = React.useState("")
  const [youtubeUrl, setYoutubeUrl] = React.useState("")
  const [githubUrl, setGithubUrl] = React.useState("")
  const [embeds, setEmbeds] = React.useState<Embed[]>([defaultEmbed(1)])
  const [copiedId, setCopiedId] = React.useState<number | null>(null)
  const [saveError, setSaveError] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [fetching, setFetching] = React.useState(true)
  const [fetchError, setFetchError] = React.useState<string | null>(null)
  const [status, setStatus] = React.useState<
    "draft" | "pending" | "published" | "rejected" | null
  >(null)

  React.useEffect(() => {
    if (!loading && !user) router.replace("/login")
  }, [loading, router, user])

  React.useEffect(() => {
    if (!user) return

    if (!projectId) {
      setFetchError("Missing project id.")
      setFetching(false)
      return
    }

    let cancelled = false

    async function loadProject() {
      let query = supabase
        .from("projects")
        .select(
          "id, owner_id, name, description, url, github_url, tags, socials, images, status"
        )
        .eq("id", projectId as string)

      if (!isAdmin) {
        query = query.eq("owner_id", user!.id)
      }

      const { data: project, error: projectError } = await query.single()

      if (cancelled) return

      if (projectError || !project) {
        setFetchError(projectError?.message ?? "Project not found.")
        setFetching(false)
        return
      }

      setStatus(project.status)
      setTitle(project.name)
      setShortDescription(project.description)
      setProjectUrl(project.url)
      setTagsInput((project.tags ?? []).join(", "))
      setImagesInput((project.images ?? []).join("\n"))
      const socials = project.socials ?? {}
      setTwitterUrl(socials.twitter ?? "")
      setYoutubeUrl(socials.youtube ?? "")
      setGithubUrl(project.github_url ?? socials.github ?? "")

      const { data: projectEmbeds, error: embedsError } = await supabase
        .from("project_embeds")
        .select("id, title, description, theme, position")
        .eq("project_id", projectId as string)
        .order("position", { ascending: true })

      if (cancelled) return

      if (embedsError) {
        setFetchError(embedsError.message)
        setFetching(false)
        return
      }

      if (projectEmbeds && projectEmbeds.length > 0) {
        setEmbeds(
          projectEmbeds.map((embed, index) => ({
            id: index + 1,
            title: embed.title,
            description: embed.description,
            theme: embed.theme,
          }))
        )
      }

      setFetching(false)
    }

    void loadProject()

    return () => {
      cancelled = true
    }
  }, [projectId, router, user, isAdmin])

  if (loading || !user || fetching) {
    return (
      <div className="flex min-h-[70svh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (fetchError) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/account">
            <ChevronLeft className="size-4" />
            Account
          </Link>
        </Button>
        <p className="mt-6 text-sm text-destructive" role="alert">
          {fetchError}
        </p>
      </main>
    )
  }

  if (status === "pending" && !isAdmin) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/account">
            <ChevronLeft className="size-4" />
            Account
          </Link>
        </Button>
        <h1 className="mt-4 text-2xl font-semibold">Edit project</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This project was submitted for moderation and can&rsquo;t be edited
          until it&rsquo;s reviewed.
        </p>
      </main>
    )
  }

  function updateEmbed(id: number, changes: Partial<Embed>) {
    setEmbeds((current) =>
      current.map((embed) =>
        embed.id === id ? { ...embed, ...changes } : embed
      )
    )
  }

  function embedCode(embed: Embed) {
    const colors =
      embed.theme === "dark"
        ? {
            background: "#171717",
            border: "#404040",
            text: "#fafafa",
            muted: "#a3a3a3",
          }
        : {
            background: "#ffffff",
            border: "#d4d4d4",
            text: "#171717",
            muted: "#737373",
          }
    return `<a href="${escapeHtml(projectUrl)}" target="_blank" rel="noreferrer noopener" style="display:inline-block;color:${colors.text};text-decoration:none"><span style="display:block;max-width:320px;border:1px solid ${colors.border};border-radius:4px;background:${colors.background};padding:14px 16px;font-family:Arial,sans-serif"><strong style="display:block;font-size:14px;line-height:20px">${escapeHtml(embed.title)}</strong><span style="display:block;margin-top:4px;color:${colors.muted};font-size:12px;line-height:18px">${escapeHtml(embed.description)}</span></span></a>`
  }

  async function copyEmbed(embed: Embed) {
    await navigator.clipboard.writeText(embedCode(embed))
    setCopiedId(embed.id)
    window.setTimeout(() => setCopiedId(null), 2000)
  }

  async function saveProject() {
    const name = title.trim()
    const description = shortDescription.trim()
    const url = projectUrl.trim()
    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
    const socials: Record<string, string> = {}
    if (twitterUrl.trim()) socials.twitter = twitterUrl.trim()
    if (youtubeUrl.trim()) socials.youtube = youtubeUrl.trim()
    if (githubUrl.trim()) socials.github = githubUrl.trim()
    const images = imagesInput
      .split("\n")
      .map((image) => image.trim())
      .filter(Boolean)

    if (!name || !description || !url) {
      setSaveError("Enter a title, short description, and valid URL.")
      return
    }

    try {
      new URL(url)
    } catch {
      setSaveError("Enter a valid project URL.")
      return
    }

    setSaving(true)
    setSaveError(null)

    const { error: projectError } = await supabase
      .from("projects")
      .update({
        name,
        description,
        url,
        github_url: socials.github ?? null,
        tags: tags.length ? tags : null,
        socials: Object.keys(socials).length ? socials : null,
        images: images.length ? images : null,
      })
      .eq("id", projectId as string)

    if (projectError) {
      setSaving(false)
      setSaveError(
        projectError.code === "23505"
          ? "A project with this name already exists. Choose another name."
          : projectError.message
      )
      return
    }

    const { error: deleteError } = await supabase
      .from("project_embeds")
      .delete()
      .eq("project_id", projectId as string)

    if (deleteError) {
      setSaving(false)
      setSaveError(
        `Project was updated, but embeds were not saved: ${deleteError.message}`
      )
      return
    }

    const { error: embedsError } = await supabase.from("project_embeds").insert(
      embeds.map((embed, position) => ({
        project_id: projectId as string,
        title: embed.title.trim() || name,
        description: embed.description.trim(),
        theme: embed.theme,
        position,
      }))
    )

    setSaving(false)

    if (embedsError) {
      setSaveError(
        `Project was updated, but embeds were not saved: ${embedsError.message}`
      )
      return
    }

    router.push("/account")
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/account">
            <ChevronLeft className="size-4" />
            Account
          </Link>
        </Button>
        <h1 className="mt-4 text-2xl font-semibold">Edit project</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Update project details and embeds.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project details</CardTitle>
              <CardDescription>
                These details are used by every embed below.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="project-title">Title</Label>
                <Input
                  id="project-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="My project"
                  maxLength={80}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-tags">Tags</Label>
                <Input
                  id="project-tags"
                  value={tagsInput}
                  onChange={(event) => setTagsInput(event.target.value)}
                  placeholder="design, AI"
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated list of tags.
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-short-description">
                  Short description
                </Label>
                <Textarea
                  id="project-short-description"
                  value={shortDescription}
                  onChange={(event) => setShortDescription(event.target.value)}
                  placeholder="A short summary of what it does."
                  maxLength={240}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-url">URL</Label>
                <Input
                  id="project-url"
                  type="url"
                  value={projectUrl}
                  onChange={(event) => setProjectUrl(event.target.value)}
                  placeholder="https://example.com/my-project"
                />
              </div>
            </CardContent>
          </Card>

          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Images</CardTitle>
                <CardDescription>
                  One image URL per line. Used on the project&rsquo;s catalog
                  page.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Label htmlFor="project-images">Image URLs</Label>
                <Textarea
                  id="project-images"
                  value={imagesInput}
                  onChange={(event) => setImagesInput(event.target.value)}
                  placeholder={
                    "/images/my-project/photo1.png\n/images/my-project/photo2.png"
                  }
                  className="min-h-32"
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Socials</CardTitle>
              <CardDescription>
                Optional links to your project&rsquo;s social profiles.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="project-twitter">Twitter</Label>
                <Input
                  id="project-twitter"
                  type="url"
                  value={twitterUrl}
                  onChange={(event) => setTwitterUrl(event.target.value)}
                  placeholder="https://x.com/username"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-youtube">YouTube</Label>
                <Input
                  id="project-youtube"
                  type="url"
                  value={youtubeUrl}
                  onChange={(event) => setYoutubeUrl(event.target.value)}
                  placeholder="https://youtube.com/@channel"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-github">GitHub</Label>
                <Input
                  id="project-github"
                  type="url"
                  value={githubUrl}
                  onChange={(event) => setGithubUrl(event.target.value)}
                  placeholder="https://github.com/user/repo"
                />
              </div>
            </CardContent>
          </Card>

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
          {embeds.map((embed, index) => {
            const colors =
              embed.theme === "dark"
                ? {
                    background: "#171717",
                    border: "#404040",
                    text: "#fafafa",
                    muted: "#a3a3a3",
                  }
                : {
                    background: "#ffffff",
                    border: "#d4d4d4",
                    text: "#171717",
                    muted: "#737373",
                  }
            return (
              <Card key={embed.id}>
                <CardHeader>
                  <CardTitle className="text-lg">Embed {index + 1}</CardTitle>
                  {embeds.length > 1 && (
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
                  )}
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
                  <div className="grid gap-2">
                    <Label>Theme</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["light", "dark"] as const).map((theme) => {
                        const Icon = theme === "light" ? Sun : Moon
                        return (
                          <Button
                            key={theme}
                            type="button"
                            variant={
                              embed.theme === theme ? "secondary" : "outline"
                            }
                            className="capitalize"
                            onClick={() => updateEmbed(embed.id, { theme })}
                          >
                            <Icon className="size-4" />
                            {theme}
                          </Button>
                        )
                      })}
                    </div>
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
                        {embed.title || title || "Untitled embed"}
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
            )
          })}
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-20">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Save project</CardTitle>
              <CardDescription>
                Changes are applied immediately.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {saveError && (
                <p className="text-sm text-destructive" role="alert">
                  {saveError}
                </p>
              )}
              <Button onClick={() => void saveProject()} disabled={saving}>
                {saving && <Loader2 className="size-4 animate-spin" />}
                {saving ? "Saving" : "Save changes"}
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Embed code</CardTitle>
              <CardDescription>
                Copy the code for each variation.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {embeds.map((embed, index) => (
                <div key={embed.id} className="flex flex-col gap-2">
                  <p className="text-sm font-medium">Embed {index + 1}</p>
                  <code className="max-h-28 overflow-auto rounded-md border bg-muted px-3 py-2 text-xs leading-relaxed break-all">
                    {embedCode(embed)}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => void copyEmbed(embed)}
                  >
                    {copiedId === embed.id ? (
                      <Check className="size-4" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                    {copiedId === embed.id ? "Copied" : "Copy code"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}

function EditProjectPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-[70svh] items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <EditProjectForm />
    </React.Suspense>
  )
}

export default EditProjectPage
