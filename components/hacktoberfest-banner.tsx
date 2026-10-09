"use client"

import * as React from "react"
import Link from "next/link"
import { X } from "lucide-react"

const STORAGE_KEY = "hacktoberfest-2026-banner-dismissed"
const VISIBILITY_EVENT = "hacktoberfest-banner-visibility-change"
let dismissedInMemory = false

function subscribe(callback: () => void) {
  const handleChange = () => callback()
  window.addEventListener("storage", handleChange)
  window.addEventListener(VISIBILITY_EVENT, handleChange)

  return () => {
    window.removeEventListener("storage", handleChange)
    window.removeEventListener(VISIBILITY_EVENT, handleChange)
  }
}

function getSnapshot() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "1"
  } catch {
    return !dismissedInMemory
  }
}

function getServerSnapshot() {
  return false
}

function HacktoberfestBanner() {
  const visible = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )

  if (!visible) return null

  function dismiss() {
    dismissedInMemory = true
    try {
      localStorage.setItem(STORAGE_KEY, "1")
    } catch {
      // storage unavailable, banner returns on next visit
    }
    window.dispatchEvent(new Event(VISIBILITY_EVENT))
  }

  return (
    <div className="relative border-b bg-accent px-10 py-2 text-center text-sm">
      <Link href="/hacktoberfest-2026" className="font-medium hover:underline">
        EmbedCatalog is participating in Hacktoberfest 2026. More →
      </Link>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={dismiss}
        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}

export { HacktoberfestBanner }
