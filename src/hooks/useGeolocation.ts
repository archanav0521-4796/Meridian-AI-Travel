import { useState, useEffect, useCallback } from 'react';
import { UserLocation } from '../types';
import { reverseGeocode, POPULAR_DEPARTURE_HUBS } from '../services/geocodingApi';

const DEFAULT_LOCATION: UserLocation = {
  city: 'London',
  country: 'United Kingdom',
  lat: 51.5074,
  lng: -0.1278,
  isCustom: false,
  status: 'prompt',
};

export function useGeolocation() {
  const [location, setLocation] = useState<UserLocation>(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('voyage_user_location');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return DEFAULT_LOCATION;
  });

  const [isDetecting, setIsDetecting] = useState(false);
  const [showLocationBanner, setShowLocationBanner] = useState(() => {
    return !localStorage.getItem('voyage_location_dismissed');
  });

  const saveLocation = useCallback((newLoc: UserLocation) => {
    setLocation(newLoc);
    localStorage.setItem('voyage_user_location', JSON.stringify(newLoc));
  }, []);

  const requestBrowserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      saveLocation({ ...location, status: 'denied' });
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        try {
          const { city, country } = await reverseGeocode(lat, lng);
          const newLoc: UserLocation = {
            city,
            country,
            lat,
            lng,
            isCustom: false,
            status: 'granted',
          };
          saveLocation(newLoc);
        } catch (err) {
          saveLocation({
            city: 'Current Location',
            country: '',
            lat,
            lng,
            isCustom: false,
            status: 'granted',
          });
        } finally {
          setIsDetecting(false);
          setShowLocationBanner(false);
        }
      },
      (err) => {
        console.warn('Geolocation denied or failed:', err.message);
        setIsDetecting(false);
        saveLocation({
          ...location,
          status: 'denied',
        });
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  }, [location, saveLocation]);

  const setManualLocation = useCallback(
    (city: string, country: string, lat: number, lng: number) => {
      const manualLoc: UserLocation = {
        city,
        country,
        lat,
        lng,
        isCustom: true,
        status: 'custom',
      };
      saveLocation(manualLoc);
      setShowLocationBanner(false);
    },
    [saveLocation]
  );

  const dismissBanner = useCallback(() => {
    setShowLocationBanner(false);
    localStorage.setItem('voyage_location_dismissed', 'true');
  }, []);

  return {
    location,
    isDetecting,
    showLocationBanner,
    requestBrowserLocation,
    setManualLocation,
    dismissBanner,
    popularHubs: POPULAR_DEPARTURE_HUBS,
  };
}
