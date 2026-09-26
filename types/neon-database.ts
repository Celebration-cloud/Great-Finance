export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      approval_requests: {
        Row: {
          action: string
          created_at: string
          id: string
          organization_id: string | null
          payload: Json
          requested_by: string
          resource_id: string
          resource_type: string
          review_note: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["ApprovalStatus"]
        }
        Insert: {
          action: string
          created_at?: string
          id: string
          organization_id?: string | null
          payload: Json
          requested_by: string
          resource_id: string
          resource_type: string
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["ApprovalStatus"]
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          organization_id?: string | null
          payload?: Json
          requested_by?: string
          resource_id?: string
          resource_type?: string
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["ApprovalStatus"]
        }
        Relationships: [
          {
            foreignKeyName: "approval_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          actor_role: string | null
          created_at: string
          entity_id: string
          entity_type: string
          hash: string
          id: string
          ip_address: string | null
          metadata: Json | null
          previous_hash: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_role?: string | null
          created_at?: string
          entity_id: string
          entity_type: string
          hash: string
          id: string
          ip_address?: string | null
          metadata?: Json | null
          previous_hash?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_role?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          hash?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          previous_hash?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      fx_rates: {
        Row: {
          base: string
          expires_at: string
          fetched_at: string
          id: string
          quote: string
          rate: number
          source: string
        }
        Insert: {
          base: string
          expires_at: string
          fetched_at?: string
          id: string
          quote: string
          rate: number
          source: string
        }
        Update: {
          base?: string
          expires_at?: string
          fetched_at?: string
          id?: string
          quote?: string
          rate?: number
          source?: string
        }
        Relationships: []
      }
      ledger_accounts: {
        Row: {
          active: boolean
          code: string
          created_at: string
          currency: string
          id: string
          name: string
          organization_id: string | null
          type: Database["public"]["Enums"]["LedgerAccountType"]
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          currency: string
          id: string
          name: string
          organization_id?: string | null
          type: Database["public"]["Enums"]["LedgerAccountType"]
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          currency?: string
          id?: string
          name?: string
          organization_id?: string | null
          type?: Database["public"]["Enums"]["LedgerAccountType"]
        }
        Relationships: [
          {
            foreignKeyName: "ledger_accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ledger_entries: {
        Row: {
          account_id: string
          amount_minor: number
          created_at: string
          currency: string
          direction: Database["public"]["Enums"]["EntryDirection"]
          id: string
          transaction_id: string
        }
        Insert: {
          account_id: string
          amount_minor: number
          created_at?: string
          currency: string
          direction: Database["public"]["Enums"]["EntryDirection"]
          id: string
          transaction_id: string
        }
        Update: {
          account_id?: string
          amount_minor?: number
          created_at?: string
          currency?: string
          direction?: Database["public"]["Enums"]["EntryDirection"]
          id?: string
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ledger_entries_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "ledger_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ledger_entries_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "ledger_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      ledger_transactions: {
        Row: {
          created_at: string
          created_by: string
          description: string
          id: string
          idempotency_key: string
          metadata: Json | null
          occurred_at: string
          reference: string
          reversal_of_id: string | null
          status: Database["public"]["Enums"]["TransactionStatus"]
        }
        Insert: {
          created_at?: string
          created_by: string
          description: string
          id: string
          idempotency_key: string
          metadata?: Json | null
          occurred_at: string
          reference: string
          reversal_of_id?: string | null
          status?: Database["public"]["Enums"]["TransactionStatus"]
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          idempotency_key?: string
          metadata?: Json | null
          occurred_at?: string
          reference?: string
          reversal_of_id?: string | null
          status?: Database["public"]["Enums"]["TransactionStatus"]
        }
        Relationships: [
          {
            foreignKeyName: "ledger_transactions_reversal_of_id_fkey"
            columns: ["reversal_of_id"]
            isOneToOne: false
            referencedRelation: "ledger_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          auth_user_id: string
          created_at: string
          id: string
          organization_id: string
          role: Database["public"]["Enums"]["MembershipRole"]
          status: Database["public"]["Enums"]["MembershipStatus"]
          updated_at: string
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          id: string
          organization_id: string
          role: Database["public"]["Enums"]["MembershipRole"]
          status?: Database["public"]["Enums"]["MembershipStatus"]
          updated_at: string
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          id?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["MembershipRole"]
          status?: Database["public"]["Enums"]["MembershipStatus"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          type: Database["public"]["Enums"]["OrganizationType"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          slug: string
          type: Database["public"]["Enums"]["OrganizationType"]
          updated_at: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          type?: Database["public"]["Enums"]["OrganizationType"]
          updated_at?: string
        }
        Relationships: []
      }
      outbox_events: {
        Row: {
          aggregate_id: string
          aggregate_type: string
          attempts: number
          available_at: string
          created_at: string
          event_type: string
          id: string
          last_error: string | null
          payload: Json
          published_at: string | null
          status: Database["public"]["Enums"]["OutboxStatus"]
        }
        Insert: {
          aggregate_id: string
          aggregate_type: string
          attempts?: number
          available_at?: string
          created_at?: string
          event_type: string
          id: string
          last_error?: string | null
          payload: Json
          published_at?: string | null
          status?: Database["public"]["Enums"]["OutboxStatus"]
        }
        Update: {
          aggregate_id?: string
          aggregate_type?: string
          attempts?: number
          available_at?: string
          created_at?: string
          event_type?: string
          id?: string
          last_error?: string | null
          payload?: Json
          published_at?: string | null
          status?: Database["public"]["Enums"]["OutboxStatus"]
        }
        Relationships: []
      }
      payment_intents: {
        Row: {
          access_code: string | null
          amount_minor: number
          authorization_url: string | null
          created_at: string
          currency: string
          customer_email: string
          failure_reason: string | null
          id: string
          idempotency_key: string
          metadata: Json | null
          organization_id: string
          provider: string
          provider_reference: string | null
          reference: string
          status: Database["public"]["Enums"]["PaymentStatus"]
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          access_code?: string | null
          amount_minor: number
          authorization_url?: string | null
          created_at?: string
          currency: string
          customer_email: string
          failure_reason?: string | null
          id: string
          idempotency_key: string
          metadata?: Json | null
          organization_id: string
          provider?: string
          provider_reference?: string | null
          reference: string
          status?: Database["public"]["Enums"]["PaymentStatus"]
          updated_at: string
          verified_at?: string | null
        }
        Update: {
          access_code?: string | null
          amount_minor?: number
          authorization_url?: string | null
          created_at?: string
          currency?: string
          customer_email?: string
          failure_reason?: string | null
          id?: string
          idempotency_key?: string
          metadata?: Json | null
          organization_id?: string
          provider?: string
          provider_reference?: string | null
          reference?: string
          status?: Database["public"]["Enums"]["PaymentStatus"]
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_intents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_number_last4: string | null
          auth_user_id: string
          bank_name: string | null
          created_at: string
          display_name: string
          id: string
          organization_id: string
          phone: string | null
          referral_code: string
          referred_by_code: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          account_number_last4?: string | null
          auth_user_id: string
          bank_name?: string | null
          created_at?: string
          display_name: string
          id: string
          organization_id: string
          phone?: string | null
          referral_code: string
          referred_by_code?: string | null
          updated_at: string
          whatsapp?: string | null
        }
        Update: {
          account_number_last4?: string | null
          auth_user_id?: string
          bank_name?: string | null
          created_at?: string
          display_name?: string
          id?: string
          organization_id?: string
          phone?: string | null
          referral_code?: string
          referred_by_code?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_kyc_submissions: {
        Row: {
          auth_user_id: string
          full_name: string
          id: string
          identity_content_type: string
          identity_object_key: string
          identity_size_bytes: number
          local_government: string
          organization_id: string
          selfie_content_type: string
          selfie_object_key: string
          selfie_size_bytes: number
          state_of_origin: string
          submitted_at: string
        }
        Insert: {
          auth_user_id: string
          full_name: string
          id: string
          identity_content_type: string
          identity_object_key: string
          identity_size_bytes: number
          local_government: string
          organization_id: string
          selfie_content_type: string
          selfie_object_key: string
          selfie_size_bytes: number
          state_of_origin: string
          submitted_at?: string
        }
        Update: {
          auth_user_id?: string
          full_name?: string
          id?: string
          identity_content_type?: string
          identity_object_key?: string
          identity_size_bytes?: number
          local_government?: string
          organization_id?: string
          selfie_content_type?: string
          selfie_object_key?: string
          selfie_size_bytes?: number
          state_of_origin?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_kyc_submissions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_events: {
        Row: {
          error: string | null
          event_hash: string
          event_type: string
          id: string
          payload: Json
          processed_at: string | null
          provider: string
          received_at: string
          reference: string | null
          signature: string
          status: Database["public"]["Enums"]["WebhookStatus"]
        }
        Insert: {
          error?: string | null
          event_hash: string
          event_type: string
          id: string
          payload: Json
          processed_at?: string | null
          provider: string
          received_at?: string
          reference?: string | null
          signature: string
          status?: Database["public"]["Enums"]["WebhookStatus"]
        }
        Update: {
          error?: string | null
          event_hash?: string
          event_type?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          provider?: string
          received_at?: string
          reference?: string | null
          signature?: string
          status?: Database["public"]["Enums"]["WebhookStatus"]
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
      ApprovalStatus: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED"
      EntryDirection: "DEBIT" | "CREDIT"
      LedgerAccountType:
        | "ASSET"
        | "LIABILITY"
        | "EQUITY"
        | "REVENUE"
        | "EXPENSE"
      MembershipRole:
        | "CUSTOMER"
        | "VENDOR"
        | "REVIEWER"
        | "ADMIN"
        | "SUPER_ADMIN"
      MembershipStatus: "INVITED" | "ACTIVE" | "SUSPENDED"
      OrganizationType: "CUSTOMER" | "VENDOR" | "INTERNAL"
      OutboxStatus: "PENDING" | "PROCESSING" | "PUBLISHED" | "FAILED"
      PaymentStatus:
        | "PENDING"
        | "PROCESSING"
        | "SUCCEEDED"
        | "FAILED"
        | "CANCELLED"
      TransactionStatus: "POSTED" | "REVERSED"
      WebhookStatus:
        | "RECEIVED"
        | "PROCESSING"
        | "PROCESSED"
        | "FAILED"
        | "IGNORED"
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
      ApprovalStatus: ["PENDING", "APPROVED", "REJECTED", "CANCELLED"],
      EntryDirection: ["DEBIT", "CREDIT"],
      LedgerAccountType: ["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"],
      MembershipRole: [
        "CUSTOMER",
        "VENDOR",
        "REVIEWER",
        "ADMIN",
        "SUPER_ADMIN",
      ],
      MembershipStatus: ["INVITED", "ACTIVE", "SUSPENDED"],
      OrganizationType: ["CUSTOMER", "VENDOR", "INTERNAL"],
      OutboxStatus: ["PENDING", "PROCESSING", "PUBLISHED", "FAILED"],
      PaymentStatus: [
        "PENDING",
        "PROCESSING",
        "SUCCEEDED",
        "FAILED",
        "CANCELLED",
      ],
      TransactionStatus: ["POSTED", "REVERSED"],
      WebhookStatus: [
        "RECEIVED",
        "PROCESSING",
        "PROCESSED",
        "FAILED",
        "IGNORED",
      ],
    },
  },
} as const
