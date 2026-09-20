import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Layers,
  Filter,
  ShieldAlert,
  CloudRain,
  Droplets,
  Activity,
  Maximize2,
  Navigation,
  Compass,
  Zap,
  Info,
  ChevronRight
} from 'lucide-react';
import { useLandSafe } from '../context/LandSafeContext';
import { MonitoredLocation, RiskLevel } from '../types';

export const LiveMapPage: React.FC = () => {
  const {
    locations,
    selectedLocationId,
    setSelectedLocationId,
    setActivePage,
    triggerStormSpike
  } = useLandSafe();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  const [selectedFilter, setSelectedFilter] = useState<'ALL' | RiskLevel>('ALL');
  const [activeTileLayer, setActiveTileLayer] = useState<'DARK' | 'STREET' | 'TERRAIN'>('DARK');
  const [activeLocationDetail, setActiveLocationDetail] = useState<MonitoredLocation | null>(null);

  // Helper for marker colors
  const getMarkerColor = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return '#ef4444'; // Red
      case 'HIGH':
        return '#f97316'; // Orange
      case 'MODERATE':
        return '#eab308'; // Yellow
      default:
        return '#10b981'; // Green
    }
  };

  // Filtered locations
  const filteredLocations = locations.filter((loc) => {
    if (selectedFilter === 'ALL') return true;
    return loc.riskLevel === selectedFilter;
  });

  // Tile layer URLs
  const tileUrls = {
    DARK: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    STREET: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    TERRAIN: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center map around first location
    const centerLat = locations[0]?.latitude || 18.5204;
    const centerLng = locations[0]?.longitude || 73.8567;

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 11,
      zoomControl: true
    });

    const tileLayer = L.tileLayer(tileUrls[activeTileLayer], {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 18
    }).addTo(map);

    (map as any)._currentTileLayer = tileLayer;
    mapInstanceRef.current = map;

    // Resize handling
    const resizeTimer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(resizeTimer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update tile layer when toggled
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if ((map as any)._currentTileLayer) {
      map.removeLayer((map as any)._currentTileLayer);
    }

    const newLayer = L.tileLayer(tileUrls[activeTileLayer], {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 18
    }).addTo(map);

    (map as any)._currentTileLayer = newLayer;
  }, [activeTileLayer]);

  // Update markers when locations, filter, or values change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => map.removeLayer(marker));
    markersRef.current = {};

    filteredLocations.forEach((loc) => {
      const color = getMarkerColor(loc.riskLevel);
      const isCritical = loc.riskLevel === 'CRITICAL';

      // Custom Leaflet DivIcon with pulsing glow for critical/high
      const customIcon = L.divIcon({
        className: 'custom-landsafe-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px;">
            ${
              isCritical
                ? `<div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: ${color}; opacity: 0.5; animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
                : ''
            }
            <div style="width: 24px; height: 24px; border-radius: 50%; background: ${color}; border: 2.5px solid #0f172a; box-shadow: 0 4px 10px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 10px;">
              ${loc.riskScore}
            </div>
            <div style="position: absolute; bottom: -4px; width: 4px; height: 4px; border-radius: 50%; background: ${color};"></div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const marker = L.marker([loc.latitude, loc.longitude], { icon: customIcon }).addTo(map);

      // Popup content with requested details
      const popupHtml = `
        <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 230px; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; padding-bottom: 6px; margin-bottom: 8px;">
            <strong style="color: #f8fafc; font-size: 13px;">${loc.name}</strong>
            <span style="background: ${color}20; color: ${color}; border: 1px solid ${color}60; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px;">
              ${loc.riskLevel} (${loc.riskScore}/100)
            </span>
          </div>
          <div style="font-size: 11px; color: #cbd5e1; display: grid; gap: 4px; margin-bottom: 8px;">
            <div>🌧 <strong>Rainfall:</strong> ${loc.currentRainfall} mm/h</div>
            <div>💧 <strong>Soil Moisture:</strong> ${loc.soilMoisture}%</div>
            <div>📏 <strong>Ground Movement:</strong> ${loc.groundDisplacement} mm</div>
            <div>🕒 <strong>Last Updated:</strong> ${loc.lastUpdated}</div>
          </div>
          <div style="background: #1e293b; padding: 6px 8px; border-radius: 4px; font-size: 11px; color: #e2e8f0; border-left: 3px solid ${color};">
            <strong>Safety Action:</strong><br/>
            ${loc.safetyRecommendation}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        className: 'landsafe-dark-popup'
      });

      marker.on('click', () => {
        setSelectedLocationId(loc.id);
        setActiveLocationDetail(loc);
      });

      markersRef.current[loc.id] = marker;
    });
  }, [filteredLocations]);

  const handleSelectLocation = (loc: MonitoredLocation) => {
    setSelectedLocationId(loc.id);
    setActiveLocationDetail(loc);
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([loc.latitude, loc.longitude], 13, { duration: 1.2 });
      const marker = markersRef.current[loc.id];
      if (marker) {
        marker.openPopup();
      }
    }
  };

  return (
    <div id="live-risk-map-page" className="h-[calc(100vh-115px)] flex flex-col lg:flex-row overflow-hidden bg-slate-950">
      {/* Map Main Canvas */}
      <div className="flex-1 relative h-full flex flex-col">
        {/* Map Top Floating Controls Bar */}
        <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Risk Filters */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 shadow-xl backdrop-blur-md pointer-events-auto">
            <span className="text-[10px] font-bold uppercase text-slate-400 px-2 flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyan-400" /> Filter:
            </span>
            {(['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                  selectedFilter === filter
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {filter === 'ALL' ? 'All (5+)' : filter}
              </button>
            ))}
          </div>

          {/* Map Tile Layer Selector */}
          <div className="flex items-center gap-1 p-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 shadow-xl backdrop-blur-md pointer-events-auto">
            <span className="text-[10px] font-bold uppercase text-slate-400 px-1.5 flex items-center gap-1">
              <Layers className="w-3 h-3 text-slate-400" /> Layer:
            </span>
            <button
              onClick={() => setActiveTileLayer('DARK')}
              className={`px-2 py-1 rounded text-xs font-medium ${
                activeTileLayer === 'DARK' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dark GIS
            </button>
            <button
              onClick={() => setActiveTileLayer('TERRAIN')}
              className={`px-2 py-1 rounded text-xs font-medium ${
                activeTileLayer === 'TERRAIN' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Topo
            </button>
            <button
              onClick={() => setActiveTileLayer('STREET')}
              className={`px-2 py-1 rounded text-xs font-medium ${
                activeTileLayer === 'STREET' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Street
            </button>
          </div>
        </div>

        {/* Map Leaflet Container */}
        <div ref={mapContainerRef} className="w-full h-full z-0 bg-[#070b16]" />

        {/* Map Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-[1000] p-3 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs text-slate-200 shadow-xl backdrop-blur-md space-y-1.5 pointer-events-auto">
          <div className="font-bold text-[11px] text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            Landslide Hazard Scale
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <span><strong>Critical Risk</strong> (&gt;85) - Imminent Slope Failure</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            <span><strong>High Risk</strong> (70 - 84) - Severe Saturation Creep</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span><strong>Moderate Risk</strong> (40 - 69) - Monitoring Advisory</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span><strong>Low Risk</strong> (0 - 39) - Nominal Stable Slope</span>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Location Details & Quick Telemetry Preview */}
      <div className="w-full lg:w-96 bg-slate-900 border-l border-slate-800 p-4 flex flex-col justify-between overflow-y-auto space-y-4">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Monitored Sites ({filteredLocations.length})</span>
              </h2>
              <p className="text-[11px] text-slate-400">Click marker or card to center</p>
            </div>
            <button
              onClick={() => triggerStormSpike()}
              className="p-1.5 rounded bg-red-950/60 border border-red-800/60 hover:bg-red-900/60 text-red-300 text-xs font-semibold flex items-center gap-1"
              title="Simulate cloudburst on primary site"
            >
              <Zap className="w-3 h-3 text-red-400" />
              <span>Spike Rain</span>
            </button>
          </div>

          {/* Sites List */}
          <div className="space-y-2 mt-3 max-h-[300px] overflow-y-auto pr-1">
            {filteredLocations.map((loc) => {
              const isSelected = (activeLocationDetail?.id || selectedLocationId) === loc.id;
              const color = getMarkerColor(loc.riskLevel);
              return (
                <div
                  key={loc.id}
                  onClick={() => handleSelectLocation(loc)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-blue-500 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-200">
                        {loc.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {loc.region} • Elev: {loc.elevation}m • Slope: {loc.slopeAngle}°
                      </div>
                    </div>
                    <span
                      style={{ color, borderColor: `${color}60`, backgroundColor: `${color}15` }}
                      className="text-[10px] font-extrabold px-1.5 py-0.5 rounded border leading-none shrink-0"
                    >
                      {loc.riskLevel} ({loc.riskScore})
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 mt-2 text-[10px] text-slate-300 pt-1.5 border-t border-slate-800/60">
                    <div>
                      Rain: <strong className="text-cyan-300">{loc.currentRainfall}</strong>
                    </div>
                    <div>
                      Moisture: <strong className="text-blue-300">{loc.soilMoisture}%</strong>
                    </div>
                    <div>
                      Creep: <strong className="text-amber-300">{loc.groundDisplacement}mm</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Location Full Inspector Box */}
        {(() => {
          const detail = activeLocationDetail || locations.find((l) => l.id === selectedLocationId) || locations[0];
          const color = getMarkerColor(detail.riskLevel);

          return (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Selected Geotech Profile
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Updated: {detail.lastUpdated}</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-100">{detail.name}</h3>
                <p className="text-[11px] text-slate-400">{detail.soilType}</p>
              </div>

              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs space-y-1">
                <div className="font-bold text-slate-300 flex items-center justify-between">
                  <span>AI Risk Index</span>
                  <span style={{ color }} className="font-mono text-sm font-black">
                    {detail.riskScore}/100 ({detail.riskLevel})
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Factor of Safety (FoS): <strong className="text-cyan-400">{detail.factorOfSafety}</strong> (Confidence: {detail.predictionConfidence}%)
                </div>
              </div>

              {/* Safety recommendation */}
              <div className="p-2.5 rounded bg-red-950/20 border border-red-900/40 text-[11px] text-slate-300">
                <div className="font-bold text-red-400 uppercase text-[10px] mb-0.5">
                  Action Recommendation:
                </div>
                {detail.safetyRecommendation}
              </div>

              <button
                onClick={() => {
                  setSelectedLocationId(detail.id);
                  setActivePage('locations');
                }}
                className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Full Telemetry & Sensor Dossier</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
