
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
    queryKey: ['paginated-products', page, pageSize, categoryId, searchTerm, sortBy, priceRange, condition, brand],
    queryFn: async () => {
      console.log('Fetching products with params:', {
        page, pageSize, categoryId, searchTerm, sortBy, priceRange, condition, brand
      });

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
          `, { count: 'exact' })
          .eq('is_active', true)
          .is('deleted_at', null);

        // Apply filters only if they have valid values
        if (categoryId && categoryId !== 'all' && categoryId !== '') {
          console.log('Applying category filter:', categoryId);
          query = query.eq('category_id', categoryId);
        }

        if (searchTerm && searchTerm.trim() !== '') {
          console.log('Applying search filter:', searchTerm);
          query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
        }

        if (condition && condition !== 'any' && condition !== '') {
          const validConditions: Product['condition'][] = ['new', 'like_new', 'good', 'fair', 'poor'];
          if (validConditions.includes(condition as Product['condition'])) {
            console.log('Applying condition filter:', condition);
            query = query.eq('condition', condition as Product['condition']);
          }
        }

        if (brand && brand !== 'any' && brand !== '') {
          console.log('Applying brand filter:', brand);
          query = query.eq('brand', brand);
        }

        if (priceRange && Array.isArray(priceRange) && priceRange.length === 2) {
          console.log('Applying price range filter:', priceRange);
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

        console.log('Executing query...');
        const { data, error, count } = await query;

        if (error) {
          console.error('Supabase query error:', error);
          throw new Error(`Database error: ${error.message}`);
        }

        console.log('Raw data received:', data);
        console.log('Total count:', count);

        // Transform the data with better error handling
        const transformedData = data?.map((product, index) => {
          try {
            console.log(`Transforming product ${index}:`, product);

            const images = product.product_images?.length > 0 
              ? product.product_images.map((img: any) => img.image_url).filter(url => url)
              : product.main_image_url 
              ? [product.main_image_url]
              : ['/placeholder.svg'];

            // Helper function to safely cast condition with proper type checking
            const getCondition = (condition: any): Product['condition'] => {
              const validConditions: Product['condition'][] = ['new', 'like_new', 'good', 'fair', 'poor'];
              if (typeof condition === 'string' && validConditions.includes(condition as Product['condition'])) {
                return condition as Product['condition'];
              }
              console.warn('Invalid condition found:', condition, 'defaulting to good');
              return 'good'; // Default fallback
            };

            // Safely handle category data
            const categoryData = product.category && typeof product.category === 'object' && !Array.isArray(product.category) 
              ? product.category 
              : null;

            // Safely handle seller data
            const sellerData = product.seller && typeof product.seller === 'object' && !Array.isArray(product.seller)
              ? product.seller
              : null;

            const transformedProduct: Product = {
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
            };

            console.log(`Successfully transformed product ${index}:`, transformedProduct);
            return transformedProduct;
          } catch (transformError) {
            console.error(`Error transforming product ${index}:`, transformError, product);
            // Return a safe fallback product instead of failing completely
            return {
              id: product.id || `error-${index}`,
              title: product.title || product.name || 'Error Loading Product',
              description: product.description || 'This product could not be loaded properly',
              price: Number(product.price) || 0,
              original_price: null,
              condition: 'good' as Product['condition'],
              size: null,
              brand: null,
              color: null,
              images: product.main_image_url ? [product.main_image_url] : ['/placeholder.svg'],
              is_available: true,
              is_featured: false,
              created_at: new Date().toISOString(),
              category: {
                id: '',
                name: 'Uncategorized',
                slug: 'uncategorized'
              },
              seller: {
                id: '',
                full_name: 'Unknown Seller',
                username: 'unknown'
              }
            } as Product;
          }
        }) || [];

        console.log('Final transformed data:', transformedData);

        const result = {
          products: transformedData,
          totalCount: count || 0,
          totalPages: Math.ceil((count || 0) / pageSize),
          currentPage: page,
          hasNextPage: page < Math.ceil((count || 0) / pageSize),
          hasPreviousPage: page > 1
        };

        console.log('Returning result:', result);
        return result;
      } catch (error) {
        console.error('Products fetch error:', error);
        // Re-throw the error so React Query can handle it properly
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      console.log(`Query failed ${failureCount} times:`, error);
      return failureCount < 3;
    },
  });
};
