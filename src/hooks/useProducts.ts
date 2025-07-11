
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

export const useProducts = (categorySlug?: string, searchTerm?: string) => {
  return useQuery({
    queryKey: ['items', categorySlug, searchTerm],
    queryFn: async () => {
      try {
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
            ),
            item_images (
              image_url,
              is_primary
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

        // Transform the data to match our Product interface with proper error handling
        const transformedData = data?.map(item => {
          // Get images from item_images table or fallback to placeholder
          const images = item.item_images?.length > 0 
            ? item.item_images.map((img: any) => img.image_url)
            : ['/placeholder.svg'];

          return {
            id: item.id,
            title: item.title || 'Untitled Item',
            description: item.description || '',
            price: Number(item.price) || 0,
            original_price: null,
            condition: item.condition || 'good',
            size: item.size || null,
            brand: item.brand || null,
            color: item.color || null,
            images,
            is_available: Boolean(item.is_available),
            is_featured: Boolean(item.is_featured),
            created_at: item.created_at || new Date().toISOString(),
            category: {
              id: item.categories?.id || '',
              name: item.categories?.name || 'Uncategorized',
              slug: item.categories?.slug || 'uncategorized'
            },
            seller: {
              id: item.profiles?.id || '',
              full_name: `${item.profiles?.first_name || ''} ${item.profiles?.last_name || ''}`.trim() || item.profiles?.username || 'Unknown Seller',
              username: item.profiles?.username || 'unknown'
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
    queryKey: ['item', id],
    queryFn: async () => {
      try {
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
            ),
            item_images (
              image_url,
              is_primary
            )
          `)
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching product:', error);
          throw error;
        }

        if (!data) {
          throw new Error('Product not found');
        }

        // Get images from item_images table or fallback to placeholder
        const images = data.item_images?.length > 0 
          ? data.item_images.map((img: any) => img.image_url)
          : ['/placeholder.svg'];

        const transformedData = {
          id: data.id,
          title: data.title || 'Untitled Item',
          description: data.description || '',
          price: Number(data.price) || 0,
          original_price: null,
          condition: data.condition || 'good',
          size: data.size || null,
          brand: data.brand || null,
          color: data.color || null,
          images,
          is_available: Boolean(data.is_available),
          is_featured: Boolean(data.is_featured),
          created_at: data.created_at || new Date().toISOString(),
          category: {
            id: data.categories?.id || '',
            name: data.categories?.name || 'Uncategorized',
            slug: data.categories?.slug || 'uncategorized'
          },
          seller: {
            id: data.profiles?.id || '',
            full_name: `${data.profiles?.first_name || ''} ${data.profiles?.last_name || ''}`.trim() || data.profiles?.username || 'Unknown Seller',
            username: data.profiles?.username || 'unknown'
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
