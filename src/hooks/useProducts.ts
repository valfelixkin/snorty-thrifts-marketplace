
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
          .select(`
            *,
            category:categories!fk_products_category (
              id,
              name,
              slug
            ),
            seller:profiles!products_seller_id_fkey (
              id,
              first_name,
              last_name,
              username
            ),
            product_images (
              image_url,
              is_primary
            )
          `)
          .eq('is_active', true)
          .is('deleted_at', null);

        if (categorySlug) {
          query = query.eq('categories.slug', categorySlug);
        }

        if (searchTerm) {
          query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching products:', error);
          throw error;
        }

        // Transform the data to match our Product interface
        const transformedData = data?.map(product => {
          // Get images from product_images table or fallback to main_image_url or placeholder
          const images = product.product_images?.length > 0 
            ? product.product_images.map((img: any) => img.image_url)
            : product.main_image_url 
            ? [product.main_image_url]
            : ['/placeholder.svg'];

          // Helper function to safely cast condition
          const getCondition = (condition: any): 'new' | 'like_new' | 'good' | 'fair' | 'poor' => {
            const validConditions = ['new', 'like_new', 'good', 'fair', 'poor'] as const;
            return validConditions.includes(condition) ? condition as 'new' | 'like_new' | 'good' | 'fair' | 'poor' : 'good';
          };

          // Safely handle category data
          const categoryData = product.category && typeof product.category === 'object' && !Array.isArray(product.category) 
            ? product.category 
            : null;

          // Safely handle seller data
          const sellerData = product.seller && typeof product.seller === 'object' && !Array.isArray(product.seller)
            ? product.seller
            : null;

          return {
            id: product.id,
            title: product.title || product.name || 'Untitled Product',
            description: product.description || '',
            price: Number(product.price) || 0,
            original_price: null,
            condition: getCondition(product.condition),
            size: product.size || null,
            brand: product.brand || null,
            color: product.color || null,
            images,
            is_available: Boolean(product.is_available),
            is_featured: Boolean(product.is_featured),
            created_at: product.created_at || new Date().toISOString(),
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
    queryKey: ['product', id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            category:categories!fk_products_category (
              id,
              name,
              slug
            ),
            seller:profiles!products_seller_id_fkey (
              id,
              first_name,
              last_name,
              username
            ),
            product_images (
              image_url,
              is_primary
            )
          `)
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

        // Get images from product_images table or fallback to main_image_url or placeholder
        const images = data.product_images?.length > 0 
          ? data.product_images.map((img: any) => img.image_url)
          : data.main_image_url 
          ? [data.main_image_url]
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
          title: data.title || data.name || 'Untitled Product',
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
