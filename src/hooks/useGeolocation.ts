import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  region?: string;
  country?: string;
}

interface GeolocationState {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  permission: 'not_requested' | 'granted' | 'denied' | 'manual';
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: false,
    error: null,
    permission: 'not_requested'
  });
  const { toast } = useToast();

  const reverseGeocode = async (lat: number, lng: number): Promise<Partial<LocationData>> => {
    try {
      // Try with Nominatim (OpenStreetMap) first as it's free
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        return {
          address: data.display_name,
          city: data.address?.city || data.address?.town || data.address?.village,
          region: data.address?.state || data.address?.province,
          country: data.address?.country || 'Kenya'
        };
      }
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
    }
    
    return {
      address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      city: '',
      region: '',
      country: 'Kenya'
    };
  };

  const requestLocation = async (): Promise<LocationData | null> => {
    if (!navigator.geolocation) {
      setState(prev => ({ 
        ...prev, 
        error: 'Geolocation is not supported by this browser',
        permission: 'denied'
      }));
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const locationDetails = await reverseGeocode(latitude, longitude);
          
          const location: LocationData = {
            latitude,
            longitude,
            ...locationDetails
          };

          setState(prev => ({
            ...prev,
            location,
            loading: false,
            permission: 'granted'
          }));

          toast({
            title: "Location Access Granted",
            description: "Your location has been captured successfully!",
            variant: "default"
          });

          resolve(location);
        },
        (error) => {
          let errorMessage = 'Failed to get your location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              setState(prev => ({ ...prev, permission: 'denied' }));
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }

          setState(prev => ({
            ...prev,
            loading: false,
            error: errorMessage,
            permission: 'denied'
          }));

          toast({
            title: "Location Access Failed",
            description: errorMessage,
            variant: "destructive"
          });

          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  const setManualLocation = async (location: LocationData) => {
    setState(prev => ({
      ...prev,
      location,
      permission: 'manual',
      error: null
    }));
  };

  // Load saved location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation);
        setState(prev => ({
          ...prev,
          location,
          permission: location.isManual ? 'manual' : 'granted'
        }));
      } catch (error) {
        console.error('Failed to parse saved location:', error);
      }
    }
  }, []);

  // Save location to localStorage when it changes
  useEffect(() => {
    if (state.location) {
      localStorage.setItem('userLocation', JSON.stringify({
        ...state.location,
        isManual: state.permission === 'manual'
      }));
    }
  }, [state.location, state.permission]);

  return {
    ...state,
    requestLocation,
    setManualLocation,
    clearLocation: () => {
      setState({
        location: null,
        loading: false,
        error: null,
        permission: 'not_requested'
      });
      localStorage.removeItem('userLocation');
    }
  };
};