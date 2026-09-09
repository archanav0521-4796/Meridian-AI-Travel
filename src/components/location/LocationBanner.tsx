import React from 'react';
import { MapPin, Navigation, Sparkles, X, ChevronRight } from 'lucide-react';
import { UserLocation } from '../../types';

interface LocationBannerProps {
  location: UserLocation;
  isDetecting: boolean;
  onRequestGps: () => void;
  onOpenSelector: () => void;
  onDismiss: () => void;
}

export const LocationBanner: React.FC<LocationBannerProps> = ({
  location,
  isDetecting,
  onRequestGps,
  onOpenSelector,
  onDismiss,
}) => {
  return (
    <div className="relative z-20 bg-gradient-to-r from-amber-950/40 via-neutral-900/90 to-neutral-900/80 border-b border-amber-500/20 backdrop-blur-md px-4 py-2.5 text-xs text-neutral-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-amber-500/20 text-amber-400">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-neutral-400">Departing from: </span>
            <strong className="text-amber-200 font-medium">
              {location.city}
              {location.country ? `, ${location.country}` : ''}
            </strong>
            <span className="hidden md:inline text-neutral-500 ml-2">
              (Live distances, flight hours & weather comparative)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {location.status === 'prompt' && (
            <button
              onClick={onRequestGps}
              disabled={isDetecting}
              className="px-3 py-1 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 font-medium flex items-center gap-1.5 transition"
            >
              <Navigation className={`w-3 h-3 ${isDetecting ? 'animate-spin' : ''}`} />
              {isDetecting ? 'Detecting...' : 'Auto-Detect My GPS'}
            </button>
          )}

          <button
            onClick={onOpenSelector}
            className="px-2.5 py-1 rounded-lg hover:bg-white/10 text-neutral-200 font-medium flex items-center gap-1 transition"
          >
            Change City
            <ChevronRight className="w-3 h-3 text-neutral-400" />
          </button>

          <button
            onClick={onDismiss}
            className="p-1 text-neutral-400 hover:text-white rounded transition"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
