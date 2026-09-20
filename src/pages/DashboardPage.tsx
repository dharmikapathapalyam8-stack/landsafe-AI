import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Radio,
  MapPin,
  CloudRain,
  Droplets,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Flame,
  CheckCircle2,
  Clock,
  ChevronRight,
  Zap,
  Gauge
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { useLandSafe } from '../context/LandSafeContext';
import { RiskLevel } from '../types';

export const DashboardPage: React.FC = () => {
  const {
    locations,
    alerts,
    setActivePage,
    setSelectedLocationId,
    triggerStormSpike
  } = useLandSafe();

  // Aggregate stats
  const totalLocations = locations.length;
  const criticalLocations = locations.filter((l) => l.riskLevel === 'CRITICAL');
  const highRiskLocations = locations.filter((l) => l.riskLevel === 'HIGH');
  const activeAlerts = alerts.filter(
    (a) => a.status === 'CRITICAL_ACTIVE' || a.status === 'HIGH_ACTIVE'
  );

  // Overall system risk score (highest monitored)
  const maxRiskLoc = locations.reduce((prev, curr) => (curr.riskScore > prev.riskScore ? curr : prev), locations[0]);
  const avgRainfall = (locations.reduce((acc, l) => acc + l.currentRainfall, 0) / (totalLocations || 1)).toFixed(1);
  const avgMoisture = Math.round(locations.reduce((acc, l) => acc + l.soilMoisture, 0) / (totalLocations || 1));
  const maxDisplacement = Math.max(...locations.map((l) => l.groundDisplacement), 0).toFixed(1);

  // Sensor status tally
  let totalSensors = 0;
  let onlineSensors = 0;
  let warningSensors = 0;
  locations.forEach((l) => {
    l.sensors.forEach((s) => {
      totalSensors++;
      if (s.status === 'ONLINE') onlineSensors++;
      if (s.status === 'WARNING') warningSensors++;
    });
  });

  // Chart data: 24h risk trend from the top high-risk location
  const chartData = maxRiskLoc ? maxRiskLoc.historicalTrend : [];

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
    <div id="dashboard-page" className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Overall Landslide Risk Status */}
      <div
        id="overall-risk-status-banner"
        className={`p-5 rounded-2xl border transition-all shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
          maxRiskLoc.riskLevel === 'CRITICAL'
            ? 'bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-900 border-red-500/60 shadow-red-950/30'
            : maxRiskLoc.riskLevel === 'HIGH'
            ? 'bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-900 border-amber-500/60 shadow-amber-950/30'
            : 'bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border-emerald-500/40 shadow-emerald-950/20'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3.5 rounded-xl text-white shadow-lg ${
            maxRiskLoc.riskLevel === 'CRITICAL' ? 'bg-red-600 animate-pulse' : maxRiskLoc.riskLevel === 'HIGH' ? 'bg-amber-600' : 'bg-emerald-600'
          }`}>
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                System Landslide Risk Status
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-extrabold border ${getRiskBadge(maxRiskLoc.riskLevel)}`}>
                {maxRiskLoc.riskLevel} ALERT ({maxRiskLoc.riskScore}/100)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 mt-1 tracking-tight">
              Primary Threat Area: {maxRiskLoc.name}
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl mt-1 leading-relaxed">
              {maxRiskLoc.aiExplanation}
            </p>
          </div>
        </div>

        {/* Quick action buttons on banner */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <button
            id="btn-banner-action-warning"
            onClick={() => setActivePage('early-warning')}
            className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-950 flex items-center gap-1.5 transition-all"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Early Warning ({activeAlerts.length})</span>
          </button>
          <button
            id="btn-banner-map-view"
            onClick={() => setActivePage('map')}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>GIS Map</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Monitored Locations */}
        <div 
          onClick={() => setActivePage('locations')}
          className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Locations</span>
            <MapPin className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-100">{totalLocations}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>High-Risk: <strong className="text-amber-400">{highRiskLocations.length}</strong></span>
            <span>Critical: <strong className="text-red-400">{criticalLocations.length}</strong></span>
          </div>
        </div>

        {/* Active Warnings */}
        <div 
          onClick={() => setActivePage('alerts')}
          className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Warnings</span>
            <AlertTriangle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-amber-400">{activeAlerts.length}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Critical broadcast: <strong className="text-red-400">{activeAlerts.filter(a => a.status === 'CRITICAL_ACTIVE').length}</strong></span>
            <span>Resolved: <strong className="text-emerald-400">{alerts.filter(a => a.status === 'RESOLVED').length}</strong></span>
          </div>
        </div>

        {/* Sensor Network Status */}
        <div 
          onClick={() => setActivePage('sensors')}
          className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Sensor Grid</span>
            <Radio className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-100">{totalSensors} <span className="text-xs text-slate-400 font-normal">probes</span></div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span className="text-emerald-400">{onlineSensors} Online</span>
            <span className="text-amber-400">{warningSensors} Threshold alerts</span>
          </div>
        </div>

        {/* Real-time Environmental Telemetry */}
        <div 
          onClick={() => setActivePage('analytics')}
          className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Live Environmental</span>
            <Activity className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-cyan-300">{avgRainfall}</span>
            <span className="text-xs text-slate-400">mm/h avg</span>
            <span className="text-slate-600">|</span>
            <span className="text-xl font-black text-amber-300">{avgMoisture}%</span>
            <span className="text-xs text-slate-400">moisture</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Max Ground Creep: <strong className="text-red-400">{maxDisplacement} mm</strong>
          </div>
        </div>
      </div>

      {/* Middle Row: Live Monitoring Cards + 24h Risk Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Risk Trend Chart */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>24-Hour Landslide Risk & Rainfall Dynamics</span>
              </h3>
              <p className="text-xs text-slate-400">
                Tracking correlation between precipitation intensity and predictive geotechnical risk index
              </p>
            </div>
            <button
              onClick={() => setActivePage('analytics')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
            >
              <span>Full Analytics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="riskScore"
                  name="Risk Index (0-100)"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRisk)"
                />
                <Area
                  type="monotone"
                  dataKey="rainfall"
                  name="Rainfall (mm/h)"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRain)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Threshold line: <strong>70 (High) / 85 (Critical)</strong>
            </span>
            <span className="text-slate-500">Live polling interval: 4s</span>
          </div>
        </div>

        {/* Right 5 Cols: Live Monitored Locations Quick Cards */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-400" />
              <span>Priority Monitored Zones</span>
            </h3>
            <button
              onClick={() => setActivePage('map')}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>View Map</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Locations Mini Cards List */}
          <div className="space-y-2 overflow-y-auto max-h-[270px] pr-1">
            {locations.slice(0, 4).map((loc) => (
              <div
                key={loc.id}
                onClick={() => {
                  setSelectedLocationId(loc.id);
                  setActivePage('locations');
                }}
                className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                      {loc.name}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${getRiskBadge(loc.riskLevel)}`}>
                      {loc.riskLevel}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <CloudRain className="w-3 h-3 text-cyan-400" />
                      {loc.currentRainfall} mm/h
                    </span>
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-blue-400" />
                      {loc.soilMoisture}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3 text-amber-400" />
                      {loc.groundDisplacement} mm
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-base font-black font-mono ${
                    loc.riskScore >= 85 ? 'text-red-400' : loc.riskScore >= 70 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {loc.riskScore}
                  </div>
                  <div className="text-[9px] text-slate-500 uppercase">Score</div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActivePage('locations')}
            className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Inspect All {locations.length} Sites</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Row: Recent Early Warnings Feed + Interactive Map Teaser */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Recent Alerts Feed */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Real-Time Incident & Alert Feed</span>
            </h3>
            <button
              onClick={() => setActivePage('alerts')}
              className="text-xs text-blue-400 hover:underline"
            >
              Alert Center ({alerts.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {alerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border text-xs space-y-1.5 transition-all ${
                  alert.riskLevel === 'CRITICAL'
                    ? 'bg-red-950/30 border-red-800/50 text-red-200'
                    : alert.riskLevel === 'HIGH'
                    ? 'bg-amber-950/30 border-amber-800/50 text-amber-200'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${
                      alert.riskLevel === 'CRITICAL' ? 'bg-red-500 animate-ping' : 'bg-amber-400'
                    }`} />
                    <span>{alert.locationName}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {alert.timestamp}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {alert.cause}
                </p>
                <div className="text-[11px] font-semibold text-slate-200 flex items-center justify-between pt-1 border-t border-slate-800/60">
                  <span className="text-cyan-300 truncate mr-2">
                    Action: {alert.recommendedAction.substring(0, 50)}...
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400 shrink-0">
                    {alert.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 6 Cols: Quick Map Preview & Geotechnical Model Overview */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-indigo-400" />
                <span>Geotechnical AI Risk Matrix</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">FoS & ML Pipeline</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Landsafe AI runs continuous infinite-slope equilibrium calculations combined with multi-variate ML regression to predict shear failure before surface detachment occurs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Factor of Safety (FoS)</div>
              <div className="text-lg font-black text-cyan-400 mt-0.5">
                {maxRiskLoc.factorOfSafety}
              </div>
              <div className="text-[10px] text-slate-500">&lt;1.0 indicates shear failure</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">AI Model Confidence</div>
              <div className="text-lg font-black text-emerald-400 mt-0.5">
                {maxRiskLoc.predictionConfidence}%
              </div>
              <div className="text-[10px] text-slate-500">Grounded in 5 telemetry probes</div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setActivePage('map')}
              className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-950 transition-colors flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              <span>Launch Interactive GIS Risk Map</span>
            </button>
            <button
              onClick={() => setActivePage('ai-prediction')}
              className="py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
            >
              AI Lab
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
