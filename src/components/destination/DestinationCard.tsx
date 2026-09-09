import React from 'react';
import { Heart, MapPin, Plane, Sparkles, ArrowRight, Star } from 'lucide-react';
import { Destination, UserLocation } from '../../types';
import { calculateDistanceKm, estimateFlightDuration } from '../../services/geocodingApi';
import { useWeather } from '../../hooks/useWeather';

interface DestinationCardProps {
  destination: Destination;
  userLocation: UserLocation;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onOpenDetail: (destination: Destination) => void;
  tempUnit: 'C' | 'F';
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  userLocation,
  isBookmarked,
  onToggleBookmark,
  onOpenDetail,
  tempUnit,
}) => {
  const { weather, loading: weatherLoading } = useWeather(
    destination.coordinates.lat,
    destination.coordinates.lng
  );

  const distanceKm = calculateDistanceKm(
    userLocation.lat,
    userLocation.lng,
    destination.coordinates.lat,
    destination.coordinates.lng
  );

  const distanceMiles = Math.round(distanceKm * 0.621371);
  const flightEstimate = estimateFlightDuration(distanceKm);

  // Convert temperature if in Fahrenheit
  const displayTemp = (tempC?: number) => {
    if (tempC === undefined) return '--';
    if (tempUnit === 'F') {
      return `${Math.round((tempC * 9) / 5 + 32)}°F`;
    }
    return `${tempC}°C`;
  };

  return (
    <div
      onClick={() => onOpenDetail(destination)}
      className="group relative flex flex-col rounded-3xl overflow-hidden glass-card glass-card-hover border border-white/10 cursor-pointer text-left transition-all duration-500 hover:border-amber-400/40"
    >
      {/* Image Banner */}
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-neutral-900">
        <img
          src={destination.heroImage}
          alt={destination.name}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
        />

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#11131a] via-black/20 to-transparent" />

        {/* Top Controls: Weather Badge & Bookmark */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
          {/* Live Weather Pill */}
          <div className="pointer-events-auto px-3 py-1.5 rounded-full glass-panel border border-white/15 text-xs text-white flex items-center gap-1.5 backdrop-blur-md shadow-lg">
            {weatherLoading ? (
              <span className="w-10 h-3 animate-pulse bg-white/20 rounded" />
            ) : weather ? (
              <>
                <span className="text-base leading-none">{weather.icon}</span>
                <span className="font-semibold">{displayTemp(weather.temp)}</span>
                <span className="hidden sm:inline text-neutral-300 text-[11px]">
                  • {weather.condition}
                </span>
              </>
            ) : (
              <span>21°C</span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(destination.id);
            }}
            className={`pointer-events-auto p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 ${
              isBookmarked
                ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-lg shadow-amber-400/20'
                : 'bg-black/50 text-white border-white/20 hover:bg-black/80 hover:text-amber-300'
            }`}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark destination'}
          >
            <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Image Info: Country & Continent */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-neutral-300 font-medium">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{destination.country}</span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-400">{destination.continent}</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-white/10 text-neutral-200 font-mono text-[11px]">
            {destination.budgetTier}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Destination Title */}
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <h3 className="text-2xl font-serif font-normal text-white group-hover:text-amber-200 transition-colors">
              {destination.name}
            </h3>
            <span className="text-xs text-neutral-400 shrink-0">
              {destination.famousPlaces.length} Iconic Places
            </span>
          </div>

          {/* Tagline */}
          <p className="text-xs sm:text-sm text-neutral-400 line-clamp-2 mb-4 font-light leading-relaxed">
            {destination.tagline}
          </p>

          {/* Vibe Chips */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {destination.vibes.slice(0, 2).map((vibe) => (
              <span
                key={vibe}
                className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-neutral-300 font-medium"
              >
                {vibe}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Metrics: Distance & Flight */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Plane className="w-3.5 h-3.5 text-amber-400/80" />
            <span>
              {tempUnit === 'C' ? `${distanceKm.toLocaleString()} km` : `${distanceMiles.toLocaleString()} mi`}
            </span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-300 font-medium">{flightEstimate}</span>
          </div>

          <span className="text-amber-300 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            View <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
