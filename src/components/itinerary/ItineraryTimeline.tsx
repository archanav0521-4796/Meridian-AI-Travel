import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
  Circle,
  Copy,
  Printer,
  Bookmark,
  Share2,
  Backpack,
  DollarSign,
  Compass,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GeneratedItinerary, Destination } from '../../types';
import { useToast } from '../common/Toast';

interface ItineraryTimelineProps {
  itinerary: GeneratedItinerary;
  destination: Destination;
  onSaveItinerary: (itinerary: GeneratedItinerary) => void;
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  itinerary,
  destination,
  onSaveItinerary,
}) => {
  const { showToast } = useToast();
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [completedActivities, setCompletedActivities] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'timeline' | 'packing' | 'budget'>('timeline');

  const toggleActivity = (actId: string) => {
    setCompletedActivities((prev) => {
      const next = { ...prev, [actId]: !prev[actId] };
      return next;
    });
  };

  // Calculate completion percentage
  const totalActivities = itinerary.days.reduce((acc, d) => acc + d.activities.length, 0);
  const completedCount = Object.values(completedActivities).filter(Boolean).length;
  const progressPercent = totalActivities > 0 ? Math.round((completedCount / totalActivities) * 100) : 0;

  const handleSave = () => {
    onSaveItinerary(itinerary);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#d4af37', '#f3e5ab', '#ffffff'],
    });
    showToast('Itinerary saved to My Trips', 'success');
  };

  const handleCopy = () => {
    let text = `${itinerary.title}\nDestination: ${itinerary.destinationName}, ${itinerary.country}\nDuration: ${itinerary.durationDays} Days | Style: ${itinerary.travelStyle}\n\n`;

    itinerary.days.forEach((day) => {
      text += `--- Day ${day.dayNumber}: ${day.theme} ---\n${day.summary}\n`;
      day.activities.forEach((act) => {
        text += `[${act.timeSlot} - ${act.time}] ${act.title}\n${act.description}\nCost: ${act.estimatedCost} | Tip: ${act.insiderTip || 'None'}\n\n`;
      });
    });

    navigator.clipboard.writeText(text);
    showToast('Full day-by-day plan copied to clipboard', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const currentDay = itinerary.days[activeDayIndex] || itinerary.days[0];

  return (
    <div className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-amber-500/20 relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-neutral-900/60 to-black/80">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini AI Orchestrated Journey</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
              {itinerary.title}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-light mt-1">
              {itinerary.durationDays} Days in {itinerary.destinationName} • {itinerary.travelStyle} • {itinerary.pace} Pace
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs transition flex items-center gap-1.5 shadow-lg shadow-amber-400/20"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save Itinerary</span>
            </button>

            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs font-medium transition flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Text</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs font-medium transition flex items-center gap-1.5"
              title="Print travel pass"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Progress Tracker Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Experience Progress:</span>
            <span className="text-amber-300 font-bold">{completedCount} of {totalActivities} Completed</span>
          </div>
          <div className="w-48 h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs: Timeline | Packing List | Budget */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
            activeTab === 'timeline'
              ? 'bg-white/15 text-amber-200 border border-amber-400/30 font-semibold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Day-by-Day Timeline</span>
        </button>

        <button
          onClick={() => setActiveTab('packing')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
            activeTab === 'packing'
              ? 'bg-white/15 text-amber-200 border border-amber-400/30 font-semibold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Backpack className="w-3.5 h-3.5" />
          <span>Packing Checklist ({itinerary.packingList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('budget')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
            activeTab === 'budget'
              ? 'bg-white/15 text-amber-200 border border-amber-400/30 font-semibold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Budget & Tips</span>
        </button>
      </div>

      {/* Tab 1: Day-by-Day Timeline */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          {/* Day Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {itinerary.days.map((day, idx) => (
              <button
                key={day.dayNumber}
                onClick={() => setActiveDayIndex(idx)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-semibold shrink-0 transition-all ${
                  activeDayIndex === idx
                    ? 'bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/20 scale-105'
                    : 'glass-panel text-neutral-300 hover:text-white border border-white/10'
                }`}
              >
                Day {day.dayNumber}: {day.theme.split('&')[0]}
              </button>
            ))}
          </div>

          {/* Current Day Header */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-baseline justify-between gap-4">
              <h4 className="font-serif text-xl sm:text-2xl text-white font-normal">
                Day {currentDay.dayNumber}: {currentDay.theme}
              </h4>
              <span className="text-xs font-mono text-neutral-400 uppercase shrink-0">
                {currentDay.activities.length} Milestones
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 font-light mt-1">
              {currentDay.summary}
            </p>
          </div>

          {/* Activities Day Cards */}
          <div className="space-y-4 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10">
            {currentDay.activities.map((act) => {
              const isChecked = !!completedActivities[act.id];

              return (
                <div
                  key={act.id}
                  className={`relative pl-14 transition-all duration-300 ${
                    isChecked ? 'opacity-65' : 'opacity-100'
                  }`}
                >
                  {/* Timeline Node Checkbox */}
                  <button
                    onClick={() => toggleActivity(act.id)}
                    className={`absolute left-3.5 top-5 -translate-x-1/2 w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                      isChecked
                        ? 'bg-amber-400 border-amber-300 text-neutral-950'
                        : 'bg-neutral-900 border-white/30 text-neutral-400 hover:border-amber-400'
                    }`}
                    title={isChecked ? 'Mark as pending' : 'Mark as completed'}
                  >
                    {isChecked ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-3.5 h-3.5" />}
                  </button>

                  {/* Activity Card */}
                  <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[11px] font-semibold uppercase tracking-wider">
                          {act.timeSlot}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-neutral-400">
                          <Clock className="w-3 h-3 text-neutral-500" />
                          <span>{act.time}</span>
                        </div>
                      </div>

                      <span className="text-xs font-mono text-emerald-300 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/20 self-start sm:self-auto">
                        Est. {act.estimatedCost}
                      </span>
                    </div>

                    <div>
                      <h5 className={`text-base font-semibold text-white ${isChecked ? 'line-through text-neutral-400' : ''}`}>
                        {act.title}
                      </h5>
                      <p className="text-xs sm:text-sm text-neutral-300 font-light mt-1 leading-relaxed">
                        {act.description}
                      </p>
                    </div>

                    {/* Insider & Transit Tips */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs text-neutral-300">
                      {act.transportTip && (
                        <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
                          <Compass className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          <span className="text-[11px] truncate">Transit: {act.transportTip}</span>
                        </div>
                      )}

                      {act.insiderTip && (
                        <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/15 text-amber-200">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="text-[11px] truncate">Tip: {act.insiderTip}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Packing Checklist */}
      {activeTab === 'packing' && (
        <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
          <h4 className="font-serif text-xl text-white">Curated Packing Checklist for {itinerary.destinationName}</h4>
          <p className="text-xs text-neutral-400">
            Based on current seasonal forecasts and your travel pace.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {itinerary.packingList.map((item, idx) => (
              <label
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 cursor-pointer transition text-xs text-neutral-200"
              >
                <input
                  type="checkbox"
                  className="rounded border-white/20 bg-neutral-900 text-amber-400 focus:ring-0 cursor-pointer"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Budget & Notes */}
      {activeTab === 'budget' && (
        <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-6">
          <div>
            <h4 className="font-serif text-xl text-white">Estimated Investment & Important Notes</h4>
            <p className="text-xs text-neutral-400 mt-1">
              Estimated total for {itinerary.durationDays} days: approximately{' '}
              <strong className="text-amber-300 text-base">${itinerary.estimatedTotalBudgetUsd} USD</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[11px] text-neutral-400 block uppercase">Lodging Estimate</span>
              <span className="text-lg font-bold text-white mt-1 block">
                ${Math.round(itinerary.estimatedTotalBudgetUsd * 0.55)} USD
              </span>
              <span className="text-[10px] text-neutral-500">Boutique / 4-5 Star Stays</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[11px] text-neutral-400 block uppercase">Culinary & Dining</span>
              <span className="text-lg font-bold text-white mt-1 block">
                ${Math.round(itinerary.estimatedTotalBudgetUsd * 0.3)} USD
              </span>
              <span className="text-[10px] text-neutral-500">Bistros & Tasting Menus</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[11px] text-neutral-400 block uppercase">Transit & Passes</span>
              <span className="text-lg font-bold text-white mt-1 block">
                ${Math.round(itinerary.estimatedTotalBudgetUsd * 0.15)} USD
              </span>
              <span className="text-[10px] text-neutral-500">Private & Public Transit</span>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Essential Local Advisories
            </h5>
            <ul className="space-y-2 text-xs text-neutral-300 font-light list-disc list-inside">
              {itinerary.importantNotes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
