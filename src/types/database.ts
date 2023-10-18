Need to install the following packages:
supabase@1.106.1
Ok to proceed? (y) export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      assigned_users: {
        Row: {
          card_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          card_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          card_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assigned_users_card_id_fkey"
            columns: ["card_id"]
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assigned_users_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      attachments: {
        Row: {
          card_id: string
          created_at: string
          file_name: string
          file_type: string
          file_url: string
          id: string
        }
        Insert: {
          card_id: string
          created_at?: string
          file_name: string
          file_type: string
          file_url: string
          id?: string
        }
        Update: {
          card_id?: string
          created_at?: string
          file_name?: string
          file_type?: string
          file_url?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachments_card_id_fkey"
            columns: ["card_id"]
            referencedRelation: "cards"
            referencedColumns: ["id"]
          }
        ]
      }
      boards: {
        Row: {
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          owner: string
          title: string
          updated_at: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          owner: string
          title: string
          updated_at?: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          owner?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "boards_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      cards: {
        Row: {
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          list_id: string
          title: string
          updated_at: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          list_id: string
          title: string
          updated_at?: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          list_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cards_list_id_fkey"
            columns: ["list_id"]
            referencedRelation: "lists"
            referencedColumns: ["id"]
          }
        ]
      }
      comments: {
        Row: {
          card_id: string
          content: string
          created_at: string
          id: string
          udpated_at: string
          user_id: string
        }
        Insert: {
          card_id: string
          content: string
          created_at?: string
          id?: string
          udpated_at?: string
          user_id: string
        }
        Update: {
          card_id?: string
          content?: string
          created_at?: string
          id?: string
          udpated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_card_id_fkey"
            columns: ["card_id"]
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      labels: {
        Row: {
          background_color: string
          card_id: string
          color: string
          id: string
          name: string
        }
        Insert: {
          background_color: string
          card_id: string
          color: string
          id?: string
          name: string
        }
        Update: {
          background_color?: string
          card_id?: string
          color?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "labels_card_id_fkey"
            columns: ["card_id"]
            referencedRelation: "cards"
            referencedColumns: ["id"]
          }
        ]
      }
      lists: {
        Row: {
          board_id: string
          created_at: string
          id: string
          title: string
        }
        Insert: {
          board_id: string
          created_at?: string
          id?: string
          title: string
        }
        Update: {
          board_id?: string
          created_at?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lists_board_id_fkey"
            columns: ["board_id"]
            referencedRelation: "boards"
            referencedColumns: ["id"]
          }
        ]
      }
      members: {
        Row: {
          board_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          board_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          board_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "members_board_id_fkey"
            columns: ["board_id"]
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
