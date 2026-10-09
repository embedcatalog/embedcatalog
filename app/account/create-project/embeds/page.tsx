"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Loader2 } from "lucide-react"

import { useAuth } from "components/auth-provider"
import { Button } from "components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card"
import { ProjectEmbedEditor } from "components/project-embed-editor"
import { useCreateProjectDraft } from "../draft-context"

function CreateProjectEmbedsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { draft, setDraft } = useCreateProjectDraft()

  React.useEffect(() => {
    if (!loading && !user) router.replace("/login")
  }, [loading, router, user])

  if (loading || !user) {
    return (
      <div className="flex min-h-[70svh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <main className="site-container py-8 sm:py-12">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/account/create-project">
            <ChevronLeft className="size-4" />
            Create project
          </Link>
        </Button>
        <h1 className="mt-4 text-2xl font-semibold">Embed editor</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Configure embeds for {draft.title.trim() || "your project"}. Changes
          are kept in your project draft until you save it.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <ProjectEmbedEditor
          embeds={draft.embeds}
          fallbackTitle={draft.title}
          onEmbedsChange={(embeds) =>
            setDraft((current) => ({ ...current, embeds }))
          }
        />

        <aside className="lg:sticky lg:top-20">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project embeds</CardTitle>
              <CardDescription>
                {draft.embeds.length} embed
                {draft.embeds.length === 1 ? "" : "s"} configured.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/account/create-project">Done</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}

export default CreateProjectEmbedsPage
