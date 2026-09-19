"use client"

import * as React from "react"
import { Search, X } from "lucide-react"

import { Input } from "components/ui/input"
import { ProjectsGrid, type Project } from "components/projects-grid"

function ProjectsView({
  projects,
  showFilters = true,
}: {
  projects: Project[]
  showFilters?: boolean
}) {
  const [query, setQuery] = React.useState("")
  const [newOnly, setNewOnly] = React.useState(false)
  const [selectedTags, setSelectedTags] = React.useState<string[]>([])
  const [sort, setSort] = React.useState<"desc" | "asc">("desc")

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
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => project.tags.includes(tag))
      return matchesQuery && matchesNew && matchesTags
    })
  }, [projects, normalizedQuery, newOnly, selectedTags])

  const sorted = React.useMemo(() => {
    return [...filtered].sort((a, b) => {
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
    setSelectedTags([])
  }

  const hasActiveFilters = query !== "" || newOnly || selectedTags.length > 0

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
              Sort by date
            </h3>
            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="sort"
                  checked={sort === "desc"}
                  onChange={() => setSort("desc")}
                  className="size-4 accent-primary"
                />
                <span>Desc</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="sort"
                  checked={sort === "asc"}
                  onChange={() => setSort("asc")}
                  className="size-4 accent-primary"
                />
                <span>Asc</span>
              </label>
            </div>
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
              <span>New only</span>
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
        <div className="relative max-w-sm">
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

        <ProjectsGrid projects={sorted} onTagClick={setQuery} />
      </div>
    </div>
  )
}

export { ProjectsView }
