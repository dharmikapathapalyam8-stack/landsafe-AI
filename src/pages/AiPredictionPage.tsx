import React, { useState, useMemo } from 'react';
import {
  BrainCircuit,
  Sliders,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  Flame,
  CheckCircle2,
  TrendingUp,
  Cpu,
  RefreshCw,
  Info,
  Layers,
  HelpCircle,
  Radio
} from 'lucide-react';
import { calculateLandslideRisk, PredictionInput } from '../utils/aiPrediction';
import { useLandSafe } from '../context/LandSafeContext';

export const AiPredictionPage: React.FC = () => {
  const { setActivePage } = useLandSafe();

  // Input states
  const [rainfallIntensity, setRainfallIntensity] = useState<number>(42.0); // mm/h
  const [soilMoisture, setSoilMoisture] = useState<number>(82); // %
  const [slopeAngle, setSlopeAngle] = useState<number>(36); // degrees
  const [groundDisplacement, setGroundDisplacement] = useState<number>(14.2); // mm
  const [soilPressure, setSoilPressure] = useState<number>(54.0); // kPa
  const [temperature, setTemperature] = useState<number>(18.5); // °C
  const [historicalIncidentsCount, setHistoricalIncidentsCount] = useState<number>(2);
  const [soilType, setSoilType] = useState<string>('Saturated Clay Loam');

  // Compute prediction in real-time
  const prediction = useMemo(() => {
    return calculateLandslideRisk({
      rainfallIntensity,
      soilMoisture,
      slopeAngle,
      groundDisplacement,
      soilPressure,
      temperature,
      historicalIncidentsCount,
      soilType
    });
  }, [
    rainfallIntensity,
    soilMoisture,
    slopeAngle,
    groundDisplacement,
    soilPressure,
    temperature,
    historicalIncidentsCount,
    soilType
  ]);

  // Presets for Hackathon demonstration
  const applyPreset = (presetName: string) => {
    if (presetName === 'MONSOON_CRITICAL') {
      setRainfallIntensity(58.5);
      setSoilMoisture(92);
      setSlopeAngle(44);
      setGroundDisplacement(21.4);
      setSoilPressure(68);
      setSoilType('Weathered Colluvial Silt');
      setHistoricalIncidentsCount(3);
    } else if (presetName === 'ACTIVE_CREEP') {
      setRainfallIntensity(26.0);
      setSoilMoisture(72);
      setSlopeAngle(38);
      setGroundDisplacement(16.5);
      setSoilPressure(45);
      setSoilType('Fractured Schist');
      setHistoricalIncidentsCount(1);
    } else if (presetName === 'MODERATE_ADVISORY') {
      setRainfallIntensity(18.0);
      setSoilMoisture(58);
      setSlopeAngle(28);
      setGroundDisplacement(4.2);
      setSoilPressure(28);
      setSoilType('Alluvial Sandy Gravel');
      setHistoricalIncidentsCount(1);
    } else if (presetName === 'DRY_STABLE') {
      setRainfallIntensity(3.0);
      setSoilMoisture(28);
      setSlopeAngle(22);
      setGroundDisplacement(0.6);
      setSoilPressure(11);
      setSoilType('Dense Granitic Bedrock');
      setHistoricalIncidentsCount(0);
    }
  };

  const getStatusColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'HIGH':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'MODERATE':
        return 'text-yellow-300 bg-yellow-500/10 border-yellow-500/30';
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <div id="ai-prediction-page" className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <BrainCircuit className="w-5 h-5 animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              AI Risk Prediction Laboratory & Sandbox
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate environmental variables, run real-time geotechnical AI inference, and inspect XAI contributing factors.
          </p>
        </div>

        {/* Demo Scenario Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">
            Scenario Presets:
          </span>
          <button
            onClick={() => applyPreset('MONSOON_CRITICAL')}
            className="px-2.5 py-1.5 rounded-md bg-red-950/60 border border-red-800/60 hover:bg-red-900/60 text-red-300 text-xs font-semibold transition-all"
          >
            ⛈ Cloudburst Catastrophe
          </button>
          <button
            onClick={() => applyPreset('ACTIVE_CREEP')}
            className="px-2.5 py-1.5 rounded-md bg-amber-950/60 border border-amber-800/60 hover:bg-amber-900/60 text-amber-300 text-xs font-semibold transition-all"
          >
            ⛰ Highway Cut Creep
          </button>
          <button
            onClick={() => applyPreset('MODERATE_ADVISORY')}
            className="px-2.5 py-1.5 rounded-md bg-yellow-950/60 border border-yellow-800/60 hover:bg-yellow-900/60 text-yellow-300 text-xs font-semibold transition-all"
          >
            🌦 Moderate Monsoon
          </button>
          <button
            onClick={() => applyPreset('DRY_STABLE')}
            className="px-2.5 py-1.5 rounded-md bg-emerald-950/60 border border-emerald-800/60 hover:bg-emerald-900/60 text-emerald-300 text-xs font-semibold transition-all"
          >
            ☀ Dry Baseline Stable
          </button>
        </div>
      </div>

      {/* Main Grid: Left Inputs (7 cols) & Right AI Output (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Panel */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Multi-Sensor Geotechnical Inputs</span>
            </h2>
            <span className="text-[11px] text-slate-400">Dynamic slider simulation</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* 1. Rainfall Intensity */}
            <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                  🌧 Rainfall Intensity
                </label>
                <span className="font-mono font-bold text-cyan-300 text-sm">
                  {rainfallIntensity.toFixed(1)} mm/h
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="0.5"
                value={rainfallIntensity}
                onChange={(e) => setRainfallIntensity(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 mm/h (Dry)</span>
                <span>25 mm/h (Threshold)</span>
                <span>80 mm/h (Cloudburst)</span>
              </div>
            </div>

            {/* 2. Soil Moisture */}
            <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                  💧 Soil Moisture Content
                </label>
                <span className="font-mono font-bold text-blue-300 text-sm">
                  {soilMoisture}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(parseInt(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>10% (Arid)</span>
                <span>75% (Saturation Limit)</span>
                <span>100% (Liquefaction)</span>
              </div>
            </div>

            {/* 3. Slope Angle */}
            <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                  📐 Slope Incline Angle
                </label>
                <span className="font-mono font-bold text-indigo-300 text-sm">
                  {slopeAngle}°
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="1"
                value={slopeAngle}
                onChange={(e) => setSlopeAngle(parseInt(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>5° (Flat Plain)</span>
                <span>35° (Critical Angle of Repose)</span>
                <span>60° (Sheer Cliff)</span>
              </div>
            </div>

            {/* 4. Ground Displacement */}
            <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                  📏 Inclinometer Ground Displacement
                </label>
                <span className="font-mono font-bold text-amber-300 text-sm">
                  {groundDisplacement.toFixed(1)} mm
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                step="0.2"
                value={groundDisplacement}
                onChange={(e) => setGroundDisplacement(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 mm (Static)</span>
                <span>12 mm (Alarm Cutoff)</span>
                <span>35 mm (Shear Rupture)</span>
              </div>
            </div>

            {/* 5. Soil Pressure & Temperature */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-200">
                    Pore Pressure
                  </label>
                  <span className="font-mono font-bold text-slate-200">
                    {soilPressure.toFixed(0)} kPa
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="1"
                  value={soilPressure}
                  onChange={(e) => setSoilPressure(parseInt(e.target.value))}
                  className="w-full accent-slate-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>

              <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-200">
                    Ambient Temp
                  </label>
                  <span className="font-mono font-bold text-slate-200">
                    {temperature.toFixed(1)}°C
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="0.5"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-slate-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>
            </div>

            {/* 6. Geology & Historical Incidents */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Soil / Geology Profile
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Saturated Clay Loam">Saturated Clay Loam (High Plasticity)</option>
                  <option value="Weathered Colluvial Silt">Weathered Colluvial Silt</option>
                  <option value="Fractured Schist & Shale">Fractured Schist & Shale</option>
                  <option value="Alluvial Sandy Gravel">Alluvial Sandy Gravel</option>
                  <option value="Dense Granitic Bedrock">Dense Granitic Bedrock</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Historical Landslide Incidents
                </label>
                <select
                  value={historicalIncidentsCount}
                  onChange={(e) => setHistoricalIncidentsCount(parseInt(e.target.value))}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="0">0 Recorded Incidents</option>
                  <option value="1">1 Prior Incident (Debris Slide)</option>
                  <option value="2">2 Prior Incidents (Frequent Creep)</option>
                  <option value="3">3+ Chronic Historical Rupture Zone</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right AI Prediction Output Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                AI Model Prediction Output
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                Confidence: {prediction.confidence}%
              </span>
            </div>

            {/* Big Risk Score Display */}
            <div className={`p-5 rounded-xl border text-center transition-all ${
              prediction.riskLevel === 'CRITICAL'
                ? 'bg-red-950/40 border-red-500/60 shadow-lg shadow-red-950/40'
                : prediction.riskLevel === 'HIGH'
                ? 'bg-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-950/40'
                : prediction.riskLevel === 'MODERATE'
                ? 'bg-yellow-950/30 border-yellow-500/50 shadow-sm'
                : 'bg-emerald-950/30 border-emerald-500/50 shadow-sm'
            }`}>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Predicted Landslide Risk Score
              </div>
              <div className="text-5xl font-black font-mono tracking-tight my-1 text-slate-100">
                {prediction.riskScore}
                <span className="text-lg text-slate-400 font-sans font-medium">/100</span>
              </div>
              <div className="inline-block mt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusColor(prediction.riskLevel)}`}>
                  Status: {prediction.riskLevel} RISK
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-300">
                Factor of Safety (FoS): <strong className="text-cyan-300">{prediction.factorOfSafety}</strong>
                <span className="text-[10px] text-slate-400 ml-1.5">(&lt;1.0 imminent failure)</span>
              </div>
            </div>

            {/* Explainable AI: "Why this risk?" */}
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                Why this risk? (Explainable AI Synthesis)
              </div>
              <p className="text-xs text-slate-200 leading-relaxed italic">
                “{prediction.explanation}”
              </p>
            </div>

            {/* Feature Importance / Contributing Factors Breakdown */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Main Contributing Factors
              </div>
              <div className="space-y-2 text-xs">
                {prediction.contributingFactors.map((factor) => (
                  <div key={factor.factor} className="space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-300 font-medium">{factor.factor}</span>
                      <span className="font-mono text-slate-400">{factor.weight}% impact</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          factor.status === 'CRITICAL' ? 'bg-red-500' : factor.status === 'ELEVATED' ? 'bg-amber-400' : 'bg-cyan-500'
                        }`}
                        style={{ width: `${factor.weight}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {factor.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Safety Action */}
            <div className="p-3.5 rounded-lg bg-red-950/20 border border-red-900/40 text-xs text-slate-200 space-y-1">
              <div className="font-bold text-red-400 uppercase text-[10px] flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                Recommended Early Warning Action:
              </div>
              <p className="text-[11px] leading-relaxed">
                {prediction.safetyRecommendation}
              </p>
            </div>

            <button
              onClick={() => setActivePage('early-warning')}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-950 transition-colors flex items-center justify-center gap-2"
            >
              <Radio className="w-4 h-4" />
              <span>Broadcast to Early Warning System</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
