"use client"

import * as React from "react"
import Image from "next/image"
import { Check, Copy } from "lucide-react"

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "components/ui/card"
import { Embed } from "components/ui/embed"
import { type EmbedKind, type EmbedTheme, getEmbedSize, getPublicEmbedSrc } from "lib/embed"
import { siteConfig } from "lib/site"
import { cn } from "lib/utils"

function buildEmbedHtml({
  projectUrl,
  projectName,
  embedSrc,
  width,
  height,
}: {
  projectUrl: string
  projectName: string
  embedSrc: string
  width: number
  height: number
}) {
  return `<a href="${projectUrl}" target="_blank" rel="noreferrer noopener"><img src="${embedSrc}" alt="${projectName} on ${siteConfig.name}" style="width: ${width}px; height: ${height}px;" width="${width}" height="${height}" /></a>`
}

function ThemeSwitch({
  theme,
  onThemeChange,
}: {
  theme: EmbedTheme
  onThemeChange: (theme: EmbedTheme) => void
}) {
  const isDark = theme === "dark"

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "text-xs",
          !isDark ? "text-foreground font-medium" : "text-muted-foreground"
        )}
      >
        Light
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle embed theme"
        onClick={() => onThemeChange(isDark ? "light" : "dark")}
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full border transition-colors",
          isDark ? "bg-foreground border-foreground" : "bg-muted border-border"
        )}
      >
        <span
          className={cn(
            "bg-background absolute top-0.5 left-0.5 size-4 rounded-full shadow-sm transition-transform",
            isDark && "translate-x-4"
          )}
        />
      </button>
      <span
        className={cn(
          "text-xs",
          isDark ? "text-foreground font-medium" : "text-muted-foreground"
        )}
      >
        Dark
      </span>
    </div>
  )
}

function EmbedHtmlLine({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <div className="bg-muted flex items-center gap-1.5 rounded-md border px-2 py-1.5">
      <code className="text-muted-foreground min-w-0 flex-1 truncate text-[10px] leading-none">
        {code}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy HTML"}
        className="text-muted-foreground hover:bg-background hover:text-foreground flex size-6 shrink-0 items-center justify-center rounded-md transition-colors"
      >
        {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      </button>
    </div>
  )
}

function EmbedCard({
  slug,
  projectName,
  projectUrl,
  title,
  kind,
  premium = false,
}: {
  slug: string
  projectName: string
  projectUrl: string
  title: string
  kind: EmbedKind
  premium?: boolean
}) {
  const [theme, setTheme] = React.useState<EmbedTheme>("light")
  const { width, height } = getEmbedSize(kind)
  const previewSrc = `/embed/${slug}/${kind}/${theme}/opengraph-image`
  const embedSrc = getPublicEmbedSrc(siteConfig.url, slug, kind, theme)
  const html = buildEmbedHtml({
    projectUrl,
    projectName,
    embedSrc,
    width,
    height,
  })

  return (
    <Card className="gap-4 py-4 shadow-none">
      <CardHeader className="border-b px-4 pb-4">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          {premium ? <Embed variant="secondary">Premium</Embed> : null}
          {title}
        </CardTitle>
        <CardAction>
          <ThemeSwitch theme={theme} onThemeChange={setTheme} />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-4">
        <a
          href={projectUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex w-fit transition-opacity hover:opacity-80"
        >
          <Image
            key={previewSrc}
            src={previewSrc}
            alt={`${projectName} on ${siteConfig.name}`}
            width={width}
            height={height}
            unoptimized
            className="w-auto"
            style={{ height: height }}
          />
        </a>
        <EmbedHtmlLine code={html} />
      </CardContent>
    </Card>
  )
}

function ProjectEmbeds({
  slug,
  projectName,
}: {
  slug: string
  projectName: string
}) {
  const projectUrl = `${siteConfig.url}/projects/${slug}`

  const groups = [
    { title: "License", kind: "license" as const },
    { title: "Added to", kind: "added" as const },
    { title: "Organization", kind: "organization" as const, premium: true },
  ]

  return (
    <section className="mt-10">
      <h2 className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Embeds
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Add interesting embeds to your website or README.
      </p>

      <div className="flex flex-col gap-4">
        {groups.map((group) => (
          <EmbedCard
            key={group.kind}
            slug={slug}
            projectName={projectName}
            projectUrl={projectUrl}
            title={group.title}
            kind={group.kind}
            premium={group.premium}
          />
        ))}
      </div>
    </section>
  )
}

export { ProjectEmbeds }
