import React from 'react';
import {
  Radio,
  Cpu,
  Brain,
  Gauge,
  AlertTriangle,
  LifeBuoy,
  ChevronRight
} from 'lucide-react';
import { useLandSafe } from '../context/LandSafeContext';
import { ActivePage } from '../types';

export const FlowBreadcrumb: React.FC = () => {
  const { activePage, setActivePage, locations, alerts } = useLandSafe();

  const criticalCount = alerts.filter((a) => a.status === 'CRITICAL_ACTIVE' || a.status === 'HIGH_ACTIVE').length;
  const maxRisk = Math.max(...locations.map((l) => l.riskScore), 0);

  const steps = [
    {
      id: 'step-sensors',
      label: 'Sensor Data',
      subtext: '5 Sensor Arrays',
      icon: Radio,
      targetPage: 'sensors' as ActivePage,
      status: 'active'
    },
    {
      id: 'step-processing',
      label: 'Data Processing',
      subtext: 'Telemetry & FoS',
      icon: Cpu,
      targetPage: 'analytics' as ActivePage,
      status: 'active'
    },
    {
      id: 'step-ai',
      label: 'AI Risk Prediction',
      subtext: 'ML Regression Engine',
      icon: Brain,
      targetPage: 'ai-prediction' as ActivePage,
      status: 'active'
    },
    {
      id: 'step-risk',
      label: 'Risk Level',
      subtext: `Max: ${maxRisk}/100`,
      icon: Gauge,
      targetPage: 'map' as ActivePage,
      status: maxRisk >= 85 ? 'critical' : maxRisk >= 70 ? 'high' : 'normal'
    },
    {
      id: 'step-warning',
      label: 'Early Warning',
      subtext: `${criticalCount} Active Alerts`,
      icon: AlertTriangle,
      targetPage: 'early-warning' as ActivePage,
      status: criticalCount > 0 ? 'critical' : 'normal'
    },
    {
      id: 'step-action',
      label: 'Safety Action',
      subtext: 'Civil Defense Protocols',
      icon: LifeBuoy,
      targetPage: 'alerts' as ActivePage,
      status: 'active'
    }
  ];

  return (
    <div id="flow-pipeline-bar" className="bg-[#0f172a] border-b border-slate-800/80 px-4 py-2 overflow-x-auto">
      <div className="flex items-center min-w-max justify-between max-w-7xl mx-auto gap-2 text-xs">
        <div className="flex items-center gap-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase mr-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping mr-1" />
          Pipeline:
        </div>

        <div className="flex items-center gap-1.5 flex-1 justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isSelected = activePage === step.targetPage;
            const isAlertState = step.status === 'critical' || step.status === 'high';

            return (
              <React.Fragment key={step.id}>
                <button
                  id={step.id}
                  onClick={() => setActivePage(step.targetPage)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all group ${
                    isSelected
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
                      : isAlertState
                      ? 'bg-red-950/40 text-red-300 border border-red-800/50 hover:bg-red-900/40'
                      : 'bg-slate-900/70 text-slate-300 border border-slate-800 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <div className={`p-1 rounded ${
                    isAlertState ? 'bg-red-500/20 text-red-400' : isSelected ? 'bg-blue-500/30 text-cyan-300' : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-[11px] leading-tight flex items-center gap-1">
                      {step.label}
                    </div>
                    <div className="text-[9px] text-slate-400 leading-none">
                      {step.subtext}
                    </div>
                  </div>
                </button>

                {index < steps.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
