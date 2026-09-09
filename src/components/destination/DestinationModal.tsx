import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  DollarSign,
  Languages,
  Clock,
  Plane,
  Heart,
  Sparkles,
  Utensils,
  BookOpen,
  CloudSun,
  Map as MapIcon,
  Compass,
  Navigation,
} from 'lucide-react';
import { Destination, UserLocation, GeneratedItinerary } from '../../types';
import { calculateDistanceKm, estimateFlightDuration } from '../../services/geocodingApi';
import { useWeather } from '../../hooks/useWeather';
import { FamousPlacesList } from '../places/FamousPlacesList';
import { WeatherView } from '../weather/WeatherView';
import { InteractiveMap } from '../map/InteractiveMap';
import { ItineraryWizard } from '../itinerary/ItineraryWizard';

interface DestinationModalProps {
  destination: Destination | null;
  onClose: () => void;
  userLocation: UserLocation;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onSaveItinerary: (itinerary: GeneratedItinerary) => void;
  tempUnit: 'C' | 'F';
  initialTab?: 'overview' | 'places' | 'weather' | 'map' | 'planner';
}

export const DestinationModal: React.FC<DestinationModalProps> = ({
  destination,
  onClose,
  userLocation,
  isBookmarked,
  onToggleBookmark,
  onSaveItinerary,
  tempUnit,
  initialTab = 'overview',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'places' | 'weather' | 'map' | 'planner'>(initialTab);

  if (!destination) return null;

  const distanceKm = calculateDistanceKm(
    userLocation.lat,
    userLocation.lng,
    destination.coordinates.lat,
    destination.coordinates.lng
  );
  const flightEstimate = estimateFlightDuration(distanceKm);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl rounded-none sm:rounded-3xl glass-panel border-0 sm:border border-white/10 shadow-2xl overflow-hidden min-h-screen sm:min-h-[85vh] flex flex-col my-auto">
        {/* Floating Close & Bookmark Top Controls */}
        <div className="absolute top-5 right-5 z-30 flex items-center gap-2">
          <button
            onClick={() => onToggleBookmark(destination.id)}
            className={`p-3 rounded-full backdrop-blur-md border transition-all ${
              isBookmarked
                ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-lg'
                : 'bg-black/60 text-white border-white/20 hover:text-amber-300'
            }`}
            aria-label="Bookmark"
          >
            <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={onClose}
            className="p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition backdrop-blur-md"
            aria-label="Close destination"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Visual Banner */}
        <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-neutral-900 shrink-0">
          <img
            src={destination.heroImage}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-black/40 to-black/30" />

          {/* Hero Overlay Text */}
          <div className="absolute bottom-6 left-6 right-6 text-left">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{destination.country} • {destination.continent}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal drop-shadow-md">
              {destination.name}
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 font-light mt-1 max-w-2xl italic">
              "{destination.tagline}"
            </p>
          </div>
        </div>

        {/* Quick Facts Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 p-4 sm:p-6 bg-white/5 border-y border-white/10 text-xs text-left">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/30">
            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="block text-neutral-400 text-[10px] uppercase">Best Months</span>
              <span className="text-white font-medium truncate block max-w-[150px]">{destination.bestTimeToVisit.split('(')[0]}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/30">
            <Plane className="w-4 h-4 text-sky-400 shrink-0" />
            <div>
              <span className="block text-neutral-400 text-[10px] uppercase">From {userLocation.city}</span>
              <span className="text-white font-medium">{distanceKm.toLocaleString()} km ({flightEstimate})</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/30">
            <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="block text-neutral-400 text-[10px] uppercase">Daily Budget</span>
              <span className="text-white font-medium">~${destination.averageDailyCostUsd} USD / day</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/30">
            <Languages className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <span className="block text-neutral-400 text-[10px] uppercase">Language & Currency</span>
              <span className="text-white font-medium">{destination.language} • {destination.currency}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="px-6 border-b border-white/10 flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-none bg-[#0e1017]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-3 text-xs sm:text-sm font-medium border-b-2 transition shrink-0 flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Overview & Culture</span>
          </button>

          <button
            onClick={() => setActiveTab('places')}
            className={`py-4 px-3 text-xs sm:text-sm font-medium border-b-2 transition shrink-0 flex items-center gap-2 ${
              activeTab === 'places'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Famous Places ({destination.famousPlaces.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('weather')}
            className={`py-4 px-3 text-xs sm:text-sm font-medium border-b-2 transition shrink-0 flex items-center gap-2 ${
              activeTab === 'weather'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <CloudSun className="w-4 h-4" />
            <span>Live Weather</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`py-4 px-3 text-xs sm:text-sm font-medium border-b-2 transition shrink-0 flex items-center gap-2 ${
              activeTab === 'map'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>Interactive Map & Route</span>
          </button>

          <button
            onClick={() => setActiveTab('planner')}
            className={`py-4 px-3 text-xs sm:text-sm font-medium border-b-2 transition shrink-0 flex items-center gap-2 ${
              activeTab === 'planner'
                ? 'border-amber-400 text-amber-300 font-semibold'
                : 'border-transparent text-amber-400/80 hover:text-amber-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Itinerary Planner</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 text-left max-w-4xl">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-3">
                  The Essence of {destination.name}
                </h3>
                <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed mb-4">
                  {destination.editorialBlurb}
                </p>
                <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
                  {destination.description}
                </p>
              </div>

              {/* Culinary Must-Tries */}
              <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
                  <Utensils className="w-4 h-4" />
                  <span>Culinary Specialties to Savor</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {destination.cuisineMustTry.map((dish, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs text-neutral-200 font-medium"
                    >
                      {dish}
                    </div>
                  ))}
                </div>
              </div>

              {/* Local Cultural Etiquette Tips */}
              <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
                <h4 className="font-serif text-xl text-white">Insider Etiquette & Navigation Wisdom</h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-300 font-light list-disc list-inside">
                  {destination.localTips.map((tip, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Route Map Call to Action Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Curated Landmark Route Available</span>
                  </div>
                  <h4 className="font-serif text-lg text-white font-normal">
                    Explore the {destination.famousPlaces.length}-Stop Discovery Circuit
                  </h4>
                  <p className="text-xs text-neutral-400 font-light mt-0.5">
                    Interactive route polyline, distance metrics, and transit times • Zero API key required
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('map')}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20 shrink-0 cursor-pointer"
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>View Route on Map</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: FAMOUS PLACES */}
          {activeTab === 'places' && (
            <FamousPlacesList
              places={destination.famousPlaces}
              destinationName={destination.name}
            />
          )}

          {/* TAB 3: LIVE WEATHER */}
          {activeTab === 'weather' && (
            <WeatherView
              destination={destination}
              userLocation={userLocation}
              tempUnit={tempUnit}
            />
          )}

          {/* TAB 4: INTERACTIVE MAP */}
          {activeTab === 'map' && (
            <div className="space-y-4">
              <InteractiveMap destination={destination} userLocation={userLocation} />
            </div>
          )}

          {/* TAB 5: AI ITINERARY PLANNER */}
          {activeTab === 'planner' && (
            <ItineraryWizard
              destination={destination}
              onSaveItinerary={onSaveItinerary}
            />
          )}
        </div>
      </div>
    </div>
  );
};
