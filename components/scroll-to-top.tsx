"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

import { Button } from "components/ui/button"

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function updateVisibility() {
      setVisible(window.scrollY > 400)
    }

    updateVisibility()
    window.addEventListener("scroll", updateVisibility, { passive: true })

    return () => {
      window.removeEventListener("scroll", updateVisibility)
    }
  }, [])

  if (!visible) return null

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="fixed right-6 bottom-6 z-40 rounded-full shadow-lg"
      aria-label="Scroll to top"
      title="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ArrowUp aria-hidden="true" />
    </Button>
  )
}
