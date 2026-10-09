"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Check,
  ChevronLeft,
  Crown,
  Loader2,
  Pencil,
  Trash2,
  X,
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
import type { Database } from "lib/supabase/database"
import { supabase } from "lib/supabase/client"

type ProjectStatus = "draft" | "pending" | "published" | "rejected"
type Project = {
  id: string
  name: string
  description: string
  url: string
  status: ProjectStatus
  submission_comment: string | null
  is_premium: boolean
  created_at: string
}
type ProjectEditRequest = {
  id: string
  project_id: string
  name: string
  description: string
  url: string
  tags: string[] | null
  created_at: string
}
type StandaloneEmbedSubmission =
  Database["public"]["Tables"]["standalone_embeds"]["Row"] & {
    profileSlug: string
  }

function AdminPage() {
  const router = useRouter()
  const { user, loading, isAdmin } = useAuth()
  const [projects, setProjects] = React.useState<Project[]>([])
  const [projectsLoading, setProjectsLoading] = React.useState(true)
  const [projectsError, setProjectsError] = React.useState<string | null>(null)
  const [actioningId, setActioningId] = React.useState<string | null>(null)
  const [pendingEdits, setPendingEdits] = React.useState<ProjectEditRequest[]>(
    []
  )
  const [pendingStandaloneEmbeds, setPendingStandaloneEmbeds] = React.useState<
    StandaloneEmbedSubmission[]
  >([])
  const [standaloneEmbedsLoading, setStandaloneEmbedsLoading] =
    React.useState(true)

  React.useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace("/account")
  }, [loading, isAdmin, router, user])

  React.useEffect(() => {
    if (!user || !isAdmin) return

    let cancelled = false

    supabase
      .from("projects")
      .select(
        "id, name, description, url, status, submission_comment, is_premium, created_at"
      )
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          setProjectsError(error.message)
        } else {
          setProjects(data)
        }
        setProjectsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user, isAdmin])

  React.useEffect(() => {
    if (!user || !isAdmin) return

    let cancelled = false

    async function loadPendingStandaloneEmbeds() {
      const [embedsResult, profilesResult] = await Promise.all([
        supabase
          .from("standalone_embeds")
          .select(
            "id, owner_id, slug, title, description, project_id, status, created_at"
          )
          .eq("status", "pending")
          .order("created_at", { ascending: true }),
        supabase
          .from("standalone_embed_profiles")
          .select("owner_id, slug, created_at"),
      ])

      if (cancelled) return

      if (embedsResult.error || profilesResult.error) {
        setProjectsError(
          embedsResult.error?.message ??
            profilesResult.error?.message ??
            "Could not load pending embeds."
        )
        setStandaloneEmbedsLoading(false)
        return
      }

      const profileSlugs = new Map(
        (profilesResult.data ?? []).map((profile) => [
          profile.owner_id,
          profile.slug,
        ])
      )
      setPendingStandaloneEmbeds(
        (embedsResult.data ?? []).map((embed) => ({
          ...embed,
          profileSlug: profileSlugs.get(embed.owner_id) ?? "",
        }))
      )
      setStandaloneEmbedsLoading(false)
    }

    void loadPendingStandaloneEmbeds()
    return () => {
      cancelled = true
    }
  }, [user, isAdmin])

  React.useEffect(() => {
    if (!user || !isAdmin) return

    let cancelled = false
    supabase
      .from("project_edit_requests")
      .select("id, project_id, name, description, url, tags, created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          setProjectsError(error.message)
        } else {
          setPendingEdits(data)
        }
      })

    return () => {
      cancelled = true
    }
  }, [user, isAdmin])

  async function updateStatus(id: string, status: ProjectStatus) {
    setActioningId(id)
    const { error } = await supabase
      .from("projects")
      .update({ status })
      .eq("id", id)
    setActioningId(null)

    if (error) {
      setProjectsError(error.message)
      return
    }

    setProjects((current) =>
      current.map((project) =>
        project.id === id ? { ...project, status } : project
      )
    )
  }

  async function deleteProject(id: string) {
    if (!window.confirm("Delete this project? This can't be undone.")) {
      return
    }

    setActioningId(id)

    await supabase.from("project_embeds").delete().eq("project_id", id)
    const { error } = await supabase.from("projects").delete().eq("id", id)

    setActioningId(null)

    if (error) {
      setProjectsError(error.message)
      return
    }

    setProjects((current) => current.filter((project) => project.id !== id))
  }

  async function togglePremium(id: string, isPremium: boolean) {
    setActioningId(id)
    const { error } = await supabase
      .from("projects")
      .update({ is_premium: isPremium })
      .eq("id", id)
    setActioningId(null)

    if (error) {
      setProjectsError(error.message)
      return
    }

    setProjects((current) =>
      current.map((project) =>
        project.id === id ? { ...project, is_premium: isPremium } : project
      )
    )
  }

  async function approveEdit(requestId: string) {
    setActioningId(requestId)
    const { error } = await supabase.rpc("approve_project_edit_request", {
      request_id: requestId,
    })
    setActioningId(null)

    if (error) {
      setProjectsError(error.message)
      return
    }

    setPendingEdits((current) =>
      current.filter((request) => request.id !== requestId)
    )
  }

  async function rejectEdit(requestId: string) {
    setActioningId(requestId)
    const { error } = await supabase
      .from("project_edit_requests")
      .delete()
      .eq("id", requestId)
      .eq("status", "pending")
    setActioningId(null)

    if (error) {
      setProjectsError(error.message)
      return
    }

    setPendingEdits((current) =>
      current.filter((request) => request.id !== requestId)
    )
  }

  async function approveStandaloneEmbed(embed: StandaloneEmbedSubmission) {
    if (!embed.profileSlug) {
      setProjectsError(
        "This embed has no profile slug and cannot be published."
      )
      return
    }

    setActioningId(embed.id)
    setProjectsError(null)
    const { error } = await supabase
      .from("standalone_embeds")
      .update({ status: "approved" })
      .eq("id", embed.id)
      .eq("status", "pending")

    if (error) {
      setProjectsError(error.message)
    } else {
      setPendingStandaloneEmbeds((current) =>
        current.filter((item) => item.id !== embed.id)
      )
    }

    setActioningId(null)
  }

  async function rejectStandaloneEmbed(embedId: string) {
    setActioningId(embedId)
    setProjectsError(null)
    const { error } = await supabase
      .from("standalone_embeds")
      .update({ status: "rejected" })
      .eq("id", embedId)
      .eq("status", "pending")
    setActioningId(null)

    if (error) {
      setProjectsError(error.message)
      return
    }

    setPendingStandaloneEmbeds((current) =>
      current.filter((embed) => embed.id !== embedId)
    )
  }

  if (loading || !user || !isAdmin) {
    return (
      <div className="flex min-h-[70svh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const pending = projects.filter((project) => project.status === "pending")
  const others = projects.filter((project) => project.status !== "pending")

  return (
    <main className="site-container py-8 sm:py-12">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/account">
          <ChevronLeft className="size-4" />
          Account
        </Link>
      </Button>
      <h1 className="mt-4 text-2xl font-semibold">Moderation</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Review submitted projects and publish or reject them.
      </p>

      {projectsError && (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {projectsError}
        </p>
      )}

      {projectsLoading ? (
        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading projects
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Pending review ({pending.length})
              </CardTitle>
              <CardDescription>Projects waiting for approval.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {pending.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nothing to review.
                </p>
              ) : (
                pending.map((project) => (
                  <div key={project.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{project.name}</p>
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-xs text-muted-foreground underline underline-offset-4"
                        >
                          {project.url}
                        </a>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {project.description}
                        </p>
                        {project.submission_comment && (
                          <p className="mt-2 rounded-md bg-muted p-2 text-xs">
                            {project.submission_comment}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/account/edit-project?id=${project.id}`}>
                            <Pencil className="size-4" />
                            Edit
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant={project.is_premium ? "secondary" : "outline"}
                          onClick={() =>
                            void togglePremium(project.id, !project.is_premium)
                          }
                          disabled={actioningId === project.id}
                        >
                          <Crown className="size-4" />
                          Premium
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            void updateStatus(project.id, "published")
                          }
                          disabled={actioningId === project.id}
                        >
                          <Check className="size-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          onClick={() =>
                            void updateStatus(project.id, "rejected")
                          }
                          disabled={actioningId === project.id}
                        >
                          <X className="size-4" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          aria-label={`Delete ${project.name}`}
                          onClick={() => void deleteProject(project.id)}
                          disabled={actioningId === project.id}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Pending changes ({pendingEdits.length})
              </CardTitle>
              <CardDescription>
                New versions of published projects waiting for approval.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {pendingEdits.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No pending changes.
                </p>
              ) : (
                pendingEdits.map((request) => (
                  <div key={request.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/account/preview-changes-project?id=${request.id}`}
                          className="cursor-pointer font-medium hover:underline"
                          title="Preview pending changes"
                        >
                          {request.name}
                        </Link>
                        <a
                          href={request.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-xs text-muted-foreground underline underline-offset-4"
                        >
                          {request.url}
                        </a>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {request.description}
                        </p>
                        {request.tags && request.tags.length > 0 && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Tags: {request.tags.join(", ")}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Button
                          size="sm"
                          onClick={() => void approveEdit(request.id)}
                          disabled={actioningId === request.id}
                        >
                          <Check className="size-4" />
                          Approve changes
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          onClick={() => void rejectEdit(request.id)}
                          disabled={actioningId === request.id}
                        >
                          <X className="size-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Embeds to approve ({pendingStandaloneEmbeds.length})
              </CardTitle>
              <CardDescription>
                Approving an embed generates and publishes its image files.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {standaloneEmbedsLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Loading embeds
                </div>
              ) : pendingStandaloneEmbeds.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No standalone embeds waiting for review.
                </p>
              ) : (
                pendingStandaloneEmbeds.map((embed) => (
                  <div
                    key={embed.id}
                    className="flex flex-col gap-4 rounded-md border p-4 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">{embed.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        /user/{embed.profileSlug}/embeds/{embed.slug}.png
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {embed.description || "No description provided."}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        size="sm"
                        onClick={() => void approveStandaloneEmbed(embed)}
                        disabled={actioningId === embed.id}
                      >
                        {actioningId === embed.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Check className="size-4" />
                        )}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => void rejectStandaloneEmbed(embed.id)}
                        disabled={actioningId === embed.id}
                      >
                        <X className="size-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">All projects</CardTitle>
              <CardDescription>Everything else in the system.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {others.length === 0 ? (
                <p className="text-sm text-muted-foreground">No projects.</p>
              ) : (
                <div className="divide-y rounded-md border">
                  {others.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between gap-4 p-4"
                    >
                      <p className="min-w-0 truncate font-medium">
                        {project.name}
                      </p>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="rounded-md border px-2 py-0.5 text-xs font-medium text-muted-foreground capitalize">
                          {project.status}
                        </span>
                        <Button
                          size="icon"
                          variant={project.is_premium ? "secondary" : "ghost"}
                          aria-label={
                            project.is_premium
                              ? `Remove premium from ${project.name}`
                              : `Mark ${project.name} as premium`
                          }
                          onClick={() =>
                            void togglePremium(project.id, !project.is_premium)
                          }
                          disabled={actioningId === project.id}
                        >
                          <Crown className="size-4" />
                        </Button>
                        <Button size="icon" variant="ghost" asChild>
                          <Link
                            href={`/account/edit-project?id=${project.id}`}
                            aria-label={`Edit ${project.name}`}
                          >
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          aria-label={`Delete ${project.name}`}
                          onClick={() => void deleteProject(project.id)}
                          disabled={actioningId === project.id}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
}

export default AdminPage
