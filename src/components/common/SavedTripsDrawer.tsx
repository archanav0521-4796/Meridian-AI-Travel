import React, { useState } from 'react';
import { X, Bookmark, Trash2, Calendar, MapPin, ArrowRight, Heart, Sparkles } from 'lucide-react';
import { Destination, GeneratedItinerary } from '../../types';
import { ItineraryTimeline } from '../itinerary/ItineraryTimeline';

interface SavedTripsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedDestinations: Destination[];
  savedItineraries: GeneratedItinerary[];
  onOpenDestination: (dest: Destination) => void;
  onDeleteItinerary: (id: string) => void;
  onSaveItinerary: (itinerary: GeneratedItinerary) => void;
}

export const SavedTripsDrawer: React.FC<SavedTripsDrawerProps> = ({
  isOpen,
  onClose,
  bookmarkedDestinations,
  savedItineraries,
  onOpenDestination,
  onDeleteItinerary,
  onSaveItinerary,
}) => {
  const [selectedItinerary, setSelectedItinerary] = useState<GeneratedItinerary | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl h-full glass-panel border-l border-white/10 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl text-left">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Bookmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-white font-medium">Saved Journeys & Favorites</h3>
                <p className="text-xs text-neutral-400">
                  {bookmarkedDestinations.length} Bookmarks • {savedItineraries.length} Generated Plans
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition"
              aria-label="Close saved trips"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Modal Detail View for a Saved Itinerary */}
          {selectedItinerary ? (
            <div className="space-y-4">
              <button
                onClick={() => setSelectedItinerary(null)}
                className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 font-medium mb-2"
              >
                ← Back to Saved List
              </button>

              <ItineraryTimeline
                itinerary={selectedItinerary}
                destination={
                  bookmarkedDestinations.find((d) => d.id === selectedItinerary.destinationId) ||
                  ({
                    id: selectedItinerary.destinationId,
                    name: selectedItinerary.destinationName,
                    country: selectedItinerary.country,
                  } as any)
                }
                onSaveItinerary={onSaveItinerary}
              />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Section 1: Generated Itineraries */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Saved AI Itineraries
                </h4>

                {savedItineraries.length > 0 ? (
                  <div className="space-y-3">
                    {savedItineraries.map((itin) => (
                      <div
                        key={itin.id}
                        className="p-4 rounded-2xl glass-card border border-white/10 flex items-center justify-between gap-4 hover:border-amber-400/40 transition group cursor-pointer"
                        onClick={() => setSelectedItinerary(itin)}
                      >
                        <div>
                          <h5 className="text-sm font-semibold text-white group-hover:text-amber-200 transition">
                            {itin.title}
                          </h5>
                          <p className="text-xs text-neutral-400 mt-0.5">
                            {itin.durationDays} Days • {itin.travelStyle} • Est. ${itin.estimatedTotalBudgetUsd} USD
                          </p>
                          <span className="text-[10px] text-neutral-500 block mt-1">
                            Generated on {new Date(itin.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteItinerary(itin.id);
                            }}
                            className="p-2 text-neutral-500 hover:text-rose-400 rounded-lg hover:bg-white/5 transition"
                            title="Delete plan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 group-hover:text-amber-300 transition" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500 italic p-3 rounded-xl bg-white/5 border border-white/5">
                    No custom itineraries saved yet. Open any destination and click "AI Itinerary Planner" to formulate a day-by-day plan!
                  </p>
                )}
              </div>

              {/* Section 2: Bookmarked Destinations */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  Bookmarked Destinations
                </h4>

                {bookmarkedDestinations.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {bookmarkedDestinations.map((dest) => (
                      <div
                        key={dest.id}
                        onClick={() => {
                          onOpenDestination(dest);
                          onClose();
                        }}
                        className="rounded-2xl glass-card overflow-hidden border border-white/10 hover:border-amber-400/40 cursor-pointer transition group"
                      >
                        <div className="h-28 w-full overflow-hidden relative">
                          <img
                            src={dest.heroImage}
                            alt={dest.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-3 right-3">
                            <h5 className="font-serif text-sm font-semibold text-white group-hover:text-amber-200">
                              {dest.name}
                            </h5>
                            <span className="text-[11px] text-neutral-300">{dest.country}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500 italic p-3 rounded-xl bg-white/5 border border-white/5">
                    No destinations bookmarked yet. Click the heart icon on any card to add it here.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
