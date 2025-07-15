
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

interface UsePaginatedProductsParams {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  searchTerm?: string;
  sortBy?: string;
  priceRange?: [number, number];
  condition?: string;
  brand?: string;
}

export const usePaginatedProducts = ({
  page = 1,
  pageSize = 12,
  categoryId,
  searchTerm,
  sortBy = 'newest',
  priceRange,
  condition,
  brand
}: UsePaginatedProductsParams = {}) => {
  return useQuery({
    queryKey: ['paginated-items', page, pageSize, categoryId, searchTerm, sortBy, priceRange, condition, brand],
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
          `, { count: 'exact' })
          .eq('is_available', true);

        // Apply filters
        if (categoryId && categoryId !== 'all') {
          query = query.eq('category_id', categoryId);
        }

        if (searchTerm) {
          query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
        }

        // Fix the condition filter - ensure it's a valid condition value
        if (condition) {
          const validConditions: Product['condition'][] = ['new', 'like_new', 'good', 'fair', 'poor'];
          if (validConditions.includes(condition as Product['condition'])) {
            query = query.eq('condition', condition as Product['condition']);
          }
        }

        if (brand) {
          query = query.eq('brand', brand);
        }

        if (priceRange) {
          query = query.gte('price', priceRange[0]).lte('price', priceRange[1]);
        }

        // Apply sorting
        switch (sortBy) {
          case 'price-low':
            query = query.order('price', { ascending: true });
            break;
          case 'price-high':
            query = query.order('price', { ascending: false });
            break;
          case 'oldest':
            query = query.order('created_at', { ascending: true });
            break;
          default: // newest
            query = query.order('created_at', { ascending: false });
            break;
        }

        // Apply pagination
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) {
          console.error('Error fetching products:', error);
          throw error;
        }

        // Transform the data
        const transformedData = data?.map(item => {
          const images = item.item_images?.length > 0 
            ? item.item_images.map((img: any) => img.image_url)
            : ['/placeholder.svg'];

          // Helper function to safely cast condition with proper type checking
          const getCondition = (condition: any): Product['condition'] => {
            const validConditions: Product['condition'][] = ['new', 'like_new', 'good', 'fair', 'poor'];
            if (typeof condition === 'string' && validConditions.includes(condition as Product['condition'])) {
              return condition as Product['condition'];
            }
            return 'good'; // Default fallback
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

        return {
          products: transformedData,
          totalCount: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize),
          currentPage: page,
          hasNextPage: page < Math.ceil((count || 0) / pageSize),
          hasPreviousPage: page > 1
        };
      } catch (error) {
        console.error('Products fetch error:', error);
        return {
          products: [],
          totalCount: 0,
          totalPages: 0,
          currentPage: 1,
          hasNextPage: false,
          hasPreviousPage: false
        };
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};
