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
      project_upvotes: {
        Row: {
          project_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          project_id: string
          user_id: string
          created_at?: string
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
          github_stars: number | null
          github_forks: number | null
          github_contributors: number | null
          github_license: string | null
          github_stats_updated_at: string | null
          tags: string[] | null
          socials: Record<string, string> | null
          images: string[] | null
          info: unknown | null
          impressions_count: number
          upvotes_count: number
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
          github_stars?: number | null
          github_forks?: number | null
          github_contributors?: number | null
          github_license?: string | null
          github_stats_updated_at?: string | null
          tags?: string[] | null
          socials?: Record<string, string> | null
          images?: string[] | null
          info?: unknown | null
          impressions_count?: number
          upvotes_count?: number
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
          github_stars?: number | null
          github_forks?: number | null
          github_contributors?: number | null
          github_license?: string | null
          github_stats_updated_at?: string | null
          tags?: string[] | null
          socials?: Record<string, string> | null
          images?: string[] | null
          info?: unknown | null
          impressions_count?: number
          upvotes_count?: number
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
    Functions: {
      record_project_impressions: {
        Args: { project_ids: string[] }
        Returns: undefined
      }
    }
    Enums: {
      project_status: "draft" | "pending" | "published" | "rejected"
    }
    CompositeTypes: Record<string, never>
  }
}
