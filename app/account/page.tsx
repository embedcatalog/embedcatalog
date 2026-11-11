"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Bookmark,
  FolderKanban,
  Images,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Settings,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react"

import { BookmarkedEmbeds } from "components/bookmarked-embeds"
import { FollowingList } from "components/following-list"
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
import { useAuth } from "components/auth-provider"
import { useNotification } from "components/notification-provider"
import {
  ProjectsGrid,
  type Project as CatalogProject,
} from "components/projects-grid"
import { supabase } from "lib/supabase/client"
import { getProjectImageUrl } from "lib/storage"

type OwnedProject = {
  id: string
  name: string
  description: string
  url: string
  status: "draft" | "pending" | "published" | "rejected"
  is_premium: boolean
  impressions_count: number
  created_at: string
}

function AccountPage({
  initialSection = "settings",
}: {
  initialSection?: "settings" | "projects" | "bookmarks" | "following"
}) {
  const router = useRouter()
  const { user, loading, isAdmin, signOut } = useAuth()
  const { notify } = useNotification()
  const [activeSection, setActiveSection] = React.useState<
    "settings" | "projects" | "bookmarks" | "following"
  >(initialSection)
  const avatarInputRef = React.useRef<HTMLInputElement>(null)
  const [avatarUploading, setAvatarUploading] = React.useState(false)
  const [avatarError, setAvatarError] = React.useState<string | null>(null)
  const [profileSlug, setProfileSlug] = React.useState("")
  const [profileBio, setProfileBio] = React.useState("")
  const [profileSaving, setProfileSaving] = React.useState(false)
  const [profileError, setProfileError] = React.useState<string | null>(null)
  const [projects, setProjects] = React.useState<OwnedProject[]>([])
  const [projectsLoading, setProjectsLoading] = React.useState(false)
  const [projectsError, setProjectsError] = React.useState<string | null>(null)
  const [pendingEditProjectIds, setPendingEditProjectIds] = React.useState<
    Set<string>
  >(() => new Set())
  const [deletingProjectId, setDeletingProjectId] = React.useState<
    string | null
  >(null)
  const [bookmarkedProjects, setBookmarkedProjects] = React.useState<
    CatalogProject[]
  >([])
  const [bookmarksLoading, setBookmarksLoading] = React.useState(false)
  const [bookmarksTab, setBookmarksTab] = React.useState<"projects" | "embeds">(
    "projects"
  )
  const [bookmarksError, setBookmarksError] = React.useState<string | null>(
    null
  )

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [loading, user, router])

  React.useEffect(() => {
    if (!user) return

    let cancelled = false
    const userId = user.id

    async function loadProfileSlug() {
      const { data } = await supabase
        .from("profiles")
        .select("slug")
        .eq("id", userId)
        .maybeSingle()

      if (!cancelled) setProfileSlug(data?.slug ?? "")

      const { data: bioData } = await supabase
        .from("profiles")
        .select("bio")
        .eq("id", userId)
        .maybeSingle()

      if (!cancelled) setProfileBio(bioData?.bio ?? "")
    }

    void loadProfileSlug()
    return () => {
      cancelled = true
    }
  }, [user])

  React.useEffect(() => {
    if (!user || activeSection !== "projects") {
      return
    }

    let cancelled = false
    const userId = user.id

    async function loadProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select(
          "id, name, description, url, status, is_premium, impressions_count, created_at"
        )
        .eq("owner_id", userId)
        .order("created_at", { ascending: false })

      if (cancelled) return
      if (error) {
        setProjectsError(error.message)
        setProjects([])
        setPendingEditProjectIds(new Set())
        setProjectsLoading(false)
        return
      }

      setProjects(data)
      const publishedProjectIds = data
        .filter((project) => project.status === "published")
        .map((project) => project.id)

      if (publishedProjectIds.length === 0) {
        setPendingEditProjectIds(new Set())
        setProjectsLoading(false)
        return
      }

      const { data: pendingRequests } = await supabase
        .from("project_edit_requests")
        .select("project_id")
        .in("project_id", publishedProjectIds)
        .eq("status", "pending")

      if (cancelled) return
      setPendingEditProjectIds(
        new Set((pendingRequests ?? []).map((request) => request.project_id))
      )
      setProjectsLoading(false)
    }

    void loadProjects()

    return () => {
      cancelled = true
    }
  }, [activeSection, user])

  React.useEffect(() => {
    if (!user || activeSection !== "bookmarks") return

    let cancelled = false
    const userId = user.id

    async function loadBookmarks() {
      const { data: bookmarkRows, error: bookmarkError } = await supabase
        .from("project_bookmarks")
        .select("project_id")
        .eq("user_id", userId)

      if (cancelled) return
      if (bookmarkError) {
        setBookmarksError(bookmarkError.message)
        setBookmarkedProjects([])
        setBookmarksLoading(false)
        return
      }

      const projectIds = (bookmarkRows ?? []).map(
        ({ project_id }) => project_id
      )
      if (projectIds.length === 0) {
        setBookmarkedProjects([])
        setBookmarksLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("projects")
        .select(
          "id, slug, name, description, url, github_url, github_stars, github_forks, github_contributors, github_license, github_stats_updated_at, categories, images, tags, socials, is_premium, impressions_count, upvotes_count, created_at"
        )
        .in("id", projectIds)
        .eq("status", "published")

      if (cancelled) return
      if (error) {
        setBookmarksError(error.message)
        setBookmarkedProjects([])
      } else {
        setBookmarkedProjects(
          data.map((project) => ({
            id: project.id,
            slug: project.slug,
            name: project.name,
            description: project.description,
            isNew: false,
            premium: project.is_premium,
            url: project.url,
            githubUrl: project.github_url ?? project.socials?.github,
            githubStats: {
              stars: project.github_stars,
              forks: project.github_forks,
              contributors: project.github_contributors,
              license: project.github_license,
              updatedAt: project.github_stats_updated_at,
            },
            images: (project.images ?? []).map(getProjectImageUrl),
            categories: project.categories,
            tags: project.tags ?? [],
            createdAt: project.created_at,
            impressionsCount: project.impressions_count,
            upvotesCount: project.upvotes_count,
            socials: project.socials ?? undefined,
          }))
        )
      }
      setBookmarksLoading(false)
    }

    void loadBookmarks()

    return () => {
      cancelled = true
    }
  }, [activeSection, user])

  function showProjects() {
    setProjectsLoading(true)
    setProjectsError(null)
    setActiveSection("projects")
  }

  function showBookmarks() {
    setBookmarksLoading(true)
    setBookmarksError(null)
    setActiveSection("bookmarks")
  }

  async function deleteProject(project: OwnedProject) {
    if (project.status !== "draft" || !user) return
    if (!window.confirm("Delete this draft project? This cannot be undone.")) {
      return
    }

    setDeletingProjectId(project.id)
    setProjectsError(null)

    const { error: embedsError } = await supabase
      .from("project_embeds")
      .delete()
      .eq("project_id", project.id)

    if (embedsError) {
      setProjectsError(embedsError.message)
      setDeletingProjectId(null)
      return
    }

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", project.id)
      .eq("owner_id", user.id)
      .eq("status", "draft")

    if (error) {
      setProjectsError(error.message)
    } else {
      setProjects((current) => current.filter((item) => item.id !== project.id))
    }
    setDeletingProjectId(null)
  }

  async function changeAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file || !user) return

    const isGif =
      file.type.toLowerCase() === "image/gif" ||
      file.name.toLowerCase().endsWith(".gif")
    if (!file.type.startsWith("image/") || isGif) {
      setAvatarError("Choose a PNG, JPEG, or WebP image.")
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("Avatar must be smaller than 2 MB.")
      return
    }

    setAvatarUploading(true)
    setAvatarError(null)

    const extension = file.name
      .split(".")
      .pop()
      ?.replace(/[^a-zA-Z0-9]/g, "")
    const path = `avatars/${user.id}/${crypto.randomUUID()}.${extension || "png"}`
    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(path, file, { upsert: false })

    if (uploadError) {
      setAvatarUploading(false)
      setAvatarError(`Avatar upload failed: ${uploadError.message}`)
      return
    }

    const { data } = supabase.storage.from("project-images").getPublicUrl(path)
    const { error: updateError } = await supabase.auth.updateUser({
      data: { custom_avatar_url: data.publicUrl },
    })

    if (updateError) {
      setAvatarUploading(false)
      setAvatarError(updateError.message)
      return
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ avatar_url: data.publicUrl })
      .eq("id", user.id)

    setAvatarUploading(false)
    if (profileError) setAvatarError(profileError.message)
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return

    const formData = new FormData(event.currentTarget)
    const profileName = String(formData.get("name") ?? "").trim()
    const profileTwitter = String(formData.get("twitter") ?? "").trim()
    const profileYoutube = String(formData.get("youtube") ?? "").trim()
    const profileGithub = String(formData.get("github") ?? "").trim()

    setProfileSaving(true)
    setProfileError(null)

    const profileSocials = {
      ...(profileTwitter ? { twitter: profileTwitter } : {}),
      ...(profileYoutube ? { youtube: profileYoutube } : {}),
      ...(profileGithub ? { github: profileGithub } : {}),
    }
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: profileName,
        profile_socials: profileSocials,
      },
    })

    if (error) {
      setProfileSaving(false)
      setProfileError(error.message)
      return
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        display_name: profileName,
        socials: profileSocials,
        bio: profileBio.trim(),
      })
      .eq("id", user.id)

    setProfileSaving(false)
    if (profileError) {
      setProfileError(profileError.message)
      return
    }

    notify("Profile saved.")
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-[70svh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const avatarUrl = (user.user_metadata?.custom_avatar_url ??
    user.user_metadata?.avatar_url) as string | undefined
  const displayName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.user_name as string | undefined) ??
    user.email
  const profileSocials = user.user_metadata?.profile_socials as
    { twitter?: string; youtube?: string; github?: string } | undefined

  return (
    <div className="site-container py-8 sm:py-12">
      <div className="grid gap-8 md:grid-cols-[13rem_minmax(0,1fr)]">
        <aside className="flex flex-col border-b pb-6 md:min-h-[28rem] md:border-r md:border-b-0 md:pr-6 md:pb-0">
          <p className="px-3 text-sm font-medium">Account</p>
          <nav
            className="mt-3 grid grid-cols-2 gap-1 md:flex md:flex-col"
            aria-label="Account navigation"
          >
            <Button
              variant="ghost"
              className="flex-1 justify-start md:flex-none"
              asChild
            >
              <Link href="/account/create">
                <Plus className="size-4" />
                Create
              </Link>
            </Button>
            <Button
              variant={activeSection === "settings" ? "secondary" : "ghost"}
              className="flex-1 justify-start md:flex-none"
              onClick={() => setActiveSection("settings")}
            >
              <Settings className="size-4" />
              Settings
            </Button>
            <Button
              variant={activeSection === "projects" ? "secondary" : "ghost"}
              className="flex-1 justify-start md:flex-none"
              onClick={showProjects}
            >
              <FolderKanban className="size-4" />
              Projects
            </Button>
            <Button
              variant="ghost"
              className="flex-1 justify-start md:flex-none"
              asChild
            >
              <Link href="/account/embeds">
                <Images className="size-4" />
                Embeds
              </Link>
            </Button>
            <Button
              variant={activeSection === "bookmarks" ? "secondary" : "ghost"}
              className="flex-1 justify-start md:flex-none"
              onClick={showBookmarks}
            >
              <Bookmark className="size-4" />
              Bookmarks
            </Button>
            <Button
              variant={activeSection === "following" ? "secondary" : "ghost"}
              className="flex-1 justify-start md:flex-none"
              onClick={() => setActiveSection("following")}
            >
              <Users className="size-4" />
              Following
            </Button>
            {isAdmin && (
              <Button
                variant="ghost"
                className="flex-1 justify-start md:flex-none"
                asChild
              >
                <Link href="/account/admin">
                  <ShieldCheck className="size-4" />
                  Admin
                </Link>
              </Button>
            )}
          </nav>
          <Button
            variant="ghost"
            className="mt-6 justify-start text-destructive hover:text-destructive md:mt-auto"
            onClick={() => {
              void signOut()
            }}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </aside>

        <main>
          {activeSection === "settings" ? (
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Settings</CardTitle>
                  <CardDescription>Manage your profile.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="flex flex-col gap-5" onSubmit={saveProfile}>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(event) => void changeAvatar(event)}
                    />
                    <div className="flex items-center gap-4">
                      <div className="relative size-14 shrink-0">
                        {avatarUrl ? (
                          <Image
                            src={avatarUrl}
                            alt={displayName ?? "Avatar"}
                            width={56}
                            height={56}
                            className="size-14 rounded-full"
                            unoptimized
                          />
                        ) : (
                          <div className="flex size-14 items-center justify-center rounded-full bg-muted text-lg font-medium text-muted-foreground">
                            {displayName?.[0]?.toUpperCase() ?? "?"}
                          </div>
                        )}
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          className="absolute -right-1 -bottom-1 size-7 rounded-full border shadow-sm"
                          aria-label="Change avatar"
                          title={
                            avatarUploading
                              ? "Uploading avatar"
                              : "Change avatar"
                          }
                          disabled={avatarUploading}
                          onClick={() => avatarInputRef.current?.click()}
                        >
                          {avatarUploading ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Pencil className="size-3.5" />
                          )}
                        </Button>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{displayName}</p>
                        <p className="truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    {avatarError && (
                      <p className="text-sm text-destructive" role="alert">
                        {avatarError}
                      </p>
                    )}
                    <div className="flex flex-col gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="profile-nickname">Nickname</Label>
                        <Input
                          id="profile-nickname"
                          value={profileSlug}
                          readOnly
                          aria-readonly="true"
                          autoComplete="off"
                          className="bg-muted text-muted-foreground"
                        />
                        <p className="text-xs text-muted-foreground">
                          This is your public profile URL. You can choose it
                          once during initial setup.
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="profile-name">Name</Label>
                        <Input
                          id="profile-name"
                          name="name"
                          autoComplete="name"
                          defaultValue={
                            (user.user_metadata?.full_name as
                              string | undefined) ??
                            (user.user_metadata?.user_name as
                              string | undefined) ??
                            ""
                          }
                          placeholder="Your name"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="profile-bio">
                          About you (optional)
                        </Label>
                        <Textarea
                          id="profile-bio"
                          value={profileBio}
                          onChange={(event) =>
                            setProfileBio(event.target.value)
                          }
                          maxLength={1000}
                          rows={5}
                          placeholder="Tell people about yourself. Markdown is supported."
                        />
                        <p className="text-xs text-muted-foreground">
                          Shown publicly on your profile. Markdown is supported.
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="profile-twitter">Twitter</Label>
                        <Input
                          id="profile-twitter"
                          name="twitter"
                          type="url"
                          autoComplete="url"
                          defaultValue={profileSocials?.twitter ?? ""}
                          placeholder="https://twitter.com/username"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="profile-youtube">YouTube</Label>
                        <Input
                          id="profile-youtube"
                          name="youtube"
                          type="url"
                          autoComplete="url"
                          defaultValue={profileSocials?.youtube ?? ""}
                          placeholder="https://youtube.com/@channel"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="profile-github">GitHub</Label>
                        <Input
                          id="profile-github"
                          name="github"
                          type="url"
                          autoComplete="url"
                          defaultValue={profileSocials?.github ?? ""}
                          placeholder="https://github.com/username"
                        />
                      </div>
                    </div>
                    {profileError && (
                      <p className="text-sm text-destructive" role="alert">
                        {profileError}
                      </p>
                    )}
                    <Button
                      className="w-full"
                      type="submit"
                      disabled={profileSaving}
                    >
                      {profileSaving && (
                        <Loader2 className="size-4 animate-spin" />
                      )}
                      {profileSaving ? "Saving profile" : "Save profile"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          ) : activeSection === "following" ? (
            <FollowingList userId={user.id} />
          ) : activeSection === "projects" ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">My projects</CardTitle>
                <CardDescription>
                  Projects saved to your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Button className="w-fit" asChild>
                  <Link href="/account/create-project">
                    <Plus className="size-4" />
                    Create project
                  </Link>
                </Button>
                {projectsLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Loading projects
                  </div>
                ) : projectsError ? (
                  <p className="text-sm text-destructive" role="alert">
                    Could not load projects: {projectsError}
                  </p>
                ) : projects.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No projects yet.
                  </p>
                ) : (
                  <div className="divide-y rounded-md border">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center gap-4 p-4 transition-colors hover:bg-accent"
                      >
                        <Link
                          href={`/account/edit-project?id=${project.id}`}
                          className="min-w-0 flex-1"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {project.name}
                              </p>
                              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                {project.description}
                              </p>
                              {project.status === "published" &&
                                pendingEditProjectIds.has(project.id) && (
                                  <p className="mt-2 text-xs font-medium text-amber-700 dark:text-amber-300">
                                    Changes pending review
                                  </p>
                                )}
                            </div>
                            <span className="flex shrink-0 items-center gap-2">
                              <span className="rounded-md border px-2 py-0.5 text-xs font-medium text-muted-foreground capitalize">
                                {project.is_premium ? "Premium" : "Free"}
                              </span>
                              <span className="rounded-md border px-2 py-0.5 text-xs font-medium text-muted-foreground capitalize">
                                {project.status}
                              </span>
                            </span>
                          </div>
                        </Link>
                        {project.status === "draft" && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Delete ${project.name}`}
                            title="Delete draft project"
                            disabled={deletingProjectId === project.id}
                            onClick={() => void deleteProject(project)}
                            className="shrink-0 text-destructive hover:text-destructive"
                          >
                            {deletingProjectId === project.id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Trash2 className="size-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <section className="flex flex-col gap-4">
              <div>
                <h1 className="text-xl font-semibold">Bookmarks</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Projects and embeds you have saved.
                </p>
              </div>
              <div className="flex w-fit gap-1 rounded-md border p-1">
                {(
                  [
                    ["projects", "Projects"],
                    ["embeds", "Embeds"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setBookmarksTab(id)}
                    aria-pressed={bookmarksTab === id}
                    className={`cursor-pointer rounded-sm px-3 py-1.5 text-sm font-medium transition-colors ${
                      bookmarksTab === id
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {bookmarksTab === "embeds" ? (
                <BookmarkedEmbeds />
              ) : bookmarksLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Loading bookmarks
                </div>
              ) : bookmarksError ? (
                <p className="text-sm text-destructive" role="alert">
                  Could not load bookmarks: {bookmarksError}
                </p>
              ) : bookmarkedProjects.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No bookmarked projects yet.
                </p>
              ) : (
                <ProjectsGrid projects={bookmarkedProjects} />
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export { AccountPage }
export default AccountPage
