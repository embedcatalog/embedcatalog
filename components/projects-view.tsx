"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { Compass, Search, X } from "lucide-react"

import { Input } from "components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select"
import { Embed } from "components/ui/embed"
import { ProjectsGrid, type Project } from "components/projects-grid"

type SortOption = "desc" | "asc" | "upvotes" | "impressions"

function parseTagsParam(value: string | null) {
  return value ? value.split(",").filter(Boolean) : []
}

function ProjectsView({
  projects,
  showFilters = true,
  hero,
  sidebar,
  centerScrollRef,
  leftSidebarRef,
  rightSidebarRef,
}: {
  projects: Project[]
  showFilters?: boolean
  hero?: React.ReactNode
  sidebar?: React.ReactNode
  centerScrollRef: React.RefObject<HTMLDivElement | null>
  leftSidebarRef: React.RefObject<HTMLElement | null>
  rightSidebarRef: React.RefObject<HTMLDivElement | null>
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [query, setQuery] = React.useState(() => searchParams.get("q") ?? "")
  const [newOnly, setNewOnly] = React.useState(
    () => searchParams.get("status") === "new"
  )
  const [premiumOnly, setPremiumOnly] = React.useState(
    () => searchParams.get("premium") === "1"
  )
  const [selectedCategory, setSelectedCategory] = React.useState(
    () => searchParams.get("category") ?? ""
  )
  const [selectedTags, setSelectedTags] = React.useState<string[]>(() =>
    parseTagsParam(searchParams.get("tags"))
  )
  const [tagSearch, setTagSearch] = React.useState("")
  const [sort, setSort] = React.useState<SortOption>(() => {
    const value = searchParams.get("sort")
    return value === "asc" || value === "upvotes" || value === "impressions"
      ? value
      : "desc"
  })

  // Keep the URL shareable without triggering a Next.js navigation.
  React.useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (newOnly) params.set("status", "new")
    if (premiumOnly) params.set("premium", "1")
    if (selectedCategory) params.set("category", selectedCategory)
    if (selectedTags.length > 0) params.set("tags", selectedTags.join(","))
    if (sort !== "desc") params.set("sort", sort)

    const queryString = params.toString()
    if (queryString === window.location.search.slice(1)) {
      return
    }

    window.history.replaceState(
      null,
      "",
      queryString ? `${pathname}?${queryString}` : pathname
    )
  }, [query, newOnly, premiumOnly, selectedCategory, selectedTags, sort, pathname])

  const categories = React.useMemo(() => {
    const categoriesByName = new Map<string, string>()
    for (const project of projects) {
      for (const category of project.categories ?? []) {
        const value = category.trim()
        const key = value.toLowerCase()
        if (value && !categoriesByName.has(key)) {
          categoriesByName.set(key, value)
        }
      }
    }
    return Array.from(categoriesByName.values()).sort((a, b) =>
      a.localeCompare(b)
    )
  }, [projects])
  const allTags = React.useMemo(() => {
    const tags = new Set<string>()
    for (const project of projects) {
      for (const tag of project.tags) {
        tags.add(tag)
      }
    }
    return Array.from(tags).sort()
  }, [projects])

  const visibleTags = React.useMemo(() => {
    const normalizedSearch = tagSearch.trim().toLowerCase()
    if (!normalizedSearch) return allTags
    return allTags.filter((tag) => tag.toLowerCase().includes(normalizedSearch))
  }, [allTags, tagSearch])

  const normalizedQuery = query.trim().toLowerCase()

  const filtered = React.useMemo(() => {
    return projects.filter((project) => {
      const matchesQuery =
        !normalizedQuery ||
        project.name.toLowerCase().includes(normalizedQuery) ||
        project.description.toLowerCase().includes(normalizedQuery) ||
        (project.categories ?? []).some((category) =>
          category.toLowerCase().includes(normalizedQuery)
        ) ||
        project.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      const matchesNew = !newOnly || project.isNew
      const matchesPremium = !premiumOnly || project.premium
      const matchesCategory =
        !selectedCategory ||
        (project.categories ?? []).some(
          (category) =>
            category.toLowerCase() === selectedCategory.toLowerCase()
        )
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => project.tags.includes(tag))
      return (
        matchesQuery &&
        matchesNew &&
        matchesPremium &&
        matchesCategory &&
        matchesTags
      )
    })
  }, [
    projects,
    normalizedQuery,
    newOnly,
    premiumOnly,
    selectedCategory,
    selectedTags,
  ])

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
    setSelectedCategory("")
    setSelectedTags([])
  }

  const hasActiveFilters =
    query !== "" ||
    newOnly ||
    premiumOnly ||
    selectedCategory !== "" ||
    selectedTags.length > 0

  return (
    <div
      className={
        showFilters
          ? sidebar
            ? "grid gap-6 md:grid-cols-[220px_1fr] lg:h-full lg:min-h-0 lg:grid-cols-[220px_minmax(0,1fr)_280px] lg:grid-rows-[minmax(0,1fr)]"
            : "grid gap-6 md:grid-cols-[220px_1fr] lg:h-full lg:min-h-0 lg:grid-rows-[minmax(0,1fr)]"
          : "flex flex-col lg:h-full lg:min-h-0"
      }
    >
      {showFilters && (
        <aside
          ref={leftSidebarRef}
          className="flex flex-col gap-6 lg:max-h-[calc(100dvh-6.5rem)] lg:overscroll-contain lg:overflow-y-auto"
        >
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-medium">
              <Compass className="size-4" />
              Browse
            </h2>
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
              Categories
            </h3>
            <div className="flex max-h-48 flex-col gap-2 overflow-y-auto pr-1">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="project-category"
                  checked={!selectedCategory}
                  onChange={() => setSelectedCategory("")}
                  className="size-4 accent-primary"
                />
                <span>All categories</span>
              </label>
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <input
                    type="radio"
                    name="project-category"
                    checked={selectedCategory === category}
                    onChange={() => setSelectedCategory(category)}
                    className="size-4 accent-primary"
                  />
                  <span>{category}</span>
                </label>
              ))}
              {categories.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No categories yet.
                </p>
              )}
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
            <Input
              value={tagSearch}
              onChange={(event) => setTagSearch(event.target.value)}
              placeholder="Search tags..."
              aria-label="Search tags"
              className="mb-3 h-8 text-sm"
            />
            {selectedTags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {selectedTags.map((tag) => (
                  <Embed key={tag} variant="secondary" asChild>
                    <button
                      type="button"
                      onClick={() => toggleTag(tag)}
                      aria-label={`Remove ${tag} tag filter`}
                      className="cursor-pointer"
                    >
                      <X />
                      {tag}
                    </button>
                  </Embed>
                ))}
              </div>
            )}
            <div className="flex max-h-48 flex-col gap-2 overflow-y-auto pr-1">
              {visibleTags.map((tag) => (
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
              {visibleTags.length === 0 && (
                <p className="text-sm text-muted-foreground">No tags found.</p>
              )}
            </div>
          </div>
        </aside>
      )}

      <div
        ref={centerScrollRef}
        className="flex flex-col gap-4 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain"
      >
        {hero}
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

        <ProjectsGrid
          projects={sorted}
          onTagClick={setQuery}
          onCategoryClick={setSelectedCategory}
        />
      </div>

      {showFilters && sidebar && (
        <div
          ref={rightSidebarRef}
          className="md:col-span-2 lg:col-span-1 lg:max-h-[calc(100dvh-6.5rem)] lg:overscroll-contain lg:overflow-y-auto"
        >
          {sidebar}
        </div>
      )}
    </div>
  )
}

export { ProjectsView }
