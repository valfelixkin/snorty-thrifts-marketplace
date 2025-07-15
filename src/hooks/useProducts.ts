
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
            category:categories!items_category_id_fkey (
              id,
              name,
              slug
            ),
            seller:profiles!items_seller_id_fkey (
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

          // Helper function to safely cast condition
          const getCondition = (condition: any): 'new' | 'like_new' | 'good' | 'fair' | 'poor' => {
            const validConditions = ['new', 'like_new', 'good', 'fair', 'poor'] as const;
            return validConditions.includes(condition) ? condition as 'new' | 'like_new' | 'good' | 'fair' | 'poor' : 'good';
          };

          // Safely handle category data
          const categoryData = item.category && typeof item.category === 'object' && !Array.isArray(item.category) 
            ? item.category 
            : null;

          // Safely handle seller data
          const sellerData = item.seller && typeof item.seller === 'object' && !Array.isArray(item.seller)
            ? item.seller
            : null;

          return {
            id: item.id,
            title: item.title || 'Untitled Item',
            description: item.description || '',
            price: Number(item.price) || 0,
            original_price: null,
            condition: getCondition(item.condition),
            size: item.size || null,
            brand: item.brand || null,
            color: item.color || null,
            images,
            is_available: Boolean(item.is_available),
            is_featured: Boolean(item.is_featured),
            created_at: item.created_at || new Date().toISOString(),
            category: {
              id: categoryData?.id || '',
              name: categoryData?.name || 'Uncategorized',
              slug: categoryData?.slug || 'uncategorized'
            },
            seller: {
              id: sellerData?.id || '',
              full_name: `${sellerData?.first_name || ''} ${sellerData?.last_name || ''}`.trim() || sellerData?.username || 'Unknown Seller',
              username: sellerData?.username || 'unknown'
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
            category:categories!items_category_id_fkey (
              id,
              name,
              slug
            ),
            seller:profiles!items_seller_id_fkey (
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

        // Helper function to safely cast condition
        const getCondition = (condition: any): 'new' | 'like_new' | 'good' | 'fair' | 'poor' => {
          const validConditions = ['new', 'like_new', 'good', 'fair', 'poor'] as const;
          return validConditions.includes(condition) ? condition as 'new' | 'like_new' | 'good' | 'fair' | 'poor' : 'good';
        };

        // Safely handle category data
        const categoryData = data.category && typeof data.category === 'object' && !Array.isArray(data.category) 
          ? data.category 
          : null;

        // Safely handle seller data
        const sellerData = data.seller && typeof data.seller === 'object' && !Array.isArray(data.seller)
          ? data.seller
          : null;

        const transformedData = {
          id: data.id,
          title: data.title || 'Untitled Item',
          description: data.description || '',
          price: Number(data.price) || 0,
          original_price: null,
          condition: getCondition(data.condition),
          size: data.size || null,
          brand: data.brand || null,
          color: data.color || null,
          images,
          is_available: Boolean(data.is_available),
          is_featured: Boolean(data.is_featured),
          created_at: data.created_at || new Date().toISOString(),
          category: {
            id: categoryData?.id || '',
            name: categoryData?.name || 'Uncategorized',
            slug: categoryData?.slug || 'uncategorized'
          },
          seller: {
            id: sellerData?.id || '',
            full_name: `${sellerData?.first_name || ''} ${sellerData?.last_name || ''}`.trim() || sellerData?.username || 'Unknown Seller',
            username: sellerData?.username || 'unknown'
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
