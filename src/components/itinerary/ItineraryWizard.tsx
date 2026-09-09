import React, { useState } from 'react';
import { Sparkles, Calendar, Compass, Clock, Check, ArrowRight } from 'lucide-react';
import { Destination, GeneratedItinerary } from '../../types';
import { generateDayByDayItinerary } from '../../services/geminiApi';
import { ItineraryTimeline } from './ItineraryTimeline';

interface ItineraryWizardProps {
  destination: Destination;
  onSaveItinerary: (itinerary: GeneratedItinerary) => void;
}

export const ItineraryWizard: React.FC<ItineraryWizardProps> = ({
  destination,
  onSaveItinerary,
}) => {
  const [days, setDays] = useState(3);
  const [style, setStyle] = useState('Balanced & Cultural');
  const [pace, setPace] = useState('Moderate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentItinerary, setCurrentItinerary] = useState<GeneratedItinerary | null>(null);

  const styleOptions = [
    { label: 'Balanced & Cultural', desc: 'Historic landmarks, scenic strolls, and local dining' },
    { label: 'Luxury & Gastronomy', desc: 'Fine dining tasting menus, wine, and boutique salons' },
    { label: 'Romantic Escapes', desc: 'Sunset vistas, intimate cafes, and tranquil viewpoints' },
    { label: 'High Adventure & Nature', desc: 'Coastal walks, alpine ridges, and outdoor thrills' },
  ];

  const paceOptions = [
    { label: 'Relaxed & Mindful', desc: '1-2 slow experiences per day with plenty of leisure' },
    { label: 'Moderate', desc: 'Well-curated rhythm of iconic sights and downtime' },
    { label: 'Intensive', desc: 'Maximizing every daylight hour to see it all' },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateDayByDayItinerary(destination, days, style, pace);
      setCurrentItinerary(result);
    } catch (err) {
      console.error('Failed to generate itinerary:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Wizard Form Card */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/10 space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Itinerary Architect</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
            Formulate Your Bespoke Plan for {destination.name}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1">
            Configure your journey length and vibe. Our Gemini AI engine synthesizes day-by-day schedules with timing, budgets, and transit advice.
          </p>
        </div>

        {/* 1. Trip Duration */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-3">
            1. Trip Duration (Days)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[2, 3, 5, 7].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDays(d)}
                className={`py-3 px-4 rounded-2xl border text-center transition-all ${
                  days === d
                    ? 'bg-amber-400 text-neutral-950 font-bold border-amber-300 shadow-lg shadow-amber-400/20'
                    : 'bg-white/5 border-white/10 text-neutral-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-lg block">{d} Days</span>
                <span className="text-[10px] block opacity-80 font-normal">
                  {d === 2 ? 'Weekend Getaway' : d === 3 ? 'Classic Discovery' : d === 5 ? 'Immersive Stay' : 'Grand Grand Tour'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Travel Style */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-3">
            2. Travel Style & Vibe
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {styleOptions.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setStyle(opt.label)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  style === opt.label
                    ? 'bg-white/15 border-amber-400/50 text-white'
                    : 'bg-white/5 border-white/10 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">{opt.label}</span>
                  {style === opt.label && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <p className="text-[11px] text-neutral-400 font-light mt-1">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Travel Pace */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-3">
            3. Journey Pace
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {paceOptions.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setPace(opt.label)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  pace === opt.label
                    ? 'bg-white/15 border-amber-400/50 text-white'
                    : 'bg-white/5 border-white/10 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">{opt.label}</span>
                  {pace === opt.label && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <p className="text-[10px] text-neutral-400 font-light mt-1">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-bold text-sm tracking-wide transition shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-neutral-950 border-t-transparent animate-spin" />
                <span>Orchestrating {days}-Day Visual Plan with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-neutral-950" />
                <span>Generate {days}-Day Visual Itinerary</span>
                <ArrowRight className="w-4 h-4 text-neutral-950" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Render Generated Itinerary Result (Real Day-by-Day Plan) */}
      {currentItinerary && (
        <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <ItineraryTimeline
            itinerary={currentItinerary}
            destination={destination}
            onSaveItinerary={onSaveItinerary}
          />
        </div>
      )}
    </div>
  );
};
