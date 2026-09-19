"use client"

import * as React from "react"
import type { Session, User } from "@supabase/supabase-js"

import { supabase } from "lib/supabase/client"

type AuthContextValue = {
  user: User | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
  signOut: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

function clearAuthCallbackUrl() {
  if (typeof window === "undefined") return

  const hasAuthFragment = /(^|&)access_token=|(^|&)code=/.test(
    window.location.hash
  )

  if (hasAuthFragment) {
    window.history.replaceState(
      null,
      document.title,
      `${window.location.pathname}${window.location.search}`
    )
  }
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [isAdmin, setIsAdmin] = React.useState(false)

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
      clearAuthCallbackUrl()
    })

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession)
        setLoading(false)
        clearAuthCallbackUrl()
      }
    )

    return () => subscription.subscription.unsubscribe()
  }, [])

  React.useEffect(() => {
    const userId = session?.user.id

    if (!userId) {
      setIsAdmin(false)
      return
    }

    let cancelled = false

    supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single()
      .then(({ data }) => {
        if (!cancelled) setIsAdmin(data?.role === "admin")
      })

    return () => {
      cancelled = true
    }
  }, [session])

  const signOut = React.useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const value = React.useMemo(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      isAdmin,
      signOut,
    }),
    [session, loading, isAdmin, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export { AuthProvider, useAuth }
