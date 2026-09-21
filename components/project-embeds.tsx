"use client"

import * as React from "react"
import Image from "next/image"
import { Check, Copy, Lock } from "lucide-react"

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "components/ui/card"
import { Embed } from "components/ui/embed"
import {
  type EmbedKind,
  type EmbedTheme,
  getCustomEmbedSize,
  getEmbedSize,
  getPublicCustomEmbedSrc,
  getPublicEmbedSrc,
} from "lib/embed"
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
          !isDark ? "font-medium text-foreground" : "text-muted-foreground"
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
          isDark ? "border-foreground bg-foreground" : "border-border bg-muted"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-4 rounded-full bg-background shadow-sm transition-transform",
            isDark && "translate-x-4"
          )}
        />
      </button>
      <span
        className={cn(
          "text-xs",
          isDark ? "font-medium text-foreground" : "text-muted-foreground"
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
    <div className="flex items-center gap-1.5 rounded-md border bg-muted px-2 py-1.5">
      <code className="min-w-0 flex-1 truncate text-[10px] leading-none text-muted-foreground">
        {code}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy HTML"}
        className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
      >
        {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      </button>
    </div>
  )
}

function buildEmbedImageHtml({
  projectUrl,
  title,
  embedSrc,
  width,
  height,
}: {
  projectUrl: string
  title: string
  embedSrc: string
  width: number
  height: number
}) {
  return `<a href="${projectUrl}" target="_blank" rel="noreferrer noopener"><img src="${embedSrc}" alt="${title}" style="width: ${width}px; height: ${height}px;" width="${width}" height="${height}" /></a>`
}

function CustomEmbedCard({
  slug,
  shortId,
  projectUrl,
  title,
}: {
  slug: string
  shortId: string
  projectUrl: string
  title: string
}) {
  const [theme, setTheme] = React.useState<EmbedTheme>("light")
  const { width, height } = getCustomEmbedSize()
  const embedSrc = getPublicCustomEmbedSrc(siteConfig.url, slug, shortId, theme)
  const html = buildEmbedImageHtml({
    projectUrl,
    title,
    embedSrc,
    width,
    height,
  })

  return (
    <Card className="gap-4 py-4 shadow-none">
      <CardHeader className="border-b px-4 pb-4">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
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
            key={embedSrc}
            src={embedSrc}
            alt={title}
            width={width}
            height={height}
            unoptimized
          />
        </a>
        <EmbedHtmlLine code={html} />
      </CardContent>
    </Card>
  )
}

function EmbedCard({
  slug,
  projectName,
  projectUrl,
  title,
  kind,
  premium = false,
  isPremium = false,
}: {
  slug: string
  projectName: string
  projectUrl: string
  title: string
  kind: EmbedKind
  premium?: boolean
  isPremium?: boolean
}) {
  if (premium && !isPremium) {
    return (
      <Card className="gap-4 py-4 shadow-none">
        <CardHeader className="border-b px-4 pb-4">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Embed variant="secondary">
              <Lock />
              Premium
            </Embed>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 px-4">
          <div className="flex min-h-16 items-center justify-center rounded border border-dashed bg-muted/40 text-sm text-muted-foreground">
            <Lock className="mr-2 size-4" />
            Available for Premium projects
          </div>
          <p className="text-sm text-muted-foreground">
            Upgrade this project to unlock the preview and embed code.
          </p>
        </CardContent>
      </Card>
    )
  }

  const [theme, setTheme] = React.useState<EmbedTheme>("light")
  const { width, height } = getEmbedSize(kind)
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
            key={embedSrc}
            src={embedSrc}
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

export type CustomEmbed = {
  id: string
  shortId: string
  title: string
  description: string
}

type EmbedTab = "default" | "premium" | "custom"

function ProjectEmbeds({
  slug,
  projectName,
  externalUrl,
  isPremium,
  customEmbeds,
}: {
  slug: string
  projectName: string
  externalUrl: string
  isPremium: boolean
  customEmbeds: CustomEmbed[]
}) {
  const catalogUrl = `${siteConfig.url}/projects/${slug}`
  const [tab, setTab] = React.useState<EmbedTab>("default")

  const defaultGroups = [
    { title: "License", kind: "license" as const },
    { title: "Added to", kind: "added" as const },
  ]
  const premiumGroups = [
    { title: "Organization", kind: "organization" as const, premium: true },
  ]

  const tabs: { id: EmbedTab; label: string }[] = [
    { id: "default", label: "Default embeds" },
    { id: "premium", label: "Premium embeds" },
    { id: "custom", label: "Custom embeds" },
  ]

  return (
    <section className="mt-10">
      <h2 className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Embeds
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Add interesting embeds to your website or README.
      </p>

      <div className="mb-4 flex w-fit gap-1 rounded-md border p-1">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
              tab === item.id
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "default" && (
        <div className="flex flex-col gap-4">
          {defaultGroups.map((group) => (
            <EmbedCard
              key={group.kind}
              slug={slug}
              projectName={projectName}
              projectUrl={catalogUrl}
              title={group.title}
              kind={group.kind}
            />
          ))}
        </div>
      )}

      {tab === "premium" && (
        <div className="flex flex-col gap-4">
          {premiumGroups.map((group) => (
            <EmbedCard
              key={group.kind}
              slug={slug}
              projectName={projectName}
              projectUrl={catalogUrl}
              title={group.title}
              kind={group.kind}
              premium={group.premium}
              isPremium={isPremium}
            />
          ))}
        </div>
      )}

      {tab === "custom" && (
        <div className="flex flex-col gap-4">
          {customEmbeds.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              This project hasn&rsquo;t added any custom embeds yet.
            </p>
          ) : (
            customEmbeds.map((embed) => (
              <CustomEmbedCard
                key={embed.id}
                slug={slug}
                shortId={embed.shortId}
                projectUrl={externalUrl}
                title={embed.title}
              />
            ))
          )}
        </div>
      )}
    </section>
  )
}

export { ProjectEmbeds }
