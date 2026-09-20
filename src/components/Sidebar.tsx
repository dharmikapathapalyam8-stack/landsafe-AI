import React from 'react';
import {
  LayoutDashboard,
  Map,
  BrainCircuit,
  Radio,
  AlertTriangle,
  BellRing,
  BarChart3,
  MapPin,
  Settings,
  LogIn,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Flame
} from 'lucide-react';
import { useLandSafe } from '../context/LandSafeContext';
import { ActivePage } from '../types';

interface SidebarProps {
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed: propCollapsed,
  setIsCollapsed: propSetIsCollapsed
}) => {
  const [internalCollapsed, setInternalCollapsed] = React.useState(false);
  const isCollapsed = propCollapsed !== undefined ? propCollapsed : internalCollapsed;
  const setIsCollapsed = propSetIsCollapsed || setInternalCollapsed;
  const { activePage, setActivePage, alerts, user } = useLandSafe();

  const criticalCount = alerts.filter(
    (a) => a.status === 'CRITICAL_ACTIVE' || a.status === 'HIGH_ACTIVE'
  ).length;

  const navItems = [
    { id: 'dashboard' as ActivePage, label: 'Main Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'map' as ActivePage, label: 'Live Risk Map', icon: Map, badge: 'GIS' },
    { id: 'ai-prediction' as ActivePage, label: 'AI Risk Prediction', icon: BrainCircuit, badge: 'AI/ML' },
    { id: 'sensors' as ActivePage, label: 'Sensor Monitoring', icon: Radio, badge: '5 Live' },
    { id: 'early-warning' as ActivePage, label: 'Early Warning System', icon: AlertTriangle, badge: criticalCount > 0 ? `${criticalCount}` : null, alertBadge: true },
    { id: 'alerts' as ActivePage, label: 'Alert Center', icon: BellRing, badge: alerts.length > 0 ? `${alerts.length}` : null },
    { id: 'analytics' as ActivePage, label: 'Analytics & Charts', icon: BarChart3, badge: null },
    { id: 'locations' as ActivePage, label: 'Location Details', icon: MapPin, badge: null },
    { id: 'admin' as ActivePage, label: 'Admin Panel', icon: Settings, badge: user?.role === 'ADMIN' ? 'Root' : null }
  ];

  return (
    <aside
      id="app-sidebar"
      className={`bg-[#0b1329] border-r border-slate-800 text-slate-200 transition-all duration-300 flex flex-col justify-between z-30 shrink-0 select-none ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-2.5 flex flex-col gap-1 overflow-y-auto">
        {/* Navigation list */}
        <div className="space-y-1 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group relative ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-850 hover:bg-slate-800/60'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? 'text-white'
                      : item.alertBadge && criticalCount > 0
                      ? 'text-red-400 animate-pulse'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between truncate">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-semibold leading-none ${
                          item.alertBadge
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : isActive
                            ? 'bg-blue-700/60 text-blue-100'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}

                {/* Notification dot when collapsed */}
                {isCollapsed && item.alertBadge && criticalCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        {/* Separator */}
        <div className="my-2 border-t border-slate-800/80" />

        {/* Auth / Login Quick Link */}
        <button
          id="nav-login-toggle"
          onClick={() => setActivePage('dashboard')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-850 hover:bg-slate-800/50 transition-colors"
          title="Authority Login Portal"
        >
          <LogIn className="w-4 h-4 text-slate-400 shrink-0" />
          {!isCollapsed && <span>{user ? 'Session Active' : 'Login Portal'}</span>}
        </button>
      </div>

      {/* Bottom Footer & Collapse Toggle */}
      <div className="p-2 border-t border-slate-800 bg-[#090f20]">
        {!isCollapsed && (
          <div className="px-2 py-1.5 mb-2 rounded bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center justify-between text-slate-300 font-semibold mb-0.5">
              <span>Model: LandSafe v2.4</span>
              <span className="text-emerald-400 font-mono text-[10px]">Ready</span>
            </div>
            <p className="text-[10px] text-slate-500">
              Infinite Slope FoS + ML Ensembles
            </p>
          </div>
        )}

        <button
          id="btn-sidebar-collapse"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors text-xs"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!isCollapsed && <span className="ml-2">Collapse Menu</span>}
        </button>
      </div>
    </aside>
  );
};
