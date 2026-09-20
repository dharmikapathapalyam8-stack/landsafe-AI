import React from 'react';
import {
  MapPin,
  ShieldAlert,
  CloudRain,
  Droplets,
  Activity,
  Gauge,
  Radio,
  Clock,
  History,
  AlertTriangle,
  CheckCircle2,
  Users,
  Compass,
  ArrowRight,
  TrendingUp,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { useLandSafe } from '../context/LandSafeContext';
import { RiskLevel } from '../types';

export const LocationDetailsPage: React.FC = () => {
  const {
    locations,
    selectedLocationId,
    setSelectedLocationId,
    triggerStormSpike,
    setActivePage
  } = useLandSafe();

  const location = locations.find((l) => l.id === selectedLocationId) || locations[0];
  const currentIndex = locations.findIndex((l) => l.id === location.id);

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % locations.length;
    setSelectedLocationId(locations[nextIdx].id);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + locations.length) % locations.length;
    setSelectedLocationId(locations[prevIdx].id);
  };

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'MODERATE':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div id="location-details-page" className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Location Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600/20 text-cyan-400 border border-blue-500/30">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
                {location.name}
              </h1>
              <span className={`px-2 py-0.5 rounded text-xs font-black border ${getRiskBadge(location.riskLevel)}`}>
                {location.riskLevel} ({location.riskScore}/100)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Sector: {location.region} • Coordinates: {location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°E
            </p>
          </div>
        </div>

        {/* Location Dropdown & Prev/Next */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Previous Site"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <select
            value={location.id}
            onChange={(e) => setSelectedLocationId(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
          >
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleNext}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Next Site"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => triggerStormSpike(location.id)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/50 border border-red-500/40 text-red-300 text-xs font-semibold transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-red-400" />
            <span>Spike Site Telemetry</span>
          </button>
        </div>
      </div>

      {/* Row 1: Core Geotechnical Profile & Risk Gauge Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Risk Score */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Current Risk Score
          </div>
          <div className="text-3xl font-black font-mono text-slate-100">
            {location.riskScore} <span className="text-xs text-slate-400 font-sans font-normal">/100</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Status: <strong className="text-slate-200">{location.riskLevel}</strong>
          </div>
        </div>

        {/* Factor of Safety */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Factor of Safety (FoS)
          </div>
          <div className="text-3xl font-black font-mono text-cyan-400">
            {location.factorOfSafety}
          </div>
          <div className="text-[10px] text-slate-500">
            {location.factorOfSafety < 1.0 ? '🚨 Failure Imminent' : location.factorOfSafety < 1.3 ? '⚠ Marginally Stable' : '✓ Geotechnically Safe'}
          </div>
        </div>

        {/* Confidence & Model */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            AI Confidence Level
          </div>
          <div className="text-3xl font-black font-mono text-emerald-400">
            {location.predictionConfidence}%
          </div>
          <div className="text-[10px] text-slate-500">5 Sensor Cross-validation</div>
        </div>

        {/* Population at Risk */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Population Exposed
          </div>
          <div className="text-3xl font-black font-mono text-amber-300">
            {location.populationAtRisk.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500">Downslope perimeter zone</div>
        </div>
      </div>

      {/* Row 2: 24-Hour Risk History Chart + Environmental Conditions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Risk History Chart */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>24-Hour Geotechnical Risk History</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">Last updated: {location.lastUpdated}</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={location.historicalTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLocRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="riskScore"
                  name="Risk Score (0-100)"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  fill="url(#colorLocRisk)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 5 Cols: Environmental & Geomorphological Profile */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Environmental & Geomorphological Data</span>
          </h2>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
              <span className="text-[10px] text-slate-400 uppercase">Slope Gradient</span>
              <div className="text-base font-bold text-slate-200 mt-0.5">{location.slopeAngle}° incline</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
              <span className="text-[10px] text-slate-400 uppercase">Elevation</span>
              <div className="text-base font-bold text-slate-200 mt-0.5">{location.elevation} meters</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
              <span className="text-[10px] text-slate-400 uppercase">Ambient Temperature</span>
              <div className="text-base font-bold text-slate-200 mt-0.5">{location.temperature}°C</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
              <span className="text-[10px] text-slate-400 uppercase">Relative Humidity</span>
              <div className="text-base font-bold text-slate-200 mt-0.5">{location.humidity}%</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-850 text-xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Geological Composition
            </span>
            <p className="text-slate-200 font-medium">
              {location.soilType}
            </p>
          </div>
        </div>
      </div>

      {/* Row 3: Live Sensor Readings for This Location */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>Assigned Telemetry Sensors ({location.sensors.length} Live Probes)</span>
          </h2>
          <button
            onClick={() => setActivePage('sensors')}
            className="text-xs text-blue-400 hover:underline"
          >
            Open Telemetry Matrix
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {location.sensors.map((sensor) => (
            <div
              key={sensor.id}
              className={`p-3.5 rounded-xl border ${
                sensor.status === 'WARNING'
                  ? 'bg-slate-950 border-amber-500/50'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-400 truncate">{sensor.name}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                  sensor.status === 'WARNING' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {sensor.status}
                </span>
              </div>
              <div className="text-xl font-black font-mono text-slate-100 my-1">
                {sensor.value.toFixed(1)} <span className="text-xs font-normal text-slate-400 font-sans">{sensor.unit}</span>
              </div>
              <div className="text-[10px] text-slate-500">
                Threshold: &ge; {sensor.alertThreshold} {sensor.unit}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 4: AI Prediction & Historical Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: AI Prediction & Safety Recommendations */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>AI Risk Prediction & Safety Recommendations</span>
          </h2>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
              AI Geotechnical Synthesis:
            </div>
            <p className="text-xs text-slate-200 leading-relaxed italic">
              “{location.aiExplanation}”
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-red-950/20 border border-red-900/40 space-y-1.5">
            <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Prescribed Safety Protocol:
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {location.safetyRecommendation}
            </p>
          </div>

          <button
            onClick={() => setActivePage('early-warning')}
            className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Proceed to Early Warning Dispatch Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right 6 Cols: Previous Landslide Incidents Dossier */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <History className="w-4 h-4 text-amber-400" />
              <span>Historical Landslide Incidents Dossier</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              {location.incidents.length} Records
            </span>
          </div>

          {location.incidents.length === 0 ? (
            <div className="p-8 rounded-lg bg-slate-950 border border-slate-800 text-center text-slate-400 text-xs">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              Zero historical landslide detachments logged in official survey archives for this site.
            </div>
          ) : (
            <div className="space-y-3">
              {location.incidents.map((inc) => (
                <div key={inc.id} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">Incident in {inc.year} ({inc.date})</span>
                    <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 text-[10px] font-bold">
                      {inc.severity}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {inc.damageReport}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-850">
                    <span>Rainfall Trigger: <strong>{inc.rainfallTrigger} mm in 24h</strong></span>
                    <span>Evacuated: <strong>{inc.evacuatedPeople} people</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
