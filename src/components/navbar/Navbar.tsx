import React, { useState } from 'react';
import { Compass, MapPin, Bookmark, Settings, Menu, X, Sparkles, Globe } from 'lucide-react';
import { UserLocation } from '../../types';

interface NavbarProps {
  userLocation: UserLocation;
  onOpenLocationModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenSavedTrips: () => void;
  onOpenChat: () => void;
  savedCount: number;
  tempUnit: 'C' | 'F';
  onToggleTempUnit: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userLocation,
  onOpenLocationModal,
  onOpenSettingsModal,
  onOpenSavedTrips,
  onOpenChat,
  savedCount,
  tempUnit,
  onToggleTempUnit,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform duration-300">
            <Compass className="w-5 h-5 transition-transform duration-500 group-hover:rotate-45" />
          </div>
          <div className="text-left">
            <span className="font-display tracking-[0.25em] text-xl font-bold text-white uppercase block leading-none">
              VOYAGE
            </span>
            <span className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase font-sans block mt-1">
              designesthetics
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
          <a
            href="#destinations"
            className="hover:text-amber-200 transition-colors duration-200"
          >
            Destinations
          </a>
          <a
            href="#curated-places"
            className="hover:text-amber-200 transition-colors duration-200"
          >
            Famous Places
          </a>
          <button
            onClick={onOpenChat}
            className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors duration-200"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Concierge
          </button>
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Departure Location Pill */}
          <button
            onClick={onOpenLocationModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-neutral-200 transition hover:border-amber-400/40"
            title="Change departure location"
          >
            <MapPin className="w-3 h-3 text-amber-400" />
            <span className="max-w-[120px] truncate">{userLocation.city}</span>
          </button>

          {/* Unit Toggle */}
          <button
            onClick={onToggleTempUnit}
            className="px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-neutral-300 transition"
            title="Toggle °C / °F"
          >
            °{tempUnit}
          </button>

          {/* Saved Trips Drawer Trigger */}
          <button
            onClick={onOpenSavedTrips}
            className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition"
            title="Saved Itineraries & Bookmarks"
            aria-label="Saved Trips"
          >
            <Bookmark className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-[10px] font-bold text-neutral-950 flex items-center justify-center animate-pulse">
                {savedCount}
              </span>
            )}
          </button>

          {/* Settings Modal Trigger */}
          <button
            onClick={onOpenSettingsModal}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition"
            title="API Keys & Settings"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenSavedTrips}
            className="relative p-2 rounded-lg bg-white/5 text-neutral-300"
            aria-label="Saved trips"
          >
            <Bookmark className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-[10px] font-bold text-neutral-950 flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 text-neutral-300 hover:text-white"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <button
              onClick={() => {
                onOpenLocationModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs text-amber-300"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Departing from {userLocation.city}</span>
            </button>
            <button
              onClick={onToggleTempUnit}
              className="px-2 py-1 rounded bg-white/10 text-xs font-semibold text-neutral-200"
            >
              °{tempUnit}
            </button>
          </div>

          <a
            href="#destinations"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-neutral-200 hover:text-amber-300"
          >
            Explore Destinations
          </a>
          <a
            href="#curated-places"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-neutral-200 hover:text-amber-300"
          >
            Famous Places
          </a>
          <button
            onClick={() => {
              onOpenChat();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between py-2 text-sm text-amber-300 text-left font-medium"
          >
            <span>Ask AI Concierge</span>
            <Sparkles className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              onOpenSettingsModal();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between py-2 text-sm text-neutral-300 text-left"
          >
            <span>API & Credentials Configuration</span>
            <Settings className="w-4 h-4 text-neutral-400" />
          </button>
        </div>
      )}
    </header>
  );
};
