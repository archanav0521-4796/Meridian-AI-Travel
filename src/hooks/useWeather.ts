import { useState, useEffect } from 'react';
import { WeatherData } from '../types';
import { fetchLiveWeather } from '../services/weatherApi';

const weatherCache = new Map<string, { data: WeatherData; timestamp: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

export function useWeather(lat?: number, lng?: number) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lat === undefined || lng === undefined) return;

    const cacheKey = `${lat.toFixed(3)}_${lng.toFixed(3)}`;
    const cached = weatherCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      setWeather(cached.data);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchLiveWeather(lat, lng)
      .then((data) => {
        if (isMounted) {
          weatherCache.set(cacheKey, { data, timestamp: Date.now() });
          setWeather(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to fetch weather');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [lat, lng]);

  const refreshWeather = () => {
    if (lat === undefined || lng === undefined) return;
    const cacheKey = `${lat.toFixed(3)}_${lng.toFixed(3)}`;
    weatherCache.delete(cacheKey);
    setLoading(true);
    fetchLiveWeather(lat, lng).then((data) => {
      weatherCache.set(cacheKey, { data, timestamp: Date.now() });
      setWeather(data);
      setLoading(false);
    });
  };

  return { weather, loading, error, refreshWeather };
}
