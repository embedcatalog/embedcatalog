"use client"

import * as React from "react"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "components/ui/card"
import { Input } from "components/ui/input"
import { Label } from "components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select"
import { Textarea } from "components/ui/textarea"
import type { CreateProjectEmbed } from "app/account/create-project/draft-context"
import { cn } from "lib/utils"

type EmbedProject = {
  id: string
  name: string
  status: string
}

type ProjectEmbedEditorProps = {
  embeds: CreateProjectEmbed[]
  onEmbedsChange: (embeds: CreateProjectEmbed[]) => void
  fallbackTitle?: string
  maxEmbeds?: number
  projects?: EmbedProject[]
  selectedProjectIds?: Record<number, string>
  onProjectChange?: (embedId: number, projectId: string | null) => void
}

const defaultEmbed = (id: number): CreateProjectEmbed => ({
  id,
  title: "Built with EmbedCatalog",
  description: "A project worth checking out.",
  theme: "light",
})

function getEmbedColors(theme: CreateProjectEmbed["theme"]) {
  return theme === "dark"
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
}

function ThemeSwitch({
  theme,
  onThemeChange,
}: {
  theme: CreateProjectEmbed["theme"]
  onThemeChange: (theme: CreateProjectEmbed["theme"]) => void
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

function ProjectEmbedEditor({
  embeds,
  onEmbedsChange,
  fallbackTitle,
  maxEmbeds,
  projects,
  selectedProjectIds,
  onProjectChange,
}: ProjectEmbedEditorProps) {
  function updateEmbed(id: number, changes: Partial<CreateProjectEmbed>) {
    onEmbedsChange(
      embeds.map((embed) =>
        embed.id === id ? { ...embed, ...changes } : embed
      )
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold">Embeds</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create as many variations as you need.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          disabled={maxEmbeds !== undefined && embeds.length >= maxEmbeds}
          onClick={() => onEmbedsChange([...embeds, defaultEmbed(Date.now())])}
        >
          <Plus className="size-4" />
          Add embed
        </Button>
      </div>
      {embeds.length === 0 && (
        <p className="text-sm text-muted-foreground">No embeds yet.</p>
      )}
      {embeds.map((embed, index) => {
        const colors = getEmbedColors(embed.theme)

        return (
          <Card key={embed.id}>
            <CardHeader>
              <CardTitle className="text-lg">Embed {index + 1}</CardTitle>
              <CardAction className="flex items-center gap-2">
                <ThemeSwitch
                  theme={embed.theme}
                  onThemeChange={(theme) => updateEmbed(embed.id, { theme })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  aria-label={`Remove embed ${index + 1}`}
                  onClick={() =>
                    onEmbedsChange(
                      embeds.filter((item) => item.id !== embed.id)
                    )
                  }
                >
                  <Trash2 className="size-4" />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor={`embed-title-${embed.id}`}>Title</Label>
                <Input
                  id={`embed-title-${embed.id}`}
                  value={embed.title}
                  onChange={(event) =>
                    updateEmbed(embed.id, { title: event.target.value })
                  }
                  maxLength={80}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`embed-description-${embed.id}`}>
                  Description
                </Label>
                <Textarea
                  id={`embed-description-${embed.id}`}
                  value={embed.description}
                  onChange={(event) =>
                    updateEmbed(embed.id, {
                      description: event.target.value,
                    })
                  }
                  maxLength={160}
                />
              </div>
              {projects && onProjectChange && (
                <div className="grid gap-2">
                  <Label htmlFor={`embed-project-${embed.id}`}>Project</Label>
                  <Select
                    value={selectedProjectIds?.[embed.id] || "none"}
                    onValueChange={(value) =>
                      onProjectChange(embed.id, value === "none" ? null : value)
                    }
                  >
                    <SelectTrigger id={`embed-project-${embed.id}`}>
                      <SelectValue placeholder="Not linked to a project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not linked</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name} ({project.status})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
            <CardContent className="border-t pt-6">
              <div className="flex min-h-32 items-center justify-center rounded-md border border-dashed bg-muted/40 p-5">
                <div
                  className="w-full max-w-xs rounded border p-4"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text,
                  }}
                >
                  <p className="text-sm leading-5 font-semibold">
                    {embed.title || fallbackTitle || "Untitled embed"}
                  </p>
                  {embed.description && (
                    <p
                      className="mt-1 text-xs leading-[18px]"
                      style={{ color: colors.muted }}
                    >
                      {embed.description}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export { ProjectEmbedEditor }
