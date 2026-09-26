"use client"

import * as React from "react"
import { Eye } from "lucide-react"

const QUEUE_KEY = "project-impression-queue"
const BATCH_SIZE = 5
const MAX_BATCH_SIZE = 100
const FLUSH_INTERVAL_MS = 30_000
const recentProjectViews = new Map<string, number>()

function readQueue() {
  try {
    const value: unknown = JSON.parse(
      window.sessionStorage.getItem(QUEUE_KEY) ?? "[]"
    )
    return Array.isArray(value)
      ? value.filter((id): id is string => typeof id === "string")
      : []
  } catch {
    return []
  }
}

function writeQueue(projectIds: string[]) {
  try {
    window.sessionStorage.setItem(QUEUE_KEY, JSON.stringify(projectIds))
  } catch {
    // Storage can be unavailable in private browsing; the current batch still flushes.
  }
}

function ProjectImpressionTracker({
  projectId,
  initialCount,
}: {
  projectId: string
  initialCount: number
}) {
  const flushing = React.useRef(false)
  const [impressionsCount, setImpressionsCount] = React.useState(initialCount)

  React.useEffect(() => {
    const hostname = window.location.hostname
    if (
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname === "127.0.0.1" ||
      hostname === "::1"
    ) {
      return
    }

    const now = Date.now()
    const lastView = recentProjectViews.get(projectId) ?? 0

    if (now - lastView > 1000) {
      recentProjectViews.set(projectId, now)
      const queue = readQueue()
      queue.push(projectId)
      writeQueue(queue)
    }

    async function flush(force = false) {
      if (flushing.current) return

      const queued = readQueue()
      if (queued.length === 0 || (!force && queued.length < BATCH_SIZE)) return

      const batch = queued.slice(0, MAX_BATCH_SIZE)
      writeQueue(queued.slice(batch.length))
      flushing.current = true

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/record_project_impressions`,
          {
            method: "POST",
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ project_ids: batch }),
            keepalive: true,
          }
        )

        if (!response.ok)
          throw new Error("Could not record project impressions")
        const recordedCount = batch.filter((id) => id === projectId).length
        if (recordedCount > 0) {
          setImpressionsCount((count) => count + recordedCount)
        }
      } catch {
        writeQueue([...batch, ...readQueue()])
      } finally {
        flushing.current = false
      }
    }

    const intervalId = window.setInterval(
      () => void flush(true),
      FLUSH_INTERVAL_MS
    )
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") void flush(true)
    }
    const handlePageHide = () => void flush(true)

    if (readQueue().length >= BATCH_SIZE) void flush()
    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("pagehide", handlePageHide)

    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("pagehide", handlePageHide)
    }
  }, [projectId])

  return (
    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
      <Eye className="size-4" />
      {impressionsCount.toLocaleString("en-US")} impressions
    </span>
  )
}

export { ProjectImpressionTracker }
