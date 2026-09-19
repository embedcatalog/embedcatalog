import { createClient } from "@supabase/supabase-js"

import type { Database } from "lib/supabase/database"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables"
  )
}

// Site is statically exported (no server runtime), so auth runs entirely
// in the browser: the client itself parses the OAuth/magic-link redirect
// URL and persists the session to localStorage.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
