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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      cart_items: {
        Row: {
          created_at: string | null
          id: string
          item_id: string | null
          quantity: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id?: string | null
          quantity?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string | null
          quantity?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          item_id: string | null
          recipient_id: string | null
          sender_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          item_id?: string | null
          recipient_id?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          item_id?: string | null
          recipient_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          item_id: string | null
          order_id: string | null
          price: number
          quantity: number
          seller_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id?: string | null
          order_id?: string | null
          price: number
          quantity: number
          seller_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string | null
          order_id?: string | null
          price?: number
          quantity?: number
          seller_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          payment_method: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          shipping_address: string
          status: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          buyer_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          shipping_address: string
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          shipping_address?: string
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string | null
          id: string
          image_url: string
          is_primary: boolean | null
          item_id: string | null
          product_id: string | null
          sort_order: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          is_primary?: boolean | null
          item_id?: string | null
          product_id?: string | null
          sort_order?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
          item_id?: string | null
          product_id?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          category_id: string | null
          color: string | null
          condition: string | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          image_gallery_urls: string[] | null
          is_active: boolean | null
          is_available: boolean | null
          is_featured: boolean | null
          main_image_url: string | null
          price: number
          profile_id: string | null
          seller_id: string | null
          size: string | null
          sku: string | null
          slug: string
          stock_quantity: number
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          brand?: string | null
          category_id?: string | null
          color?: string | null
          condition?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          image_gallery_urls?: string[] | null
          is_active?: boolean | null
          is_available?: boolean | null
          is_featured?: boolean | null
          main_image_url?: string | null
          price: number
          profile_id?: string | null
          seller_id?: string | null
          size?: string | null
          sku?: string | null
          slug: string
          stock_quantity?: number
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          brand?: string | null
          category_id?: string | null
          color?: string | null
          condition?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          image_gallery_urls?: string[] | null
          is_active?: boolean | null
          is_available?: boolean | null
          is_featured?: boolean | null
          main_image_url?: string | null
          price?: number
          profile_id?: string | null
          seller_id?: string | null
          size?: string | null
          sku?: string | null
          slug?: string
          stock_quantity?: number
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_products_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_profile"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_seller"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      products_scraped: {
        Row: {
          "_ni src": string | null
          _ni_src: string | null
          bdg: string | null
          "bdg (2)": string | null
          bdg_2: string | null
          "btn href": string | null
          btn_href: string | null
          "core href": string | null
          core_href: string | null
          created_at: string | null
          "enhance-certs___certification-wrapper": string | null
          id: string
          "img src": string | null
          img_src: string | null
          "margin-right-2": string | null
          mpg: string | null
          name: string | null
          old: string | null
          prc: string | null
          rev: string | null
          "search-card-e-abutton href": string | null
          "search-card-e-abutton__content (2)": string | null
          "search-card-e-company": string | null
          "search-card-e-company href": string | null
          "search-card-e-country-flag__wrapper src": string | null
          "search-card-e-detail-wrapper href (3)": string | null
          "search-card-e-icon__certification src": string | null
          "search-card-e-living href": string | null
          "search-card-e-market-power-common": string | null
          "search-card-e-price__discount": string | null
          "search-card-e-price__original": string | null
          "search-card-e-price-main": string | null
          "search-card-e-review": string | null
          "search-card-e-review (2)": string | null
          "search-card-e-review (3)": string | null
          "search-card-e-slider__img src": string | null
          "search-card-e-slider__link href": string | null
          "search-card-e-supplier__year": string | null
          "search-card-e-title": string | null
          "search-card-e-title (2)": string | null
          "search-card-e-title (3)": string | null
          "search-card-e-title (4)": string | null
          "search-card-e-title (5)": string | null
          "search-card-e-title (6)": string | null
          "search-card-m-sale-features__item": string | null
          "search-card-m-sale-features__item (2)": string | null
          "searchx-find-similar__img src": string | null
          spon: string | null
          stars: string | null
          "verified-supplier-icon src": string | null
          "verified-supplier-icon__wrapper href": string | null
        }
        Insert: {
          "_ni src"?: string | null
          _ni_src?: string | null
          bdg?: string | null
          "bdg (2)"?: string | null
          bdg_2?: string | null
          "btn href"?: string | null
          btn_href?: string | null
          "core href"?: string | null
          core_href?: string | null
          created_at?: string | null
          "enhance-certs___certification-wrapper"?: string | null
          id?: string
          "img src"?: string | null
          img_src?: string | null
          "margin-right-2"?: string | null
          mpg?: string | null
          name?: string | null
          old?: string | null
          prc?: string | null
          rev?: string | null
          "search-card-e-abutton href"?: string | null
          "search-card-e-abutton__content (2)"?: string | null
          "search-card-e-company"?: string | null
          "search-card-e-company href"?: string | null
          "search-card-e-country-flag__wrapper src"?: string | null
          "search-card-e-detail-wrapper href (3)"?: string | null
          "search-card-e-icon__certification src"?: string | null
          "search-card-e-living href"?: string | null
          "search-card-e-market-power-common"?: string | null
          "search-card-e-price__discount"?: string | null
          "search-card-e-price__original"?: string | null
          "search-card-e-price-main"?: string | null
          "search-card-e-review"?: string | null
          "search-card-e-review (2)"?: string | null
          "search-card-e-review (3)"?: string | null
          "search-card-e-slider__img src"?: string | null
          "search-card-e-slider__link href"?: string | null
          "search-card-e-supplier__year"?: string | null
          "search-card-e-title"?: string | null
          "search-card-e-title (2)"?: string | null
          "search-card-e-title (3)"?: string | null
          "search-card-e-title (4)"?: string | null
          "search-card-e-title (5)"?: string | null
          "search-card-e-title (6)"?: string | null
          "search-card-m-sale-features__item"?: string | null
          "search-card-m-sale-features__item (2)"?: string | null
          "searchx-find-similar__img src"?: string | null
          spon?: string | null
          stars?: string | null
          "verified-supplier-icon src"?: string | null
          "verified-supplier-icon__wrapper href"?: string | null
        }
        Update: {
          "_ni src"?: string | null
          _ni_src?: string | null
          bdg?: string | null
          "bdg (2)"?: string | null
          bdg_2?: string | null
          "btn href"?: string | null
          btn_href?: string | null
          "core href"?: string | null
          core_href?: string | null
          created_at?: string | null
          "enhance-certs___certification-wrapper"?: string | null
          id?: string
          "img src"?: string | null
          img_src?: string | null
          "margin-right-2"?: string | null
          mpg?: string | null
          name?: string | null
          old?: string | null
          prc?: string | null
          rev?: string | null
          "search-card-e-abutton href"?: string | null
          "search-card-e-abutton__content (2)"?: string | null
          "search-card-e-company"?: string | null
          "search-card-e-company href"?: string | null
          "search-card-e-country-flag__wrapper src"?: string | null
          "search-card-e-detail-wrapper href (3)"?: string | null
          "search-card-e-icon__certification src"?: string | null
          "search-card-e-living href"?: string | null
          "search-card-e-market-power-common"?: string | null
          "search-card-e-price__discount"?: string | null
          "search-card-e-price__original"?: string | null
          "search-card-e-price-main"?: string | null
          "search-card-e-review"?: string | null
          "search-card-e-review (2)"?: string | null
          "search-card-e-review (3)"?: string | null
          "search-card-e-slider__img src"?: string | null
          "search-card-e-slider__link href"?: string | null
          "search-card-e-supplier__year"?: string | null
          "search-card-e-title"?: string | null
          "search-card-e-title (2)"?: string | null
          "search-card-e-title (3)"?: string | null
          "search-card-e-title (4)"?: string | null
          "search-card-e-title (5)"?: string | null
          "search-card-e-title (6)"?: string | null
          "search-card-m-sale-features__item"?: string | null
          "search-card-m-sale-features__item (2)"?: string | null
          "searchx-find-similar__img src"?: string | null
          spon?: string | null
          stars?: string | null
          "verified-supplier-icon src"?: string | null
          "verified-supplier-icon__wrapper href"?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          is_verified: boolean | null
          last_name: string | null
          location: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          is_verified?: boolean | null
          last_name?: string | null
          location?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_verified?: boolean | null
          last_name?: string | null
          location?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          order_id: string | null
          rating: number | null
          reviewee_id: string | null
          reviewer_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          rating?: number | null
          reviewee_id?: string | null
          reviewer_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          rating?: number | null
          reviewee_id?: string | null
          reviewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      items: {
        Row: {
          category_id: string | null
          category_name: string | null
          category_slug: string | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string | null
          image_gallery_urls: string[] | null
          is_active: boolean | null
          main_image_url: string | null
          name: string | null
          price: number | null
          sku: string | null
          slug: string | null
          stock_quantity: number | null
          tags: string[] | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_products_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      item_condition: "new" | "like_new" | "good" | "fair" | "poor"
      order_status:
        | "pending"
        | "confirmed"
        | "shipped"
        | "delivered"
        | "cancelled"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      user_role: "admin" | "seller" | "buyer"
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
      item_condition: ["new", "like_new", "good", "fair", "poor"],
      order_status: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      payment_status: ["pending", "completed", "failed", "refunded"],
      user_role: ["admin", "seller", "buyer"],
    },
  },
} as const
