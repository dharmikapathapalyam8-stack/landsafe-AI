import React, { useState } from 'react';
import {
  BellRing,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  Filter,
  Download,
  Send,
  ShieldAlert,
  Flame,
  UserCheck,
  Radio,
  FileSpreadsheet
} from 'lucide-react';
import { useLandSafe } from '../context/LandSafeContext';
import { RiskLevel, LandslideAlert } from '../types';

export const AlertCenterPage: React.FC = () => {
  const {
    alerts,
    acknowledgeAlert,
    dispatchAlertTeam,
    resolveAlert,
    setSelectedLocationId,
    setActivePage
  } = useLandSafe();

  const [activeTab, setActiveTab] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MODERATE' | 'RESOLVED'>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredAlerts = alerts.filter((alert) => {
    // Tab filter
    if (activeTab === 'CRITICAL' && alert.riskLevel !== 'CRITICAL') return false;
    if (activeTab === 'HIGH' && alert.riskLevel !== 'HIGH') return false;
    if (activeTab === 'MODERATE' && alert.riskLevel !== 'MODERATE') return false;
    if (activeTab === 'RESOLVED' && alert.status !== 'RESOLVED') return false;

    // Search filter
    if (searchTerm) {
      const matchName = alert.locationName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCause = alert.cause.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRegion = alert.region.toLowerCase().includes(searchTerm.toLowerCase());
      return matchName || matchCause || matchRegion;
    }
    return true;
  });

  const getAlertBadge = (level: RiskLevel) => {
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

  const getStatusBadge = (status: LandslideAlert['status']) => {
    switch (status) {
      case 'CRITICAL_ACTIVE':
        return <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-[10px] font-bold">CRITICAL ACTIVE</span>;
      case 'HIGH_ACTIVE':
        return <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-bold">HIGH ACTIVE</span>;
      case 'ACKNOWLEDGED':
        return <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 text-[10px] font-bold">ACKNOWLEDGED</span>;
      case 'DISPATCHED':
        return <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800 text-[10px] font-bold">TEAM DISPATCHED</span>;
      case 'RESOLVED':
        return <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">RESOLVED</span>;
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(alerts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `landsafe-alerts-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="alert-center-page" className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <BellRing className="w-5 h-5 animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Incident Response & Alert Center
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Review live geotechnical early warnings, coordinate responder teams, and audit emergency actions.
          </p>
        </div>

        <button
          onClick={handleExportJson}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Incident Log (JSON)</span>
        </button>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'All Alerts', count: alerts.length },
            { id: 'CRITICAL', label: 'Critical Alerts', count: alerts.filter(a => a.riskLevel === 'CRITICAL').length },
            { id: 'HIGH', label: 'High-Risk Alerts', count: alerts.filter(a => a.riskLevel === 'HIGH').length },
            { id: 'MODERATE', label: 'Moderate Alerts', count: alerts.filter(a => a.riskLevel === 'MODERATE').length },
            { id: 'RESOLVED', label: 'Resolved Alerts', count: alerts.filter(a => a.status === 'RESOLVED').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] leading-tight ${
                activeTab === tab.id ? 'bg-blue-800 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by location, cause..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Alerts Table / Cards List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
            No alerts found matching the active filter.
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.riskLevel === 'CRITICAL';
            const isResolved = alert.status === 'RESOLVED';

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all shadow-sm space-y-3 ${
                  isResolved
                    ? 'bg-slate-900/50 border-slate-800/80 opacity-75'
                    : isCritical
                    ? 'bg-slate-900/90 border-red-500/60 shadow-red-950/20'
                    : 'bg-slate-900/90 border-amber-500/50 shadow-amber-950/10'
                }`}
              >
                {/* Alert Top Row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-black border ${getAlertBadge(alert.riskLevel)}`}>
                      {alert.riskLevel} ({alert.riskScore}/100)
                    </span>
                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      <span>{alert.locationName}</span>
                      <span className="text-xs text-slate-400 font-normal">({alert.region})</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {alert.timestamp}
                    </div>
                    {getStatusBadge(alert.status)}
                  </div>
                </div>

                {/* Cause & Recommended Action */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                  <div className="md:col-span-6 p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-amber-400" />
                      Cause / Sensor Trigger:
                    </div>
                    <p className="text-slate-200 leading-relaxed font-medium">
                      {alert.cause}
                    </p>
                  </div>

                  <div className="md:col-span-6 p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Radio className="w-3 h-3 text-cyan-400" />
                      Recommended Safety Action:
                    </div>
                    <p className="text-slate-200 leading-relaxed">
                      {alert.recommendedAction}
                    </p>
                  </div>
                </div>

                {/* Operational Action Controls */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSelectedLocationId(alert.locationId);
                      setActivePage('locations');
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    Inspect Full Site Profile &rarr;
                  </button>

                  <div className="flex items-center gap-2">
                    {alert.status !== 'ACKNOWLEDGED' && alert.status !== 'RESOLVED' && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                      >
                        Acknowledge
                      </button>
                    )}

                    {alert.status !== 'DISPATCHED' && alert.status !== 'RESOLVED' && (
                      <button
                        onClick={() => dispatchAlertTeam(alert.id)}
                        className="px-3 py-1 rounded bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-700 text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Dispatch Rescue Unit</span>
                      </button>
                    )}

                    {alert.status !== 'RESOLVED' ? (
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="px-3 py-1 rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Resolved</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-400 font-medium">
                        ✓ Case closed & verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
