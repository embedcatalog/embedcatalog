export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          name: string
          created_at: string
        }
        Insert: {
          name: string
          created_at?: string
        }
        Update: {
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          role: "user" | "admin"
          slug: string
          display_name: string | null
          avatar_url: string | null
          socials: Record<string, string>
          bio: string
          is_confirmed: boolean
          created_at: string
        }
        Insert: {
          id: string
          role?: "user" | "admin"
          slug?: string
          display_name?: string | null
          avatar_url?: string | null
          socials?: Record<string, string>
          bio?: string
          is_confirmed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          role?: "user" | "admin"
          slug?: string
          display_name?: string | null
          avatar_url?: string | null
          socials?: Record<string, string>
          bio?: string
          is_confirmed?: boolean
          created_at?: string
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
        }
        Update: never
        Relationships: []
      }
      user_follows: {
        Row: {
          follower_id: string
          followed_id: string
          created_at: string
        }
        Insert: {
          follower_id: string
          followed_id: string
          created_at?: string
        }
        Update: never
        Relationships: []
      }
      standalone_embeds: {
        Row: {
          id: string
          owner_id: string
          slug: string
          title: string
          description: string
          image_title: string
          image_description: string
          project_id: string | null
          status: "draft" | "pending" | "approved" | "rejected"
          views_count: number
          upvotes_count: number
          edit_count: number
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          slug: string
          title: string
          description?: string
          image_title?: string
          image_description?: string
          project_id?: string | null
          status?: "draft" | "pending" | "approved" | "rejected"
          created_at?: string
        }
        Update: {
          project_id?: string | null
          slug?: string
          title?: string
          description?: string
          image_title?: string
          image_description?: string
          status?: "draft" | "pending" | "approved" | "rejected"
        }
        Relationships: []
      }
      standalone_embed_project_requests: {
        Row: {
          id: string
          embed_id: string
          project_id: string | null
          owner_id: string
          status: "pending" | "approved" | "rejected"
          created_at: string
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          embed_id: string
          project_id?: string | null
          owner_id: string
          status?: "pending" | "approved" | "rejected"
          created_at?: string
          reviewed_at?: string | null
        }
        Update: never
        Relationships: []
      }
      standalone_embed_edit_requests: {
        Row: {
          id: string
          embed_id: string
          owner_id: string
          slug: string
          title: string
          image_title: string
          image_description: string
          status: "pending" | "approved" | "rejected"
          created_at: string
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          embed_id: string
          owner_id: string
          slug: string
          title: string
          image_title?: string
          image_description?: string
          status?: "pending" | "approved" | "rejected"
          created_at?: string
          reviewed_at?: string | null
        }
        Update: never
        Relationships: []
      }
      standalone_embed_bookmarks: {
        Row: {
          embed_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          embed_id: string
          user_id: string
          created_at?: string
        }
        Update: never
        Relationships: []
      }
      standalone_embed_upvotes: {
        Row: {
          embed_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          embed_id: string
          user_id: string
          created_at?: string
        }
        Update: never
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
      project_edit_requests: {
        Row: {
          id: string
          project_id: string
          owner_id: string
          name: string
          description: string
          url: string
          github_url: string | null
          categories: string[] | null
          tags: string[] | null
          socials: Record<string, string> | null
          images: string[] | null
          info: string | null
          embeds: unknown
          status: "pending" | "approved" | "rejected"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          owner_id: string
          name: string
          description: string
          url: string
          github_url?: string | null
          categories?: string[] | null
          tags?: string[] | null
          socials?: Record<string, string> | null
          images?: string[] | null
          info?: string | null
          embeds: unknown
          status?: "pending" | "approved" | "rejected"
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: "pending" | "approved" | "rejected"
          updated_at?: string
        }
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
      project_bookmarks: {
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
          categories: string[] | null
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
          categories?: string[] | null
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
          categories?: string[] | null
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
      consume_newsletter_rate_limit: {
        Args: {
          p_key_hash: string
          p_max_attempts: number
          p_window_seconds: number
        }
        Returns: boolean
      }
      approve_project_edit_request: {
        Args: { request_id: string }
        Returns: undefined
      }
      set_standalone_embed_project: {
        Args: { p_embed_id: string; p_project_id: string | null }
        Returns: undefined
      }
      review_standalone_embed_project_request: {
        Args: { p_request_id: string; p_approve: boolean }
        Returns: undefined
      }
      review_standalone_embed_edit_request: {
        Args: { p_request_id: string; p_approve: boolean }
        Returns: undefined
      }
      get_public_profile_bio: {
        Args: { p_profile_id: string }
        Returns: string | null
      }
      record_standalone_embed_view: {
        Args: { p_embed_id: string }
        Returns: undefined
      }
      record_project_impressions: {
        Args: { project_ids: string[] }
        Returns: undefined
      }
      current_user_profile_role: {
        Args: Record<PropertyKey, never>
        Returns: string | null
      }
      get_public_profiles: {
        Args: {
          p_profile_ids?: string[] | null
          p_profile_slug?: string | null
        }
        Returns: {
          id: string
          slug: string
          display_name: string
          avatar_url: string | null
          socials: Record<string, string>
        }[]
      }
    }
    Enums: {
      project_status: "draft" | "pending" | "published" | "rejected"
    }
    CompositeTypes: Record<string, never>
  }
}
