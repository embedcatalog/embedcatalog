"use client"

import * as React from "react"
import Link from "next/link"
import { Check, ChevronLeft, Copy, Loader2, Moon, Sun } from "lucide-react"

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
import { Textarea } from "components/ui/textarea"
import { useRouter } from "next/navigation"

type Theme = "light" | "dark"

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    }
    return entities[character]
  })
}

function CreateEmbedPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [title, setTitle] = React.useState("Built with EmbedCatalog")
  const [description, setDescription] = React.useState(
    "A project worth checking out."
  )
  const [url, setUrl] = React.useState("https://example.com")
  const [theme, setTheme] = React.useState<Theme>("light")
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [loading, router, user])

  if (loading || !user) {
    return (
      <div className="flex min-h-[70svh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const colors =
    theme === "dark"
      ? {
          background: "#171717",
          border: "#404040",
          text: "#fafafa",
          muted: "#a3a3a3",
        }
      : {
          background: "#ffffff",
          border: "#d4d4d4",
          text: "#171717",
          muted: "#737373",
        }
  const embedHtml = `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer noopener" style="display:inline-block;color:${colors.text};text-decoration:none"><span style="display:block;max-width:320px;border:1px solid ${colors.border};border-radius:4px;background:${colors.background};padding:14px 16px;font-family:Arial,sans-serif"><strong style="display:block;font-size:14px;line-height:20px">${escapeHtml(title)}</strong><span style="display:block;margin-top:4px;color:${colors.muted};font-size:12px;line-height:18px">${escapeHtml(description)}</span></span></a>`

  async function copyEmbed() {
    await navigator.clipboard.writeText(embedHtml)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="site-container py-8 sm:py-12">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/account">
            <ChevronLeft className="size-4" />
            Account
          </Link>
        </Button>
        <h1 className="mt-4 text-2xl font-semibold">Create embed</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Design a compact link card for your website or README.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content</CardTitle>
            <CardDescription>
              Changes appear in the preview instantly.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label htmlFor="embed-title">Title</Label>
              <Input
                id="embed-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={80}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="embed-description">Description</Label>
              <Textarea
                id="embed-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                maxLength={160}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="embed-url">Destination URL</Label>
              <Input
                id="embed-url"
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Theme</Label>
              <div className="grid grid-cols-2 gap-2">
                {(["light", "dark"] as const).map((option) => {
                  const Icon = option === "light" ? Sun : Moon
                  return (
                    <Button
                      key={option}
                      type="button"
                      variant={theme === option ? "secondary" : "outline"}
                      className="capitalize"
                      onClick={() => setTheme(option)}
                    >
                      <Icon className="size-4" />
                      {option}
                    </Button>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4 lg:sticky lg:top-20">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex min-h-40 items-center justify-center rounded-md border border-dashed bg-muted/40 p-5">
                <div
                  className="w-full max-w-xs rounded border p-4"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text,
                  }}
                >
                  <p className="text-sm leading-5 font-semibold">
                    {title || "Untitled embed"}
                  </p>
                  {description && (
                    <p
                      className="mt-1 text-xs leading-[18px]"
                      style={{ color: colors.muted }}
                    >
                      {description}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Embed code</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <code className="max-h-32 overflow-auto rounded-md border bg-muted px-3 py-2 text-xs leading-relaxed break-all">
                {embedHtml}
              </code>
              <Button onClick={() => void copyEmbed()}>
                {copied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
                {copied ? "Copied" : "Copy code"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default CreateEmbedPage
