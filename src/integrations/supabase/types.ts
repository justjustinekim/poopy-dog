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
      achievements: {
        Row: {
          achievement_type: string
          category: string | null
          created_at: string
          description: string
          icon: string
          id: string
          is_negative: boolean | null
          max_progress: number | null
          penalty_points: number | null
          title: string
          trigger_condition: string | null
          trigger_value: number | null
          updated_at: string
        }
        Insert: {
          achievement_type: string
          category?: string | null
          created_at?: string
          description: string
          icon: string
          id?: string
          is_negative?: boolean | null
          max_progress?: number | null
          penalty_points?: number | null
          title: string
          trigger_condition?: string | null
          trigger_value?: number | null
          updated_at?: string
        }
        Update: {
          achievement_type?: string
          category?: string | null
          created_at?: string
          description?: string
          icon?: string
          id?: string
          is_negative?: boolean | null
          max_progress?: number | null
          penalty_points?: number | null
          title?: string
          trigger_condition?: string | null
          trigger_value?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      challenges: {
        Row: {
          challenge_type: string
          condition: string
          condition_value: number
          created_at: string
          description: string
          end_date: string
          icon: string
          id: string
          points: number
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          challenge_type: string
          condition: string
          condition_value: number
          created_at?: string
          description: string
          end_date: string
          icon: string
          id?: string
          points: number
          start_date: string
          title: string
          updated_at?: string
        }
        Update: {
          challenge_type?: string
          condition?: string
          condition_value?: number
          created_at?: string
          description?: string
          end_date?: string
          icon?: string
          id?: string
          points?: number
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      dogs: {
        Row: {
          adoption_story: string | null
          age: number
          birthdate: string | null
          breed: string
          created_at: string
          diet_type: string | null
          digestive_health: string | null
          digestive_issues: string[] | null
          favorite_treats: string | null
          food_sensitivity: string | null
          health_assessment: Json | null
          id: string
          image_url: string | null
          lifestyle_data: Json | null
          microchipped: boolean | null
          name: string
          personality_traits: string[] | null
          poop_frequency: string | null
          updated_at: string
          user_id: string
          weight: number
        }
        Insert: {
          adoption_story?: string | null
          age: number
          birthdate?: string | null
          breed: string
          created_at?: string
          diet_type?: string | null
          digestive_health?: string | null
          digestive_issues?: string[] | null
          favorite_treats?: string | null
          food_sensitivity?: string | null
          health_assessment?: Json | null
          id?: string
          image_url?: string | null
          lifestyle_data?: Json | null
          microchipped?: boolean | null
          name: string
          personality_traits?: string[] | null
          poop_frequency?: string | null
          updated_at?: string
          user_id: string
          weight: number
        }
        Update: {
          adoption_story?: string | null
          age?: number
          birthdate?: string | null
          breed?: string
          created_at?: string
          diet_type?: string | null
          digestive_health?: string | null
          digestive_issues?: string[] | null
          favorite_treats?: string | null
          food_sensitivity?: string | null
          health_assessment?: Json | null
          id?: string
          image_url?: string | null
          lifestyle_data?: Json | null
          microchipped?: boolean | null
          name?: string
          personality_traits?: string[] | null
          poop_frequency?: string | null
          updated_at?: string
          user_id?: string
          weight?: number
        }
        Relationships: []
      }
      poop_entries: {
        Row: {
          color: string
          consistency: string
          created_at: string
          date: string
          dog_id: string
          id: string
          image_path: string | null
          location: string | null
          notes: string | null
          user_id: string
        }
        Insert: {
          color: string
          consistency: string
          created_at?: string
          date: string
          dog_id: string
          id?: string
          image_path?: string | null
          location?: string | null
          notes?: string | null
          user_id: string
        }
        Update: {
          color?: string
          consistency?: string
          created_at?: string
          date?: string
          dog_id?: string
          id?: string
          image_path?: string | null
          location?: string | null
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          created_at: string
          id: string
          progress: number | null
          unlocked: boolean | null
          unlocked_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          created_at?: string
          id?: string
          progress?: number | null
          unlocked?: boolean | null
          unlocked_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          created_at?: string
          id?: string
          progress?: number | null
          unlocked?: boolean | null
          unlocked_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenges: {
        Row: {
          challenge_id: string
          completed: boolean | null
          completed_at: string | null
          created_at: string
          id: string
          progress: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          progress?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          progress?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_daily_challenges: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_monthly_challenges: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_weekly_challenges: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
