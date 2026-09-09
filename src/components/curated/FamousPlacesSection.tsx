import React, { useState } from 'react';
import { Star, Clock, Ticket, Sun, Sparkles, MapPin, ArrowUpRight } from 'lucide-react';
import { Destination, FamousPlace } from '../../types';
import { PlaceDetailModal } from '../places/PlaceDetailModal';

interface FamousPlacesSectionProps {
  destinations: Destination[];
  onOpenDestination: (dest: Destination) => void;
}

export const FamousPlacesSection: React.FC<FamousPlacesSectionProps> = ({
  destinations,
  onOpenDestination,
}) => {
  const [selectedPlace, setSelectedPlace] = useState<{ place: FamousPlace; destName: string } | null>(null);

  // Flatten the top iconic places from each destination
  const showcasePlaces = destinations.flatMap((d) =>
    d.famousPlaces.slice(0, 1).map((p) => ({
      place: p,
      destination: d,
    }))
  ).slice(0, 6);

  return (
    <section id="curated-places" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
      {/* Section Title */}
      <div className="text-left mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Wonders of Human Heritage</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight">
          Iconic Places & Sanctuaries
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base mt-2 max-w-2xl font-light leading-relaxed">
          Not merely a list of names, but fully contextualized sanctuaries curated with prime lighting hours, historical significance, entrance logistics, and insider advice.
        </p>
      </div>

      {/* Grid of Famous Places */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
        {showcasePlaces.map(({ place, destination }) => (
          <div
            key={place.id}
            onClick={() => setSelectedPlace({ place, destName: destination.name })}
            className="group rounded-3xl glass-card glass-card-hover overflow-hidden border border-white/10 flex flex-col justify-between cursor-pointer transition-all duration-300"
          >
            {/* Image Header */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
              <img
                src={place.imageUrl}
                alt={place.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11131a] via-black/20 to-transparent" />

              {/* Badges */}
              <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-amber-300 uppercase tracking-wider">
                  {place.category}
                </span>

                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs text-white">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="font-bold">{place.rating}</span>
                </div>
              </div>

              {/* Destination Tag at Bottom */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-neutral-300">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {destination.name}, {destination.country}
                </span>
                <span className="text-[11px] text-neutral-400">{place.entryFee}</span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-xl font-serif text-white group-hover:text-amber-200 transition-colors mb-1">
                  {place.name}
                </h4>
                <p className="text-xs text-neutral-400 italic mb-2 line-clamp-1">
                  "{place.tagline}"
                </p>
                <p className="text-xs sm:text-sm text-neutral-300 font-light line-clamp-2 leading-relaxed">
                  {place.description}
                </p>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5 text-[11px] text-neutral-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  {place.suggestedDuration}
                </span>
                <span className="flex items-center gap-1">
                  <Sun className="w-3 h-3 text-sky-400" />
                  {place.bestTimeOfDay.split('(')[0]}
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDestination(destination);
                  }}
                  className="text-neutral-400 hover:text-white transition text-[11px]"
                >
                  View City Guide →
                </button>
                <span className="text-amber-300 font-semibold flex items-center gap-1">
                  Landmark Details <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Place Detail Spotlight Modal */}
      {selectedPlace && (
        <PlaceDetailModal
          place={selectedPlace.place}
          onClose={() => setSelectedPlace(null)}
          destinationName={selectedPlace.destName}
        />
      )}
    </section>
  );
};
