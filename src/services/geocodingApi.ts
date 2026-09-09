export interface CityLocation {
  city: string;
  country: string;
  lat: number;
  lng: number;
  continent: string;
}

export const POPULAR_DEPARTURE_HUBS: CityLocation[] = [
  { city: 'Mumbai', country: 'India', lat: 19.076, lng: 72.8777, continent: 'Asia' },
  { city: 'New Delhi', country: 'India', lat: 28.6139, lng: 77.209, continent: 'Asia' },
  { city: 'Bengaluru', country: 'India', lat: 12.9716, lng: 77.5946, continent: 'Asia' },
  { city: 'Hyderabad', country: 'India', lat: 17.385, lng: 78.4867, continent: 'Asia' },
  { city: 'Chennai', country: 'India', lat: 13.0827, lng: 80.2707, continent: 'Asia' },
  { city: 'Kolkata', country: 'India', lat: 22.5726, lng: 88.3639, continent: 'Asia' },
  { city: 'Port Blair', country: 'India', lat: 11.6234, lng: 92.7265, continent: 'Asia' },
  { city: 'Bali (Denpasar)', country: 'Indonesia', lat: -8.65, lng: 115.2167, continent: 'Asia' },
  { city: 'Colombo', country: 'Sri Lanka', lat: 6.9271, lng: 79.8612, continent: 'Asia' },
  { city: 'Kathmandu', country: 'Nepal', lat: 27.7172, lng: 85.324, continent: 'Asia' },
  { city: 'Male', country: 'Maldives', lat: 4.1755, lng: 73.5093, continent: 'Asia' },
  { city: 'Thimphu', country: 'Bhutan', lat: 27.4728, lng: 89.6393, continent: 'Asia' },
  { city: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, continent: 'Europe' },
  { city: 'New York', country: 'United States', lat: 40.7128, lng: -74.006, continent: 'Americas' },
  { city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, continent: 'Asia' },
  { city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, continent: 'Europe' },
  { city: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708, continent: 'Asia' },
  { city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, continent: 'Asia' },
  { city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, continent: 'Oceania' },
  { city: 'Los Angeles', country: 'United States', lat: 34.0522, lng: -118.2437, continent: 'Americas' },
  { city: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, continent: 'Americas' },
  { city: 'Berlin', country: 'Germany', lat: 52.52, lng: 13.405, continent: 'Europe' },
  { city: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964, continent: 'Europe' },
  { city: 'San Francisco', country: 'United States', lat: 37.7749, lng: -122.4194, continent: 'Americas' },
  { city: 'Hong Kong', country: 'China', lat: 22.3193, lng: 114.1694, continent: 'Asia' },
  { city: 'Cape Town', country: 'South Africa', lat: -33.9249, lng: 18.4241, continent: 'Africa' },
  { city: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, continent: 'Americas' },
  { city: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041, continent: 'Europe' },
  { city: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.978, continent: 'Asia' },
  { city: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018, continent: 'Asia' },
  { city: 'Barcelona', country: 'Spain', lat: 41.3851, lng: 2.1734, continent: 'Europe' },
  { city: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784, continent: 'Europe' },
  { city: 'Zurich', country: 'Switzerland', lat: 47.3769, lng: 8.5417, continent: 'Europe' },
  { city: 'Auckland', country: 'New Zealand', lat: -36.8485, lng: 174.7633, continent: 'Oceania' },
];

/**
 * Calculates great-circle distance between two points using Haversine formula (in km)
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Estimates direct flight time (based on ~800 km/h average cruise + 40 min ascent/descent)
 */
export function estimateFlightDuration(distanceKm: number): string {
  if (distanceKm < 150) return '< 1 hr drive / train';
  const hours = distanceKm / 800 + 0.6;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}m flight`;
  return `~${h}h ${m > 0 ? `${m}m` : ''} flight`;
}

/**
 * Reverse geocode coordinates to City & Country name
 */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<{ city: string; country: string }> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
        },
      }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const city = addr.city || addr.town || addr.municipality || addr.village || addr.county || 'Current Location';
      const country = addr.country || '';
      return { city, country };
    }
  } catch (e) {
    console.warn('Reverse geocoding failed, using coordinate estimation:', e);
  }

  // Find closest hub
  let closest = POPULAR_DEPARTURE_HUBS[0];
  let minDistance = Infinity;
  for (const hub of POPULAR_DEPARTURE_HUBS) {
    const d = calculateDistanceKm(lat, lng, hub.lat, hub.lng);
    if (d < minDistance) {
      minDistance = d;
      closest = hub;
    }
  }

  return { city: closest.city, country: closest.country };
}
