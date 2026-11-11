"use client"

import * as React from "react"
import Image from "next/image"
import { Check, Copy, Loader2 } from "lucide-react"

import { siteConfig } from "lib/site"
import { getContributors, type GithubContributor } from "lib/hacktoberfest"

function HacktoberfestCommunity() {
  const [contributors, setContributors] = React.useState<GithubContributor[]>(
    []
  )
  const [copiedLogin, setCopiedLogin] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false

    getContributors().then((loadedContributors) => {
      if (cancelled) return
      setContributors(loadedContributors)
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [])

  async function copyEmbedCode(contributor: GithubContributor) {
    const imageUrl = `${siteConfig.url}/embed/hacktoberfest-2026/${contributor.login}.png`
    const code = `<a href="${contributor.url}" target="_blank" rel="noreferrer noopener"><img src="${imageUrl}" alt="Hacktoberfest 2026 contributor badge for ${contributor.login}" width="320" height="84" /></a>`

    try {
      await navigator.clipboard.writeText(code)
      setCopiedLogin(contributor.login)
      setTimeout(() => setCopiedLogin(null), 2000)
    } catch {
      // Clipboard API unavailable.
    }
  }

  if (loading) {
    return (
      <div className="mt-10 flex justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <>
      <section className="mt-10 rounded-lg border p-6 text-center">
        <h2 className="text-lg font-semibold">
          Hacktoberfest 2026 has wrapped up
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you to everyone who contributed to EmbedCatalog and helped grow
          open source.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Contributors</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Meet the contributors and visit their GitHub profiles.
        </p>
        {contributors.length > 0 ? (
          <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
            {contributors.map((contributor) => (
              <li key={contributor.login}>
                <div className="flex flex-col items-center gap-2">
                  <a
                    href={contributor.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center gap-2"
                  >
                    <Image
                      src={contributor.avatarUrl}
                      alt={contributor.login}
                      width={64}
                      height={64}
                      unoptimized
                      className="size-16 rounded-full"
                    />
                    <span className="max-w-full truncate text-sm">
                      {contributor.login}
                    </span>
                  </a>
                  <a
                    href={`/embed/hacktoberfest-2026/${contributor.login}.png`}
                    download={`${contributor.login}-hacktoberfest-2026.png`}
                    aria-label={`Download ${contributor.login}'s Hacktoberfest 2026 badge`}
                  >
                    <Image
                      src={`/embed/hacktoberfest-2026/${contributor.login}.png`}
                      alt={`Hacktoberfest 2026 contributor badge for ${contributor.login}`}
                      width={320}
                      height={84}
                      unoptimized
                      className="h-auto w-full max-w-64"
                    />
                  </a>
                  <button
                    type="button"
                    onClick={() => void copyEmbedCode(contributor)}
                    aria-label={`Copy ${contributor.login}'s Hacktoberfest embed code`}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    {copiedLogin === contributor.login ? (
                      <Check className="size-3.5" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                    {copiedLogin === contributor.login
                      ? "Copied"
                      : "Copy embed code"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            No contributors to show.
          </p>
        )}
      </section>
    </>
  )
}

export { HacktoberfestCommunity }
