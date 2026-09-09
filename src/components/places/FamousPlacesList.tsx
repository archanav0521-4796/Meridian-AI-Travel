import React, { useState } from 'react';
import { Star, Clock, Ticket, Sun, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { FamousPlace } from '../../types';
import { PlaceDetailModal } from './PlaceDetailModal';

interface FamousPlacesListProps {
  places: FamousPlace[];
  destinationName: string;
}

export const FamousPlacesList: React.FC<FamousPlacesListProps> = ({
  places,
  destinationName,
}) => {
  const [selectedPlace, setSelectedPlace] = useState<FamousPlace | null>(null);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {places.map((place) => (
          <div
            key={place.id}
            onClick={() => setSelectedPlace(place)}
            className="group glass-card glass-card-hover rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between cursor-pointer transition-all duration-300"
          >
            {/* Visual Thumbnail Banner */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900">
              <img
                src={place.imageUrl}
                alt={place.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11131a] via-black/20 to-transparent" />

              {/* Category Pill & Rating Badge */}
              <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-amber-300 uppercase tracking-wider">
                  {place.category}
                </span>

                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs text-white">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="font-bold">{place.rating}</span>
                </div>
              </div>

              {/* Title Overlay at bottom of image */}
              <div className="absolute bottom-3 left-4 right-4">
                <h4 className="text-xl font-serif font-normal text-white drop-shadow group-hover:text-amber-200 transition-colors">
                  {place.name}
                </h4>
              </div>
            </div>

            {/* Card Information Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-left">
              <div>
                <p className="text-xs text-neutral-400 font-light italic mb-2">
                  "{place.tagline}"
                </p>
                <p className="text-xs sm:text-sm text-neutral-300 font-light line-clamp-2 leading-relaxed">
                  {place.description}
                </p>
              </div>

              {/* Quick Specs Chips */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-300 pt-2 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>{place.suggestedDuration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Ticket className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">{place.entryFee}</span>
                </div>
              </div>

              {/* Highlights snippet */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {place.highlights.slice(0, 2).map((h, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-neutral-400 font-medium"
                  >
                    • {h}
                  </span>
                ))}
              </div>

              {/* Footer CTA */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-neutral-400 text-[11px] flex items-center gap-1">
                  <Sun className="w-3 h-3 text-sky-400" />
                  {place.bestTimeOfDay}
                </span>
                <span className="text-amber-300 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Explore Landmark <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Place Spotlight Modal */}
      <PlaceDetailModal
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
        destinationName={destinationName}
      />
    </div>
  );
};
