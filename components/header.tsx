"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, Moon, Sun, X } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "components/ui/button"
import { cn } from "lib/utils"
import { siteConfig } from "lib/site"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
]

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="hidden size-4 dark:block" />
      <Moon className="size-4 dark:hidden" />
    </Button>
  )
}

function Header({ githubSlot }: { githubSlot?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center font-semibold"
          title={siteConfig.name}
        >
          <span className="truncate">{siteConfig.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {githubSlot}
          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <Button size="sm" asChild>
              <Link href="/submit">Submit</Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((prev) => !prev)}
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "border-t md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2">
            <Button size="sm" asChild>
              <Link href="/submit" onClick={() => setOpen(false)}>
                Submit
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}

export { Header }
