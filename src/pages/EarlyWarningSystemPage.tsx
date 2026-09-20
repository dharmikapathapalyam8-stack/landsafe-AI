import React, { useState } from 'react';
import {
  AlertTriangle,
  Radio,
  Send,
  Volume2,
  Users,
  MapPin,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Bell,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  PhoneCall
} from 'lucide-react';
import { useLandSafe } from '../context/LandSafeContext';
import { alertAudio } from '../utils/audioAlert';

export const EarlyWarningSystemPage: React.FC = () => {
  const {
    locations,
    alerts,
    broadcastEmergency,
    triggerStormSpike,
    setSelectedLocationId,
    setActivePage
  } = useLandSafe();

  const [broadcastSimLog, setBroadcastSimLog] = useState<string[]>([]);
  const [activeBroadcastChannel, setActiveBroadcastChannel] = useState<'SMS' | 'SIREN' | 'FIRST_RESPONDERS'>('SMS');

  // Filter high and critical locations
  const threatLocations = locations.filter(
    (l) => l.riskLevel === 'CRITICAL' || l.riskLevel === 'HIGH'
  );

  const handleTestSiren = () => {
    alertAudio.playWarningBeep('CRITICAL');
  };

  const handleEmergencyDispatch = (alertId: string, locationName: string) => {
    broadcastEmergency(alertId);
    const now = new Date().toLocaleTimeString();
    setBroadcastSimLog((prev) => [
      `[${now}] EMERGENCY BROADCAST TRANSMITTED: SMS blast sent to ${locationName} sector cell towers.`,
      `[${now}] CIVIL DEFENSE SIRENS ACTIVATED: Frequency 880Hz alert tone sounding in vulnerable perimeter.`,
      `[${now}] TRAFFIC DIVERSION DISPATCHED: Highway Patrol ordered to cordon downslope access roads.`,
      ...prev
    ]);
  };

  return (
    <div id="early-warning-system-page" className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Early Warning & Civil Defense Dispatch System
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous multi-channel warning dissemination when geotechnical risk breaches High (&gt;70) or Critical (&gt;85) thresholds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTestSiren}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all"
            title="Play civil defense audio siren"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Test Alert Audio Siren</span>
          </button>

          <button
            onClick={() => triggerStormSpike()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-950 transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Trigger Demo Cloudburst Warning</span>
          </button>
        </div>
      </div>

      {/* Active High & Critical Threat Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>Active Landslide Warning Bulletins ({threatLocations.length})</span>
          </h2>
          <span className="text-xs text-slate-400">
            Automated threshold trigger active
          </span>
        </div>

        {threatLocations.length === 0 ? (
          <div className="p-8 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-200">No High or Critical Warnings Active</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              All monitored slopes are currently within safe Factor of Safety equilibrium. Click "Trigger Demo Cloudburst Warning" above to simulate an emergency.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {threatLocations.map((loc) => {
              const isCritical = loc.riskLevel === 'CRITICAL';
              const alert = alerts.find((a) => a.locationId === loc.id);

              return (
                <div
                  key={loc.id}
                  className={`p-5 rounded-xl border transition-all shadow-xl space-y-4 ${
                    isCritical
                      ? 'bg-slate-900/90 border-red-500/70 shadow-red-950/30'
                      : 'bg-slate-900/90 border-amber-500/70 shadow-amber-950/20'
                  }`}
                >
                  {/* Warning Header */}
                  <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${isCritical ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-amber-500/20 text-amber-400'}`}>
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          Warning Level:
                        </div>
                        <h3 className={`text-base font-black tracking-tight ${isCritical ? 'text-red-400' : 'text-amber-400'}`}>
                          ⚠ {loc.riskLevel} LANDSLIDE RISK
                        </h3>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-black font-mono text-slate-100">
                        {loc.riskScore}<span className="text-xs text-slate-400 font-normal">/100</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Risk Score</span>
                    </div>
                  </div>

                  {/* Location and Telemetry Snapshot */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 space-y-0.5">
                      <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-400" /> Location:
                      </div>
                      <div className="font-bold text-slate-200">{loc.name}</div>
                      <div className="text-[10px] text-slate-500">{loc.region} • Elev: {loc.elevation}m</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 space-y-0.5">
                      <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                        <Users className="w-3 h-3 text-amber-400" /> Population at Risk:
                      </div>
                      <div className="font-bold text-amber-300">{loc.populationAtRisk.toLocaleString()} citizens</div>
                      <div className="text-[10px] text-slate-500">Slope Incline: {loc.slopeAngle}°</div>
                    </div>
                  </div>

                  {/* Reason for Warning */}
                  <div className="p-3 rounded-lg bg-red-950/30 border border-red-900/50 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" />
                      Reason for Warning:
                    </div>
                    <p className="text-xs text-slate-200 font-medium leading-relaxed">
                      Heavy rainfall ({loc.currentRainfall} mm/h) + saturated soil ({loc.soilMoisture}%) + increasing ground movement ({loc.groundDisplacement} mm).
                    </p>
                  </div>

                  {/* Recommended Action */}
                  <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-900/50 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                      <Radio className="w-3 h-3" />
                      Recommended Action:
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {loc.safetyRecommendation}
                    </p>
                  </div>

                  {/* Broadcast Trigger Button */}
                  <div className="pt-1 flex items-center justify-between gap-3">
                    <button
                      onClick={() => {
                        setSelectedLocationId(loc.id);
                        setActivePage('locations');
                      }}
                      className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>Examine Telemetry</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      id={`btn-dispatch-${loc.id}`}
                      onClick={() => handleEmergencyDispatch(alert?.id || loc.id, loc.name)}
                      className={`px-4 py-2 rounded-lg font-bold text-xs shadow-md transition-all flex items-center gap-2 ${
                        alert?.broadcastSent
                          ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/60'
                          : 'bg-red-600 hover:bg-red-500 text-white shadow-red-950'
                      }`}
                    >
                      {alert?.broadcastSent ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Broadcast Active</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Transmit Warning (Siren + SMS)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Broadcast Log & Multi-Agency Dispatch Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Multi-Agency Channels */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>Automated Dissemination Channels</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-blue-500/20 text-blue-400">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-200">Public Cell Broadcast (CAP Protocol)</div>
                  <div className="text-[10px] text-slate-400">Geofenced emergency SMS to vulnerable zone residents</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                STANDBY
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-amber-500/20 text-amber-400">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-200">Acoustic Hillside Siren Towers</div>
                  <div className="text-[10px] text-slate-400">120dB omnidirectional solar-backed sirens</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                ARMED
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-purple-500/20 text-purple-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-200">Civil Defense & Disaster Rescue Desk</div>
                  <div className="text-[10px] text-slate-400">Direct tactical API payload to state emergency services</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                CONNECTED
              </span>
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Transmission Audit Log */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Real-Time Broadcast Transmission Telemetry</span>
            </h3>
            <p className="text-xs text-slate-400">
              Audit log of dispatched civil warnings and responder taskings.
            </p>
          </div>

          <div className="h-44 overflow-y-auto bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-slate-300 space-y-2">
            {broadcastSimLog.length === 0 ? (
              <div className="text-slate-500 italic text-center py-8">
                No recent manual broadcasts sent. Trigger an alert above to view transmission logs.
              </div>
            ) : (
              broadcastSimLog.map((log, i) => (
                <div key={i} className="text-emerald-300 border-l-2 border-emerald-500 pl-2">
                  {log}
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Standard: Common Alerting Protocol (CAP v1.2)</span>
            <button
              onClick={() => setBroadcastSimLog([])}
              className="text-slate-400 hover:text-slate-200 underline"
            >
              Clear Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
