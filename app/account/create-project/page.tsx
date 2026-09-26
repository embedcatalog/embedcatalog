"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft, Loader2, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { useAuth } from "components/auth-provider"
import { Button } from "components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card"
import { Input } from "components/ui/input"
import { Label } from "components/ui/label"
import { Textarea } from "components/ui/textarea"
import { ProjectInfoMarkdown } from "components/project-info-markdown"
import { supabase } from "lib/supabase/client"
import { cn } from "lib/utils"

type Theme = "light" | "dark"

type Embed = {
  id: number
  title: string
  description: string
  theme: Theme
}

const defaultEmbed = (id: number): Embed => ({
  id,
  title: "Built with EmbedCatalog",
  description: "A project worth checking out.",
  theme: "light",
})

function getEmbedColors(theme: Theme) {
  return theme === "dark"
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
}

function ThemeSwitch({
  theme,
  onThemeChange,
}: {
  theme: Theme
  onThemeChange: (theme: Theme) => void
}) {
  const isDark = theme === "dark"

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "text-xs",
          !isDark ? "font-medium text-foreground" : "text-muted-foreground"
        )}
      >
        Light
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle embed theme"
        onClick={() => onThemeChange(isDark ? "light" : "dark")}
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full border transition-colors",
          isDark ? "border-foreground bg-foreground" : "border-border bg-muted"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-4 rounded-full bg-background shadow-sm transition-transform",
            isDark && "translate-x-4"
          )}
        />
      </button>
      <span
        className={cn(
          "text-xs",
          isDark ? "font-medium text-foreground" : "text-muted-foreground"
        )}
      >
        Dark
      </span>
    </div>
  )
}

function CreateProjectPage() {
  const router = useRouter()
  const { user, loading, isAdmin } = useAuth()
  const [title, setTitle] = React.useState("")
  const [projectUrl, setProjectUrl] = React.useState("https://example.com")
  const [shortDescription, setShortDescription] = React.useState("")
  const [tagsInput, setTagsInput] = React.useState("")
  const [twitterUrl, setTwitterUrl] = React.useState("")
  const [youtubeUrl, setYoutubeUrl] = React.useState("")
  const [githubUrl, setGithubUrl] = React.useState("")
  const [infoInput, setInfoInput] = React.useState("")
  const [embeds, setEmbeds] = React.useState<Embed[]>([])
  const [saveError, setSaveError] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    if (!loading && !user) router.replace("/login")
  }, [loading, router, user])

  if (loading || !user) {
    return (
      <div className="flex min-h-[70svh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const ownerId = user.id

  function updateEmbed(id: number, changes: Partial<Embed>) {
    setEmbeds((current) =>
      current.map((embed) =>
        embed.id === id ? { ...embed, ...changes } : embed
      )
    )
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
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

    if (!name || !description || !slug || !url) {
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

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        owner_id: ownerId,
        slug,
        name,
        description,
        url,
        github_url: socials.github ?? null,
        tags: tags.length ? tags : null,
        socials: Object.keys(socials).length ? socials : null,
        info: isAdmin && infoInput.trim() ? infoInput.trim() : null,
      })
      .select("id")
      .single()

    if (projectError) {
      setSaving(false)
      setSaveError(
        projectError.code === "23505"
          ? "A project with this name already exists. Choose another name."
          : projectError.message
      )
      return
    }

    if (embeds.length > 0) {
      const { error: embedsError } = await supabase
        .from("project_embeds")
        .insert(
          embeds.map((embed, position) => ({
            project_id: project.id,
            title: embed.title.trim() || name,
            description: embed.description.trim(),
            position,
          }))
        )

      if (embedsError) {
        setSaving(false)
        setSaveError(
          `Project was created, but embeds were not saved: ${embedsError.message}`
        )
        return
      }
    }

    setSaving(false)
    router.push("/account")
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
        <h1 className="mt-4 text-2xl font-semibold">Create project</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add project details, then create embeds for it.
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
                <CardTitle className="text-lg">
                  Project info (Markdown)
                </CardTitle>
                <CardDescription>
                  Write Markdown. Tables, task lists, code blocks, links, and
                  images are supported.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="project-info-markdown">Markdown</Label>
                  <Textarea
                    id="project-info-markdown"
                    aria-label="Project info Markdown"
                    value={infoInput}
                    onChange={(event) => setInfoInput(event.target.value)}
                    placeholder={
                      "## Example\n\nDescribe your project with **Markdown**."
                    }
                    className="min-h-80 resize-y font-mono text-sm leading-relaxed"
                  />
                </div>
                <div className="min-w-0">
                  <p className="mb-2 text-sm font-medium">Preview</p>
                  <div className="min-h-80 overflow-x-auto rounded-md border p-4">
                    {infoInput.trim() ? (
                      <ProjectInfoMarkdown content={infoInput} />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Markdown preview will appear here.
                      </p>
                    )}
                  </div>
                </div>
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
                Optional. Create as many variations as you need.
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
            <p className="text-sm text-muted-foreground">
              No embeds yet. You can add one now or later from the project page.
            </p>
          )}
          {embeds.map((embed, index) => {
            const colors = getEmbedColors(embed.theme)
            return (
              <Card key={embed.id}>
                <CardHeader>
                  <CardTitle className="text-lg">Embed {index + 1}</CardTitle>
                  <CardAction className="flex items-center gap-2">
                    <ThemeSwitch
                      theme={embed.theme}
                      onThemeChange={(theme) =>
                        updateEmbed(embed.id, { theme })
                      }
                    />
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
                  </CardAction>
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
                Your project will be saved as a draft.
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
                {saving ? "Saving" : "Save project"}
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}

export default CreateProjectPage
