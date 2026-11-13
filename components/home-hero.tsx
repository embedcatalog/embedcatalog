import Image from "next/image"
import Link from "next/link"

import { Button } from "components/ui/button"
import { createPublicServerClient } from "lib/supabase/server"

const MAX_AVATARS = 5

async function getCommunity() {
  const supabase = createPublicServerClient()
  const { data, error } = await supabase
    .from("projects")
    .select("slug, name, github_url, socials")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) {
    console.error("Failed to load home community:", error.message)
    return { repositories: [] }
  }

  const repositories = []
  const seenOwners = new Set<string>()
  for (const project of data ?? []) {
    if (project.slug.toLowerCase() === "hmpl") continue

    const githubUrl = project.github_url ?? project.socials?.github
    if (!githubUrl) continue

    try {
      const url = new URL(githubUrl)
      if (url.hostname !== "github.com" && url.hostname !== "www.github.com") {
        continue
      }

      const [owner, repository] = url.pathname.split("/").filter(Boolean)
      if (!owner || !repository) continue
      const ownerKey = owner.toLowerCase()
      if (seenOwners.has(ownerKey)) continue
      seenOwners.add(ownerKey)
      repositories.push({
        key: ownerKey,
        name: project.name,
        avatarUrl: `https://github.com/${owner}.png?size=64`,
      })
      if (repositories.length === MAX_AVATARS) break
    } catch {
      continue
    }
  }

  return { repositories }
}

async function HomeHero() {
  const { repositories } = await getCommunity()

  return (
    <section className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-5 text-center">
      {repositories.length > 0 && (
        <Link
          href="/submit"
          className="flex items-center gap-3 rounded-full border bg-card py-1.5 pr-4 pl-1.5 text-sm transition-colors hover:bg-accent"
        >
          <span className="flex -space-x-2">
            {repositories.map((repository) => (
              <span
                key={repository.key}
                className="flex size-7 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-muted"
              >
                <Image
                  src={repository.avatarUrl}
                  alt={`${repository.name} GitHub repository owner`}
                  width={28}
                  height={28}
                  unoptimized
                  className="size-full object-cover"
                />
              </span>
            ))}
          </span>
          <span className="font-medium">Join 10 projects</span>
        </Link>
      )}
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Discover and share great projects
      </h1>
      <p className="text-muted-foreground">
        Explore projects built by creators, browse categories, filter by status
        and tags, and submit your own to get found.
      </p>
      <Button asChild size="lg">
        <Link href="/submit">Submit your project</Link>
      </Button>
    </section>
  )
}

export { HomeHero }
