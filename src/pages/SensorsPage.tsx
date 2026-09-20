import React, { useState } from 'react';
import {
  Radio,
  CloudRain,
  Droplets,
  Activity,
  Gauge,
  Wifi,
  Battery,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Zap,
  Sliders,
  Filter,
  ArrowDownCircle
} from 'lucide-react';
import { useLandSafe } from '../context/LandSafeContext';
import { SensorType, SensorStatus, SensorDevice } from '../types';

export const SensorsPage: React.FC = () => {
  const {
    locations,
    selectedLocationId,
    setSelectedLocationId,
    triggerStormSpike,
    isSimulating,
    simulationTickCount
  } = useLandSafe();

  const [filterType, setFilterType] = useState<'ALL' | SensorType>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | SensorStatus>('ALL');

  // Currently inspected location
  const currentLocation = locations.find((l) => l.id === selectedLocationId) || locations[0];

  // All sensors aggregated across all locations
  const allSensors = locations.flatMap((loc) =>
    loc.sensors.map((s) => ({
      ...s,
      locationName: loc.name,
      locationId: loc.id,
      slopeAngle: loc.slopeAngle
    }))
  );

  const displayedSensors = allSensors.filter((s) => {
    if (filterType !== 'ALL' && s.type !== filterType) return false;
    if (filterStatus !== 'ALL' && s.status !== filterStatus) return false;
    return true;
  });

  const getSensorIcon = (type: SensorType) => {
    switch (type) {
      case 'RAINFALL':
        return CloudRain;
      case 'SOIL_MOISTURE':
        return Droplets;
      case 'GROUND_MOVEMENT':
        return Activity;
      case 'SOIL_PRESSURE':
        return Gauge;
      case 'VIBRATION':
        return Radio;
    }
  };

  const getStatusBadge = (status: SensorStatus) => {
    switch (status) {
      case 'ONLINE':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ONLINE
          </span>
        );
      case 'WARNING':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            WARNING
          </span>
        );
      case 'OFFLINE':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3 h-3 text-rose-400" />
            OFFLINE
          </span>
        );
    }
  };

  return (
    <div id="sensor-monitoring-page" className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Real-Time Sensor Telemetry Matrix
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Continuous in-situ monitoring across optical rain gauges, TDR moisture probes, borehole inclinometers, and piezometers.
          </p>
        </div>

        {/* Live simulation indicator and controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isSimulating ? 'bg-emerald-400' : 'bg-slate-500'
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                isSimulating ? 'bg-emerald-500' : 'bg-slate-600'
              }`} />
            </span>
            <span className="text-slate-300 font-medium">
              {isSimulating ? 'Continuous Stream Active' : 'Polling Paused'}
            </span>
            <span className="text-slate-500 font-mono text-[10px]">4s Cycle</span>
          </div>

          <button
            onClick={() => triggerStormSpike(currentLocation.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/50 border border-red-500/40 text-red-300 text-xs font-semibold shadow-sm transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-red-400" />
            <span>Simulate Sensor Spike</span>
          </button>
        </div>
      </div>

      {/* Sensor Categories Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { type: 'RAINFALL' as SensorType, label: 'Rainfall Sensors', desc: 'Optical Tipping Bucket', icon: CloudRain, count: locations.length, unit: 'mm/h' },
          { type: 'SOIL_MOISTURE' as SensorType, label: 'Soil Moisture Arrays', desc: 'TDR Frequency Domain', icon: Droplets, count: locations.length, unit: '%' },
          { type: 'GROUND_MOVEMENT' as SensorType, label: 'Inclinometers', desc: 'MEMS Shear Displacement', icon: Activity, count: locations.length, unit: 'mm' },
          { type: 'SOIL_PRESSURE' as SensorType, label: 'Piezometers', desc: 'Pore Water Head', icon: Gauge, count: locations.length, unit: 'kPa' },
          { type: 'VIBRATION' as SensorType, label: 'Seismic Geophones', desc: '3-Axis Vibration (PPV)', icon: Radio, count: locations.length, unit: 'mm/s' }
        ].map((cat) => {
          const Icon = cat.icon;
          const isFilterActive = filterType === cat.type;
          return (
            <div
              key={cat.type}
              onClick={() => setFilterType(isFilterActive ? 'ALL' : cat.type)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                isFilterActive
                  ? 'bg-blue-600/20 border-blue-500 shadow-md'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Icon className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-mono text-slate-400">{cat.count} Units</span>
              </div>
              <div className="text-xs font-bold text-slate-200">{cat.label}</div>
              <div className="text-[10px] text-slate-400">{cat.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Filter and Location Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Select Location:</span>
          <select
            value={selectedLocationId}
            onChange={(e) => setSelectedLocationId(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 font-semibold focus:outline-none focus:border-blue-500"
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name} ({loc.riskLevel})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Status:</span>
            {(['ALL', 'ONLINE', 'WARNING', 'OFFLINE'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  filterStatus === st ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="text-slate-500 font-mono text-[11px]">
            Showing {displayedSensors.length} active sensor probes
          </div>
        </div>
      </div>

      {/* Sensors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedSensors.map((sensor) => {
          const Icon = getSensorIcon(sensor.type);
          const isWarning = sensor.status === 'WARNING';
          const pctOfThreshold = Math.min(100, Math.round((sensor.value / sensor.alertThreshold) * 100));

          return (
            <div
              key={`${sensor.locationId}-${sensor.id}`}
              className={`p-4 rounded-xl border transition-all ${
                isWarning
                  ? 'bg-slate-900/90 border-amber-500/50 shadow-md shadow-amber-950/20'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Top Sensor Info */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${isWarning ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-cyan-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-100">{sensor.name}</h3>
                    <p className="text-[10px] text-slate-400">{sensor.locationName}</p>
                  </div>
                </div>
                {getStatusBadge(sensor.status)}
              </div>

              {/* Sensor Metric Reading */}
              <div className="my-3 p-3 rounded-lg bg-slate-950 border border-slate-850 flex items-baseline justify-between">
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                    Current Reading
                  </div>
                  <div className="text-2xl font-black font-mono text-slate-100 mt-0.5">
                    {sensor.value.toFixed(1)}{' '}
                    <span className="text-xs text-slate-400 font-sans font-normal">{sensor.unit}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Alarm Threshold</div>
                  <div className="text-xs font-mono font-bold text-amber-400">
                    &ge; {sensor.alertThreshold} {sensor.unit}
                  </div>
                </div>
              </div>

              {/* Progress gauge bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Normal: {sensor.normalRange[0]}-{sensor.normalRange[1]} {sensor.unit}</span>
                  <span className={pctOfThreshold >= 100 ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                    {pctOfThreshold}% of limit
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      pctOfThreshold >= 100 ? 'bg-amber-500' : pctOfThreshold >= 70 ? 'bg-yellow-400' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, pctOfThreshold)}%` }}
                  />
                </div>
              </div>

              {/* Telemetry Hardware Stats: Battery, RSSI, Timestamp */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <div className="flex items-center gap-1" title="Battery Health">
                  <Battery className="w-3 h-3 text-emerald-400" />
                  <span>{sensor.batteryLevel}%</span>
                </div>
                <div className="flex items-center gap-1" title="Cellular/LoRa Signal Strength">
                  <Wifi className="w-3 h-3 text-cyan-400" />
                  <span>{sensor.signalStrength} dBm</span>
                </div>
                <div className="font-mono text-slate-500">
                  {sensor.lastReported}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
