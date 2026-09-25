import { type Project } from "components/projects-grid"

import { supabase } from "lib/supabase/client"
import { getProjectImageUrl } from "lib/storage"

const NEW_PROJECT_WINDOW_MS = 14 * 24 * 60 * 60 * 1000

async function getPublishedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, slug, name, description, url, github_url, github_stars, github_forks, github_contributors, github_license, github_stats_updated_at, images, tags, socials, info, is_premium, created_at"
    )
    .eq("status", "published")
    .order("created_at", { ascending: false })

  if (error || !data) {
    if (error) {
      console.error("Failed to load published projects:", error.message)
    }
    return []
  }

  return data.map((project) => ({
    id: project.id,
    slug: project.slug,
    name: project.name,
    description: project.description,
    isNew:
      Date.now() - new Date(project.created_at).getTime() <
      NEW_PROJECT_WINDOW_MS,
    premium: project.is_premium,
    url: project.url,
    githubUrl: project.github_url ?? project.socials?.github ?? undefined,
    githubStats: {
      stars: project.github_stars,
      forks: project.github_forks,
      contributors: project.github_contributors,
      license: project.github_license,
      updatedAt: project.github_stats_updated_at,
    },
    images: (project.images ?? []).map(getProjectImageUrl),
    tags: project.tags ?? [],
    createdAt: project.created_at,
    info: (project.info as Project["info"]) ?? undefined,
    socials: project.socials ?? undefined,
  }))
}

export { getPublishedProjects }
