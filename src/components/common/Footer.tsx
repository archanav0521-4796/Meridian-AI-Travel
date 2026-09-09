import React from 'react';
import { Compass } from 'lucide-react';

interface FooterProps {
  onOpenSettings: () => void;
  onOpenLocation: () => void;
  onOpenChat: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSettings,
  onOpenLocation,
  onOpenChat,
}) => {
  return (
    <footer className="border-t border-white/10 bg-[#07080b] py-16 px-4 sm:px-6 lg:px-8 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-left mb-12">
        {/* Brand Col */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="font-display tracking-[0.25em] text-lg font-bold text-white uppercase block leading-none">
                MERIDIAN
              </span>
              <span className="text-[9px] tracking-[0.2em] text-amber-400/80 uppercase font-sans block mt-0.5">
                GLOBAL EXPEDITIONS & AI
              </span>
            </div>
          </div>
          <p className="font-light leading-relaxed text-neutral-400">
            A design-led luxury travel intelligence platform balancing restraint, typographic poise, real-time meteorological telemetry, and AI trip planning.
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-2.5">
          <h5 className="text-white font-semibold uppercase tracking-wider text-[11px]">Exploration</h5>
          <ul className="space-y-2 font-light">
            <li>
              <a href="#destinations" className="hover:text-amber-200 transition">Destinations Explorer</a>
            </li>
            <li>
              <a href="#curated-places" className="hover:text-amber-200 transition">Famous Sanctuaries</a>
            </li>
            <li>
              <button onClick={onOpenChat} className="hover:text-amber-200 transition text-left">
                Ask Gemini Concierge
              </button>
            </li>
            <li>
              <button onClick={onOpenLocation} className="hover:text-amber-200 transition text-left">
                Change Departure Origin
              </button>
            </li>
            <li>
              <button onClick={onOpenSettings} className="hover:text-amber-200 transition text-left">
                Concierge & API Settings
              </button>
            </li>
          </ul>
        </div>

        {/* Curated Portfolios */}
        <div className="space-y-2.5">
          <h5 className="text-white font-semibold uppercase tracking-wider text-[11px]">Curated Portfolios</h5>
          <ul className="space-y-2 font-light">
            <li>
              <a href="#destinations" className="hover:text-amber-200 transition">Asia & Subcontinent Expeditions</a>
            </li>
            <li>
              <a href="#destinations" className="hover:text-amber-200 transition">European Alpine & Coastal Retreats</a>
            </li>
            <li>
              <a href="#destinations" className="hover:text-amber-200 transition">Americas & Oceania Natural Wonders</a>
            </li>
            <li>
              <a href="#destinations" className="hover:text-amber-200 transition">Middle East & African Sanctuaries</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
        <p>
          Crafted with poise & precision • <strong className="text-neutral-300">MERIDIAN Travel Intelligence</strong>.
        </p>
      </div>
    </footer>
  );
};
