import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, RotateCcw, Sparkles } from 'lucide-react';
import { Destination, Continent, TravelVibe, UserLocation } from '../../types';
import { DestinationCard } from './DestinationCard';
import { calculateDistanceKm } from '../../services/geocodingApi';

interface DestinationGridProps {
  destinations: Destination[];
  userLocation: UserLocation;
  selectedContinent: Continent;
  onSelectContinent: (c: Continent) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (id: string) => void;
  onOpenDetail: (dest: Destination) => void;
  tempUnit: 'C' | 'F';
}

export const DestinationGrid: React.FC<DestinationGridProps> = ({
  destinations,
  userLocation,
  selectedContinent,
  onSelectContinent,
  searchQuery,
  onSearchChange,
  isBookmarked,
  onToggleBookmark,
  onOpenDetail,
  tempUnit,
}) => {
  const [selectedVibe, setSelectedVibe] = useState<TravelVibe>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'nearest' | 'furthest' | 'budget' | 'name'>('featured');

  const continents: Continent[] = ['All', 'India', 'Asia', 'Europe', 'Americas', 'Africa', 'Oceania'];
  const vibes: TravelVibe[] = [
    'All',
    'Cultural & Historic',
    'Beach & Coastal',
    'Alpine & Nature',
    'Urban & Modern',
    'Romantic & Luxury',
  ];

  // Filtering and sorting logic
  const filteredDestinations = useMemo(() => {
    return destinations
      .filter((dest) => {
        // Continent / Region filter
        if (selectedContinent !== 'All') {
          if (selectedContinent === 'India') {
            if (dest.country !== 'India') return false;
          } else if (dest.continent !== selectedContinent) {
            return false;
          }
        }

        // Vibe filter
        if (selectedVibe !== 'All' && !dest.vibes.includes(selectedVibe)) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = dest.name.toLowerCase().includes(q);
          const matchCountry = dest.country.toLowerCase().includes(q);
          const matchTagline = dest.tagline.toLowerCase().includes(q);
          const matchPlaces = dest.famousPlaces.some(
            (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
          );
          const matchVibes = dest.vibes.some((v) => v.toLowerCase().includes(q));

          if (!matchName && !matchCountry && !matchTagline && !matchPlaces && !matchVibes) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'budget') {
          return a.averageDailyCostUsd - b.averageDailyCostUsd;
        }
        if (sortBy === 'nearest') {
          const distA = calculateDistanceKm(userLocation.lat, userLocation.lng, a.coordinates.lat, a.coordinates.lng);
          const distB = calculateDistanceKm(userLocation.lat, userLocation.lng, b.coordinates.lat, b.coordinates.lng);
          return distA - distB;
        }
        if (sortBy === 'furthest') {
          const distA = calculateDistanceKm(userLocation.lat, userLocation.lng, a.coordinates.lat, a.coordinates.lng);
          const distB = calculateDistanceKm(userLocation.lat, userLocation.lng, b.coordinates.lat, b.coordinates.lng);
          return distB - distA;
        }
        return 0; // featured default
      });
  }, [destinations, selectedContinent, selectedVibe, searchQuery, sortBy, userLocation]);

  const resetFilters = () => {
    onSelectContinent('All');
    setSelectedVibe('All');
    onSearchChange('');
    setSortBy('featured');
  };

  return (
    <section id="destinations" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Sanctuary Portfolios</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight">
            Explore Destinations
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base mt-2 max-w-xl font-light">
            Each sanctuary is profiled with live satellite weather, calculated distance from your departure city, notable landmarks, and tailor-made AI journeys.
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl glass-panel border border-white/10 text-xs text-neutral-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-neutral-900">Featured</option>
              <option value="nearest" className="bg-neutral-900">Nearest to You</option>
              <option value="furthest" className="bg-neutral-900">Furthest Away</option>
              <option value="budget" className="bg-neutral-900">Daily Budget</option>
              <option value="name" className="bg-neutral-900">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="mb-10 space-y-4">
        {/* Continents Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs text-neutral-500 uppercase font-semibold tracking-wider mr-2 hidden sm:inline">
            Region:
          </span>
          {continents.map((continent) => {
            const isSelected = selectedContinent === continent;
            return (
              <button
                key={continent}
                onClick={() => onSelectContinent(continent)}
                className={`px-4 py-2 rounded-full text-xs font-medium shrink-0 transition-all duration-200 ${
                  isSelected
                    ? 'bg-amber-400 text-neutral-950 font-semibold shadow-lg shadow-amber-400/20 scale-105'
                    : 'glass-panel text-neutral-300 hover:text-white hover:border-white/20'
                }`}
              >
                {continent}
              </button>
            );
          })}
        </div>

        {/* Vibes Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs text-neutral-500 uppercase font-semibold tracking-wider mr-2 hidden sm:inline">
            Atmosphere:
          </span>
          {vibes.map((vibe) => {
            const isSelected = selectedVibe === vibe;
            return (
              <button
                key={vibe}
                onClick={() => setSelectedVibe(vibe)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all duration-200 ${
                  isSelected
                    ? 'bg-white/15 text-amber-200 border border-amber-400/40'
                    : 'bg-white/5 text-neutral-400 hover:text-neutral-200 border border-transparent'
                }`}
              >
                {vibe}
              </button>
            );
          })}
        </div>

        {/* Results Counter & Active Filter Pills */}
        <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-white/5">
          <span>
            Showing <strong className="text-white">{filteredDestinations.length}</strong> of{' '}
            {destinations.length} destinations
          </span>

          {(selectedContinent !== 'All' || selectedVibe !== 'All' || searchQuery.trim()) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid of Destinations */}
      {filteredDestinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              userLocation={userLocation}
              isBookmarked={isBookmarked(destination.id)}
              onToggleBookmark={onToggleBookmark}
              onOpenDetail={onOpenDetail}
              tempUnit={tempUnit}
            />
          ))}
        </div>
      ) : (
        /* Empty State: Designed with care per instructions */
        <div className="py-20 px-6 rounded-3xl glass-panel border border-white/10 text-center max-w-lg mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif text-white font-medium mb-2">No Matching Destinations</h3>
          <p className="text-sm text-neutral-400 mb-6 font-light leading-relaxed">
            We couldn't find any destinations matching "{searchQuery}" with the selected region and atmosphere filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs transition"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </section>
  );
};
