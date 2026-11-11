"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"

import { useAuth } from "components/auth-provider"
import { Button } from "components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card"
import { Embed } from "components/ui/embed"
import { ProjectInfoMarkdown } from "components/project-info-markdown"
import { supabase } from "lib/supabase/client"

type PendingEmbed = {
  title: string
  description: string
  position?: number
}

type PendingProject = {
  id: string
  project_id: string
  name: string
  description: string
  url: string
  github_url: string | null
  categories: string[] | null
  tags: string[] | null
  socials: Record<string, string> | null
  images: string[] | null
  info: string | null
  embeds: unknown
  created_at: string
}

function PreviewChangesProjectContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const requestId = searchParams.get("id")
  const { user, loading, isAdmin } = useAuth()
  const [request, setRequest] = React.useState<PendingProject | null>(null)
  const [fetching, setFetching] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.replace("/account")
    }
  }, [isAdmin, loading, router, user])

  React.useEffect(() => {
    if (!user || !isAdmin || !requestId) return

    let cancelled = false
    supabase
      .from("project_edit_requests")
      .select(
        "id, project_id, name, description, url, github_url, categories, tags, socials, images, info, embeds, created_at"
      )
      .eq("id", requestId)
      .eq("status", "pending")
      .maybeSingle()
      .then(({ data, error: requestError }) => {
        if (cancelled) return
        if (requestError || !data) {
          setError(requestError?.message ?? "Pending changes not found.")
        } else {
          setRequest(data)
        }
        setFetching(false)
      })

    return () => {
      cancelled = true
    }
  }, [isAdmin, requestId, user])

  if (loading || !user || !isAdmin || fetching) {
    return (
      <div className="flex min-h-[70svh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !request) {
    return (
      <main className="site-container py-8 sm:py-12">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/account/admin">
            <ArrowLeft className="size-4" />
            Moderation
          </Link>
        </Button>
        <p className="mt-6 text-sm text-destructive" role="alert">
          {error ?? "Pending changes not found."}
        </p>
      </main>
    )
  }

  const embeds = Array.isArray(request.embeds)
    ? (request.embeds as PendingEmbed[])
    : []

  return (
    <main className="site-container py-8 sm:py-12">
      <div className="mx-auto w-full max-w-4xl">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/account/admin">
            <ArrowLeft className="size-4" />
            Moderation
          </Link>
        </Button>

        <div className="mt-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Pending changes</p>
            <h1 className="mt-1 text-2xl font-semibold">{request.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Preview of the version waiting for approval.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Embed variant="secondary">Preview only</Embed>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Project details</CardTitle>
              <CardDescription>
                Values from the pending version.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="leading-relaxed">{request.description}</p>
              <a
                href={request.url}
                target="_blank"
                rel="noreferrer noopener"
                className="text-sm text-primary underline underline-offset-4"
              >
                {request.url}
              </a>
              {request.categories && request.categories.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Categories: {request.categories.join(", ")}
                </p>
              )}
              {request.tags && request.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {request.tags.map((tag) => (
                    <Embed key={tag} variant="outline">
                      {tag}
                    </Embed>
                  ))}
                </div>
              )}
              {request.socials && (
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  {Object.entries(request.socials).map(([name, url]) => (
                    <a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline underline-offset-4"
                    >
                      {name}
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {request.images && request.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {request.images.map((image) => (
                  <Image
                    key={image}
                    src={image}
                    alt={request.name}
                    width={800}
                    height={500}
                    unoptimized
                    className="aspect-video w-full rounded-md border object-cover"
                  />
                ))}
              </CardContent>
            </Card>
          )}

          {request.info && (
            <Card>
              <CardHeader>
                <CardTitle>Project info</CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectInfoMarkdown content={request.info} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Embeds ({embeds.length})</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {embeds.length === 0 ? (
                <p className="text-sm text-muted-foreground">No embeds.</p>
              ) : (
                embeds.map((embed, index) => (
                  <div
                    key={`${embed.title}-${index}`}
                    className="rounded-md border p-4"
                  >
                    <p className="font-medium">{embed.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {embed.description}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

function PreviewChangesProjectPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-[70svh] items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <PreviewChangesProjectContent />
    </React.Suspense>
  )
}

export default PreviewChangesProjectPage
