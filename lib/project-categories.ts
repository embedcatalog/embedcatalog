const MAX_PROJECT_CATEGORIES = 5

function parseProjectCategories(input: string) {
  const categories = new Map<string, string>()

  for (const value of input.split(",")) {
    const category = value.trim()
    const key = category.toLowerCase()
    if (category && !categories.has(key)) {
      categories.set(key, category)
    }
  }

  return Array.from(categories.values())
}

export { MAX_PROJECT_CATEGORIES, parseProjectCategories }
