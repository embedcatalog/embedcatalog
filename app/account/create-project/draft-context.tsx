"use client"

import * as React from "react"

export type CreateProjectEmbed = {
  id: number
  title: string
  description: string
  theme: "light" | "dark"
}

export type CreateProjectDraft = {
  title: string
  projectUrl: string
  shortDescription: string
  tagsInput: string
  twitterUrl: string
  youtubeUrl: string
  githubUrl: string
  infoInput: string
  embeds: CreateProjectEmbed[]
}

type CreateProjectDraftContextValue = {
  draft: CreateProjectDraft
  setDraft: React.Dispatch<React.SetStateAction<CreateProjectDraft>>
}

const CreateProjectDraftContext =
  React.createContext<CreateProjectDraftContextValue | null>(null)

function CreateProjectDraftProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [draft, setDraft] = React.useState<CreateProjectDraft>(() => ({
    title: "",
    projectUrl: "https://example.com",
    shortDescription: "",
    tagsInput: "",
    twitterUrl: "",
    youtubeUrl: "",
    githubUrl: "",
    infoInput: "",
    embeds: [],
  }))

  return (
    <CreateProjectDraftContext.Provider value={{ draft, setDraft }}>
      {children}
    </CreateProjectDraftContext.Provider>
  )
}

function useCreateProjectDraft() {
  const context = React.useContext(CreateProjectDraftContext)
  if (!context) {
    throw new Error(
      "useCreateProjectDraft must be used within CreateProjectDraftProvider"
    )
  }
  return context
}

export { CreateProjectDraftProvider, useCreateProjectDraft }
