import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin,
  Navigation,
  Plane,
  Clock,
  Compass,
  ShieldCheck,
  Sparkles,
  Footprints,
  Car,
  Bus,
  ChevronRight,
  Eye,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Ticket,
  Star,
} from 'lucide-react';
import { Destination, UserLocation, FamousPlace } from '../../types';
import { calculateDistanceKm, estimateFlightDuration } from '../../services/geocodingApi';

// Custom SVG map pin with waypoint number for Leaflet
const createNumberedIcon = (number: number | string, color: string = '#f59e0b') => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        position: relative;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          position: absolute;
          width: 32px;
          height: 32px;
          background: ${color};
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2px solid #ffffff;
          box-shadow: 0 4px 14px rgba(0,0,0,0.6);
        "></div>
        <span style="
          position: relative;
          z-index: 2;
          color: #090a0f;
          font-weight: 800;
          font-size: 13px;
          font-family: sans-serif;
          margin-top: -3px;
        ">${number}</span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

// Custom Hub beacon icon
const createHubIcon = () => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        position: relative;
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          position: absolute;
          width: 38px;
          height: 38px;
          background: rgba(212, 175, 55, 0.25);
          border-radius: 50%;
        "></div>
        <div style="
          width: 26px;
          height: 26px;
          background: #d4af37;
          border-radius: 50%;
          border: 2px solid #ffffff;
          box-shadow: 0 0 16px rgba(212, 175, 55, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #090a0f;
          font-size: 14px;
          font-weight: bold;
        ">★</div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20],
  });
};

// Custom Origin Departure pin
const createOriginIcon = () => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        position: relative;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          position: absolute;
          width: 36px;
          height: 36px;
          background: rgba(56, 189, 248, 0.35);
          border-radius: 50%;
        "></div>
        <div style="
          width: 24px;
          height: 24px;
          background: #0284c7;
          border-radius: 50%;
          border: 2px solid #ffffff;
          box-shadow: 0 0 14px rgba(56, 189, 248, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 12px;
        ">✈</div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
};

// Interpolate spherical geodesic points between origin and destination for smooth flight curves
function getGeodesicPoints(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  numPoints: number = 24
): [number, number][] {
  const points: [number, number][] = [];
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;

  const phi1 = toRad(lat1);
  const lambda1 = toRad(lng1);
  const phi2 = toRad(lat2);
  const lambda2 = toRad(lng2);

  const deltaLambda = lambda2 - lambda1;
  const a =
    Math.sin((phi2 - phi1) / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
  const d = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  if (d < 0.0001) return [[lat1, lng1], [lat2, lng2]];

  for (let i = 0; i <= numPoints; i++) {
    const f = i / numPoints;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(phi1) * Math.cos(lambda1) + B * Math.cos(phi2) * Math.cos(lambda2);
    const y = A * Math.cos(phi1) * Math.sin(lambda1) + B * Math.cos(phi2) * Math.sin(lambda2);
    const z = A * Math.sin(phi1) + B * Math.sin(phi2);

    const lat = toDeg(Math.atan2(z, Math.sqrt(x * x + y * y)));
    const lng = toDeg(Math.atan2(y, x));
    points.push([lat, lng]);
  }
  return points;
}

// Controller component to handle programmatic zoom, pan, and bounds fitting
interface MapControllerProps {
  center: [number, number];
  zoom: number;
  bounds: [number, number][] | null;
  focusedCoord: [number, number] | null;
  triggerReset: number;
}

const MapController: React.FC<MapControllerProps> = ({
  center,
  zoom,
  bounds,
  focusedCoord,
  triggerReset,
}) => {
  const map = useMap();

  useEffect(() => {
    if (focusedCoord) {
      map.flyTo(focusedCoord, 15, { duration: 1.2 });
    } else if (bounds && bounds.length > 1) {
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 15 });
    } else {
      map.setView(center, zoom);
    }
  }, [focusedCoord, bounds, triggerReset, center, zoom, map]);

  return null;
};

