import Image from "next/image"
import Link from "next/link"

import { Button } from "components/ui/button"

const communityProjects = [
  {
    slug: "hol-guard",
    name: "HOL Guard",
    avatar: "/project-avatars/hashgraph-online.png",
  },
  {
    slug: "is-kit",
    name: "is-kit",
    avatar: "/project-avatars/nyaomaru.png",
  },
  {
    slug: "audiocn",
    name: "audiocn",
    avatar: "/project-avatars/audiocn.png",
  },
  {
    slug: "shadscan",
    name: "shadscan",
    avatar: "/project-avatars/theorcdev.png",
  },
  {
    slug: "browseract",
    name: "BrowserAct",
    avatar: "/project-avatars/browser-act.png",
  },
]

function HomeHero() {
  return (
    <section className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-5 text-center">
      <div className="flex items-center gap-3 rounded-full border bg-card py-1.5 pr-4 pl-1.5 text-sm">
        <span className="flex -space-x-2">
          {communityProjects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              aria-label={`View ${project.name} project`}
              className="flex size-7 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-muted transition-opacity hover:opacity-80"
            >
              <Image
                src={project.avatar}
                alt=""
                width={28}
                height={28}
                unoptimized
                className="size-full object-cover"
              />
            </Link>
          ))}
        </span>
        <Link
          href="/submit"
          className="transition-colors hover:text-foreground"
        >
          <span className="font-medium">Join 10 projects</span>
        </Link>
      </div>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Discover and share great projects
      </h1>
      <p className="text-muted-foreground">
        Explore projects built by creators, browse categories, filter by status
        and tags, and submit your own to get found.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/submit">Submit your project</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/about#embeds">About embeds</Link>
        </Button>
      </div>
    </section>
  )
}

export { HomeHero }
