"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft, Loader2, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

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
import { ProjectInfoMarkdown } from "components/project-info-markdown"
import { supabase } from "lib/supabase/client"
import { bindGithubRepo } from "lib/embed-variables"
import { isValidEmbedSlug, slugifyEmbed } from "lib/standalone-embed-slug"
import {
  MAX_PROJECT_CATEGORIES,
  parseProjectCategories,
} from "lib/project-categories"
import { useCreateProjectDraft } from "./draft-context"

const maxProjectsPerAccount = 3

function CreateProjectPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { notify } = useNotification()
  const { draft, setDraft } = useCreateProjectDraft()
  const {
    title,
    projectUrl,
    shortDescription,
    categoriesInput,
    tagsInput,
    twitterUrl,
    youtubeUrl,
    githubUrl,
    infoInput,
    embeds,
  } = draft
  const [saveError, setSaveError] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [projectCount, setProjectCount] = React.useState<number | null>(null)

  React.useEffect(() => {
    if (!loading && !user) router.replace("/login")
  }, [loading, router, user])

  React.useEffect(() => {
    if (!user) return

    let cancelled = false

    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("owner_id", user.id)
      .then(({ count, error }) => {
        if (cancelled) return
        if (error) {
          setSaveError("Could not check your project limit. Please try again.")
        } else {
          setProjectCount(count ?? 0)
        }
      })

    return () => {
      cancelled = true
    }
  }, [user])

  if (loading || !user) {
    return (
      <div className="flex min-h-[70svh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const ownerId = user.id

  async function saveProject() {
    if (projectCount === null) {
      setSaveError(
        "Your project limit is still being checked. Please try again."
      )
      return
    }
    if (projectCount >= maxProjectsPerAccount) {
      setSaveError(
        `You can create up to ${maxProjectsPerAccount} projects per account. Delete a project before creating another.`
      )
      return
    }

    const name = title.trim()
    const description = shortDescription.trim()
    const url = projectUrl.trim()
    const categories = parseProjectCategories(categoriesInput)
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

    if (categories.length > MAX_PROJECT_CATEGORIES) {
      setSaveError(`Choose no more than ${MAX_PROJECT_CATEGORIES} categories.`)
      return
    }

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
        categories: categories.length ? categories : null,
        github_url: socials.github ?? null,
        tags: tags.length ? tags : null,
        socials: Object.keys(socials).length ? socials : null,
        info: infoInput.trim() || null,
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
      const slugs = embeds.map((embed) =>
        slugifyEmbed(embed.slug?.trim() || embed.name || "")
      )
      let embedsErrorMessage: string | null = null

      if (slugs.some((embedSlug) => !isValidEmbedSlug(embedSlug))) {
        embedsErrorMessage = "Invalid embed URL."
      } else {
        const { data: created, error: embedsError } = await supabase
          .from("standalone_embeds")
          .insert(
            embeds.map((embed, index) => ({
              owner_id: ownerId,
              slug: slugs[index],
              title: embed.name?.trim() || embed.title.trim() || name,
              image_title: bindGithubRepo(embed.title.trim(), embed.githubRepo),
              image_description: bindGithubRepo(
                embed.description.trim(),
                embed.githubRepo
              ),
              status: "approved" as const,
            }))
          )
          .select("id")

        if (embedsError || !created) {
          embedsErrorMessage =
            embedsError?.code === "23505"
              ? "An embed with this embed URL already exists in your account."
              : (embedsError?.message ?? "Could not create embeds.")
        } else {
          // The project is still a draft, so linking needs no moderation.
          const { error: linkError } = await supabase
            .from("standalone_embeds")
            .update({ project_id: project.id })
            .in(
              "id",
              created.map((item) => item.id)
            )
            .eq("owner_id", ownerId)
          if (linkError) embedsErrorMessage = linkError.message
        }
      }

      if (embedsErrorMessage) {
        setSaving(false)
        setSaveError(
          `Project was created, but embeds were not saved: ${embedsErrorMessage}`
        )
        return
      }
    }

    setSaving(false)
    notify("Project created successfully.")
    router.push("/account/projects")
  }

  return (
    <main className="site-container py-8 sm:py-12">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/account/projects">
            <ChevronLeft className="size-4" />
            My projects
          </Link>
        </Button>
        <h1 className="mt-4 text-2xl font-semibold">Create project</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add project details and configure embeds on a separate page. You can
          create up to {maxProjectsPerAccount} projects per account
          {projectCount === null ? "." : ` (${projectCount} used).`}
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project details</CardTitle>
              <CardDescription>
                These details are used by every embed on this project.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="project-title">Title</Label>
                <Input
                  id="project-title"
                  value={title}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="My project"
                  maxLength={80}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-categories">Categories</Label>
                <Input
                  id="project-categories"
                  value={categoriesInput}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      categoriesInput: event.target.value,
                    }))
                  }
                  placeholder="Developer tools, Productivity"
                  maxLength={224}
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated list, up to {MAX_PROJECT_CATEGORIES}.
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-tags">Tags</Label>
                <Input
                  id="project-tags"
                  value={tagsInput}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      tagsInput: event.target.value,
                    }))
                  }
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
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      shortDescription: event.target.value,
                    }))
                  }
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
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      projectUrl: event.target.value,
                    }))
                  }
                  placeholder="https://example.com/my-project"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project info (Markdown)</CardTitle>
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
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      infoInput: event.target.value,
                    }))
                  }
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
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      twitterUrl: event.target.value,
                    }))
                  }
                  placeholder="https://x.com/username"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-youtube">YouTube</Label>
                <Input
                  id="project-youtube"
                  type="url"
                  value={youtubeUrl}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      youtubeUrl: event.target.value,
                    }))
                  }
                  placeholder="https://youtube.com/@channel"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-github">GitHub</Label>
                <Input
                  id="project-github"
                  type="url"
                  value={githubUrl}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      githubUrl: event.target.value,
                    }))
                  }
                  placeholder="https://github.com/user/repo"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Embeds</CardTitle>
              <CardDescription>
                {embeds.length === 0
                  ? "No embeds configured yet."
                  : `${embeds.length} embed${embeds.length === 1 ? "" : "s"} configured.`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="sm" asChild>
                <Link href="/account/create-project/embeds">
                  <Plus className="size-4" />
                  Add or edit embeds
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-20">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Save project</CardTitle>
              <CardDescription>
                {projectCount !== null && projectCount >= maxProjectsPerAccount
                  ? "Delete one of your existing projects to create another."
                  : "Your project will be saved as a draft."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {saveError && (
                <p className="text-sm text-destructive" role="alert">
                  {saveError}
                </p>
              )}
              <Button
                onClick={() => void saveProject()}
                disabled={
                  saving ||
                  projectCount === null ||
                  projectCount >= maxProjectsPerAccount
                }
              >
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
