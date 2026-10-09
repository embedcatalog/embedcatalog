"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, FolderPlus, ImagePlus, Loader2 } from "lucide-react"

import { useAuth } from "components/auth-provider"
import { Button } from "components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card"

function CreatePage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  React.useEffect(() => {
    if (!loading && !user) router.replace("/login")
  }, [loading, router, user])

  if (loading || !user) {
    return (
      <div className="flex min-h-[70svh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <main className="site-container py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Create</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose what you want to make.
        </p>
      </div>

      <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <FolderPlus className="mb-2 size-6 text-muted-foreground" />
            <CardTitle>Create project</CardTitle>
            <CardDescription>
              Add a project to EmbedCatalog and configure its project embeds.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Button className="w-full" asChild>
              <Link href="/account/create-project">
                Create project
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <ImagePlus className="mb-2 size-6 text-muted-foreground" />
            <CardTitle>Create embed</CardTitle>
            <CardDescription>
              Design custom image embeds for your profile and send them for
              review.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Button className="w-full" asChild>
              <Link href="/account/create-embed">
                Create embed
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default CreatePage
