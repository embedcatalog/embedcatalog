"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "components/ui/button"
import { Input } from "components/ui/input"
import { Label } from "components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card"
import { useAuth } from "components/auth-provider"
import { supabase } from "lib/supabase/client"
import { siteConfig } from "lib/site"

function GithubIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.775.42-1.305.762-1.605-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.241 2.873.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.624-5.48 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function LoginPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [email, setEmail] = React.useState("")
  const [status, setStatus] = React.useState<
    "idle" | "sending" | "sent" | "error"
  >("idle")
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!loading && user) {
      router.replace("/account")
    }
  }, [loading, user, router])

  async function handleEmailSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")
    setError(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${siteConfig.url}/account`,
      },
    })

    if (error) {
      setError(error.message)
      setStatus("error")
      return
    }

    setStatus("sent")
  }

  async function handleGithubSignIn() {
    setError(null)
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${siteConfig.url}/account`,
      },
    })
  }

  return (
    <div className="mx-auto flex min-h-[70svh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Sign in</CardTitle>
          <CardDescription>
            Use your email or GitHub account to access your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGithubSignIn}
          >
            <GithubIcon className="size-4" />
            Continue with GitHub
          </Button>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            or
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleEmailSignIn} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {status === "sent" ? (
              <p className="text-sm text-muted-foreground">
                Check your inbox for a magic link to sign in.
              </p>
            ) : (
              <Button type="submit" disabled={status === "sending"}>
                {status === "sending" && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                Send magic link
              </Button>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
          </form>

          <p className="text-center text-xs text-muted-foreground">
            By continuing you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
