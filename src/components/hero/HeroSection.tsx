import React, { useState, useRef, useEffect } from 'react';
import { Search, ArrowDown, Sparkles, MapPin } from 'lucide-react';
import { Continent } from '../../types';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectContinent: (c: Continent) => void;
  selectedContinent: Continent;
  totalDestinations?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  onSelectContinent,
  selectedContinent,
  totalDestinations = 30,
}) => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const videoRef1 = useRef<HTMLVideoElement | null>(null);
  const videoRef2 = useRef<HTMLVideoElement | null>(null);

  // Guarantee browser autoplay for both videos
  useEffect(() => {
    [videoRef1.current, videoRef2.current].forEach((video) => {
      if (video) {
        video.defaultMuted = true;
        video.muted = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Autoplay prevented by browser:', err);
          });
        }
      }
    });
  }, []);

  // Seamlessly cycle between both looping videos every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVideoIndex((prev) => (prev === 0 ? 1 : 0));
    }, 10000); // 10-second alternating loop

    return () => clearInterval(interval);
  }, []);

  const continents: Continent[] = ['All', 'India', 'Asia', 'Europe', 'Americas', 'Africa', 'Oceania'];

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-black">
      {/* Background Video Layer with 10-Second Alternating Cross-Fade */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        {/* Looping Scene 1: Coastal Horizons */}
        <video
          ref={videoRef1}
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop"
          className={`absolute inset-0 w-full h-full object-cover scale-105 transition-opacity duration-1000 ease-in-out ${
            activeVideoIndex === 0 ? 'opacity-60 z-1' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <source src={`${import.meta.env.BASE_URL}videos/hero.mp4`} type="video/mp4" />
          <source src="./videos/hero.mp4" type="video/mp4" />
        </video>

        {/* Looping Scene 2: Golden Sunset */}
        <video
          ref={videoRef2}
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1920&auto=format&fit=crop"
          className={`absolute inset-0 w-full h-full object-cover scale-105 transition-opacity duration-1000 ease-in-out ${
            activeVideoIndex === 1 ? 'opacity-60 z-1' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <source src={`${import.meta.env.BASE_URL}videos/hero.webm`} type="video/webm" />
          <source src="./videos/hero.webm" type="video/webm" />
        </video>

        {/* Sophisticated Editorial Vignette & Gradient Overlays */}
        <div className="absolute inset-0 z-2 bg-gradient-to-t from-[#090a0f] via-black/40 to-black/70 pointer-events-none" />
        <div className="absolute inset-0 z-2 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-[#090a0f] pointer-events-none" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-12 pb-16">
        {/* Subtle Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-neutral-300 text-xs tracking-wider uppercase font-medium mb-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Curated Global Expeditions • MERIDIAN</span>
        </div>


        {/* Hero Typography */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight text-white leading-[1.08] mb-6 drop-shadow-lg">
          The World, Unveiled With{' '}
          <span className="italic font-normal bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 bg-clip-text text-transparent">
            Restraint & Wonder
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-neutral-300 font-light leading-relaxed mb-10 drop-shadow">
          Immerse yourself in handpicked global destinations. Discover live real-time weather,
          explore famous sanctuaries, and let Gemini AI formulate bespoke day-by-day itineraries.
        </p>

        {/* Hero Integrated Search Pill */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-600/20 rounded-2xl blur-md opacity-60 group-hover:opacity-100 transition duration-500" />
            <div className="relative flex items-center bg-[#12141c]/90 border border-white/15 rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl">
              <div className="pl-4 pr-2 text-neutral-400">
                <Search className="w-5 h-5 text-amber-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search Kyoto, Paris, beaches, Alps, culture..."
                className="w-full py-3 bg-transparent text-sm sm:text-base text-white placeholder-neutral-400 focus:outline-none"
              />
              <a
                href="#destinations"
                className="shrink-0 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs sm:text-sm transition duration-200 flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                <span>Explore</span>
                <ArrowDown className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Quick Continent Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          {continents.map((continent) => {
            const isSelected = selectedContinent === continent;
            return (
              <button
                key={continent}
                onClick={() => {
                  onSelectContinent(continent);
                  const el = document.getElementById('destinations');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-3.5 py-1.5 rounded-full transition-all duration-200 font-medium ${
                  isSelected
                    ? 'bg-white text-neutral-950 shadow-md scale-105'
                    : 'bg-white/5 hover:bg-white/15 text-neutral-300 border border-white/10'
                }`}
              >
                {continent}
              </button>
            );
          })}
        </div>

        {/* Live Metrics Ticker */}
        <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
          <div className="px-3">
            <span className="block text-2xl font-serif text-white">{totalDestinations}</span>
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider">Curated Destinations</span>
          </div>

          <div className="px-3 border-l border-white/10">
            <span className="block text-2xl font-serif text-amber-200">Live</span>
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider">Satellite Weather</span>
          </div>
          <div className="px-3 border-l border-white/10">
            <span className="block text-2xl font-serif text-white">Gemini</span>
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider">AI Travel Concierge</span>
          </div>
          <div className="px-3 border-l border-white/10">
            <span className="block text-2xl font-serif text-amber-200">Day-by-Day</span>
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider">Visual Itineraries</span>
          </div>
        </div>
      </div>

      {/* Down Chevron Anchor */}
      <a
        href="#destinations"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 p-2 text-neutral-400 hover:text-white transition animate-bounce"
        aria-label="Scroll down to destinations"
      >
        <ArrowDown className="w-5 h-5" />
      </a>
    </section>
  );
};