interface InteractiveMapProps {
  destination: Destination;
  userLocation?: UserLocation;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ destination, userLocation }) => {
  const [routeMode, setRouteMode] = useState<'circuit' | 'flight'>('circuit');
  const [focusedCoord, setFocusedCoord] = useState<[number, number] | null>(null);
  const [resetTrigger, setResetTrigger] = useState(0);

  const centerLat = destination.coordinates.lat;
  const centerLng = destination.coordinates.lng;

  // Ordered Waypoints: City Hub -> Famous Places -> Loop back
  const waypoints = useMemo(() => {
    return [
      {
        id: 'city-hub',
        name: `${destination.name} Central Hub`,
        category: 'Arrival Point',
        tagline: 'Expedition starting base and historic city core',
        coordinates: { lat: centerLat, lng: centerLng },
        imageUrl: destination.heroImage,
        rating: 5.0,
        suggestedDuration: 'Starting point',
        entryFee: 'Free',
        bestTimeOfDay: 'Morning kick-off',
        highlights: ['Central navigation nexus', 'Local transit connections', 'Curated welcome hub'],
      },
      ...destination.famousPlaces,
    ];
  }, [destination, centerLat, centerLng]);

  // Exploration Circuit Route Coordinates
  const circuitPositions = useMemo<[number, number][]>(() => {
    const coords: [number, number][] = waypoints.map((w) => [w.coordinates.lat, w.coordinates.lng]);
    // Loop back to start for complete scenic circuit
    if (coords.length > 1) {
      coords.push(coords[0]);
    }
    return coords;
  }, [waypoints]);

  // Calculate detailed legs between consecutive stops
  const routeLegs = useMemo(() => {
    const legs = [];
    for (let i = 0; i < waypoints.length; i++) {
      const from = waypoints[i];
      const to = waypoints[(i + 1) % waypoints.length];
      const dist = calculateDistanceKm(
        from.coordinates.lat,
        from.coordinates.lng,
        to.coordinates.lat,
        to.coordinates.lng
      );

      let transitMode: 'walk' | 'drive' | 'transit' = 'walk';
      let durationStr = '';

      if (dist <= 2) {
        transitMode = 'walk';
        durationStr = `~${Math.max(5, Math.round(dist * 13))} min walk`;
      } else if (dist <= 15) {
        transitMode = 'drive';
        durationStr = `~${Math.max(8, Math.round(dist * 2.4 + 4))} min drive / taxi`;
      } else {
        transitMode = 'transit';
        durationStr = `~${Math.max(15, Math.round(dist * 1.5 + 10))} min scenic transit`;
      }

      legs.push({
        fromIndex: i,
        toIndex: (i + 1) % waypoints.length,
        fromName: from.name,
        toName: to.name,
        distanceKm: dist,
        distanceMiles: Math.round(dist * 0.621371 * 10) / 10,
        durationStr,
        transitMode,
      });
    }
    return legs;
  }, [waypoints]);

  // Total circuit statistics
  const totalCircuitKm = useMemo(() => {
    return routeLegs.reduce((acc, leg) => acc + leg.distanceKm, 0);
  }, [routeLegs]);

  // Intercontinental Geodesic Flight Route
  const flightRouteData = useMemo(() => {
    if (!userLocation) return null;
    const originLat = userLocation.lat;
    const originLng = userLocation.lng;
    const distKm = calculateDistanceKm(originLat, originLng, centerLat, centerLng);
    const flightDuration = estimateFlightDuration(distKm);
    const points = getGeodesicPoints(originLat, originLng, centerLat, centerLng, 32);

    return {
      points,
      distKm,
      distMiles: Math.round(distKm * 0.621371),
      flightDuration,
      origin: userLocation,
    };
  }, [userLocation, centerLat, centerLng]);

  // Bounds for auto-fitting
  const activeBounds = useMemo<[number, number][]>(() => {
    if (routeMode === 'flight' && flightRouteData) {
      return [
        [flightRouteData.origin.lat, flightRouteData.origin.lng],
        [centerLat, centerLng],
      ];
    }
    return circuitPositions;
  }, [routeMode, flightRouteData, circuitPositions, centerLat, centerLng]);

  const handleFocusPlace = (lat: number, lng: number) => {
    setFocusedCoord([lat, lng]);
  };

  const handleRecenter = () => {
    setFocusedCoord(null);
    setResetTrigger((prev) => prev + 1);
  };

  return (
    <div className="w-full space-y-6 text-left">
      {/* Route Mode & Zero API Key Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900/80 border border-white/10 glass-panel">
        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setRouteMode('circuit');
              handleRecenter();
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              routeMode === 'circuit'
                ? 'bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/20'
                : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Curated Landmark Circuit</span>
            <span className="px-1.5 py-0.5 rounded-full bg-black/20 text-[10px]">
              {destination.famousPlaces.length} Stops
            </span>
          </button>

          {userLocation && (
            <button
              onClick={() => {
                setRouteMode('flight');
                handleRecenter();
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                routeMode === 'flight'
                  ? 'bg-sky-400 text-neutral-950 shadow-md shadow-sky-400/20'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Plane className="w-3.5 h-3.5" />
              <span>Flight Route</span>
              <span className="hidden md:inline text-[10px] opacity-75">
                from {userLocation.city}
              </span>
            </button>
          )}
        </div>

        {/* Route Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-neutral-300 text-xs self-start sm:self-auto font-medium">
          <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Interactive Route Navigator</span>
        </div>
      </div>

      {/* Interactive Map Container */}
      <div className="w-full h-[460px] sm:h-[520px] rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl bg-[#090a0f]">
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={13}
          scrollWheelZoom={false}
          attributionControl={false}
          className="w-full h-full z-10"
        >
          {/* Dark Mode Basemap Layer */}
          <TileLayer
            attribution=""
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          <MapController
            center={[centerLat, centerLng]}
            zoom={13}
            bounds={activeBounds}
            focusedCoord={focusedCoord}
            triggerReset={resetTrigger}
          />

          {/* ==================== CIRCUIT MODE ==================== */}
          {routeMode === 'circuit' && (
            <>
              {/* Glowing Route Polyline Underlay */}
              <Polyline
                positions={circuitPositions}
                pathOptions={{
                  color: '#d97706',
                  weight: 8,
                  opacity: 0.35,
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
              />

              {/* Main Animated Dashed Route Polyline */}
              <Polyline
                positions={circuitPositions}
                pathOptions={{
                  color: '#fbbf24',
                  weight: 3.5,
                  dashArray: '8, 8',
                  opacity: 0.95,
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
              />

              {/* City Center Beacon Marker */}
              <Marker position={[centerLat, centerLng]} icon={createHubIcon()}>
                <Popup>
                  <div className="p-1.5 text-left max-w-[220px]">
                    <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block">
                      Expedition Hub
                    </span>
                    <h5 className="font-serif font-bold text-white text-sm mt-0.5">
                      {destination.name}
                    </h5>
                    <p className="text-xs text-neutral-300 mt-1">{destination.country}</p>
                    <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-neutral-400 flex items-center justify-between">
                      <span>Coordinates</span>
                      <span className="font-mono text-amber-200/80">
                        {centerLat.toFixed(2)}°, {centerLng.toFixed(2)}°
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>

              {/* Numbered Landmark Waypoint Markers */}
              {destination.famousPlaces.map((place, index) => (
                <Marker
                  key={place.id}
                  position={[place.coordinates.lat, place.coordinates.lng]}
                  icon={createNumberedIcon(index + 1, '#f59e0b')}
                >
                  <Popup>
                    <div className="p-1 max-w-[220px] text-left">
                      <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden mb-2">
                        <img
                          src={place.imageUrl}
                          alt={place.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/70 text-amber-300 font-bold text-[10px]">
                          Stop #{index + 1}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block">
                        {place.category}
                      </span>
                      <h6 className="font-serif font-bold text-white text-xs mt-0.5">
                        {place.name}
                      </h6>
                      <p className="text-[11px] text-neutral-300 line-clamp-2 mt-1">
                        {place.tagline}
                      </p>
                      <div className="grid grid-cols-2 gap-1 text-[10px] text-neutral-400 mt-2 pt-2 border-t border-white/10">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span>{place.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-neutral-400" />
                          <span>{place.suggestedDuration}</span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </>
          )}

          {/* ==================== FLIGHT MODE ==================== */}
          {routeMode === 'flight' && flightRouteData && (
            <>
              {/* Glowing Flight Path Underlay */}
              <Polyline
                positions={flightRouteData.points}
                pathOptions={{
                  color: '#0284c7',
                  weight: 8,
                  opacity: 0.35,
                  lineCap: 'round',
                }}
              />

              {/* Main Flight Trajectory Line */}
              <Polyline
                positions={flightRouteData.points}
                pathOptions={{
                  color: '#38bdf8',
                  weight: 3.5,
                  dashArray: '8, 8',
                  opacity: 0.95,
                  lineCap: 'round',
                }}
              />

              {/* Departure Origin Marker */}
              <Marker
                position={[flightRouteData.origin.lat, flightRouteData.origin.lng]}
                icon={createOriginIcon()}
              >
                <Popup>
                  <div className="p-1.5 text-left">
                    <span className="text-[10px] font-semibold text-sky-400 uppercase tracking-wider block">
                      Departure Origin
                    </span>
                    <h5 className="font-serif font-bold text-white text-sm mt-0.5">
                      {flightRouteData.origin.city}, {flightRouteData.origin.country}
                    </h5>
                    <p className="text-xs text-neutral-300 mt-1">
                      Direct air travel to {destination.name}
                    </p>
                  </div>
                </Popup>
              </Marker>

              {/* Destination Arrival Marker */}
              <Marker position={[centerLat, centerLng]} icon={createHubIcon()}>
                <Popup>
                  <div className="p-1.5 text-left">
                    <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block">
                      Destination Arrival
                    </span>
                    <h5 className="font-serif font-bold text-white text-sm mt-0.5">
                      {destination.name}, {destination.country}
                    </h5>
                    <div className="mt-2 pt-2 border-t border-white/10 text-xs text-sky-300 font-medium">
                      Direct flight distance: {flightRouteData.distKm.toLocaleString()} km ({flightRouteData.flightDuration})
                    </div>
                  </div>
                </Popup>
              </Marker>
            </>
          )}
        </MapContainer>

        {/* Floating Reset/Recenter Button */}
        <button
          onClick={handleRecenter}
          className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/85 text-neutral-200 hover:text-white border border-white/15 backdrop-blur-md transition text-xs font-medium flex items-center gap-1.5 shadow-lg cursor-pointer"
          title="Fit full route in view"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>Recenter Route</span>
        </button>

        {/* Floating Route Status Banner in Bottom Left */}
        <div className="absolute bottom-4 left-4 z-20 pointer-events-none glass-panel px-3.5 py-2.5 rounded-2xl text-xs text-neutral-200 border border-white/15 shadow-xl max-w-xs sm:max-w-md">
          {routeMode === 'circuit' ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-medium text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Exploration Circuit Polyline Active</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                {destination.famousPlaces.length} Iconic Stops • {totalCircuitKm} km Total Circuit • Scenic Transit Connected
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-medium text-sky-300">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
                <span>Geodesic Great-Circle Flight Corridor</span>
              </div>
              <p className="text-[11px] text-neutral-300">
                {userLocation?.city} ➔ {destination.name}: {flightRouteData?.distKm.toLocaleString()} km ({flightRouteData?.flightDuration})
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ==================== STEP-BY-STEP ROUTE DETAILS ITINERARY ==================== */}
      <div className="space-y-6 pt-4">
        {/* Route Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-2xl glass-card border border-white/10">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-medium">
              Total Route Distance
            </span>
            <span className="font-serif text-xl sm:text-2xl text-white font-normal block mt-1">
              {routeMode === 'circuit' ? `${totalCircuitKm} km` : `${flightRouteData?.distKm.toLocaleString()} km`}
            </span>
            <span className="text-[11px] text-amber-400/90 font-mono mt-0.5 block">
              {routeMode === 'circuit' ? `~${Math.round(totalCircuitKm * 0.621371)} miles loop` : `${flightRouteData?.distMiles.toLocaleString()} miles`}
            </span>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-white/10">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-medium">
              Estimated Exploration
            </span>
            <span className="font-serif text-xl sm:text-2xl text-white font-normal block mt-1">
              {routeMode === 'circuit' ? '~5.5 Hours' : (flightRouteData?.flightDuration || 'N/A')}
            </span>
            <span className="text-[11px] text-neutral-400 font-mono mt-0.5 block">
              {routeMode === 'circuit' ? 'Sights + local transit' : 'Direct cruising altitude'}
            </span>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-white/10">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-medium">
              Waypoints Sequence
            </span>
            <span className="font-serif text-xl sm:text-2xl text-white font-normal block mt-1">
              {destination.famousPlaces.length + 1} Waypoints
            </span>
            <span className="text-[11px] text-neutral-400 font-mono mt-0.5 block">
              Central hub + {destination.famousPlaces.length} landmarks
            </span>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-white/10">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-medium">
              Navigation Mode
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <Navigation className="w-4 h-4 text-amber-400" />
              <span className="font-serif text-sm sm:text-base text-white font-normal">
                Curated
              </span>
            </div>
            <span className="text-[11px] text-neutral-400 font-medium mt-0.5 block">
              Scenic Circuit
            </span>
          </div>
        </div>

        {/* Informative Guidance Banner */}
        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3 text-xs text-amber-200/90 leading-relaxed">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Curated Waypoint Route Order: </span>
            This itinerary is plotted chronologically based on proximity, optimal lighting hours (avoiding midday crowds), and scenic transit. Click <strong>Focus on Map</strong> to zoom smoothly to any landmark.
          </div>
        </div>

        {/* Step-by-Step Waypoint Cards */}
        <div className="space-y-4">
          <h4 className="font-serif text-xl text-white font-normal flex items-center justify-between">
            <span>Turn-by-Turn Route Waypoints</span>
            <span className="text-xs font-sans text-neutral-400 font-light">
              Click any stop to view on map
            </span>
          </h4>

          <div className="space-y-3">
            {destination.famousPlaces.map((place, idx) => {
              const leg = routeLegs[idx];

              return (
                <div key={place.id} className="space-y-3">
                  {/* Waypoint Card */}
                  <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-amber-400/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
                    <div className="flex items-start sm:items-center gap-3.5">
                      {/* Number Badge */}
                      <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold font-mono text-sm shrink-0">
                        #{idx + 1}
                      </div>

                      {/* Image Thumbnail */}
                      <div className="w-16 h-14 rounded-xl overflow-hidden bg-neutral-900 shrink-0 hidden sm:block">
                        <img
                          src={place.imageUrl}
                          alt={place.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      </div>

                      {/* Details */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-white/5 text-amber-300 border border-white/10">
                            {place.category}
                          </span>
                          <span className="text-xs text-neutral-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {place.suggestedDuration}
                          </span>
                        </div>
                        <h5 className="font-serif font-bold text-white text-base sm:text-lg mt-1">
                          {place.name}
                        </h5>
                        <p className="text-xs text-neutral-400 font-light line-clamp-1 mt-0.5">
                          {place.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Action & logistics */}
                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      <div className="text-right hidden md:block">
                        <span className="text-[11px] text-neutral-400 block">Prime Light</span>
                        <span className="text-xs text-neutral-200 font-medium">
                          {place.bestTimeOfDay}
                        </span>
                      </div>

                      <button
                        onClick={() => handleFocusPlace(place.coordinates.lat, place.coordinates.lng)}
                        className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-200 hover:text-white border border-white/10 transition text-xs font-medium flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>Focus on Map</span>
                      </button>
                    </div>
                  </div>

                  {/* Route Leg Connecting to Next Landmark */}
                  {leg && (
                    <div className="flex items-center justify-center my-1.5">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[11px] text-neutral-400">
                        {leg.transitMode === 'walk' ? (
                          <Footprints className="w-3.5 h-3.5 text-emerald-400" />
                        ) : leg.transitMode === 'drive' ? (
                          <Car className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Bus className="w-3.5 h-3.5 text-sky-400" />
                        )}
                        <span>
                          Travel to Stop {idx + 2 > destination.famousPlaces.length ? '1 (Circuit Complete)' : `#${idx + 2}`}:{' '}
                          <strong className="text-white">{leg.distanceKm} km</strong> ({leg.durationStr})
                        </span>
                        <ChevronRight className="w-3 h-3 text-neutral-500" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
