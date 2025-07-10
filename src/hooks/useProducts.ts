
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  condition: string;
  size: string | null;
  brand: string | null;
  color: string | null;
  images: string[];
  is_available: boolean;
  is_featured: boolean;
  created_at: string;
  category: {
    id: string;
    name: string;
  } | null;
  seller: {
    id: string;
    full_name: string | null;
    username: string | null;
  } | null;
}

export const useProducts = (featured?: boolean) => {
  return useQuery({
    queryKey: ['products', featured],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories:category_id (
            id,
            name
          ),
          profiles:seller_id (
            id,
            full_name,
            username
          )
        `)
        .eq('is_available', true);

      if (featured) {
        query = query.eq('is_featured', true);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        original_price: product.original_price,
        condition: product.condition,
        size: product.size,
        brand: product.brand,
        color: product.color,
        images: product.images || [],
        is_available: product.is_available,
        is_featured: product.is_featured,
        created_at: product.created_at,
        category: product.categories,
        seller: product.profiles,
      })) as Product[];
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories:category_id (
            id,
            name
          ),
          profiles:seller_id (
            id,
            full_name,
            username
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
        original_price: data.original_price,
        condition: data.condition,
        size: data.size,
        brand: data.brand,
        color: data.color,
        images: data.images || [],
        is_available: data.is_available,
        is_featured: data.is_featured,
        created_at: data.created_at,
        category: data.categories,
        seller: data.profiles,
      } as Product;
    },
    enabled: !!id,
  });
};
