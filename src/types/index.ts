
// Central type definitions for better consistency
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price?: number;
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  size?: string;
  brand?: string;
  color?: string;
  images: string[];
  is_available: boolean;
  is_featured: boolean;
  created_at: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  seller: {
    id: string;
    full_name: string;
    username: string;
  };
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  seller: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  phone?: string;
  is_verified?: boolean;
  role?: string;
  created_at?: string;
  updated_at?: string;
}
