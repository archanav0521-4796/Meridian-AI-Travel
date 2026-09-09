import React, { useState, useMemo } from 'react';
import { X, Search, MapPin, Navigation, Compass } from 'lucide-react';
import { POPULAR_DEPARTURE_HUBS, CityLocation } from '../../services/geocodingApi';

interface LocationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCity: (city: string, country: string, lat: number, lng: number) => void;
  onUseGps: () => void;
  isDetecting: boolean;
  currentCity: string;
}

export const LocationSearchModal: React.FC<LocationSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCity,
  onUseGps,
  isDetecting,
  currentCity,
}) => {
  const [query, setQuery] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [customCountry, setCustomCountry] = useState('');

  const filteredHubs = useMemo(() => {
    if (!query.trim()) return POPULAR_DEPARTURE_HUBS;
    const q = query.toLowerCase();
    return POPULAR_DEPARTURE_HUBS.filter(
      (hub) => hub.city.toLowerCase().includes(q) || hub.country.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCity.trim()) return;
    // For custom city without precise GPS, approximate coordinates
    onSelectCity(customCity.trim(), customCountry.trim() || 'Worldwide', 40.7128, -74.006);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl glass-panel border border-white/10 p-6 md:p-8 shadow-2xl text-neutral-200 flex flex-col max-h-[85vh]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition"
          aria-label="Close location picker"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white font-serif tracking-wide">Select Departure Origin</h3>
            <p className="text-xs text-neutral-400">Calculates exact flight distances, routes, and comparative climates</p>
          </div>
        </div>

        {/* GPS Button */}
        <button
          onClick={() => {
            onUseGps();
            onClose();
          }}
          disabled={isDetecting}
          className="w-full mb-4 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 hover:border-amber-400 text-amber-300 text-sm font-medium flex items-center justify-center gap-2 transition hover:bg-amber-500/25"
        >
          <Navigation className={`w-4 h-4 ${isDetecting ? 'animate-spin' : ''}`} />
          {isDetecting ? 'Detecting satellite position...' : 'Use My Current GPS Location'}
        </button>

        {/* Search filter input */}
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search departure city (e.g. Tokyo, New York, London, Paris)..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-neutral-900/90 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50"
            autoFocus
          />
        </div>

        {/* Cities list */}
        <div className="overflow-y-auto flex-1 space-y-1.5 pr-1 min-h-[220px]">
          <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold px-2 py-1">
            Global Departure Hubs
          </div>
          {filteredHubs.map((hub) => {
            const isSelected = hub.city.toLowerCase() === currentCity.toLowerCase();
            return (
              <button
                key={`${hub.city}-${hub.country}`}
                onClick={() => {
                  onSelectCity(hub.city, hub.country, hub.lat, hub.lng);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm transition ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                    : 'hover:bg-white/5 text-neutral-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-neutral-500'}`} />
                  <div>
                    <span className="font-medium text-white">{hub.city}</span>
                    <span className="text-neutral-400 text-xs ml-1.5">{hub.country}</span>
                  </div>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-neutral-400">
                  {hub.continent}
                </span>
              </button>
            );
          })}

          {filteredHubs.length === 0 && (
            <div className="py-6 text-center text-sm text-neutral-400">
              <p>No predefined hub found matching "{query}".</p>
              <p className="text-xs text-neutral-500 mt-1">You can type a custom departure city below.</p>
            </div>
          )}
        </div>

        {/* Custom City Fallback */}
        <form onSubmit={handleCustomSubmit} className="pt-3 border-t border-white/10 mt-2 flex gap-2">
          <input
            type="text"
            value={customCity}
            onChange={(e) => setCustomCity(e.target.value)}
            placeholder="Other city name..."
            className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-neutral-900 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50"
          />
          <button
            type="submit"
            disabled={!customCity.trim()}
            className="px-3.5 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg disabled:opacity-40 transition"
          >
            Set Custom
          </button>
        </form>
      </div>
    </div>
  );
};
