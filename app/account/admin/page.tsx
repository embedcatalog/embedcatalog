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
  categories: string[] | null
  tags: string[] | null
  created_at: string
}
type EmbedProjectRequest =
  Database["public"]["Tables"]["standalone_embed_project_requests"]["Row"] & {
    embed: Pick<
      Database["public"]["Tables"]["standalone_embeds"]["Row"],
      "slug" | "title" | "description"
    >
    profileSlug: string
    projectName: string | null
  }
type StandaloneEmbedEditRequest =
  Database["public"]["Tables"]["standalone_embed_edit_requests"]["Row"] & {
    embed: Pick<
      Database["public"]["Tables"]["standalone_embeds"]["Row"],
      "slug" | "title" | "project_id"
    >
    profileSlug: string
    projectName: string | null
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
  const [pendingEmbedProjectRequests, setPendingEmbedProjectRequests] =
    React.useState<EmbedProjectRequest[]>([])
  const [embedProjectRequestsLoading, setEmbedProjectRequestsLoading] =
    React.useState(true)
  const [pendingEmbedEditRequests, setPendingEmbedEditRequests] =
    React.useState<StandaloneEmbedEditRequest[]>([])
  const [embedEditRequestsLoading, setEmbedEditRequestsLoading] =
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

    async function loadPendingEmbedEditRequests() {
      const { data: requests, error: requestsError } = await supabase
        .from("standalone_embed_edit_requests")
        .select(
          "id, embed_id, owner_id, slug, title, image_title, image_description, status, created_at, reviewed_at"
        )
        .eq("status", "pending")
        .order("created_at", { ascending: true })

      if (cancelled) return
      if (requestsError) {
        setProjectsError(requestsError.message)
        setEmbedEditRequestsLoading(false)
        return
      }
      if (!requests?.length) {
        setPendingEmbedEditRequests([])
        setEmbedEditRequestsLoading(false)
        return
      }

      const embedIds = [...new Set(requests.map((request) => request.embed_id))]
      const ownerIds = [...new Set(requests.map((request) => request.owner_id))]
      const [embedsResult, profilesResult] = await Promise.all([
        supabase
          .from("standalone_embeds")
          .select("id, slug, title, project_id")
          .in("id", embedIds),
        supabase.rpc("get_public_profiles", { p_profile_ids: ownerIds }),
      ])

      if (cancelled) return
      if (embedsResult.error || profilesResult.error) {
        setProjectsError(
          embedsResult.error?.message ??
            profilesResult.error?.message ??
            "Could not load embed edit requests."
        )
        setEmbedEditRequestsLoading(false)
        return
      }

      const embedsById = new Map(
        (embedsResult.data ?? []).map((embed) => [embed.id, embed])
      )
      const projectIds = [
        ...new Set(
          (embedsResult.data ?? []).flatMap((embed) =>
            embed.project_id ? [embed.project_id] : []
          )
        ),
      ]
      const { data: projects, error: projectsError } = projectIds.length
        ? await supabase
            .from("projects")
            .select("id, name")
            .in("id", projectIds)
        : { data: [], error: null }

      if (cancelled) return
      if (projectsError) {
        setProjectsError(projectsError.message)
        setEmbedEditRequestsLoading(false)
        return
      }

      const profilesById = new Map(
        (profilesResult.data ?? []).map((profile) => [profile.id, profile.slug])
      )
      const projectsById = new Map(
        (projects ?? []).map((project) => [project.id, project.name])
      )
      setPendingEmbedEditRequests(
        requests.flatMap((request) => {
          const embed = embedsById.get(request.embed_id)
          if (!embed) return []
          return [
            {
              ...request,
              embed,
              profileSlug: profilesById.get(request.owner_id) ?? "",
              projectName: embed.project_id
                ? (projectsById.get(embed.project_id) ?? null)
                : null,
            },
          ]
        })
      )
      setEmbedEditRequestsLoading(false)
    }

    void loadPendingEmbedEditRequests()
    return () => {
      cancelled = true
    }
  }, [user, isAdmin])

  React.useEffect(() => {
    if (!user || !isAdmin) return

    let cancelled = false

    async function loadPendingEmbedProjectRequests() {
      const { data: requests, error: requestsError } = await supabase
        .from("standalone_embed_project_requests")
        .select(
          "id, embed_id, project_id, owner_id, status, created_at, reviewed_at"
        )
        .eq("status", "pending")
        .order("created_at", { ascending: true })

      if (cancelled) return

      if (requestsError) {
        setProjectsError(requestsError.message)
        setEmbedProjectRequestsLoading(false)
        return
      }

      if (!requests?.length) {
        setPendingEmbedProjectRequests([])
        setEmbedProjectRequestsLoading(false)
        return
      }

      const embedIds = [...new Set(requests.map((request) => request.embed_id))]
      const projectIds = [
        ...new Set(
          requests.flatMap((request) =>
            request.project_id ? [request.project_id] : []
          )
        ),
      ]
      const ownerIds = [...new Set(requests.map((request) => request.owner_id))]
      const [embedsResult, projectsResult, profilesResult] = await Promise.all([
        supabase
          .from("standalone_embeds")
          .select("id, slug, title, description")
          .in("id", embedIds),
        projectIds.length
          ? supabase.from("projects").select("id, name").in("id", projectIds)
          : Promise.resolve({ data: [], error: null }),
        supabase.rpc("get_public_profiles", { p_profile_ids: ownerIds }),
      ])

      if (cancelled) return
      if (embedsResult.error || projectsResult.error || profilesResult.error) {
        setProjectsError(
          embedsResult.error?.message ??
            projectsResult.error?.message ??
            profilesResult.error?.message ??
            "Could not load embed project requests."
        )
        setEmbedProjectRequestsLoading(false)
        return
      }

      const embedsById = new Map(
        (embedsResult.data ?? []).map((embed) => [embed.id, embed])
      )
      const projectsById = new Map(
        (projectsResult.data ?? []).map((project) => [project.id, project.name])
      )
      const profileSlugs = new Map(
        (profilesResult.data ?? []).map((profile) => [profile.id, profile.slug])
      )
      setPendingEmbedProjectRequests(
        requests.flatMap((request) => {
          const embed = embedsById.get(request.embed_id)
          if (!embed) return []
          return [
            {
              ...request,
              embed,
              profileSlug: profileSlugs.get(request.owner_id) ?? "",
              projectName: request.project_id
                ? (projectsById.get(request.project_id) ?? null)
                : null,
            },
          ]
        })
      )
      setEmbedProjectRequestsLoading(false)
    }

    void loadPendingEmbedProjectRequests()
    return () => {
      cancelled = true
    }
  }, [user, isAdmin])

  React.useEffect(() => {
    if (!user || !isAdmin) return

    let cancelled = false
    supabase
      .from("project_edit_requests")
      .select("id, project_id, name, description, url, categories, tags, created_at")
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

  async function reviewEmbedProjectRequest(
    requestId: string,
    approve: boolean
  ) {
    setActioningId(requestId)
    setProjectsError(null)
    const { error } = await supabase.rpc(
      "review_standalone_embed_project_request",
      { p_request_id: requestId, p_approve: approve }
    )
    setActioningId(null)

    if (error) {
      setProjectsError(error.message)
      return
    }

    setPendingEmbedProjectRequests((current) =>
      current.filter((request) => request.id !== requestId)
    )
  }

  async function reviewEmbedEditRequest(requestId: string, approve: boolean) {
    setActioningId(requestId)
    setProjectsError(null)
    const { error } = await supabase.rpc(
      "review_standalone_embed_edit_request",
      { p_request_id: requestId, p_approve: approve }
    )
    setActioningId(null)

    if (error) {
      setProjectsError(error.message)
      return
    }

    setPendingEmbedEditRequests((current) =>
      current.filter((request) => request.id !== requestId)
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
                Project embed edits ({pendingEmbedEditRequests.length})
              </CardTitle>
              <CardDescription>
                Review changes to custom embeds currently published on projects.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {embedEditRequestsLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Loading embed edits
                </div>
              ) : pendingEmbedEditRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No project embed edits waiting for review.
                </p>
              ) : (
                pendingEmbedEditRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex flex-col gap-4 rounded-md border p-4 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">
                        {request.embed.title} -&gt; {request.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {request.projectName ?? "Project"} · @
                        {request.profileSlug}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        URL: {request.embed.slug} -&gt; {request.slug}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Image title: {request.image_title || "(empty)"}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Description: {request.image_description || "(empty)"}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          void reviewEmbedEditRequest(request.id, true)
                        }
                        disabled={actioningId === request.id}
                      >
                        {actioningId === request.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Check className="size-4" />
                        )}
                        Approve changes
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() =>
                          void reviewEmbedEditRequest(request.id, false)
                        }
                        disabled={actioningId === request.id}
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
                        {request.categories && request.categories.length > 0 && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Categories: {request.categories.join(", ")}
                          </p>
                        )}
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
                Embed project applications ({pendingEmbedProjectRequests.length}
                )
              </CardTitle>
              <CardDescription>
                Review requests to attach published custom embeds to projects.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {embedProjectRequestsLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Loading applications
                </div>
              ) : pendingEmbedProjectRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No embed project applications waiting for review.
                </p>
              ) : (
                pendingEmbedProjectRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex flex-col gap-4 rounded-md border p-4 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">{request.embed.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        /user/{request.profileSlug}/embeds/{request.embed.slug}
                        .png
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {request.embed.description ||
                          "No description provided."}
                      </p>
                      <p className="mt-2 text-sm">
                        {request.project_id
                          ? `Apply to ${request.projectName ?? "unknown project"}`
                          : "Remove the current project assignment"}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          void reviewEmbedProjectRequest(request.id, true)
                        }
                        disabled={actioningId === request.id}
                      >
                        {actioningId === request.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Check className="size-4" />
                        )}
                        Approve application
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() =>
                          void reviewEmbedProjectRequest(request.id, false)
                        }
                        disabled={actioningId === request.id}
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
