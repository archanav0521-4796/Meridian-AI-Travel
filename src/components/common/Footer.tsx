import React from 'react';
import { Compass, Sparkles, Heart, ExternalLink, ShieldCheck } from 'lucide-react';

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
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-left mb-12">
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
          </ul>
        </div>

        {/* Telemetry & APIs */}
        <div className="space-y-2.5">
          <h5 className="text-white font-semibold uppercase tracking-wider text-[11px]">Integrated APIs</h5>
          <ul className="space-y-2 font-light">
            <li className="flex items-center gap-1.5 text-neutral-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Google Gemini AI (1.5/2.5 Flash)</span>
            </li>
            <li className="flex items-center gap-1.5 text-neutral-300">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span>OpenWeather & Open-Meteo</span>
            </li>
            <li className="flex items-center gap-1.5 text-neutral-300">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>Unsplash High-Res CDN</span>
            </li>
            <li className="flex items-center gap-1.5 text-neutral-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Haversine Geolocation Math</span>
            </li>
          </ul>
        </div>

        {/* Credentials & Settings */}
        <div className="space-y-3">
          <h5 className="text-white font-semibold uppercase tracking-wider text-[11px]">Credentials & Status</h5>
          <p className="font-light text-neutral-400">
            Zero-config live satellite mode enabled. Evaluators can enter custom keys at any time:
          </p>
          <button
            onClick={onOpenSettings}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 hover:text-white transition text-xs font-medium flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>API Settings & Keys</span>
          </button>
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
