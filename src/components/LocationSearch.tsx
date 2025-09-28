import React, { useState, useEffect } from 'react';
import { MapPin, Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface LocationFilter {
  city?: string;
  region?: string;
  radius?: number; // in kilometers
  userLatitude?: number;
  userLongitude?: number;
}

interface LocationSearchProps {
  onFilterChange: (filters: LocationFilter) => void;
  className?: string;
}

const LocationSearch = ({ onFilterChange, className }: LocationSearchProps) => {
  const [filters, setFilters] = useState<LocationFilter>({
    radius: 50 // default 50km radius
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load user's location from localStorage
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation);
        setFilters(prev => ({
          ...prev,
          userLatitude: location.latitude,
          userLongitude: location.longitude
        }));
      } catch (error) {
        console.error('Failed to parse saved location:', error);
      }
    }
  }, []);

  const handleFilterChange = (newFilters: Partial<LocationFilter>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters: LocationFilter = {
      radius: 50,
      userLatitude: filters.userLatitude,
      userLongitude: filters.userLongitude
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = filters.city || filters.region || (filters.radius && filters.radius < 50);

  return (
    <div className={className}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className={`flex items-center gap-2 ${hasActiveFilters ? 'border-primary text-primary' : ''}`}
          >
            <MapPin className="w-4 h-4" />
            Location
            {hasActiveFilters && (
              <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                Active
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location Filters
                </span>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="city-filter">City</Label>
                <Input
                  id="city-filter"
                  placeholder="Enter city name..."
                  value={filters.city || ''}
                  onChange={(e) => handleFilterChange({ city: e.target.value || undefined })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="region-filter">Region/County</Label>
                <Input
                  id="region-filter"
                  placeholder="Enter region..."
                  value={filters.region || ''}
                  onChange={(e) => handleFilterChange({ region: e.target.value || undefined })}
                />
              </div>

              {filters.userLatitude && filters.userLongitude && (
                <div className="space-y-3">
                  <Label>Distance from your location</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[filters.radius || 50]}
                      onValueChange={([value]) => handleFilterChange({ radius: value })}
                      max={200}
                      min={1}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>1 km</span>
                      <span className="font-medium">
                        {filters.radius || 50} km
                      </span>
                      <span>200 km</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  {filters.userLatitude && filters.userLongitude
                    ? 'Using your saved location for distance calculations'
                    : 'Set your location to enable distance filtering'}
                </p>
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LocationSearch;