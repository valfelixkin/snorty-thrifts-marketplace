import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Ad {
  id: string;
  title: string;
  description: string;
  image_url: string;
  target_url: string;
  category: string;
  location: string;
  clicks: number;
}

interface AdDisplayProps {
  category?: string;
  location?: string;
  maxAds?: number;
  className?: string;
}

export default function AdDisplay({ category, location, maxAds = 3, className = "" }: AdDisplayProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAds();
  }, [category, location]);

  const fetchAds = async () => {
    try {
      let query = supabase
        .from('ads')
        .select('*')
        .eq('is_active', true)
        .eq('status', 'active')
        .limit(maxAds);

      if (category) {
        query = query.eq('category', category);
      }
      
      if (location) {
        query = query.eq('location', location);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setAds(data || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdClick = async (ad: Ad) => {
    // Track impression and click
    try {
      // Update clicks count directly
      await supabase
        .from('ads')
        .update({ clicks: ad.clicks + 1 })
        .eq('id', ad.id);
      
      // Open ad in new window to prevent interference with website navigation
      window.open(ad.target_url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error tracking ad click:', error);
      // Still open the ad even if tracking fails
      window.open(ad.target_url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: maxAds }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (ads.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <p className="text-xs text-muted-foreground">Sponsored</p>
      {ads.map((ad) => (
        <Card key={ad.id} className="hover:shadow-md transition-shadow cursor-pointer border-accent/20">
          <CardContent className="p-4" onClick={() => handleAdClick(ad)}>
            <div className="flex items-start space-x-3">
              {ad.image_url && (
                <img 
                  src={ad.image_url} 
                  alt={ad.title}
                  className="w-12 h-12 rounded object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-primary truncate">{ad.title}</h4>
                {ad.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {ad.description}
                  </p>
                )}
                <Button size="sm" variant="outline" className="mt-2 text-xs h-6">
                  Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}