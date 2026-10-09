"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ImagePlus, Loader2 } from "lucide-react"

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
import { supabase } from "lib/supabase/client"

function normalizeUsername(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30)
    .replace(/-+$/g, "")
}

function SetupProfilePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const avatarInputRef = React.useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!loading && !user) router.replace("/login")
    else if (!loading && user?.user_metadata?.profile_setup_completed) {
      router.replace("/account")
    }
  }, [loading, router, user])

  React.useEffect(
    () => () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    },
    [avatarPreview]
  )

  if (loading || !user || user.user_metadata?.profile_setup_completed) {
    return (
      <div className="flex min-h-[70svh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const metadata = user.user_metadata ?? {}
  const initialUsername = normalizeUsername(
    String(
      metadata.profile_username ??
        metadata.user_name ??
        user.email?.split("@")[0] ??
        ""
    )
  )
  const initialDisplayName = String(
    metadata.full_name ?? metadata.name ?? metadata.user_name ?? ""
  )
  const currentAvatar = String(
    metadata.custom_avatar_url ?? metadata.avatar_url ?? ""
  )

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return

    const formData = new FormData(event.currentTarget)
    const username = normalizeUsername(String(formData.get("username") ?? ""))
    const displayName = String(formData.get("displayName") ?? "").trim()
    const avatarFile = avatarInputRef.current?.files?.[0]

    if (!/^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])$/.test(username)) {
      setError("Use 3-30 characters: lowercase letters, numbers, and hyphens.")
      return
    }
    if (!displayName) {
      setError("Enter a display name.")
      return
    }
    if (
      avatarFile &&
      !["image/png", "image/jpeg", "image/webp"].includes(avatarFile.type)
    ) {
      setError("Choose a PNG, JPEG, or WebP avatar.")
      return
    }
    if (avatarFile && avatarFile.size > 2 * 1024 * 1024) {
      setError("Avatar must be smaller than 2 MB.")
      return
    }

    setSaving(true)
    setError(null)

    const { data: existingProfile, error: profileError } = await supabase
      .from("standalone_embed_profiles")
      .select("owner_id, slug, created_at")
      .eq("owner_id", user.id)
      .maybeSingle()

    if (profileError) {
      setSaving(false)
      setError(profileError.message)
      return
    }

    const profileResult = existingProfile
      ? await supabase
          .from("standalone_embed_profiles")
          .update({ slug: username })
          .eq("owner_id", user.id)
      : await supabase
          .from("standalone_embed_profiles")
          .insert({ owner_id: user.id, slug: username })

    if (profileResult.error) {
      setSaving(false)
      setError(
        profileResult.error.code === "23505"
          ? "That username is already taken. Choose another one."
          : profileResult.error.message
      )
      return
    }

    let avatarUrl = currentAvatar
    if (avatarFile) {
      const extension =
        avatarFile.type === "image/jpeg" ? "jpg" : avatarFile.type.split("/")[1]
      const path = `avatars/${user.id}/${crypto.randomUUID()}.${extension}`
      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(path, avatarFile, { upsert: false })

      if (uploadError) {
        setSaving(false)
        setError(`Avatar upload failed: ${uploadError.message}`)
        return
      }
      avatarUrl = supabase.storage.from("project-images").getPublicUrl(path)
        .data.publicUrl
    }

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        profile_username: username,
        profile_slug: username,
        full_name: displayName,
        profile_setup_completed: true,
        ...(avatarFile ? { custom_avatar_url: avatarUrl } : {}),
      },
    })

    setSaving(false)
    if (updateError) {
      setError(updateError.message)
      return
    }

    router.replace("/account")
  }

  return (
    <main className="site-container flex min-h-[75svh] items-center justify-center py-10">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-xl">Set up your profile</CardTitle>
          <CardDescription>
            Choose your public username and how your name appears.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-5" onSubmit={saveProfile}>
            <div className="flex items-center gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted text-muted-foreground">
                {avatarPreview || currentAvatar ? (
                  <Image
                    src={avatarPreview ?? currentAvatar}
                    alt="Profile avatar preview"
                    width={64}
                    height={64}
                    className="size-full object-cover"
                    unoptimized
                  />
                ) : (
                  <ImagePlus className="size-6" />
                )}
              </div>
              <div className="grid gap-2">
                <input
                  ref={avatarInputRef}
                  id="profile-avatar"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    setAvatarPreview(file ? URL.createObjectURL(file) : null)
                    setError(null)
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  <ImagePlus className="size-4" />
                  Choose avatar
                </Button>
                <p className="text-xs text-muted-foreground">
                  PNG, JPEG, or WebP, up to 2 MB.
                </p>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profile-username">Username</Label>
              <Input
                id="profile-username"
                name="username"
                autoComplete="username"
                defaultValue={initialUsername}
                minLength={3}
                maxLength={30}
                pattern="[a-z0-9][a-z0-9-]{1,28}[a-z0-9]"
                required
                onChange={(event) => {
                  event.target.value = normalizeUsername(event.target.value)
                  setError(null)
                }}
              />
              <p className="text-xs text-muted-foreground">
                Your username will be used in your profile URL and can only be
                set once. It cannot be changed later.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profile-display-name">Display name</Label>
              <Input
                id="profile-display-name"
                name="displayName"
                autoComplete="name"
                defaultValue={initialDisplayName}
                maxLength={80}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              {saving ? "Saving profile" : "Continue to account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

export default SetupProfilePage
