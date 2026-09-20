import React, { useState } from 'react';
import {
  Settings,
  PlusCircle,
  ShieldAlert,
  Sliders,
  Radio,
  ToggleLeft,
  ToggleRight,
  RotateCcw,
  Save,
  CheckCircle2,
  Trash2,
  Activity,
  AlertTriangle,
  Server,
  Layers,
  Database
} from 'lucide-react';
import { useLandSafe } from '../context/LandSafeContext';
import { RiskThresholds, MonitoredLocation } from '../types';

export const AdminPanelPage: React.FC = () => {
  const {
    locations,
    thresholds,
    updateThresholds,
    addNewLocation,
    toggleLocationMonitoring,
    resetToBaseline,
    alerts,
    user
  } = useLandSafe();

  // Threshold form state
  const [threshState, setThreshState] = useState<RiskThresholds>(thresholds);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // New location form state
  const [newLocName, setNewLocName] = useState<string>('');
  const [newLocRegion, setNewLocRegion] = useState<string>('Western Ridge Sector');
  const [newLocLat, setNewLocLat] = useState<number>(18.55);
  const [newLocLng, setNewLocLng] = useState<number>(73.83);
  const [newLocElevation, setNewLocElevation] = useState<number>(950);
  const [newLocSlope, setNewLocSlope] = useState<number>(34);
  const [newLocSoil, setNewLocSoil] = useState<string>('Weathered Schist & Loam');
  const [newLocPop, setNewLocPop] = useState<number>(850);
  const [showAddSuccess, setShowAddSuccess] = useState<boolean>(false);

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    updateThresholds(threshState);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCreateLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName.trim()) return;

    addNewLocation({
      name: newLocName,
      region: newLocRegion,
      latitude: newLocLat,
      longitude: newLocLng,
      elevation: newLocElevation,
      slopeAngle: newLocSlope,
      soilType: newLocSoil,
      populationAtRisk: newLocPop
    });

    setNewLocName('');
    setShowAddSuccess(true);
    setTimeout(() => setShowAddSuccess(false), 3000);
  };

  return (
    <div id="admin-panel-page" className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Administrative Command & Threshold Configuration
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage monitored survey locations, tune AI warning risk thresholds, and oversee geotechnical sensor grid health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetToBaseline}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Database to Initial State</span>
          </button>
        </div>
      </div>

      {/* Row 1: Add Monitored Location + Update Risk Thresholds */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Add Monitored Location Form */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-cyan-400" />
              <span>Commission New Monitored Survey Site</span>
            </h2>
            <span className="text-[11px] text-slate-400">Deploy sensor array node</span>
          </div>

          {showAddSuccess && (
            <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>New location successfully commissioned and added to GIS map & telemetry grid!</span>
            </div>
          )}

          <form onSubmit={handleCreateLocation} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Site Name / Zone
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ridge Sector Gamma Point 3"
                  value={newLocName}
                  onChange={(e) => setNewLocName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Region / Corridor
                </label>
                <input
                  type="text"
                  value={newLocRegion}
                  onChange={(e) => setNewLocRegion(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Latitude (°N)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={newLocLat}
                  onChange={(e) => setNewLocLat(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Longitude (°E)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={newLocLng}
                  onChange={(e) => setNewLocLng(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Slope Angle (°)
                </label>
                <input
                  type="number"
                  value={newLocSlope}
                  onChange={(e) => setNewLocSlope(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Elevation (m)
                </label>
                <input
                  type="number"
                  value={newLocElevation}
                  onChange={(e) => setNewLocElevation(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Soil / Geology Profile
                </label>
                <input
                  type="text"
                  value={newLocSoil}
                  onChange={(e) => setNewLocSoil(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Population Exposed Downslope
                </label>
                <input
                  type="number"
                  value={newLocPop}
                  onChange={(e) => setNewLocPop(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-950 transition-colors flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Deploy Location to Active Monitoring</span>
            </button>
          </form>
        </div>

        {/* Right 5 Cols: Update Risk Thresholds */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Geotechnical Risk Thresholds</span>
              </h2>
              <span className="text-[10px] font-mono text-cyan-400">Trigger Limits</span>
            </div>

            {savedSuccess && (
              <div className="my-2 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Threshold parameters updated!</span>
              </div>
            )}

            <form onSubmit={handleSaveThresholds} className="space-y-3 mt-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Critical Risk Cutoff (0-100)
                  </label>
                  <input
                    type="number"
                    value={threshState.criticalRiskScore}
                    onChange={(e) => setThreshState({ ...threshState, criticalRiskScore: parseInt(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    High Risk Cutoff (0-100)
                  </label>
                  <input
                    type="number"
                    value={threshState.highRiskScore}
                    onChange={(e) => setThreshState({ ...threshState, highRiskScore: parseInt(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Rainfall Warning (mm/h)
                  </label>
                  <input
                    type="number"
                    value={threshState.maxRainfallMmH}
                    onChange={(e) => setThreshState({ ...threshState, maxRainfallMmH: parseInt(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Soil Moisture Cap (%)
                  </label>
                  <input
                    type="number"
                    value={threshState.maxSoilMoisturePercent}
                    onChange={(e) => setThreshState({ ...threshState, maxSoilMoisturePercent: parseInt(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Inclinometer Shear Displacement Alarm (mm)
                </label>
                <input
                  type="number"
                  value={threshState.maxDisplacementMm}
                  onChange={(e) => setThreshState({ ...threshState, maxDisplacementMm: parseInt(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save New Risk Thresholds</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Row 2: Manage Monitored Locations Table (Enable/Disable Continuous Monitoring) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>Monitored Locations Roster & Active Polling State</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {locations.filter((l) => l.isMonitored).length} of {locations.length} Sites Actively Polled
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-3">Site Name</th>
                <th className="p-3">Region</th>
                <th className="p-3">Slope Angle</th>
                <th className="p-3">Current Score</th>
                <th className="p-3">FoS</th>
                <th className="p-3">Sensors</th>
                <th className="p-3">Monitoring State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {locations.map((loc) => (
                <tr key={loc.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="p-3 font-semibold text-slate-200">{loc.name}</td>
                  <td className="p-3 text-slate-400">{loc.region}</td>
                  <td className="p-3 text-slate-300">{loc.slopeAngle}°</td>
                  <td className="p-3 font-mono font-bold">
                    <span className={loc.riskScore >= 85 ? 'text-red-400' : loc.riskScore >= 70 ? 'text-amber-400' : 'text-emerald-400'}>
                      {loc.riskScore} ({loc.riskLevel})
                    </span>
                  </td>
                  <td className="p-3 font-mono text-cyan-400">{loc.factorOfSafety}</td>
                  <td className="p-3 text-slate-400">{loc.sensors.length} Probes</td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleLocationMonitoring(loc.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                        loc.isMonitored
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {loc.isMonitored ? (
                        <>
                          <ToggleRight className="w-4 h-4 text-emerald-400" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4 text-slate-500" />
                          <span>Disabled</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
