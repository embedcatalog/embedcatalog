import * as React from "react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Embed } from "components/ui/embed"
import { Button } from "components/ui/button"
import { CopyBlock } from "components/copy-block"
import { CopyLinkButton } from "components/copy-link-button"
import { ImageCarousel } from "components/image-carousel"
import { ProjectEmbeds } from "components/project-embeds"
import { ProjectGithubStats } from "components/project-github-stats"
import { type Project } from "components/projects-grid"
import projectsData from "data/projects.json"
import { siteConfig } from "lib/site"

const projects = projectsData as Project[]

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

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((item) => item.slug === slug)

  if (!project) {
    return { title: "Project not found" }
  }

  const canonical = `/projects/${project.slug}`

  return {
    title: project.name,
    description: project.description,
    keywords: [project.name, ...project.tags, "project"],
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: `${project.name} | ${siteConfig.name}`,
      description: project.description,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} | ${siteConfig.name}`,
      description: project.description,
    },
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = projects.find((item) => item.slug === slug)

  if (!project) {
    notFound()
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to projects
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-col gap-2">
            {(project.premium || project.isNew) && (
              <div className="mb-1 flex items-center gap-2">
                {project.premium && <Embed variant="secondary">Premium</Embed>}
                {project.isNew && <Embed>New</Embed>}
              </div>
            )}
            <h1 className="text-2xl font-semibold">{project.name}</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Updated {project.updatedAt}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {project.socials && (
            <div className="flex items-center gap-0.5">
              {project.socials.twitter && (
                <a
                  href={project.socials.twitter}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${project.name} on X`}
                  className="text-muted-foreground hover:bg-accent hover:text-foreground flex size-9 items-center justify-center rounded-md border transition-colors"
                >
                  <TwitterIcon className="size-4" />
                </a>
              )}
              {project.socials.youtube && (
                <a
                  href={project.socials.youtube}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${project.name} on YouTube`}
                  className="text-muted-foreground hover:bg-accent hover:text-foreground flex size-9 items-center justify-center rounded-md border transition-colors"
                >
                  <YoutubeIcon className="size-4" />
                </a>
              )}
              {project.socials.github && (
                <a
                  href={project.socials.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${project.name} on GitHub`}
                  className="text-muted-foreground hover:bg-accent hover:text-foreground flex size-9 items-center justify-center rounded-md border transition-colors"
                >
                  <GithubIcon className="size-4" />
                </a>
              )}
            </div>
          )}

          <CopyLinkButton path={`/projects/${project.slug}`} />

          <Button asChild>
            <a href={project.url} target="_blank" rel="noreferrer noopener">
              Link
            </a>
          </Button>
        </div>
      </div>

      {project.socials?.github && (
        <ProjectGithubStats githubUrl={project.socials.github} />
      )}

      <div className="mt-6">
        <ImageCarousel images={project.images} alt={project.name} />
      </div>

      <ProjectEmbeds slug={project.slug} projectName={project.name} />

      <p className="mt-6 leading-relaxed">{project.description}</p>

      {project.info && project.info.length > 0 && (
        <div className="mt-8 flex flex-col gap-6">
          {project.info.map((block, index) => {
            if (block.type === "heading") {
              return (
                <h2
                  key={index}
                  className="text-xl font-semibold tracking-tight"
                >
                  {block.content}
                </h2>
              )
            }

            if (block.type === "text") {
              return (
                <p key={index} className="leading-relaxed">
                  {block.content}
                </p>
              )
            }

            if (block.type === "code") {
              return <CopyBlock key={index} code={block.content} />
            }

            return (
              <div
                key={index}
                className="bg-muted w-full overflow-hidden rounded-xl border"
              >
                <Image
                  src={block.content}
                  alt={project.name}
                  width={1200}
                  height={800}
                  unoptimized
                  sizes="(min-width: 768px) 768px, 100vw"
                  className="h-auto w-full"
                />
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-6">
        <h2 className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Tags
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Embed key={tag} variant="outline">
              {tag}
            </Embed>
          ))}
        </div>
      </div>
    </main>
  )
}
