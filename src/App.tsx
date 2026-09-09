import React, { useState } from 'react';
import { DESTINATIONS } from './data/destinations';
import { Destination, Continent } from './types';
import { useGeolocation } from './hooks/useGeolocation';
import { useSavedTrips } from './hooks/useSavedTrips';
import { ToastProvider, useToast } from './components/common/Toast';
import { Navbar } from './components/navbar/Navbar';
import { LocationBanner } from './components/location/LocationBanner';
import { LocationSearchModal } from './components/location/LocationSearchModal';
import { ApiKeyModal } from './components/navbar/ApiKeyModal';
import { HeroSection } from './components/hero/HeroSection';
import { DestinationGrid } from './components/destination/DestinationGrid';
import { FamousPlacesSection } from './components/curated/FamousPlacesSection';
import { DestinationModal } from './components/destination/DestinationModal';
import { TravelChatbot } from './components/ai/TravelChatbot';
import { SavedTripsDrawer } from './components/common/SavedTripsDrawer';
import { Footer } from './components/common/Footer';
import { Sparkles } from 'lucide-react';

function AppContent() {
  const { showToast } = useToast();
  const {
    location,
    isDetecting,
    showLocationBanner,
    requestBrowserLocation,
    setManualLocation,
    dismissBanner,
  } = useGeolocation();

  const {
    bookmarkedIds,
    toggleBookmark,
    isBookmarked,
    savedItineraries,
    saveItinerary,
    deleteItinerary,
  } = useSavedTrips();

  // App UI state
  const [selectedContinent, setSelectedContinent] = useState<Continent>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDestination, setActiveDestination] = useState<Destination | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');

  const bookmarkedDestinations = DESTINATIONS.filter((d) => bookmarkedIds.includes(d.id));

  const handleToggleTempUnit = () => {
    setTempUnit((prev) => {
      const next = prev === 'C' ? 'F' : 'C';
      showToast(`Temperature unit switched to °${next}`, 'info');
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f4f4f6] flex flex-col justify-between selection:bg-amber-500/25 selection:text-amber-200">
      {/* Top Location Awareness Banner */}
      {showLocationBanner && (
        <LocationBanner
          location={location}
          isDetecting={isDetecting}
          onRequestGps={() => {
            requestBrowserLocation();
            showToast('Requesting satellite geolocation...', 'info');
          }}
          onOpenSelector={() => setIsLocationModalOpen(true)}
          onDismiss={dismissBanner}
        />
      )}

      {/* Main Glass Navbar */}
      <Navbar
        userLocation={location}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenSavedTrips={() => setIsSavedDrawerOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        savedCount={bookmarkedIds.length + savedItineraries.length}
        tempUnit={tempUnit}
        onToggleTempUnit={handleToggleTempUnit}
      />

      <main className="flex-1">
        {/* Requirement 01: Landing experience with looping background video */}
        <HeroSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectContinent={setSelectedContinent}
          selectedContinent={selectedContinent}
          totalDestinations={DESTINATIONS.length}
        />

        {/* Requirement 02 & 04 & 05: Destination explorer with live weather and distance */}
        <DestinationGrid
          destinations={DESTINATIONS}
          userLocation={location}
          selectedContinent={selectedContinent}
          onSelectContinent={setSelectedContinent}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isBookmarked={isBookmarked}
          onToggleBookmark={(id) => {
            toggleBookmark(id);
            showToast(
              isBookmarked(id) ? 'Removed from favorites' : 'Added to favorites',
              'info'
            );
          }}
          onOpenDetail={(dest) => setActiveDestination(dest)}
          tempUnit={tempUnit}
        />

        {/* Requirement 03: Famous places showcase */}
        <FamousPlacesSection
          destinations={DESTINATIONS}
          onOpenDestination={(dest) => setActiveDestination(dest)}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenLocation={() => setIsLocationModalOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Floating AI Concierge Chatbot Trigger */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-bold shadow-2xl shadow-amber-500/30 flex items-center gap-2.5 transition-all duration-300 hover:scale-105 group"
          aria-label="Open AI Concierge"
        >
          <Sparkles className="w-5 h-5 text-neutral-950 group-hover:rotate-12 transition-transform duration-300" />
          <span className="hidden sm:inline text-xs tracking-wider uppercase font-semibold">
            Ask AI Concierge
          </span>
        </button>
      )}

      {/* Requirement 07: Conversational AI Chatbot */}
      <TravelChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        activeDestination={activeDestination || undefined}
        allDestinations={DESTINATIONS}
      />

      {/* Requirement 02 & 08: Full Destination Page Modal with Itinerary Planning */}
      <DestinationModal
        destination={activeDestination}
        onClose={() => setActiveDestination(null)}
        userLocation={location}
        isBookmarked={activeDestination ? isBookmarked(activeDestination.id) : false}
        onToggleBookmark={toggleBookmark}
        onSaveItinerary={saveItinerary}
        tempUnit={tempUnit}
      />

      {/* Requirement 04: Location Search & Manual Selector */}
      <LocationSearchModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectCity={(city, country, lat, lng) => {
          setManualLocation(city, country, lat, lng);
          showToast(`Departure hub set to ${city}, ${country}`, 'success');
        }}
        onUseGps={() => {
          requestBrowserLocation();
          showToast('Acquiring GPS location...', 'info');
        }}
        isDetecting={isDetecting}
        currentCity={location.city}
      />

      {/* Settings & Credentials Modal */}
      <ApiKeyModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      {/* Saved Trips & Bookmarks Drawer */}
      <SavedTripsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        bookmarkedDestinations={bookmarkedDestinations}
        savedItineraries={savedItineraries}
        onOpenDestination={(dest) => setActiveDestination(dest)}
        onDeleteItinerary={(id) => {
          deleteItinerary(id);
          showToast('Itinerary removed', 'info');
        }}
        onSaveItinerary={saveItinerary}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
