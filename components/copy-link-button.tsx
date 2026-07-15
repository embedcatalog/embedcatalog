"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"

import { Button } from "components/ui/button"

function CopyLinkButton({ path }: { path: string }) {
  const [copied, setCopied] = React.useState(false)

  async function handleCopy() {
    try {
      const url = `${window.location.origin}${path}`
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable — silently ignore.
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy link"}
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  )
}

export { CopyLinkButton }
