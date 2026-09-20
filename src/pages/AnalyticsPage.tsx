import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  CloudRain,
  Droplets,
  Activity,
  PieChart as PieIcon,
  Filter,
  Download,
  Calendar,
  Layers,
  ShieldAlert
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';
import { useLandSafe } from '../context/LandSafeContext';

export const AnalyticsPage: React.FC = () => {
  const { locations, alerts } = useLandSafe();

  const [selectedLocationId, setSelectedLocationId] = useState<string>(locations[0]?.id || '');
  const [timeWindow, setTimeWindow] = useState<'24H' | '7D' | '30D'>('24H');

  const currentLocation = locations.find((l) => l.id === selectedLocationId) || locations[0];
  const timeSeriesData = currentLocation ? currentLocation.historicalTrend : [];

  // Chart 1: Rainfall over time
  const rainfallChartData = timeSeriesData.map((d) => ({
    timestamp: d.timestamp,
    rainfall: d.rainfall,
    cumulative: Math.round(d.rainfall * 2.8)
  }));

  // Chart 2: Soil Moisture over time
  const moistureChartData = timeSeriesData.map((d) => ({
    timestamp: d.timestamp,
    moisture: d.soilMoisture,
    criticalThreshold: 75
  }));

  // Chart 3: Ground Displacement
  const displacementChartData = timeSeriesData.map((d) => ({
    timestamp: d.timestamp,
    displacement: d.displacement,
    creepLimit: 12
  }));

  // Chart 4: Risk score comparison across all locations
  const locationRiskComparisonData = locations.map((loc) => ({
    name: loc.name.split(' - ')[0],
    fullName: loc.name,
    riskScore: loc.riskScore,
    elevation: loc.elevation,
    slope: loc.slopeAngle
  }));

  // Chart 5: Alert breakdown by risk severity
  const criticalAlerts = alerts.filter((a) => a.riskLevel === 'CRITICAL').length;
  const highAlerts = alerts.filter((a) => a.riskLevel === 'HIGH').length;
  const moderateAlerts = alerts.filter((a) => a.riskLevel === 'MODERATE').length;
  const lowAlerts = alerts.filter((a) => a.riskLevel === 'LOW').length;

  const alertsPieData = [
    { name: 'Critical Risk', value: criticalAlerts, color: '#ef4444' },
    { name: 'High Risk', value: highAlerts, color: '#f97316' },
    { name: 'Moderate Risk', value: moderateAlerts, color: '#eab308' },
    { name: 'Low Risk', value: lowAlerts, color: '#10b981' }
  ].filter((d) => d.value > 0);

  // Multi-location risk trend comparison
  const comparativeTrendData = timeSeriesData.map((d, index) => {
    const point: any = { timestamp: d.timestamp };
    locations.forEach((loc) => {
      const locPoint = loc.historicalTrend[index] || loc.historicalTrend[0];
      point[loc.name.split(' - ')[0]] = locPoint ? locPoint.riskScore : loc.riskScore;
    });
    return point;
  });

  const locationColors = ['#ef4444', '#f97316', '#eab308', '#38bdf8', '#10b981', '#a855f7'];

  return (
    <div id="analytics-page" className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <BarChart3 className="w-5 h-5 animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Geotechnical Telemetry & AI Analytics
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Historical correlation charts for precipitation thresholds, soil pore hydration, ground displacement velocity, and spatial risk distribution.
          </p>
        </div>

        {/* Location Selector & Time Window */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400 pl-2">Location:</span>
            <select
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 font-semibold focus:outline-none"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            {(['24H', '7D', '30D'] as const).map((win) => (
              <button
                key={win}
                onClick={() => setTimeWindow(win)}
                className={`px-2.5 py-1 rounded font-semibold transition-all ${
                  timeWindow === win ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {win}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 1: Rainfall Over Time & Soil Moisture Over Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rainfall Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-cyan-400" />
                <span>Rainfall Intensity Over Time</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Site: {currentLocation?.name} (mm/h)
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-300 font-bold">
              Current: {currentLocation?.currentRainfall} mm/h
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rainfallChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRainAnalytics" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <ReferenceLine y={45} stroke="#f97316" strokeDasharray="3 3" label={{ value: 'Warning Limit (45mm)', fill: '#f97316', fontSize: 10 }} />
                <Area
                  type="monotone"
                  dataKey="rainfall"
                  name="Intensity (mm/h)"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  fill="url(#colorRainAnalytics)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Soil Moisture Over Time */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span>Soil Moisture & Pore Hydration Over Time</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Percentage volume saturation against critical geotechnical threshold (75%)
              </p>
            </div>
            <span className="text-xs font-mono text-blue-300 font-bold">
              Current: {currentLocation?.soilMoisture}%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moistureChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Saturation Limit (75%)', fill: '#ef4444', fontSize: 10 }} />
                <Line
                  type="monotone"
                  dataKey="moisture"
                  name="Soil Moisture (%)"
                  stroke="#60a5fa"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Ground Displacement & Comparative Risk Score Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ground Displacement Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <span>Inclinometer Ground Displacement (Shear Creep)</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Continuous millimeter shear plane movement across borehole sensors
              </p>
            </div>
            <span className="text-xs font-mono text-amber-300 font-bold">
              Current: {currentLocation?.groundDisplacement} mm
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displacementChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <ReferenceLine y={12} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Alarm Limit (12mm)', fill: '#ef4444', fontSize: 10 }} />
                <Line
                  type="monotone"
                  dataKey="displacement"
                  name="Displacement (mm)"
                  stroke="#fbbf24"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#f59e0b' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Comparative Risk Trend Across Locations */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-400" />
                <span>Multi-Site Risk Score Trend Dynamics</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Comparing risk trajectory across monitored mountain sectors
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">0 - 100 Index</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparativeTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                {locations.map((loc, i) => (
                  <Line
                    key={loc.id}
                    type="monotone"
                    dataKey={loc.name.split(' - ')[0]}
                    stroke={locationColors[i % locationColors.length]}
                    strokeWidth={loc.id === currentLocation?.id ? 3 : 1.5}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Risk Distribution by Location (Bar) & Number of Alerts (Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Risk Distribution by Location */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Risk Score Distribution by Monitored Location</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Site comparison ranking highest landslide vulnerability
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationRiskComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <ReferenceLine y={85} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Critical', fill: '#ef4444', fontSize: 10 }} />
                <ReferenceLine y={70} stroke="#f97316" strokeDasharray="3 3" label={{ value: 'High', fill: '#f97316', fontSize: 10 }} />
                <Bar dataKey="riskScore" name="Risk Score">
                  {locationRiskComparisonData.map((entry, index) => {
                    const color = entry.riskScore >= 85 ? '#ef4444' : entry.riskScore >= 70 ? '#f97316' : entry.riskScore >= 40 ? '#eab308' : '#10b981';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 5 Cols: Number of Alerts by Severity */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-purple-400" />
              <span>Active Early Warnings by Severity</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Total active emergency and advisory bulletins: {alerts.length}
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={alertsPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {alertsPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
            <span>Critical alerts trigger automated siren</span>
            <span className="text-cyan-400">100% CAP compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
