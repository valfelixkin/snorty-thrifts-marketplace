import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, X, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LocationPicker from './LocationPicker';

interface LocationManagerProps {
  onLocationUpdate?: (location: any) => void;
  showLocationPicker?: boolean;
  hideHeader?: boolean;
}

const LocationManager = ({ onLocationUpdate, showLocationPicker = false, hideHeader = false }: LocationManagerProps) => {
  const [showPicker, setShowPicker] = useState(showLocationPicker);
  const [isUpdating, setIsUpdating] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [manualCity, setManualCity] = useState('');
  const [manualRegion, setManualRegion] = useState('');
  
  const { location, loading, error, permission, requestLocation, setManualLocation, clearLocation } = useGeolocation();
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const updateUserLocation = async (locationData: any) => {
    if (!user) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          address: locationData.address,
          city: locationData.city,
          region: locationData.region,
          country: locationData.country,
          location_permissions: permission,
          location_updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Location Saved",
        description: "Your location has been updated in your profile!",
        variant: "default"
      });

      onLocationUpdate?.(locationData);
    } catch (error) {
      console.error('Error updating location:', error);
      toast({
        title: "Update Failed",
        description: "Failed to save location to your profile.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAutoLocation = async () => {
    const locationData = await requestLocation();
    if (locationData && user) {
      await updateUserLocation(locationData);
    }
  };

  const handleManualLocation = async () => {
    if (!manualAddress.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter a valid address.",
        variant: "destructive"
      });
      return;
    }

    // Simple geocoding fallback - in production you'd use a proper geocoding service
    const locationData = {
      latitude: 0,
      longitude: 0,
      address: manualAddress,
      city: manualCity,
      region: manualRegion,
      country: 'Kenya'
    };

    await setManualLocation(locationData);
    if (user) {
      await updateUserLocation(locationData);
    }
    
    setManualAddress('');
    setManualCity('');
    setManualRegion('');
  };

  const handleLocationSelect = async (locationData: { lat: number; lng: number; address: string }) => {
    const location = {
      latitude: locationData.lat,
      longitude: locationData.lng,
      address: locationData.address,
      city: locationData.address.split(',')[1]?.trim() || '',
      region: locationData.address.split(',')[2]?.trim() || '',
      country: 'Kenya'
    };

    await setManualLocation(location);
    if (user) {
      await updateUserLocation(location);
    }
    setShowPicker(false);
  };

  // Load user's saved location from profile
  useEffect(() => {
    if (profile?.latitude && profile?.longitude) {
      setManualLocation({
        latitude: Number(profile.latitude),
        longitude: Number(profile.longitude),
        address: profile.address || '',
        city: profile.city || '',
        region: profile.region || '',
        country: profile.country || 'Kenya'
      });
    }
  }, [profile]);

  return (
    <>
      <Card className="w-full max-w-md">
        {!hideHeader && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location Settings
            </CardTitle>
            <CardDescription>
              Set your location to help customers find you easily
            </CardDescription>
          </CardHeader>
        )}
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {location && (
            <Alert>
              <Check className="w-4 h-4" />
              <AlertDescription>
                <strong>Current Location:</strong><br />
                {location.address || `${location.latitude}, ${location.longitude}`}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleAutoLocation}
              disabled={loading || isUpdating}
              className="w-full flex items-center gap-2"
              variant={permission === 'granted' ? 'outline' : 'default'}
            >
              <Navigation className="w-4 h-4" />
              {loading ? 'Getting Location...' : 'Use Current Location'}
            </Button>

            <Button
              onClick={() => setShowPicker(true)}
              disabled={isUpdating}
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Pick on Map
            </Button>

            <div className="text-center text-sm text-muted-foreground">or</div>

            <div className="space-y-2">
              <Label htmlFor="manual-address">Enter Manually</Label>
              <Input
                id="manual-address"
                placeholder="Street address..."
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="City..."
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value)}
                />
                <Input
                  placeholder="Region..."
                  value={manualRegion}
                  onChange={(e) => setManualRegion(e.target.value)}
                />
              </div>
              <Button
                onClick={handleManualLocation}
                disabled={isUpdating || !manualAddress.trim()}
                variant="outline"
                className="w-full"
              >
                {isUpdating ? 'Saving...' : 'Save Manual Location'}
              </Button>
            </div>

            {location && (
              <Button
                onClick={() => {
                  clearLocation();
                  if (user) {
                    updateUserLocation({
                      latitude: null,
                      longitude: null,
                      address: null,
                      city: null,
                      region: null,
                      location_permissions: 'not_requested'
                    });
                  }
                }}
                variant="ghost"
                className="w-full text-destructive hover:text-destructive/90"
              >
                Clear Location
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <LocationPicker
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onLocationSelect={handleLocationSelect}
      />
    </>
  );
};

export default LocationManager;