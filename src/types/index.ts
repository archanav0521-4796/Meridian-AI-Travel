export type Continent =
  | 'All'
  | 'Europe'
  | 'Asia'
  | 'Americas'
  | 'Africa'
  | 'Oceania';

export type TravelVibe =
  | 'All'
  | 'Cultural & Historic'
  | 'Beach & Coastal'
  | 'Alpine & Nature'
  | 'Urban & Modern'
  | 'Romantic & Luxury'
  | 'Scenic Viewpoint'
  | 'Sacred Site'
  | 'Natural Wonder';



export type BudgetTier = '$' | '$$' | '$$$' | '$$$$';

export interface FamousPlace {
  id: string;
  name: string;
  tagline: string;
  category: 'Architectural' | 'Natural Wonder' | 'Cultural Heritage' | 'Culinary' | 'Scenic Viewpoint' | 'Sacred Site';
  description: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  suggestedDuration: string;
  entryFee: string;
  bestTimeOfDay: string;
  highlights: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  continent: 'Europe' | 'Asia' | 'Americas' | 'Africa' | 'Oceania';
  tagline: string;
  description: string;
  editorialBlurb: string;
  vibes: TravelVibe[];
  heroImage: string;
  gallery: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  weatherQuery: string;
  bestTimeToVisit: string;
  currency: string;
  language: string;
  timezone: string;
  budgetTier: BudgetTier;
  averageDailyCostUsd: number;
  famousPlaces: FamousPlace[];
  localTips: string[];
  cuisineMustTry: string[];
}

export interface UserLocation {
  city: string;
  country: string;
  lat: number;
  lng: number;
  isCustom: boolean;
  status: 'prompt' | 'granted' | 'denied' | 'custom';
}

export interface WeatherData {
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  uvIndex?: number;
  condition: string;
  conditionDescription: string;
  icon: string;
  source: 'OpenWeather' | 'Open-Meteo';
  hourlyForecast: Array<{
    time: string;
    temp: number;
    icon: string;
    condition: string;
  }>;
  dailyForecast: Array<{
    day: string;
    tempMin: number;
    tempMax: number;
    condition: string;
    icon: string;
  }>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: Array<{
    label: string;
    prompt: string;
  }>;
}

export interface ItineraryActivity {
  id: string;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening';
  time: string;
  title: string;
  placeName?: string;
  description: string;
  estimatedCost: string;
  transportTip?: string;
  insiderTip?: string;
  completed?: boolean;
}

export interface ItineraryDay {
  dayNumber: number;
  theme: string;
  summary: string;
  activities: ItineraryActivity[];
}

export interface GeneratedItinerary {
  id: string;
  destinationId: string;
  destinationName: string;
  country: string;
  title: string;
  durationDays: number;
  travelStyle: string;
  budgetStyle: string;
  pace: string;
  estimatedTotalBudgetUsd: number;
  days: ItineraryDay[];
  packingList: string[];
  importantNotes: string[];
  createdAt: string;
}

export interface ApiKeysConfig {
  geminiKey: string;
  openWeatherKey: string;
  unsplashKey: string;
}
