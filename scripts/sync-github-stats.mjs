import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const githubToken = process.env.GITHUB_TOKEN

if (!supabaseUrl || !serviceRoleKey || !githubToken) {
  throw new Error(
    "SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and GITHUB_TOKEN are required"
  )
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

function parseGithubRepo(url) {
  try {
    const parsed = new URL(url)
    if (
      parsed.hostname !== "github.com" &&
      parsed.hostname !== "www.github.com"
    ) {
      return null
    }

    const [owner, rawRepo] = parsed.pathname.split("/").filter(Boolean)
    const repo = rawRepo?.replace(/\.git$/, "")
    return owner && repo ? `${owner}/${repo}` : null
  } catch {
    return null
  }
}

function parseContributorCount(linkHeader, list) {
  if (!linkHeader) return list.length

  const lastLink = linkHeader
    .split(",")
    .map((part) => part.trim())
    .find((part) => part.includes('rel="last"'))
  const page = lastLink?.match(/[?&]page=(\d+)/)?.[1]

  return page ? Number(page) : list.length
}

async function githubRequest(path) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${githubToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`GitHub ${response.status} for ${path}: ${detail}`)
  }

  return response
}

async function loadProjects() {
  const projects = []
  const pageSize = 1000

  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await supabase
      .from("projects")
      .select("id, github_url, socials")
      .eq("status", "published")
      .order("id")
      .range(offset, offset + pageSize - 1)

    if (error)
      throw new Error(`Supabase project query failed: ${error.message}`)

    projects.push(...data)
    if (data.length < pageSize) return projects
  }
}

const projects = await loadProjects()
const projectsByRepo = new Map()

for (const project of projects) {
  const repo = parseGithubRepo(
    project.github_url ?? project.socials?.github ?? ""
  )
  if (!repo) continue

  const matches = projectsByRepo.get(repo) ?? []
  matches.push(project)
  projectsByRepo.set(repo, matches)
}

console.log(`Syncing ${projectsByRepo.size} unique GitHub repositories`)
let failed = 0

for (const [repo, repoProjects] of projectsByRepo) {
  try {
    const repoResponse = await githubRequest(`/repos/${repo}`)
    const repoData = await repoResponse.json()
    const update = {
      github_stars: repoData.stargazers_count,
      github_forks: repoData.forks_count,
      github_license:
        repoData.license?.spdx_id && repoData.license.spdx_id !== "NOASSERTION"
          ? repoData.license.spdx_id
          : null,
      github_stats_updated_at: new Date().toISOString(),
    }

    try {
      const contributorsResponse = await fetch(
        `https://api.github.com/repos/${repo}/contributors?per_page=1&anon=true`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${githubToken}`,
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      )

      if (contributorsResponse.ok) {
        const contributors = await contributorsResponse.json()
        update.github_contributors = parseContributorCount(
          contributorsResponse.headers.get("Link"),
          contributors
        )
      } else {
        console.warn(
          `${repo}: contributors request failed (${contributorsResponse.status}); keeping the previous value`
        )
      }
    } catch (error) {
      console.warn(
        `${repo}: contributors request failed (${error instanceof Error ? error.message : error}); keeping the previous value`
      )
    }

    const { error } = await supabase
      .from("projects")
      .update(update)
      .in(
        "id",
        repoProjects.map((project) => project.id)
      )

    if (error) throw new Error(`Supabase update failed: ${error.message}`)
    console.log(`${repo}: updated ${repoProjects.length} project(s)`)
  } catch (error) {
    failed += 1
    console.error(`${repo}: ${error instanceof Error ? error.message : error}`)
  }
}

if (failed > 0) {
  throw new Error(
    `Failed to sync ${failed} of ${projectsByRepo.size} repositories`
  )
}
