
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

export const useProducts = (categorySlug?: string, searchTerm?: string) => {
  return useQuery({
    queryKey: ['products', categorySlug, searchTerm],
    queryFn: async () => {
      try {
        let query = supabase
          .from('products')
          .select(`*`)
          .eq('is_active', true)
          .is('deleted_at', null);

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
        const transformedData = data?.map(product => {
          // Get images from main_image_url or placeholder
          const images = product.main_image_url 
            ? [product.main_image_url]
            : ['/placeholder.svg'];

          return {
            id: product.id,
            title: (product as any).name || 'Untitled Product',
            description: product.description || '',
            price: Number(product.price) || 0,
            original_price: null,
            condition: 'good' as const,
            size: null,
            brand: null,
            color: null,
            images,
            is_available: Boolean(product.is_active),
            is_featured: false,
            created_at: product.created_at || new Date().toISOString(),
            category: {
              id: '',
              name: 'General',
              slug: 'general'
            },
            seller: {
              id: product.seller_id || '',
              full_name: 'Seller',
              username: 'seller'
            }
          } as Product;
        }) || [];

        return transformedData;
      } catch (error) {
        console.error('Products fetch error:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`*`)
          .eq('id', id)
          .eq('is_active', true)
          .is('deleted_at', null)
          .single();

        if (error) {
          console.error('Error fetching product:', error);
          throw error;
        }

        if (!data) {
          throw new Error('Product not found');
        }

        // Get images from main_image_url or placeholder
        const images = data.main_image_url 
          ? [data.main_image_url]
          : ['/placeholder.svg'];

        const transformedData = {
          id: data.id,
          title: (data as any).name || 'Untitled Product',
          description: data.description || '',
          price: Number(data.price) || 0,
          original_price: null,
          condition: 'good' as const,
          size: null,
          brand: null,
          color: null,
          images,
          is_available: Boolean(data.is_active),
          is_featured: false,
          created_at: data.created_at || new Date().toISOString(),
          category: {
            id: '',
            name: 'General',
            slug: 'general'
          },
          seller: {
            id: data.seller_id || '',
            full_name: 'Seller',
            username: 'seller'
          }
        } as Product;

        return transformedData;
      } catch (error) {
        console.error('Product fetch error:', error);
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};
