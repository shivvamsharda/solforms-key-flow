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
      field_responses: {
        Row: {
          created_at: string
          field_id: string
          form_response_id: string
          id: string
          response_value: Json
        }
        Insert: {
          created_at?: string
          field_id: string
          form_response_id: string
          id?: string
          response_value: Json
        }
        Update: {
          created_at?: string
          field_id?: string
          form_response_id?: string
          id?: string
          response_value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "field_responses_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "form_fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "field_responses_form_response_id_fkey"
            columns: ["form_response_id"]
            isOneToOne: false
            referencedRelation: "form_responses"
            referencedColumns: ["id"]
          },
        ]
      }
      form_analytics: {
        Row: {
          created_at: string
          event_type: string
          form_id: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          wallet_address: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          form_id: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          wallet_address?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          form_id?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      form_fields: {
        Row: {
          created_at: string
          description: string | null
          field_order: number
          field_type: string
          form_id: string
          id: string
          options: string[] | null
          required: boolean
          settings: Json | null
          title: string
          updated_at: string
          validation: Json | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          field_order?: number
          field_type: string
          form_id: string
          id?: string
          options?: string[] | null
          required?: boolean
          settings?: Json | null
          title: string
          updated_at?: string
          validation?: Json | null
        }
        Update: {
          created_at?: string
          description?: string | null
          field_order?: number
          field_type?: string
          form_id?: string
          id?: string
          options?: string[] | null
          required?: boolean
          settings?: Json | null
          title?: string
          updated_at?: string
          validation?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "form_fields_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      form_responses: {
        Row: {
          form_id: string
          id: string
          ip_address: unknown | null
          submitted_at: string
          user_id: string | null
          wallet_address: string | null
        }
        Insert: {
          form_id: string
          id?: string
          ip_address?: unknown | null
          submitted_at?: string
          user_id?: string | null
          wallet_address?: string | null
        }
        Update: {
          form_id?: string
          id?: string
          ip_address?: unknown | null
          submitted_at?: string
          user_id?: string | null
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_responses_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      form_shares: {
        Row: {
          created_at: string
          expires_at: string | null
          form_id: string
          id: string
          share_type: string
          share_url: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          form_id: string
          id?: string
          share_type: string
          share_url?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          form_id?: string
          id?: string
          share_type?: string
          share_url?: string | null
        }
        Relationships: []
      }
      forms: {
        Row: {
          created_at: string
          description: string | null
          expires_at: string | null
          form_schema: Json | null
          id: string
          published: boolean
          response_limit: number | null
          settings: Json
          thank_you_message: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          expires_at?: string | null
          form_schema?: Json | null
          id?: string
          published?: boolean
          response_limit?: number | null
          settings?: Json
          thank_you_message?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          expires_at?: string | null
          form_schema?: Json | null
          id?: string
          published?: boolean
          response_limit?: number | null
          settings?: Json
          thank_you_message?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_sol: number
          amount_usd: number
          confirmed_at: string | null
          created_at: string
          id: string
          plan_type: string
          sol_price_usd: number
          status: string
          subscription_id: string | null
          transaction_hash: string
          user_id: string
        }
        Insert: {
          amount_sol: number
          amount_usd: number
          confirmed_at?: string | null
          created_at?: string
          id?: string
          plan_type: string
          sol_price_usd: number
          status?: string
          subscription_id?: string | null
          transaction_hash: string
          user_id: string
        }
        Update: {
          amount_sol?: number
          amount_usd?: number
          confirmed_at?: string | null
          created_at?: string
          id?: string
          plan_type?: string
          sol_price_usd?: number
          status?: string
          subscription_id?: string | null
          transaction_hash?: string
          user_id?: string
        }
        Relationships: []
      }
      pricing_cache: {
        Row: {
          id: string
          sol_price_usd: number
          updated_at: string
        }
        Insert: {
          id?: string
          sol_price_usd: number
          updated_at?: string
        }
        Update: {
          id?: string
          sol_price_usd?: number
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          plan_type: string
          sol_amount_paid: number | null
          status: string
          updated_at: string
          usd_amount_paid: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_type: string
          sol_amount_paid?: number | null
          status?: string
          updated_at?: string
          usd_amount_paid?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_type?: string
          sol_amount_paid?: number | null
          status?: string
          updated_at?: string
          usd_amount_paid?: number | null
          user_id?: string
        }
        Relationships: []
      }
      token_balances: {
        Row: {
          balance: number
          checked_at: string
          id: string
          token_mint: string
          wallet_address: string
        }
        Insert: {
          balance?: number
          checked_at?: string
          id?: string
          token_mint: string
          wallet_address: string
        }
        Update: {
          balance?: number
          checked_at?: string
          id?: string
          token_mint?: string
          wallet_address?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
