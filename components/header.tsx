"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  LogOut,
  Menu,
  Moon,
  FolderKanban,
  Plus,
  Settings,
  ShieldCheck,
  Sun,
  UserRound,
  X,
} from "lucide-react"
import { useTheme } from "next-themes"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

import { Button } from "components/ui/button"
import { useAuth } from "components/auth-provider"
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
  const { user, loading, isAdmin, signOut } = useAuth()
  const avatarUrl = user?.user_metadata?.avatar_url
  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.user_name as string | undefined) ??
    user?.email

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="site-container flex h-14 items-center justify-between gap-4">
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
            {!loading && (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={
                      user
                        ? `Open account menu for ${displayName}`
                        : "Open sign in menu"
                    }
                    className="size-9 overflow-hidden rounded-full p-0"
                  >
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt=""
                        width={36}
                        height={36}
                        unoptimized
                        className="size-full cursor-pointer object-cover"
                      />
                    ) : (
                      <UserRound className="size-4" />
                    )}
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align="end"
                    sideOffset={8}
                    className="z-[60] min-w-48 rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
                  >
                    {user ? (
                      <>
                        <DropdownMenu.Label className="px-2 py-1.5 text-xs text-muted-foreground">
                          {user.email}
                        </DropdownMenu.Label>
                        <DropdownMenu.Separator className="my-1 h-px bg-border" />
                        <DropdownMenu.Item asChild>
                          <Link
                            href="/account/create-project"
                            className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus:bg-accent"
                          >
                            <Plus className="size-4" />
                            Create project
                          </Link>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item asChild>
                          <Link
                            href="/account"
                            className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus:bg-accent"
                          >
                            <Settings className="size-4" />
                            Settings
                          </Link>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item asChild>
                          <Link
                            href="/account/projects"
                            className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus:bg-accent"
                          >
                            <FolderKanban className="size-4" />
                            My projects
                          </Link>
                        </DropdownMenu.Item>
                        {isAdmin && (
                          <DropdownMenu.Item asChild>
                            <Link
                              href="/account/admin"
                              className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus:bg-accent"
                            >
                              <ShieldCheck className="size-4" />
                              Admin
                            </Link>
                          </DropdownMenu.Item>
                        )}
                        <DropdownMenu.Separator className="my-1 h-px bg-border" />
                        <DropdownMenu.Item
                          onSelect={() => void signOut()}
                          className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus:bg-accent"
                        >
                          <LogOut className="size-4" />
                          Sign out
                        </DropdownMenu.Item>
                      </>
                    ) : (
                      <DropdownMenu.Item asChild>
                        <Link
                          href="/login"
                          className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus:bg-accent"
                        >
                          <UserRound className="size-4" />
                          Sign in
                        </Link>
                      </DropdownMenu.Item>
                    )}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            )}
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

      <div className={cn("border-t md:hidden", open ? "block" : "hidden")}>
        <nav className="site-container flex flex-col gap-1 py-3">
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
            {!loading && (
              <Button size="sm" variant="outline" asChild>
                <Link
                  href={user ? "/account" : "/login"}
                  onClick={() => setOpen(false)}
                >
                  {user ? "Account" : "Sign in"}
                </Link>
              </Button>
            )}
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
