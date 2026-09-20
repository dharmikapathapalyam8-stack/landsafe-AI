import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Bell,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Zap,
  RotateCcw,
  Activity,
  Radio,
  User,
  LogOut,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { useLandSafe } from '../context/LandSafeContext';

export const Navbar: React.FC = () => {
  const {
    user,
    logout,
    alerts,
    isSimulating,
    setIsSimulating,
    simulationTickCount,
    triggerStormSpike,
    resetToBaseline,
    isMuted,
    toggleMute,
    setActivePage,
    locations
  } = useLandSafe();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [showDemoDropdown, setShowDemoDropdown] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const criticalAlertsCount = alerts.filter(
    (a) => a.status === 'CRITICAL_ACTIVE' || a.status === 'HIGH_ACTIVE'
  ).length;

  const highestRisk = Math.max(...locations.map((l) => l.riskScore), 0);

  return (
    <header id="app-navbar" className="bg-[#0b1329] border-b border-slate-800 text-slate-100 sticky top-0 z-40 px-4 py-2.5 shadow-lg">
      <div className="flex items-center justify-between gap-3">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setActivePage('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 via-red-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-red-950/40 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Landsafe AI
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-red-500/20 text-red-400 border border-red-500/30 rounded uppercase tracking-wider">
                  Live Telemetry
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Landslide Early Warning & AI Risk System
              </p>
            </div>
          </div>

          {/* System Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-700/60 text-xs">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                highestRisk >= 85 ? 'bg-red-400' : highestRisk >= 70 ? 'bg-orange-400' : 'bg-emerald-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                highestRisk >= 85 ? 'bg-red-500' : highestRisk >= 70 ? 'bg-orange-500' : 'bg-emerald-500'
              }`} />
            </span>
            <span className="text-slate-300 font-medium">
              Network: <strong className={highestRisk >= 85 ? 'text-red-400' : highestRisk >= 70 ? 'text-amber-400' : 'text-emerald-400'}>
                {highestRisk >= 85 ? 'CRITICAL RISK DETECTED' : highestRisk >= 70 ? 'ELEVATED SURGE' : 'NOMINAL STABILITY'}
              </strong>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 text-[11px]">Tick #{simulationTickCount}</span>
          </div>
        </div>

        {/* Center: Live Clock & Quick Hackathon Actions */}
        <div className="flex items-center gap-2">
          {/* Hackathon Preset Action Buttons */}
          <div className="relative">
            <button
              id="btn-hackathon-demo"
              onClick={() => setShowDemoDropdown(!showDemoDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-gradient-to-r from-amber-600/30 to-red-600/30 hover:from-amber-600/50 hover:to-red-600/50 text-amber-300 border border-amber-500/40 text-xs font-semibold shadow-sm transition-all"
              title="Quick demo simulation trigger for presentation"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="hidden sm:inline">Hackathon Demo</span>
              <ChevronDown className="w-3 h-3 text-amber-400" />
            </button>

            {showDemoDropdown && (
              <div 
                className="absolute right-0 mt-1 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-2 z-50 text-xs space-y-1"
                onClick={() => setShowDemoDropdown(false)}
              >
                <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Simulate Presentation Scenarios
                </div>
                <button
                  onClick={() => triggerStormSpike('loc-hill-zone-a')}
                  className="w-full text-left px-2.5 py-2 rounded hover:bg-red-950/60 text-red-300 flex items-center justify-between border border-transparent hover:border-red-800/60 transition-colors"
                >
                  <div>
                    <div className="font-semibold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-red-400" />
                      Trigger Extreme Cloudburst
                    </div>
                    <div className="text-[10px] text-slate-400">Forces 64mm/h rain + ground creep</div>
                  </div>
                </button>
                <button
                  onClick={() => triggerStormSpike('loc-north-ridge-12')}
                  className="w-full text-left px-2.5 py-2 rounded hover:bg-orange-950/60 text-amber-300 flex items-center justify-between border border-transparent hover:border-amber-800/60 transition-colors"
                >
                  <div>
                    <div className="font-semibold flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-amber-400" />
                      Trigger Roadcut Rockfall Creep
                    </div>
                    <div className="text-[10px] text-slate-400">Highway 12 shear displacement</div>
                  </div>
                </button>
                <button
                  onClick={resetToBaseline}
                  className="w-full text-left px-2.5 py-2 rounded hover:bg-slate-800 text-slate-300 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset All to Baseline Normal</span>
                </button>
              </div>
            )}
          </div>

          {/* Simulation Toggle */}
          <button
            id="btn-toggle-telemetry"
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
              isSimulating
                ? 'bg-emerald-950/50 text-emerald-300 border-emerald-700/50 hover:bg-emerald-900/50'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
            }`}
            title={isSimulating ? 'Pause live telemetry simulation' : 'Resume live telemetry simulation'}
          >
            {isSimulating ? (
              <>
                <Pause className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Sim: Live</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline">Sim: Paused</span>
              </>
            )}
          </button>

          {/* Audio Mute */}
          <button
            id="btn-toggle-sound"
            onClick={toggleMute}
            className="p-1.5 rounded-md bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title={isMuted ? 'Unmute civil defense sirens' : 'Mute alert sirens'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Alerts Counter */}
          <button
            id="btn-nav-alerts"
            onClick={() => setActivePage('alerts')}
            className="relative p-1.5 rounded-md bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Open Alert Center"
          >
            <Bell className="w-4 h-4" />
            {criticalAlertsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-slate-900 animate-pulse">
                {criticalAlertsCount}
              </span>
            )}
          </button>
        </div>

        {/* Right User & Live Clock */}
        <div className="flex items-center gap-3">
          <div className="hidden xl:block text-right">
            <div className="text-[11px] font-mono text-slate-300 tracking-wider">
              {currentTime}
            </div>
            <div className="text-[10px] text-slate-500">
              UTC+05:30 (IST) / Geotech Hub
            </div>
          </div>

          {user ? (
            <div className="relative">
              <button
                id="btn-user-profile"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 transition-all text-left"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold leading-none text-slate-200">
                    {user.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-indigo-400 leading-none mt-0.5">
                    {user.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-1.5 w-60 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-2.5 z-50 text-xs">
                  <div className="pb-2 mb-2 border-b border-slate-800">
                    <p className="font-semibold text-slate-200">{user.name}</p>
                    <p className="text-[11px] text-slate-400">{user.email}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-mono bg-indigo-950 text-indigo-300 rounded border border-indigo-800/40">
                      ID: {user.badgeNumber}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mb-2">
                    {user.agency}
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-red-400 hover:bg-red-950/40 hover:text-red-300 rounded transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setActivePage('dashboard')}
              className="px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
