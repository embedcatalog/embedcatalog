"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowUp, LoaderCircle } from "lucide-react"

import { useAuth } from "components/auth-provider"
import { Button } from "components/ui/button"
import { supabase } from "lib/supabase/client"

function ProjectUpvote({
  projectId,
  initialCount,
}: {
  projectId: string
  initialCount: number
}) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [count, setCount] = React.useState(initialCount)
  const [hasUpvoted, setHasUpvoted] = React.useState(false)
  const [resolvedUserId, setResolvedUserId] = React.useState<string | null>(
    null
  )
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const requestInProgress = React.useRef(false)

  React.useEffect(() => {
    if (!user) return

    let cancelled = false
    supabase
      .from("project_upvotes")
      .select("project_id")
      .eq("project_id", projectId)
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return
        setHasUpvoted(Boolean(data))
        setResolvedUserId(user.id)
      })

    return () => {
      cancelled = true
    }
  }, [projectId, user])

  async function toggleUpvote() {
    if (!user) {
      router.push("/login")
      return
    }
    if (requestInProgress.current || resolvedUserId !== user.id) return

    requestInProgress.current = true
    setSaving(true)
    setError(null)

    const nextHasUpvoted = !hasUpvoted
    const result = nextHasUpvoted
      ? await supabase
          .from("project_upvotes")
          .insert({ project_id: projectId, user_id: user.id })
      : await supabase
          .from("project_upvotes")
          .delete()
          .eq("project_id", projectId)
          .eq("user_id", user.id)

    if (result.error) {
      setError("Could not update your upvote. Please try again.")
    } else {
      setHasUpvoted(nextHasUpvoted)
      setCount((current) => current + (nextHasUpvoted ? 1 : -1))
    }

    setSaving(false)
    requestInProgress.current = false
  }

  const checkingVote = Boolean(user) && resolvedUserId !== user?.id

  return (
    <div className="flex flex-col items-start gap-1">
      <Button
        type="button"
        variant={hasUpvoted ? "secondary" : "outline"}
        size="sm"
        onClick={() => void toggleUpvote()}
        disabled={authLoading || checkingVote || saving}
        aria-label={
          hasUpvoted
            ? `Remove upvote, ${count} upvotes`
            : user
              ? `Upvote project, ${count} upvotes`
              : `Sign in to upvote, ${count} upvotes`
        }
        aria-pressed={hasUpvoted}
        title={user ? undefined : "Sign in to upvote"}
      >
        {saving || checkingVote ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <ArrowUp className="size-4" />
        )}
        {count.toLocaleString("en-US")}
      </Button>
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export { ProjectUpvote }
