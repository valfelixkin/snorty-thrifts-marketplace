import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

interface LocationFilter {
  city?: string;
  region?: string;
  radius?: number;
  userLatitude?: number;
  userLongitude?: number;
}

export const useLocationProducts = (
  categorySlug?: string, 
  searchTerm?: string, 
  locationFilter?: LocationFilter
) => {
  return useQuery({
    queryKey: ['products', categorySlug, searchTerm, locationFilter],
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

        // Apply location filters
        if (locationFilter?.city) {
          query = query.ilike('city', `%${locationFilter.city}%`);
        }

        if (locationFilter?.region) {
          query = query.ilike('region', `%${locationFilter.region}%`);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching products:', error);
          throw error;
        }

        let transformedData = data?.map(product => {
          const images = product.main_image_url 
            ? [product.main_image_url]
            : ['/placeholder.svg'];

          return {
            id: product.id,
            title: product.title || 'Untitled Product',
            description: product.description || '',
            price: Number(product.price) || 0,
            original_price: null,
            condition: (product.condition as any) || 'good',
            size: product.size || null,
            brand: product.brand || null,
            color: product.color || null,
            images,
            is_available: Boolean(product.is_active),
            is_featured: Boolean(product.is_featured),
            created_at: product.created_at || new Date().toISOString(),
            location: {
              latitude: product.latitude ? Number(product.latitude) : null,
              longitude: product.longitude ? Number(product.longitude) : null,
              address: product.address,
              city: product.city,
              region: product.region
            },
            category: {
              id: '',
              name: 'General',
              slug: 'general'
            },
            seller: {
              id: product.user_id || '',
              full_name: 'Seller',
              username: 'seller'
            }
          } as Product & { location: any };
        }) || [];

        // Apply radius filter if user location is available
        if (locationFilter?.radius && locationFilter?.userLatitude && locationFilter?.userLongitude) {
          transformedData = transformedData.filter(product => {
            if (!product.location?.latitude || !product.location?.longitude) return true;
            
            const distance = calculateDistance(
              locationFilter.userLatitude!,
              locationFilter.userLongitude!,
              product.location.latitude,
              product.location.longitude
            );
            
            return distance <= locationFilter.radius!;
          });
        }

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

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}