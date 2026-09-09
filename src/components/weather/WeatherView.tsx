import React from 'react';
import { Cloud, Droplets, Wind, Thermometer, RefreshCw, SunMedium, ShieldAlert, Sparkles } from 'lucide-react';
import { WeatherData, Destination, UserLocation } from '../../types';
import { useWeather } from '../../hooks/useWeather';

interface WeatherViewProps {
  destination: Destination;
  userLocation: UserLocation;
  tempUnit: 'C' | 'F';
}

export const WeatherView: React.FC<WeatherViewProps> = ({
  destination,
  userLocation,
  tempUnit,
}) => {
  const { weather, loading, refreshWeather } = useWeather(
    destination.coordinates.lat,
    destination.coordinates.lng
  );

  const { weather: originWeather } = useWeather(
    userLocation.lat,
    userLocation.lng
  );

  const formatTemp = (c?: number) => {
    if (c === undefined) return '--';
    if (tempUnit === 'F') {
      return `${Math.round((c * 9) / 5 + 32)}°F`;
    }
    return `${c}°C`;
  };

  const getPackingAdvice = (tempC?: number) => {
    if (tempC === undefined) return 'Pack versatile layers.';
    if (tempC >= 26) return 'High summer climate: pack light breathable linen, sunglasses, UV hats, and light sandals.';
    if (tempC >= 18) return 'Delightfully mild and pleasant: light shirts, chinos, and a light knit or cardigan for evenings.';
    if (tempC >= 10) return 'Crisp shoulder weather: bring a trenchcoat, tailored wool sweater, and comfortable walking boots.';
    return 'Chilly or alpine climate: thermal underlayers, insulated down coat, gloves, and cashmere scarves.';
  };

  if (loading && !weather) {
    return (
      <div className="py-16 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-sm text-neutral-400 font-light">Acquiring live meteorological telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      {/* Real-time Hero Weather Card */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/10 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
              <span>Live Meteorological Telemetry</span>
              <span>•</span>
              <span className="text-neutral-400">Via {weather?.source || 'Open-Meteo Satellite'}</span>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-5xl sm:text-6xl font-serif text-white font-normal">
                {formatTemp(weather?.temp)}
              </span>
              <div className="text-4xl sm:text-5xl">{weather?.icon || '🌤️'}</div>
            </div>

            <div className="mt-2 text-base sm:text-lg text-neutral-200 font-medium capitalize">
              {weather?.conditionDescription || 'Partly Cloudy'}
            </div>

            <div className="text-xs text-neutral-400 mt-1 flex items-center gap-3">
              <span>Feels like {formatTemp(weather?.feelsLike)}</span>
              <span>•</span>
              <span>Low {formatTemp(weather?.tempMin)} / High {formatTemp(weather?.tempMax)}</span>
            </div>
          </div>

          {/* Quick Metrics Column */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 shrink-0">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
              <Droplets className="w-4 h-4 text-sky-400" />
              <div>
                <span className="block text-[11px] text-neutral-400">Humidity</span>
                <span className="text-sm font-semibold text-white">{weather?.humidity}%</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
              <Wind className="w-4 h-4 text-teal-400" />
              <div>
                <span className="block text-[11px] text-neutral-400">Wind</span>
                <span className="text-sm font-semibold text-white">{weather?.windSpeed} km/h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Refresh button */}
        <button
          onClick={refreshWeather}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition"
          title="Refresh live telemetry"
          aria-label="Refresh weather"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Origin vs Destination Weather Comparison */}
      {originWeather && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-white/5 to-transparent border border-amber-500/20">
          <div className="flex items-center gap-2 text-xs text-amber-300 font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Departure vs Arrival Climate Contrast</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
              <div>
                <span className="text-neutral-400 block">From {userLocation.city}</span>
                <span className="text-sm font-semibold text-white">{formatTemp(originWeather.temp)} • {originWeather.condition}</span>
              </div>
              <span className="text-2xl">{originWeather.icon}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/15 border border-amber-500/30">
              <div>
                <span className="text-amber-300 block">Arriving at {destination.name}</span>
                <span className="text-sm font-semibold text-white">{formatTemp(weather?.temp)} • {weather?.condition}</span>
              </div>
              <span className="text-2xl">{weather?.icon}</span>
            </div>
          </div>
        </div>
      )}

      {/* Hourly Forecast */}
      {weather && weather.hourlyForecast && weather.hourlyForecast.length > 0 && (
        <div>
          <h4 className="text-xs uppercase font-semibold text-neutral-400 tracking-wider mb-3">
            Next Hours Outlook
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {weather.hourlyForecast.map((hour, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl glass-card text-center border border-white/5 flex flex-col items-center gap-1.5"
              >
                <span className="text-[11px] text-neutral-400">{hour.time}</span>
                <span className="text-xl">{hour.icon}</span>
                <span className="text-xs font-semibold text-white">{formatTemp(hour.temp)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5-Day Outlook */}
      {weather && weather.dailyForecast && weather.dailyForecast.length > 0 && (
        <div>
          <h4 className="text-xs uppercase font-semibold text-neutral-400 tracking-wider mb-3">
            5-Day Meteorological Projection
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {weather.dailyForecast.map((day, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl glass-card text-center border border-white/5 flex flex-col items-center gap-1.5"
              >
                <span className="text-xs font-medium text-neutral-300">{day.day}</span>
                <span className="text-2xl my-1">{day.icon}</span>
                <span className="text-[11px] text-neutral-400 font-light truncate max-w-full">
                  {day.condition}
                </span>
                <div className="text-xs text-white font-semibold flex items-center gap-1.5 mt-1">
                  <span>{formatTemp(day.tempMax)}</span>
                  <span className="text-neutral-500 font-normal">/ {formatTemp(day.tempMin)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Season & Wardrobe Insight */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
        <h4 className="text-xs uppercase font-semibold text-neutral-400 tracking-wider">
          Seasonal Guide & Wardrobe Recommendation
        </h4>
        <div className="text-xs sm:text-sm text-neutral-300 font-light space-y-1.5">
          <p>
            <strong className="text-amber-200 font-medium">Optimal Months:</strong> {destination.bestTimeToVisit}.
          </p>
          <p>
            <strong className="text-neutral-200 font-medium">Current Climate Advice:</strong> {getPackingAdvice(weather?.temp)}
          </p>
        </div>
      </div>
    </div>
  );
};
