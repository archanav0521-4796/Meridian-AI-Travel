import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, Sparkles, CloudSun, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { useToast } from '../common/Toast';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [geminiKey, setGeminiKey] = useState('');
  const [weatherKey, setWeatherKey] = useState('');
  const [unsplashKey, setUnsplashKey] = useState('');

  useEffect(() => {
    if (isOpen) {
      setGeminiKey(localStorage.getItem('voyage_gemini_key') || import.meta.env.VITE_GEMINI_API_KEY || '');
      setWeatherKey(localStorage.getItem('voyage_openweather_key') || import.meta.env.VITE_OPENWEATHER_API_KEY || '');
      setUnsplashKey(localStorage.getItem('voyage_unsplash_key') || import.meta.env.VITE_UNSPLASH_ACCESS_KEY || '');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (geminiKey.trim()) {
      localStorage.setItem('voyage_gemini_key', geminiKey.trim());
    } else {
      localStorage.removeItem('voyage_gemini_key');
    }

    if (weatherKey.trim()) {
      localStorage.setItem('voyage_openweather_key', weatherKey.trim());
    } else {
      localStorage.removeItem('voyage_openweather_key');
    }

    if (unsplashKey.trim()) {
      localStorage.setItem('voyage_unsplash_key', unsplashKey.trim());
    } else {
      localStorage.removeItem('voyage_unsplash_key');
    }

    showToast('API Configuration saved successfully', 'success');
    onClose();
  };

  const handleClear = () => {
    localStorage.removeItem('voyage_gemini_key');
    localStorage.removeItem('voyage_openweather_key');
    localStorage.removeItem('voyage_unsplash_key');
    setGeminiKey('');
    setWeatherKey('');
    setUnsplashKey('');
    showToast('Keys cleared. Switched to live satellite & curated fallback engine.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl glass-panel border border-white/10 p-6 md:p-8 shadow-2xl text-neutral-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white font-serif tracking-wide">API Configuration</h3>
            <p className="text-xs text-neutral-400">Manage your Google Gemini, OpenWeather, and Unsplash credentials</p>
          </div>
        </div>

        <div className="my-4 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-start gap-2.5 text-xs text-emerald-300">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
          <div>
            <span className="font-semibold">Zero-Config Mode Active:</span> Even without entering custom keys, VOYAGE runs live with global satellite weather (Open-Meteo) and our curated intelligence engine. Adding keys unlocks live Gemini 1.5/2.5 Flash and official OpenWeather telemetry.
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-left">
          {/* Gemini Key */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Google Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-amber-400/80 hover:text-amber-300 flex items-center gap-1"
              >
                Get Free Key <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-neutral-900/90 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* OpenWeather Key */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
                <CloudSun className="w-3.5 h-3.5 text-sky-400" /> OpenWeather API Key
              </label>
              <a
                href="https://home.openweathermap.org/api_keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-sky-400/80 hover:text-sky-300 flex items-center gap-1"
              >
                Get Key <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <input
              type="password"
              value={weatherKey}
              onChange={(e) => setWeatherKey(e.target.value)}
              placeholder="e.g. 3b7c2..."
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-neutral-900/90 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Unsplash Key */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-purple-400" /> Unsplash Access Key
              </label>
              <a
                href="https://unsplash.com/developers"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-purple-400/80 hover:text-purple-300 flex items-center gap-1"
              >
                Get Key <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <input
              type="password"
              value={unsplashKey}
              onChange={(e) => setUnsplashKey(e.target.value)}
              placeholder="e.g. Access Key..."
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-neutral-900/90 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="pt-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-rose-300 transition"
            >
              Clear Keys
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-neutral-300 bg-white/5 hover:bg-white/10 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition shadow-lg shadow-amber-500/20"
              >
                Save Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
