
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReturnRequest } from '@/types/return';
import { useToast } from '@/hooks/use-toast';

export const useReturns = () => {
  return useQuery({
    queryKey: ['returns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('returns')
        .select(`
          *,
          items (
            id,
            title,
            price
          ),
          return_media (
            id,
            media_url,
            media_type
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateReturn = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      returnData, 
      mediaFiles 
    }: { 
      returnData: Omit<ReturnRequest, 'id' | 'created_at' | 'updated_at'>;
      mediaFiles: File[];
    }) => {
      // Create return request
      const { data: returnRequest, error: returnError } = await supabase
        .from('returns')
        .insert(returnData)
        .select()
        .single();

      if (returnError) throw returnError;

      // Upload media files
      const mediaUploads = await Promise.all(
        mediaFiles.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${returnRequest.id}/${Math.random()}.${fileExt}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('return-media')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('return-media')
            .getPublicUrl(fileName);

          return {
            return_id: returnRequest.id,
            media_url: publicUrl,
            media_type: file.type.startsWith('video/') ? 'video' : 'image'
          };
        })
      );

      // Save media records
      if (mediaUploads.length > 0) {
        const { error: mediaError } = await supabase
          .from('return_media')
          .insert(mediaUploads);

        if (mediaError) throw mediaError;
      }

      return returnRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['returns'] });
      toast({
        title: "Return request submitted",
        description: "Your return request has been submitted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error submitting return",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
