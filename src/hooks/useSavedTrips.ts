import { useState, useEffect, useCallback } from 'react';
import { GeneratedItinerary } from '../types';

export function useSavedTrips() {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem('voyage_bookmarks');
        return saved ? JSON.parse(saved) : ['kyoto', 'paris'];
      } catch (e) {
        return ['kyoto', 'paris'];
      }
    }
    return ['kyoto', 'paris'];
  });

  const [savedItineraries, setSavedItineraries] = useState<GeneratedItinerary[]>(() => {
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem('voyage_saved_itineraries');
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const toggleBookmark = useCallback((destinationId: string) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(destinationId)
        ? prev.filter((id) => id !== destinationId)
        : [...prev, destinationId];
      localStorage.setItem('voyage_bookmarks', JSON.stringify(next));
      return next;
    });
  }, []);

  const saveItinerary = useCallback((itinerary: GeneratedItinerary) => {
    setSavedItineraries((prev) => {
      const filtered = prev.filter((item) => item.id !== itinerary.id);
      const next = [itinerary, ...filtered];
      localStorage.setItem('voyage_saved_itineraries', JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteItinerary = useCallback((itineraryId: string) => {
    setSavedItineraries((prev) => {
      const next = prev.filter((item) => item.id !== itineraryId);
      localStorage.setItem('voyage_saved_itineraries', JSON.stringify(next));
      return next;
    });
  }, []);

  return {
    bookmarkedIds,
    toggleBookmark,
    isBookmarked: (id: string) => bookmarkedIds.includes(id),
    savedItineraries,
    saveItinerary,
    deleteItinerary,
  };
}
