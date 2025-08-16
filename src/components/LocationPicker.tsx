import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  onClose: () => void;
  isOpen: boolean;
}

const LocationPicker = ({ onLocationSelect, onClose, isOpen }: LocationPickerProps) => {
  const [mapboxToken, setMapboxToken] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);

  const getCurrentLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(location);
          reverseGeocode(location.lat, location.lng);
          setIsLoading(false);
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get your current location. Please enter manually.",
            variant: "destructive"
          });
          setIsLoading(false);
        }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    if (!mapboxToken) return;
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        setAddress(data.features[0].place_name);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
  };

  const initializeMap = () => {
    if (!mapboxToken || !mapContainer.current || map.current) return;

    // Dynamically import mapbox-gl
    import('mapbox-gl').then((mapboxgl) => {
      mapboxgl.default.accessToken = mapboxToken;
      
      map.current = new mapboxgl.default.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: currentLocation ? [currentLocation.lng, currentLocation.lat] : [0, 0],
        zoom: currentLocation ? 15 : 2
      });

      // Add click handler
      map.current.on('click', (e: any) => {
        const { lng, lat } = e.lngLat;
        setCurrentLocation({ lat, lng });
        reverseGeocode(lat, lng);
        
        // Remove existing marker
        const existingMarker = document.querySelector('.mapboxgl-marker');
        if (existingMarker) {
          existingMarker.remove();
        }
        
        // Add new marker
        new mapboxgl.default.Marker()
          .setLngLat([lng, lat])
          .addTo(map.current);
      });

      // Add current location marker if available
      if (currentLocation) {
        new mapboxgl.default.Marker()
          .setLngLat([currentLocation.lng, currentLocation.lat])
          .addTo(map.current);
      }
    });
  };

  useEffect(() => {
    if (mapboxToken && isOpen) {
      initializeMap();
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, isOpen, currentLocation]);

  const handleConfirmLocation = () => {
    if (currentLocation && address) {
      onLocationSelect({
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        address
      });
      onClose();
    } else {
      toast({
        title: "Location Required",
        description: "Please select a location on the map or use your current location.",
        variant: "destructive"
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Select Your Location
            </CardTitle>
            <CardDescription>
              Choose your location to help buyers find you easily
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col gap-4">
          {!mapboxToken ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                To use location features, please enter your Mapbox public token:
              </p>
              <Input
                type="text"
                placeholder="Enter Mapbox public token..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Get your free token at{' '}
                <a 
                  href="https://mapbox.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  mapbox.com
                </a>
              </p>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <Button
                  onClick={getCurrentLocation}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  {isLoading ? 'Getting Location...' : 'Use Current Location'}
                </Button>
              </div>

              <div 
                ref={mapContainer} 
                className="flex-1 rounded-lg border min-h-[300px]"
                style={{ minHeight: '300px' }}
              />

              {address && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Selected Location:</label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address will appear here..."
                  />
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmLocation}>
                  Confirm Location
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationPicker;