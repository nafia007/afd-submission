export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      afd_submissions: {
        Row: {
          budget: string | null
          country_of_origin: string | null
          country_of_production: string | null
          created_at: string
          description: string | null
          director: string | null
          file_type: string
          file_url: string
          format: string | null
          genre: string | null
          id: string
          partners: string | null
          tier: string
          title: string
          user_id: string
        }
        Insert: {
          budget?: string | null
          country_of_origin?: string | null
          country_of_production?: string | null
          created_at?: string
          description?: string | null
          director?: string | null
          file_type: string
          file_url: string
          format?: string | null
          genre?: string | null
          id?: string
          partners?: string | null
          tier: string
          title: string
          user_id: string
        }
        Update: {
          budget?: string | null
          country_of_origin?: string | null
          country_of_production?: string | null
          created_at?: string
          description?: string | null
          director?: string | null
          file_type?: string
          file_url?: string
          format?: string | null
          genre?: string | null
          id?: string
          partners?: string | null
          tier?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      asset_documents: {
        Row: {
          asset_id: string
          document_type: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          uploaded_at: string
        }
        Insert: {
          asset_id: string
          document_type?: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
          uploaded_at?: string
        }
        Update: {
          asset_id?: string
          document_type?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_documents_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_transactions: {
        Row: {
          asset_id: string
          created_at: string
          from_user_id: string | null
          id: string
          price_per_token: number
          to_user_id: string | null
          token_amount: number
          total_amount: number
          transaction_hash: string | null
          transaction_type: string
        }
        Insert: {
          asset_id: string
          created_at?: string
          from_user_id?: string | null
          id?: string
          price_per_token: number
          to_user_id?: string | null
          token_amount: number
          total_amount: number
          transaction_hash?: string | null
          transaction_type: string
        }
        Update: {
          asset_id?: string
          created_at?: string
          from_user_id?: string | null
          id?: string
          price_per_token?: number
          to_user_id?: string | null
          token_amount?: number
          total_amount?: number
          transaction_hash?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_transactions_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_valuations: {
        Row: {
          asset_id: string
          id: string
          notes: string | null
          valuation_amount: number
          valuation_date: string
          valuation_method: string | null
          valuator_id: string | null
        }
        Insert: {
          asset_id: string
          id?: string
          notes?: string | null
          valuation_amount: number
          valuation_date?: string
          valuation_method?: string | null
          valuator_id?: string | null
        }
        Update: {
          asset_id?: string
          id?: string
          notes?: string | null
          valuation_amount?: number
          valuation_date?: string
          valuation_method?: string | null
          valuator_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_valuations_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          asset_type: Database["public"]["Enums"]["asset_type"]
          contract_address: string | null
          created_at: string
          description: string | null
          id: string
          location: string | null
          name: string
          status: Database["public"]["Enums"]["token_status"]
          token_price: number | null
          token_supply: number
          token_symbol: string | null
          total_value: number
          updated_at: string
          user_id: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          asset_type: Database["public"]["Enums"]["asset_type"]
          contract_address?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          name: string
          status?: Database["public"]["Enums"]["token_status"]
          token_price?: number | null
          token_supply: number
          token_symbol?: string | null
          total_value: number
          updated_at?: string
          user_id: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          asset_type?: Database["public"]["Enums"]["asset_type"]
          contract_address?: string | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          name?: string
          status?: Database["public"]["Enums"]["token_status"]
          token_price?: number | null
          token_supply?: number
          token_symbol?: string | null
          total_value?: number
          updated_at?: string
          user_id?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: []
      }
      connections: {
        Row: {
          connected_user_id: string
          created_at: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          connected_user_id: string
          created_at?: string
          id?: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          connected_user_id?: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "connections_connected_user_id_fkey"
            columns: ["connected_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_connected_user_id_fkey"
            columns: ["connected_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      film_reviews: {
        Row: {
          comment: string
          created_at: string
          film_id: string
          helpful_count: number | null
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          film_id: string
          helpful_count?: number | null
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          film_id?: string
          helpful_count?: number | null
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "film_reviews_film_id_fkey"
            columns: ["film_id"]
            isOneToOne: false
            referencedRelation: "films"
            referencedColumns: ["id"]
          },
        ]
      }
      filmmaker_profiles: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          portfolio_url: string | null
          skills: Database["public"]["Enums"]["filmmaker_skill"][] | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id: string
          portfolio_url?: string | null
          skills?: Database["public"]["Enums"]["filmmaker_skill"][] | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          portfolio_url?: string | null
          skills?: Database["public"]["Enums"]["filmmaker_skill"][] | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "filmmaker_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "filmmaker_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      filmmaker_profiles_extended: {
        Row: {
          created_at: string
          experience: string
          id: string
          image: string
          name: string
          role: string
          skills: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          experience: string
          id: string
          image: string
          name: string
          role: string
          skills?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          experience?: string
          id?: string
          image?: string
          name?: string
          role?: string
          skills?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "filmmaker_profiles_extended_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "filmmaker_profiles_extended_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      films: {
        Row: {
          created_at: string
          description: string | null
          director: string
          film_url: string
          id: string
          price: string
          title: string
          token_id: number | null
          updated_at: string
          user_id: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          director: string
          film_url: string
          id?: string
          price: string
          title: string
          token_id?: number | null
          updated_at?: string
          user_id?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          director?: string
          film_url?: string
          id?: string
          price?: string
          title?: string
          token_id?: number | null
          updated_at?: string
          user_id?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      kyc_profiles: {
        Row: {
          address: string
          city: string
          country: string
          created_at: string
          date_of_birth: string
          id: string
          identity_document_url: string
          income_range: string
          investment_experience: string
          investment_goals: string
          occupation: string
          phone_number: string
          proof_of_address_url: string
          risk_tolerance: string
          source_of_funds: string
          state: string
          updated_at: string
          user_id: string
          verification_status: string
          zip_code: string
        }
        Insert: {
          address: string
          city: string
          country: string
          created_at?: string
          date_of_birth: string
          id?: string
          identity_document_url: string
          income_range: string
          investment_experience: string
          investment_goals: string
          occupation: string
          phone_number: string
          proof_of_address_url: string
          risk_tolerance: string
          source_of_funds: string
          state: string
          updated_at?: string
          user_id: string
          verification_status?: string
          zip_code: string
        }
        Update: {
          address?: string
          city?: string
          country?: string
          created_at?: string
          date_of_birth?: string
          id?: string
          identity_document_url?: string
          income_range?: string
          investment_experience?: string
          investment_goals?: string
          occupation?: string
          phone_number?: string
          proof_of_address_url?: string
          risk_tolerance?: string
          source_of_funds?: string
          state?: string
          updated_at?: string
          user_id?: string
          verification_status?: string
          zip_code?: string
        }
        Relationships: []
      }
      meetup_attendees: {
        Row: {
          created_at: string
          id: string
          meetup_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          meetup_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          meetup_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetup_attendees_meetup_id_fkey"
            columns: ["meetup_id"]
            isOneToOne: false
            referencedRelation: "meetups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetup_attendees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetup_attendees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meetups: {
        Row: {
          created_at: string
          creator_id: string
          description: string
          id: string
          location: string
          meetup_date: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          description: string
          id?: string
          location: string
          meetup_date: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string
          id?: string
          location?: string
          meetup_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetups_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetups_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          receiver_id: string
          sender_id: string
          subject: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          receiver_id: string
          sender_id: string
          subject: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          receiver_id?: string
          sender_id?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          content: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      token_holders: {
        Row: {
          asset_id: string
          id: string
          purchase_date: string
          purchase_price: number
          token_amount: number
          user_id: string
        }
        Insert: {
          asset_id: string
          id?: string
          purchase_date?: string
          purchase_price: number
          token_amount: number
          user_id: string
        }
        Update: {
          asset_id?: string
          id?: string
          purchase_date?: string
          purchase_price?: number
          token_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_holders_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_collections: {
        Row: {
          created_at: string | null
          film_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          film_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          film_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_collections_film_id_fkey"
            columns: ["film_id"]
            isOneToOne: false
            referencedRelation: "films"
            referencedColumns: ["id"]
          },
        ]
      }
      yield_distributions: {
        Row: {
          amount_per_token: number
          asset_id: string
          distribution_amount: number
          distribution_date: string
          id: string
          period_end: string
          period_start: string
          status: string
        }
        Insert: {
          amount_per_token: number
          asset_id: string
          distribution_amount: number
          distribution_date?: string
          id?: string
          period_end: string
          period_start: string
          status?: string
        }
        Update: {
          amount_per_token?: number
          asset_id?: string
          distribution_amount?: number
          distribution_date?: string
          id?: string
          period_end?: string
          period_start?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "yield_distributions_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string | null
          last_sign_in_at: string | null
          role: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_user: {
        Args: { email: string; password: string }
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_film_average_rating: {
        Args: { film_id: string }
        Returns: number
      }
      log_user_creation: {
        Args: { email: string }
        Returns: undefined
      }
    }
    Enums: {
      asset_type:
        | "real-estate"
        | "art"
        | "commodities"
        | "intellectual-property"
      filmmaker_skill:
        | "directing"
        | "cinematography"
        | "editing"
        | "writing"
        | "producing"
        | "sound_design"
        | "visual_effects"
      token_status: "draft" | "pending" | "active" | "paused" | "completed"
      user_role: "admin" | "user"
      verification_status: "pending" | "in_review" | "verified" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      asset_type: [
        "real-estate",
        "art",
        "commodities",
        "intellectual-property",
      ],
      filmmaker_skill: [
        "directing",
        "cinematography",
        "editing",
        "writing",
        "producing",
        "sound_design",
        "visual_effects",
      ],
      token_status: ["draft", "pending", "active", "paused", "completed"],
      user_role: ["admin", "user"],
      verification_status: ["pending", "in_review", "verified", "rejected"],
    },
  },
} as const
