export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: "user" | "admin"
          created_at: string
        }
        Insert: {
          id: string
          role?: "user" | "admin"
          created_at?: string
        }
        Update: {
          id?: string
          role?: "user" | "admin"
          created_at?: string
        }
        Relationships: []
      }
      project_embeds: {
        Row: {
          id: string
          project_id: string
          short_id: string
          title: string
          description: string
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          short_id?: string
          title: string
          description: string
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: never
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          owner_id: string | null
          slug: string
          name: string
          description: string
          url: string
          github_url: string | null
          tags: string[] | null
          socials: Record<string, string> | null
          images: string[] | null
          info: unknown | null
          status: "draft" | "pending" | "published" | "rejected"
          submission_comment: string | null
          is_premium: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id?: string | null
          slug: string
          name: string
          description: string
          url: string
          github_url?: string | null
          tags?: string[] | null
          socials?: Record<string, string> | null
          images?: string[] | null
          info?: unknown | null
          status?: "draft" | "pending" | "published" | "rejected"
          submission_comment?: string | null
          is_premium?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string | null
          slug?: string
          name?: string
          description?: string
          url?: string
          github_url?: string | null
          tags?: string[] | null
          socials?: Record<string, string> | null
          images?: string[] | null
          info?: unknown | null
          status?: "draft" | "pending" | "published" | "rejected"
          submission_comment?: string | null
          is_premium?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      project_status: "draft" | "pending" | "published" | "rejected"
    }
    CompositeTypes: Record<string, never>
  }
}
