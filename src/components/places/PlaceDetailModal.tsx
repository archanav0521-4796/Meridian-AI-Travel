import React from 'react';
import { X, Star, Clock, Ticket, Sun, CheckCircle2, MapPin, ExternalLink } from 'lucide-react';
import { FamousPlace } from '../../types';

interface PlaceDetailModalProps {
  place: FamousPlace | null;
  onClose: () => void;
  destinationName: string;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  place,
  onClose,
  destinationName,
}) => {
  if (!place) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-2xl text-left max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/15 transition backdrop-blur-md"
          aria-label="Close spotlight"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Photo Header */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-neutral-900 shrink-0">
          <img
            src={place.imageUrl}
            alt={place.name}
            onError={(e) => {
              e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Torii_path_with_lantern_at_Fushimi_Inari_Taisha_Shrine%2C_Kyoto%2C_Japan.jpg/1280px-Torii_path_with_lantern_at_Fushimi_Inari_Taisha_Shrine%2C_Kyoto%2C_Japan.jpg';
            }}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11131a] via-black/30 to-transparent" />

          {/* Badges on Header */}
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-neutral-950 font-semibold text-xs uppercase tracking-wider">
              {place.category}
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border border-white/15 text-xs text-white">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold">{place.rating}</span>
              <span className="text-neutral-400">({place.reviewCount.toLocaleString()} reviews)</span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div>
            <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
              {destinationName} Landmark Spotlight
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
              {place.name}
            </h3>
            <p className="text-sm text-neutral-300 font-light mt-1 italic">
              "{place.tagline}"
            </p>
          </div>

          <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
            {place.description}
          </p>

          {/* Quick Specifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] text-neutral-400 uppercase tracking-wider">Suggested Time</span>
                <span className="text-xs font-semibold text-white">{place.suggestedDuration}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
              <Ticket className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] text-neutral-400 uppercase tracking-wider">Admission Fee</span>
                <span className="text-xs font-semibold text-white">{place.entryFee}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
              <Sun className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] text-neutral-400 uppercase tracking-wider">Prime Lighting</span>
                <span className="text-xs font-semibold text-white">{place.bestTimeOfDay}</span>
              </div>
            </div>
          </div>

          {/* Must-See Highlights */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-3">
              Must-See Highlights & Features
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {place.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-neutral-200 font-light"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Coordinates & Map Link */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Coordinates: {place.coordinates.lat.toFixed(4)}, {place.coordinates.lng.toFixed(4)}
              </span>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${place.coordinates.lat},${place.coordinates.lng}`}
              target="_blank"
              rel="noreferrer"
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition"
            >
              Open Satellite View <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
