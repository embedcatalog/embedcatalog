"use client"

import * as React from "react"
import { Plus, X } from "lucide-react"

import { Button } from "components/ui/button"
import { Embed } from "components/ui/embed"
import { Input } from "components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select"
import { supabase } from "lib/supabase/client"
import { MAX_PROJECT_CATEGORIES } from "lib/project-categories"

function ProjectCategoryPicker({
  categories,
  onChange,
}: {
  categories: string[]
  onChange: (categories: string[]) => void
}) {
  const [customCategory, setCustomCategory] = React.useState("")
  const [categoryToAdd, setCategoryToAdd] = React.useState("")
  const [availableCategories, setAvailableCategories] = React.useState<
    string[]
  >([])
  const [categoriesError, setCategoriesError] = React.useState<string | null>(
    null
  )

  React.useEffect(() => {
    let cancelled = false

    supabase
      .from("categories")
      .select("name")
      .order("name")
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          setCategoriesError(error.message)
          return
        }
        setAvailableCategories(data.map((category) => category.name))
      })

    return () => {
      cancelled = true
    }
  }, [])

  const selectedKeys = new Set(
    categories.map((category) => category.toLowerCase())
  )
  const options = [
    ...availableCategories,
    ...categories.filter(
      (category) =>
        !availableCategories.some(
          (option) => option.toLowerCase() === category.toLowerCase()
        )
    ),
  ]
  const atLimit = categories.length >= MAX_PROJECT_CATEGORIES

  function addCategory(category: string) {
    if (
      atLimit ||
      categories.some(
        (selected) => selected.toLowerCase() === category.toLowerCase()
      )
    ) {
      return
    }

    onChange([...categories, category])
  }

  function removeCategory(category: string) {
    onChange(
      categories.filter(
        (selected) => selected.toLowerCase() !== category.toLowerCase()
      )
    )
  }

  function addCustomCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = customCategory.trim()
    if (
      !value ||
      atLimit ||
      categories.some(
        (category) => category.toLowerCase() === value.toLowerCase()
      )
    ) {
      return
    }

    onChange([...categories, value])
    setCustomCategory("")
  }

  return (
    <fieldset className="grid gap-3">
      <legend className="text-sm font-medium">
        Categories ({categories.length}/{MAX_PROJECT_CATEGORIES})
      </legend>
      {categoriesError && (
        <p className="text-sm text-destructive" role="alert">
          Could not load categories: {categoriesError}
        </p>
      )}
      <Select
        value={categoryToAdd}
        onValueChange={(category) => {
          addCategory(category)
          setCategoryToAdd("")
        }}
        disabled={
          atLimit ||
          options.every((category) => selectedKeys.has(category.toLowerCase()))
        }
      >
        <SelectTrigger aria-label="Select a category">
          <SelectValue
            placeholder={
              atLimit
                ? "Category limit reached"
                : options.length === 0
                  ? "No categories available"
                  : "Select a category"
            }
          />
        </SelectTrigger>
        <SelectContent>
          {options
            .filter((category) => !selectedKeys.has(category.toLowerCase()))
            .map((category) => (
              <SelectItem key={category.toLowerCase()} value={category}>
                {category}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Embed key={category} variant="secondary" className="gap-1">
              {category}
              <button
                type="button"
                onClick={() => removeCategory(category)}
                aria-label={`Remove ${category} category`}
                className="ml-1 cursor-pointer"
              >
                <X />
              </button>
            </Embed>
          ))}
        </div>
      )}
      <form className="flex gap-2" onSubmit={addCustomCategory}>
        <Input
          value={customCategory}
          onChange={(event) => setCustomCategory(event.target.value)}
          placeholder="Add your own category"
          aria-label="Custom category"
          maxLength={40}
          disabled={atLimit}
        />
        <Button
          type="submit"
          variant="outline"
          size="sm"
          disabled={atLimit || !customCategory.trim()}
        >
          <Plus />
          Add
        </Button>
      </form>
      <p className="text-xs text-muted-foreground">
        Choose up to {MAX_PROJECT_CATEGORIES} categories, including your own.
      </p>
    </fieldset>
  )
}

export { ProjectCategoryPicker }
