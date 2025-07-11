
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error fetching categories:', error);
          throw error;
        }

        return (data || []) as Category[];
      } catch (error) {
        console.error('Categories fetch error:', error);
        return [];
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - categories don't change often
    retry: 3,
  });
};
