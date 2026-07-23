"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"

import { Embed } from "components/ui/embed"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui/card"
import { ProjectCardStars } from "components/project-card-stars"

function TwitterIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
    </svg>
  )
}

function YoutubeIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function GithubIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.086 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.776.42-1.305.762-1.605-2.665-.303-5.466-1.334-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.873.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.624-5.48 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .32.216.694.825.576C20.565 22.296 24 17.797 24 12.5 24 5.87 18.627.5 12 .5z" />
    </svg>
  )
}

export type ProjectInfoBlock = {
  type: "heading" | "text" | "code" | "image"
  content: string
}

export type ProjectSocials = {
  twitter?: string
  youtube?: string
  github?: string
}

export type Project = {
  id: string
  slug: string
  name: string
  description: string
  isNew: boolean
  premium?: boolean
  url: string
  images: string[]
  tags: string[]
  updatedAt: string
  info?: ProjectInfoBlock[]
  socials?: ProjectSocials
}

function ProjectsGrid({
  projects,
  onTagClick,
}: {
  projects: Project[]
  onTagClick?: (tag: string) => void
}) {
  if (projects.length === 0) {
    return (
      <div className="text-muted-foreground rounded-xl border border-dashed p-10 text-center text-sm">
        No projects found.
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="relative h-full overflow-hidden transition-colors hover:border-foreground/20"
        >
          <Link
            href={`/projects/${project.slug}`}
            aria-label={project.name}
            className="absolute inset-0 z-0 rounded-xl"
          />

          {project.images[0] && (
            <div className="bg-muted pointer-events-none relative -mt-6 aspect-video w-full overflow-hidden border-b select-none">
              <Image
                src={project.images[0]}
                alt={project.name}
                fill
                unoptimized
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          )}

          <CardHeader>
            <CardTitle className="flex flex-col items-start gap-2">
              {(project.premium || project.isNew) && (
                <div className="mb-1 flex items-center gap-2">
                  {project.premium && (
                    <Embed variant="secondary">Premium</Embed>
                  )}
                  {project.isNew && <Embed>New</Embed>}
                </div>
              )}
              <span>{project.name}</span>
            </CardTitle>
            <CardDescription>{project.description}</CardDescription>
            <CardAction className="relative z-10 flex items-center gap-2">
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`Link to ${project.name}`}
                className="text-muted-foreground hover:bg-accent hover:text-foreground flex h-8 items-center rounded-md border px-3 text-sm font-medium transition-colors"
              >
                link
              </a>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="relative z-10 flex w-fit flex-wrap gap-1">
              {project.tags.map((tag) => (
                <Embed
                  key={tag}
                  variant="outline"
                  className={onTagClick ? "cursor-pointer" : undefined}
                  onClick={onTagClick ? () => onTagClick(tag) : undefined}
                >
                  {tag}
                </Embed>
              ))}
            </div>
          </CardContent>
          <CardFooter className="text-muted-foreground mt-auto justify-between text-xs">
            <span>Updated {project.updatedAt}</span>
            <div className="relative z-10 flex items-center gap-0.5">
              {project.socials?.github && (
                <ProjectCardStars githubUrl={project.socials.github} />
              )}
              {project.socials?.twitter && (
                <a
                  href={project.socials.twitter}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${project.name} on X`}
                  className="hover:bg-accent hover:text-foreground flex size-7 items-center justify-center rounded-md transition-colors"
                >
                  <TwitterIcon className="size-4" />
                </a>
              )}
              {project.socials?.youtube && (
                <a
                  href={project.socials.youtube}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${project.name} on YouTube`}
                  className="hover:bg-accent hover:text-foreground flex size-7 items-center justify-center rounded-md transition-colors"
                >
                  <YoutubeIcon className="size-4" />
                </a>
              )}
              {project.socials?.github && (
                <a
                  href={project.socials.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${project.name} on GitHub`}
                  className="hover:bg-accent hover:text-foreground flex size-7 items-center justify-center rounded-md transition-colors"
                >
                  <GithubIcon className="size-4" />
                </a>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export { ProjectsGrid }
