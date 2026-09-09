import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Search, ArrowDown, Sparkles, MapPin, Film } from 'lucide-react';
import { Continent } from '../../types';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectContinent: (c: Continent) => void;
  selectedContinent: Continent;
}

const VIDEO_SCENES = [
  {
    id: 'coastal',
    title: 'Coastal Horizons',
    src: `${import.meta.env.BASE_URL}videos/hero.mp4`,
    type: 'video/mp4',
    badge: '4K Ocean Waves',
  },
  {
    id: 'sunset',
    title: 'River Sunset Sanctuary',
    src: `${import.meta.env.BASE_URL}videos/hero.webm`,
    type: 'video/webm',
    badge: '1080p Sunset Glow',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  onSelectContinent,
  selectedContinent,
}) => {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Guarantee browser autoplay by programmatically setting muted before play
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Autoplay prevented by browser, click play to start:', err);
            setIsPlaying(false);
          });
      }
    }
  }, [activeSceneIndex]);

  // Toggle Video Play/Pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
      } else {
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  // Ambient Ocean / Nature sound synthesizer via Web Audio API
  // Ensures sound toggle works 100% reliably in all browsers without broken MP3 links!
  const toggleAudioAmbiance = () => {
    if (isMuted) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!audioContextRef.current) {
          const ctx = new AudioCtx();
          audioContextRef.current = ctx;

          // Generate pink noise for soft ocean surf
          const bufferSize = ctx.sampleRate * 2;
          const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
            b6 = white * 0.115926;
          }

          const whiteNoise = ctx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;
          whiteNoise.loop = true;

          // Gentle low-pass filter
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(450, ctx.currentTime);

          // Subtle LFO for ocean wave swell
          const lfo = ctx.createOscillator();
          lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // one swell every 8s
          const lfoGain = ctx.createGain();
          lfoGain.gain.setValueAtTime(180, ctx.currentTime);
          lfo.connect(lfoGain);
          lfoGain.connect(filter.frequency);
          lfo.start();

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gainNodeRef.current = gain;

          whiteNoise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          whiteNoise.start();
        } else if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }

        if (gainNodeRef.current && audioContextRef.current) {
          gainNodeRef.current.gain.setTargetAtTime(0.3, audioContextRef.current.currentTime, 0.5);
        }
        setIsMuted(false);
      } catch (e) {
        console.warn('Audio context creation blocked by browser policy:', e);
      }
    } else {
      if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0.001, audioContextRef.current.currentTime, 0.5);
      }
      setIsMuted(true);
    }
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const continents: Continent[] = ['All', 'Europe', 'Asia', 'Americas', 'Africa', 'Oceania'];

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-black">
      {/* Background Video Layer with Graceful Fallback */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          key={VIDEO_SCENES[activeSceneIndex].src}
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000 ease-out"
        >
          <source
            src={VIDEO_SCENES[activeSceneIndex].src}
            type={VIDEO_SCENES[activeSceneIndex].type}
          />
          {/* Direct relative fallbacks */}
          <source src="./videos/hero.mp4" type="video/mp4" />
          <source src="./videos/hero.webm" type="video/webm" />
        </video>

        {/* Sophisticated Editorial Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-[#090a0f]" />
      </div>

      {/* Video Interaction Controls in Top Right */}
      <div className="absolute top-6 right-4 sm:top-8 sm:right-6 z-20 flex items-center gap-2">
        {/* Live Looping Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-xs text-neutral-300">
          <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'}`} />
          <span className="text-[11px] font-medium tracking-wide">
            {isPlaying ? 'Looping Video' : 'Video Paused'}
          </span>
        </div>

        {/* Scene Switcher */}
        <button
          onClick={() => setActiveSceneIndex((prev) => (prev + 1) % VIDEO_SCENES.length)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/40 hover:bg-black/70 text-neutral-300 hover:text-white border border-white/10 backdrop-blur-md text-xs font-medium transition group"
          title={`Switch Scene: currently ${VIDEO_SCENES[activeSceneIndex].title}`}
          aria-label="Switch cinematic background video scene"
        >
          <Film className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
          <span className="hidden sm:inline">{VIDEO_SCENES[activeSceneIndex].title}</span>
          <span className="sm:hidden">Scene</span>
        </button>

        {/* Play/Pause Toggle */}
        <button
          onClick={togglePlay}
          className="p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-neutral-300 hover:text-white border border-white/10 backdrop-blur-md transition"
          title={isPlaying ? 'Pause video' : 'Play video'}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        {/* Ambient Sound Toggle */}
        <button
          onClick={toggleAudioAmbiance}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full border backdrop-blur-md text-xs font-medium transition ${
            !isMuted
              ? 'bg-amber-500/20 text-amber-200 border-amber-500/40'
              : 'bg-black/40 text-neutral-300 border-white/10 hover:text-white'
          }`}
          title={isMuted ? 'Turn on ambient sound' : 'Mute ambient sound'}
          aria-label={isMuted ? 'Turn on ambient sound' : 'Mute ambient sound'}
        >
          {!isMuted ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{!isMuted ? 'Ambient Ocean' : 'Sound'}</span>
        </button>
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
            <span className="block text-2xl font-serif text-white">21</span>
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
