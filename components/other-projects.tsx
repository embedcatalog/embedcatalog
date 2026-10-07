import Image from "next/image"
import Link from "next/link"

import { type Project } from "components/projects-grid"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui/card"
import { Embed } from "components/ui/embed"
import { ProjectLiveStats } from "components/project-live-stats"
import { formatDate } from "lib/utils"

function OtherProjects({
  projects,
  currentProjectId,
}: {
  projects: Project[]
  currentProjectId: string
}) {
  const availableProjects = projects.filter(
    (project) => project.id !== currentProjectId
  )

  for (let index = availableProjects.length - 1; index > 0; index -= 1) {
    // eslint-disable-next-line react-hooks/purity
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[availableProjects[index], availableProjects[randomIndex]] = [
      availableProjects[randomIndex],
      availableProjects[index],
    ]
  }

  const otherProjects = availableProjects.slice(0, 5)

  if (otherProjects.length === 0) return null

  return (
    <aside className="lg:sticky lg:top-20">
      <h2 className="mb-4 text-lg font-semibold">Other projects</h2>
      <div className="flex flex-col gap-4">
        {otherProjects.map((project) => (
          <Card
            key={project.id}
            className="gap-0 overflow-hidden py-0 shadow-none"
          >
            <Link
              href={`/projects/${project.slug}`}
              aria-label={project.name}
              className="group"
            >
              {project.images[0] && (
                <div className="relative aspect-video overflow-hidden border-b bg-muted">
                  <Image
                    src={project.images[0]}
                    alt={project.name}
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 320px, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <CardHeader className="gap-1 px-4 py-4">
                <CardTitle className="text-base">{project.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
            </Link>
            <CardContent className="px-4 pb-3">
              <div className="flex flex-wrap gap-1">
                {project.tags.slice(0, 3).map((tag) => (
                  <Embed key={tag} variant="outline" asChild>
                    <Link href={`/?q=${encodeURIComponent(tag)}`}>
                      {tag}
                    </Link>
                  </Embed>
                ))}
              </div>
            </CardContent>
            <CardFooter className="justify-between px-4 py-3 text-xs text-muted-foreground">
              <span>{formatDate(project.createdAt)}</span>
              <ProjectLiveStats
                projectId={project.id}
                initialImpressions={project.impressionsCount}
                initialUpvotes={project.upvotesCount}
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </aside>
  )
}

export { OtherProjects }
