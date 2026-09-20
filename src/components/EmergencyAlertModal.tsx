import React from 'react';
import {
  AlertTriangle,
  Radio,
  Send,
  X,
  ShieldAlert,
  Volume2,
  Users,
  MapPin,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { useLandSafe } from '../context/LandSafeContext';

export const EmergencyAlertModal: React.FC = () => {
  const { emergencyModalAlert, setEmergencyModalAlert, broadcastEmergency, setActivePage, setSelectedLocationId } = useLandSafe();

  if (!emergencyModalAlert) return null;

  const isCritical = emergencyModalAlert.riskLevel === 'CRITICAL';

  const handleBroadcast = () => {
    broadcastEmergency(emergencyModalAlert.id);
  };

  const handleViewLocation = () => {
    setSelectedLocationId(emergencyModalAlert.locationId);
    setActivePage('locations');
    setEmergencyModalAlert(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="emergency-alert-dialog"
        className={`w-full max-w-xl rounded-xl border-2 shadow-2xl overflow-hidden transition-all ${
          isCritical
            ? 'bg-slate-950 border-red-500 shadow-red-950/60'
            : 'bg-slate-950 border-amber-500 shadow-amber-950/60'
        }`}
      >
        {/* Banner Top Header */}
        <div className={`px-5 py-4 flex items-center justify-between ${
          isCritical ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white' : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-black/20 animate-bounce">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest opacity-90">
                Early Warning System Broadcast
              </div>
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                <span>⚠ {emergencyModalAlert.riskLevel} LANDSLIDE RISK</span>
                <span className="text-xs px-2 py-0.5 rounded bg-black/30 font-mono">
                  SCORE: {emergencyModalAlert.riskScore}/100
                </span>
              </h2>
            </div>
          </div>
          <button
            onClick={() => setEmergencyModalAlert(null)}
            className="p-1 rounded-md text-white/80 hover:text-white hover:bg-black/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-slate-200 text-sm">
          {/* Location & Time */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-400" />
              <div>
                <span className="font-semibold text-slate-100">{emergencyModalAlert.locationName}</span>
                <span className="text-xs text-slate-400 ml-2">({emergencyModalAlert.region})</span>
              </div>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Timestamp: {emergencyModalAlert.timestamp}
            </div>
          </div>

          {/* Reason / Cause */}
          <div className="p-3.5 rounded-lg bg-red-950/30 border border-red-900/50">
            <div className="text-xs font-bold uppercase tracking-wider text-red-400 mb-1 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Reason for Warning:
            </div>
            <p className="text-slate-200 font-medium leading-relaxed">
              {emergencyModalAlert.cause}
            </p>
          </div>

          {/* Action to take */}
          <div className="p-3.5 rounded-lg bg-blue-950/30 border border-blue-900/50">
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" />
              Recommended Safety Action:
            </div>
            <p className="text-slate-200 leading-relaxed">
              {emergencyModalAlert.recommendedAction}
            </p>
          </div>

          {/* Broadcast status */}
          <div className="flex items-center justify-between text-xs px-2 text-slate-400">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-400" />
              <span>Civil Defense Channels:</span>
              <span className={emergencyModalAlert.broadcastSent ? 'text-emerald-400 font-semibold flex items-center gap-1' : 'text-amber-400'}>
                {emergencyModalAlert.broadcastSent ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    SMS & Siren Broadcast Active
                  </>
                ) : 'Standby for confirmation'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleViewLocation}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Inspect Location Telemetry
          </button>

          <div className="flex items-center gap-2">
            {!emergencyModalAlert.broadcastSent ? (
              <button
                id="btn-trigger-civil-broadcast"
                onClick={handleBroadcast}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-950 transition-colors"
              >
                <Send className="w-4 h-4" />
                Dispatch Siren & SMS Blast
              </button>
            ) : (
              <div className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-semibold">
                ✓ Emergency Broadcast Active
              </div>
            )}
            <button
              onClick={() => setEmergencyModalAlert(null)}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
