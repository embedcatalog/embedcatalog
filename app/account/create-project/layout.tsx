"use client"

import * as React from "react"

import { CreateProjectDraftProvider } from "./draft-context"

function CreateProjectLayout({ children }: { children: React.ReactNode }) {
  return <CreateProjectDraftProvider>{children}</CreateProjectDraftProvider>
}

export default CreateProjectLayout
