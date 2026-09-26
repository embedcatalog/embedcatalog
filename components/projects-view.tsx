"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"

import { Input } from "components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select"
import { ProjectsGrid, type Project } from "components/projects-grid"

type SortOption = "desc" | "asc" | "upvotes" | "impressions"

function parseTagsParam(value: string | null) {
  return value ? value.split(",").filter(Boolean) : []
}

function ProjectsView({
  projects,
  showFilters = true,
}: {
  projects: Project[]
  showFilters?: boolean
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [query, setQuery] = React.useState(() => searchParams.get("q") ?? "")
  const [newOnly, setNewOnly] = React.useState(
    () => searchParams.get("status") === "new"
  )
  const [premiumOnly, setPremiumOnly] = React.useState(
    () => searchParams.get("premium") === "1"
  )
  const [selectedTags, setSelectedTags] = React.useState<string[]>(() =>
    parseTagsParam(searchParams.get("tags"))
  )
  const [sort, setSort] = React.useState<SortOption>(() => {
    const value = searchParams.get("sort")
    return value === "asc" || value === "upvotes" || value === "impressions"
      ? value
      : "desc"
  })

  // keep the URL in sync so filters are shareable/bookmarkable
  React.useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (newOnly) params.set("status", "new")
    if (premiumOnly) params.set("premium", "1")
    if (selectedTags.length > 0) params.set("tags", selectedTags.join(","))
    if (sort !== "desc") params.set("sort", sort)

    const queryString = params.toString()
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    })
  }, [query, newOnly, premiumOnly, selectedTags, sort, pathname, router])

  const allTags = React.useMemo(() => {
    const tags = new Set<string>()
    for (const project of projects) {
      for (const tag of project.tags) {
        tags.add(tag)
      }
    }
    return Array.from(tags).sort()
  }, [projects])

  const normalizedQuery = query.trim().toLowerCase()

  const filtered = React.useMemo(() => {
    return projects.filter((project) => {
      const matchesQuery =
        !normalizedQuery ||
        project.name.toLowerCase().includes(normalizedQuery) ||
        project.description.toLowerCase().includes(normalizedQuery) ||
        project.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      const matchesNew = !newOnly || project.isNew
      const matchesPremium = !premiumOnly || project.premium
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => project.tags.includes(tag))
      return matchesQuery && matchesNew && matchesPremium && matchesTags
    })
  }, [projects, normalizedQuery, newOnly, premiumOnly, selectedTags])

  const sorted = React.useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sort === "upvotes") return b.upvotesCount - a.upvotesCount
      if (sort === "impressions") {
        return b.impressionsCount - a.impressionsCount
      }

      const diff =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      return sort === "desc" ? -diff : diff
    })
  }, [filtered, sort])

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  function clearFilters() {
    setQuery("")
    setNewOnly(false)
    setPremiumOnly(false)
    setSelectedTags([])
  }

  const hasActiveFilters =
    query !== "" || newOnly || premiumOnly || selectedTags.length > 0

  return (
    <div
      className={
        showFilters ? "grid gap-6 md:grid-cols-[220px_1fr]" : "flex flex-col"
      }
    >
      {showFilters && (
        <aside className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Filters</h2>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          <div>
            <h3 className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Status
            </h3>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={newOnly}
                onChange={() => setNewOnly((prev) => !prev)}
                className="size-4 rounded border border-input accent-primary"
              />
              <span>New</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={premiumOnly}
                onChange={() => setPremiumOnly((prev) => !prev)}
                className="size-4 rounded border border-input accent-primary"
              />
              <span>Premium</span>
            </label>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Tags
            </h3>
            <div className="flex max-h-48 flex-col gap-2 overflow-y-auto pr-1">
              {allTags.map((tag) => (
                <label
                  key={tag}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => toggleTag(tag)}
                    className="size-4 rounded border border-input accent-primary"
                  />
                  <span>{tag}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <div className="relative max-w-sm min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, description or tag..."
              className="pl-9"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <Select
            value={sort}
            onValueChange={(value) => setSort(value as SortOption)}
          >
            <SelectTrigger
              aria-label="Sort projects"
              className="ml-auto w-[200px]"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Date: descending</SelectItem>
              <SelectItem value="asc">Date: ascending</SelectItem>
              <SelectItem value="upvotes">Most upvoted</SelectItem>
              <SelectItem value="impressions">Most viewed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ProjectsGrid projects={sorted} onTagClick={setQuery} />
      </div>
    </div>
  )
}

export { ProjectsView }
