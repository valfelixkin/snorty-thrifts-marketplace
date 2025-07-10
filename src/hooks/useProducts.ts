
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price?: number;
  condition: string;
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

export const useProducts = (categorySlug?: string, searchTerm?: string) => {
  return useQuery({
    queryKey: ['items', categorySlug, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('items')
        .select(`
          *,
          categories (
            id,
            name,
            slug
          ),
          profiles (
            id,
            first_name,
            last_name,
            username
          )
        `)
        .eq('is_available', true);

      if (categorySlug) {
        query = query.eq('categories.slug', categorySlug);
      }

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      // Transform the data to match our Product interface
      const transformedData = data?.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        original_price: item.original_price,
        condition: item.condition,
        size: item.size,
        brand: item.brand,
        color: item.color,
        images: Array.isArray(item.images) ? item.images : [],
        is_available: item.is_available,
        is_featured: item.is_featured,
        created_at: item.created_at,
        category: {
          id: item.categories?.id || '',
          name: item.categories?.name || '',
          slug: item.categories?.slug || ''
        },
        seller: {
          id: item.profiles?.id || '',
          full_name: `${item.profiles?.first_name || ''} ${item.profiles?.last_name || ''}`.trim() || item.profiles?.username || '',
          username: item.profiles?.username || ''
        }
      })) || [];

      return transformedData as Product[];
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['item', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          categories (
            id,
            name,
            slug
          ),
          profiles (
            id,
            first_name,
            last_name,
            username
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        throw error;
      }

      // Transform the data to match our Product interface
      const transformedData = {
        id: data.id,
        title: data.title,
        description: data.description,
        price: data.price,
        original_price: data.original_price,
        condition: data.condition,
        size: data.size,
        brand: data.brand,
        color: data.color,
        images: Array.isArray(data.images) ? data.images : [],
        is_available: data.is_available,
        is_featured: data.is_featured,
        created_at: data.created_at,
        category: {
          id: data.categories?.id || '',
          name: data.categories?.name || '',
          slug: data.categories?.slug || ''
        },
        seller: {
          id: data.profiles?.id || '',
          full_name: `${data.profiles?.first_name || ''} ${data.profiles?.last_name || ''}`.trim() || data.profiles?.username || '',
          username: data.profiles?.username || ''
        }
      };

      return transformedData as Product;
    },
  });
};
