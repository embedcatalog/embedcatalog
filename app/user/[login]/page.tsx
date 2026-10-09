import type { Metadata } from "next"

import { PublicUserEmbeds } from "components/public-user-embeds"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ login: string }>
}): Promise<Metadata> {
  const { login } = await params

  return {
    title: `${login}'s embeds`,
    description: `Custom standalone embeds by ${login}.`,
  }
}

export default async function UserEmbedsPage({
  params,
}: {
  params: Promise<{ login: string }>
}) {
  const { login } = await params
  return <PublicUserEmbeds login={login} />
}
