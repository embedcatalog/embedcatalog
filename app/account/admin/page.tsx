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

function AdminPage() {
  const router = useRouter()
  const { user, loading, isAdmin } = useAuth()
  const [projects, setProjects] = React.useState<Project[]>([])
  const [projectsLoading, setProjectsLoading] = React.useState(true)
  const [projectsError, setProjectsError] = React.useState<string | null>(null)
  const [actioningId, setActioningId] = React.useState<string | null>(null)

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
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
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
