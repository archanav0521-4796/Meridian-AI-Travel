import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Destination } from '../../types';

// Custom SVG map pin icon for Leaflet
const createCustomIcon = (color: string = '#d4af37') => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="
      background-color: ${color};
      width: 28px;
      height: 28px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid white;
      box-shadow: 0 4px 10px rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 10px;
        height: 10px;
        background: #090a0f;
        border-radius: 50%;
        transform: rotate(45deg);
      "></div>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
};

interface InteractiveMapProps {
  destination: Destination;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ destination }) => {
  const centerLat = destination.coordinates.lat;
  const centerLng = destination.coordinates.lng;

  return (
    <div className="w-full h-[450px] sm:h-[500px] rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
      >
        {/* Dark Mode Tile Layer from CartoDB */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Destination City Center Marker */}
        <Marker
          position={[centerLat, centerLng]}
          icon={createCustomIcon('#d4af37')}
        >
          <Popup>
            <div className="p-1 text-left">
              <h5 className="font-serif font-bold text-white text-sm">{destination.name}</h5>
              <p className="text-xs text-neutral-300 mt-0.5">{destination.country}</p>
              <span className="text-[10px] text-amber-400 block mt-1">Curated Destination Capital</span>
            </div>
          </Popup>
        </Marker>

        {/* Famous Places Markers */}
        {destination.famousPlaces.map((place) => (
          <Marker
            key={place.id}
            position={[place.coordinates.lat, place.coordinates.lng]}
            icon={createCustomIcon('#f59e0b')}
          >
            <Popup>
              <div className="p-1 max-w-[200px] text-left">
                <img
                  src={place.imageUrl}
                  alt={place.name}
                  className="w-full h-24 object-cover rounded-lg mb-2"
                />
                <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block">
                  {place.category}
                </span>
                <h6 className="font-serif font-bold text-white text-xs mt-0.5">{place.name}</h6>
                <p className="text-[11px] text-neutral-300 line-clamp-2 mt-1">{place.tagline}</p>
                <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-2 pt-1.5 border-t border-white/10">
                  <span>★ {place.rating}</span>
                  <span>{place.entryFee}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating Map Legend */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none glass-panel px-3 py-2 rounded-xl text-[11px] text-neutral-300 border border-white/10 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
          <span>City Hub</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
          <span>Famous Landmarks ({destination.famousPlaces.length})</span>
        </div>
      </div>
    </div>
  );
};
