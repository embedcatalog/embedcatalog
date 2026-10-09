"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { useRouter } from "next/navigation"
import {
  Check,
  ChevronLeft,
  Copy,
  Ellipsis,
  Images,
  Loader2,
  Trash2,
} from "lucide-react"

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
import type { Database } from "lib/supabase/database"
import {
  imageHeight,
  imageWidth,
  type StandaloneEmbedTheme,
} from "lib/standalone-embed-image"
import { supabase } from "lib/supabase/client"

type StandaloneEmbed = Database["public"]["Tables"]["standalone_embeds"]["Row"]
type ProjectEmbed = Database["public"]["Tables"]["project_embeds"]["Row"]
type OwnedProject = {
  id: string
  name: string
  slug: string
  url: string
  status: string
}
type ProjectEmbedWithProject = ProjectEmbed & { project: OwnedProject }

function StandaloneEmbedCard({
  embed,
  profileSlug,
  projects,
  linkedProject,
  linking,
  deleting,
  onProjectChange,
  onDelete,
}: {
  embed: StandaloneEmbed
  profileSlug: string | null
  projects: OwnedProject[]
  linkedProject?: OwnedProject
  linking: boolean
  deleting: boolean
  onProjectChange: (projectId: string | null) => void
  onDelete: () => void
}) {
  const [theme, setTheme] = React.useState<StandaloneEmbedTheme>("light")
  const [copied, setCopied] = React.useState(false)
  const [useLegacyPath, setUseLegacyPath] = React.useState(false)
  const suffix = theme === "dark" ? ".theme-dark" : ""
  const path = profileSlug
    ? useLegacyPath
      ? `user/${profileSlug}/${embed.slug}${suffix}.png`
      : `user/${profileSlug}/embeds/${embed.slug}${suffix}.png`
    : ""
  const { data } = supabase.storage.from("standalone-embeds").getPublicUrl(path)
  const code = `<img src="${data.publicUrl}" alt="${embed.title}" width="${imageWidth}" height="${imageHeight}" />`

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Card className="gap-4 py-4 shadow-none">
      <CardHeader className="border-b px-4 pb-4">
        <CardTitle className="text-sm font-medium">{embed.title}</CardTitle>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{embed.slug}.png</span>
          <span className="capitalize">{embed.status}</span>
        </div>
        <CardAction>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label={`Actions for ${embed.title}`}
                title="Embed actions"
                disabled={linking || deleting}
              >
                <Ellipsis className="size-4" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={4}
                className="z-50 min-w-52 rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
              >
                <DropdownMenu.Label className="px-2 py-1.5 text-xs text-muted-foreground">
                  {linkedProject
                    ? `Linked to ${linkedProject.name}`
                    : "Link to project"}
                </DropdownMenu.Label>
                <DropdownMenu.Item
                  onSelect={() => onProjectChange(null)}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus:bg-accent"
                >
                  Not linked
                  {!linkedProject && <Check className="size-4" />}
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="my-1 h-px bg-border" />
                {projects.map((project) => (
                  <DropdownMenu.Item
                    key={project.id}
                    onSelect={() => onProjectChange(project.id)}
                    className="flex cursor-pointer items-center justify-between gap-3 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus:bg-accent"
                  >
                    <span className="min-w-0 truncate">{project.name}</span>
                    {linkedProject?.id === project.id && (
                      <Check className="size-4 shrink-0" />
                    )}
                  </DropdownMenu.Item>
                ))}
                {embed.status !== "approved" && (
                  <>
                    <DropdownMenu.Separator className="my-1 h-px bg-border" />
                    <DropdownMenu.Item
                      onSelect={onDelete}
                      className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive outline-none hover:bg-accent focus:bg-accent"
                    >
                      {deleting ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                      Delete submission
                    </DropdownMenu.Item>
                  </>
                )}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-4">
        {embed.status === "approved" && profileSlug ? (
          <>
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
                onClick={() => {
                  setTheme("light")
                  setUseLegacyPath(false)
                }}
              >
                Light
              </Button>
              <Button
                type="button"
                size="sm"
                variant={theme === "dark" ? "secondary" : "ghost"}
                aria-pressed={theme === "dark"}
                onClick={() => {
                  setTheme("dark")
                  setUseLegacyPath(false)
                }}
              >
                Dark
              </Button>
            </div>
            <Image
              src={data.publicUrl}
              alt={embed.title}
              width={imageWidth}
              height={imageHeight}
              unoptimized
              onError={() => setUseLegacyPath(true)}
            />
            <code className="block overflow-x-auto rounded-md border bg-muted p-2 text-xs whitespace-nowrap text-muted-foreground">
              {code}
            </code>
            <Button
              type="button"
              variant="outline"
              onClick={() => void copyCode()}
            >
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
              {copied ? "Copied" : "Copy embed code"}
            </Button>
          </>
        ) : (
          <div className="rounded-md border bg-muted/40 p-4">
            <p className="text-sm font-medium capitalize">
              {embed.status === "pending" ? "Pending review" : "Rejected"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {embed.description || "No description provided."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function AccountEmbedsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [profileSlug, setProfileSlug] = React.useState<string | null>(null)
  const [projects, setProjects] = React.useState<OwnedProject[]>([])
  const [projectEmbeds, setProjectEmbeds] = React.useState<
    ProjectEmbedWithProject[]
  >([])
  const [standaloneEmbeds, setStandaloneEmbeds] = React.useState<
    StandaloneEmbed[]
  >([])
  const [fetching, setFetching] = React.useState(true)
  const [linkingId, setLinkingId] = React.useState<string | null>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [notice, setNotice] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!loading && !user) router.replace("/login")
  }, [loading, router, user])

  React.useEffect(() => {
    if (!user) return

    let cancelled = false

    async function loadEmbeds() {
      const [profileResult, projectsResult, standaloneResult] =
        await Promise.all([
          supabase
            .from("standalone_embed_profiles")
            .select("slug")
            .eq("owner_id", user!.id)
            .maybeSingle(),
          supabase
            .from("projects")
            .select("id, name, slug, url, status")
            .eq("owner_id", user!.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("standalone_embeds")
            .select(
              "id, owner_id, slug, title, description, project_id, status, created_at"
            )
            .eq("owner_id", user!.id)
            .order("created_at", { ascending: false }),
        ])

      if (cancelled) return
      if (
        profileResult.error ||
        projectsResult.error ||
        standaloneResult.error
      ) {
        setError(
          profileResult.error?.message ??
            projectsResult.error?.message ??
            standaloneResult.error?.message ??
            "Could not load your embeds."
        )
        setFetching(false)
        return
      }

      const ownedProjects = projectsResult.data ?? []
      const projectIds = ownedProjects.map((project) => project.id)
      let loadedProjectEmbeds: ProjectEmbedWithProject[] = []

      if (projectIds.length > 0) {
        const { data, error: projectEmbedsError } = await supabase
          .from("project_embeds")
          .select(
            "id, project_id, short_id, title, description, position, created_at, updated_at"
          )
          .in("project_id", projectIds)
          .order("position", { ascending: true })

        if (cancelled) return
        if (projectEmbedsError) {
          setError(projectEmbedsError.message)
          setFetching(false)
          return
        }

        const projectsById = new Map(
          ownedProjects.map((project) => [project.id, project])
        )
        loadedProjectEmbeds = (data ?? []).flatMap((embed) => {
          const project = projectsById.get(embed.project_id)
          return project ? [{ ...embed, project }] : []
        })
      }

      setProfileSlug(profileResult.data?.slug ?? null)
      setProjects(ownedProjects)
      setProjectEmbeds(loadedProjectEmbeds)
      setStandaloneEmbeds(standaloneResult.data ?? [])
      setFetching(false)
    }

    void loadEmbeds()
    return () => {
      cancelled = true
    }
  }, [user])

  if (loading || !user || fetching) {
    return (
      <div className="flex min-h-[70svh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  async function setEmbedProject(
    embed: StandaloneEmbed,
    projectId: string | null
  ) {
    setLinkingId(embed.id)
    setError(null)
    setNotice(null)

    const { error: updateError } = await supabase.rpc(
      "set_standalone_embed_project",
      { p_embed_id: embed.id, p_project_id: projectId }
    )

    if (updateError) {
      setError(updateError.message)
      setLinkingId(null)
      return
    }

    setStandaloneEmbeds((current) =>
      current.map((item) =>
        item.id === embed.id ? { ...item, project_id: projectId } : item
      )
    )
    setNotice(projectId ? "Embed linked to project." : "Project link removed.")
    setLinkingId(null)
  }

  async function deleteEmbed(embed: StandaloneEmbed) {
    if (!user) return
    if (
      !window.confirm("Delete this embed submission? This can't be undone.")
    ) {
      return
    }
    setDeletingId(embed.id)
    setError(null)

    const { error: deleteError } = await supabase
      .from("standalone_embeds")
      .delete()
      .eq("id", embed.id)
      .eq("owner_id", user.id)

    if (deleteError) {
      setError(deleteError.message)
    } else {
      setStandaloneEmbeds((current) =>
        current.filter((item) => item.id !== embed.id)
      )
      setNotice("Embed deleted.")
    }
    setDeletingId(null)
  }

  const projectsById = new Map(projects.map((project) => [project.id, project]))

  return (
    <main className="site-container py-8 sm:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/account">
              <ChevronLeft className="size-4" />
              Account
            </Link>
          </Button>
          <h1 className="mt-4 text-2xl font-semibold">My embeds</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Project embeds and your custom image embeds.
          </p>
        </div>
        <div className="flex gap-2">
          {profileSlug && (
            <Button variant="outline" asChild>
              <Link href={`/user/${encodeURIComponent(profileSlug)}`}>
                View public profile
              </Link>
            </Button>
          )}
          <Button asChild>
            <Link href="/account/create-embed">Create embed</Link>
          </Button>
        </div>
      </div>

      {(error || notice) && (
        <p
          className={`mb-6 text-sm ${error ? "text-destructive" : "text-muted-foreground"}`}
          role={error ? "alert" : "status"}
        >
          {error ?? notice}
        </p>
      )}

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="font-semibold">Project embeds</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Embeds configured on your projects.
          </p>
        </div>
        {projectEmbeds.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
              <Images className="size-7 text-muted-foreground" />
              <p className="font-medium">No project embeds yet</p>
              <Button variant="link" asChild>
                <Link href="/account/create-project">Create a project</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {projectEmbeds.map((embed) => (
              <Card key={embed.id} className="gap-3 py-4 shadow-none">
                <CardHeader className="px-4">
                  <CardTitle className="text-sm font-medium">
                    {embed.title}
                  </CardTitle>
                  <CardDescription>
                    {embed.project.name} · {embed.project.status}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 px-4">
                  <p className="text-sm text-muted-foreground">
                    {embed.description || "No description provided."}
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/account/edit-embeds?id=${embed.project.id}`}>
                      Edit project embeds
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10 flex flex-col gap-4">
        <div>
          <h2 className="font-semibold">Custom embeds</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Link approved embeds to any of your projects from the actions menu.
          </p>
        </div>
        {standaloneEmbeds.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
              <Images className="size-7 text-muted-foreground" />
              <p className="font-medium">No custom embeds yet</p>
              <Button variant="link" asChild>
                <Link href="/account/create-embed">Create an embed</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          standaloneEmbeds.map((embed) => (
            <StandaloneEmbedCard
              key={embed.id}
              embed={embed}
              profileSlug={profileSlug}
              projects={projects}
              linkedProject={
                embed.project_id
                  ? projectsById.get(embed.project_id)
                  : undefined
              }
              linking={linkingId === embed.id}
              deleting={deletingId === embed.id}
              onProjectChange={(projectId) =>
                void setEmbedProject(embed, projectId)
              }
              onDelete={() => void deleteEmbed(embed)}
            />
          ))
        )}
      </section>
    </main>
  )
}

export default AccountEmbedsPage
