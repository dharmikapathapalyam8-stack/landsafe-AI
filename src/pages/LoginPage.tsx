import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Radio,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Flame
} from 'lucide-react';
import { useLandSafe } from '../context/LandSafeContext';

export const LoginPage: React.FC = () => {
  const { login, setActivePage } = useLandSafe();
  const [email, setEmail] = useState('officer@landsafe.gov');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<'AUTHORITY' | 'ADMIN' | 'FIELD_ENGINEER'>('AUTHORITY');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
    setActivePage('dashboard');
  };

  const handleDemoLogin = (role: 'AUTHORITY' | 'ADMIN' | 'FIELD_ENGINEER') => {
    login(role);
    setActivePage('dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-110px)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#070d1e] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,116,144,0.15),rgba(255,255,255,0))]">
      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
        {/* Left: Disaster Management Themed Hero Banner */}
        <div className="p-8 bg-gradient-to-br from-[#0c1838] via-[#091329] to-[#040817] text-white flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-slate-800">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-red-950/60">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Landsafe AI</h1>
                <p className="text-xs text-slate-400 font-mono">Disaster Management Early Warning</p>
              </div>
            </div>

            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                <Radio className="w-3.5 h-3.5 animate-pulse" /> Real-time Geotechnical Intelligence
              </span>
              <h2 className="text-2xl font-black text-slate-100 tracking-tight leading-snug">
                Predictive Landslide Risk Prevention & Early Warning
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Empowering emergency rescue command centers, geotechnical researchers, and regional authorities with live sensor telemetry and AI-driven early warnings.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Infinite Slope Factor of Safety & ML Regression</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multi-tier automated SMS & Civil Siren dispatch</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Interactive GIS Leaflet slope saturation contouring</span>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-6 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Hackathon Prototype v2.4</span>
            <span className="text-cyan-400">Civil Defense Secure</span>
          </div>
        </div>

        {/* Right: Login Form & One-Click Demo Access */}
        <div className="p-8 flex flex-col justify-center space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-100">Authority Login</h3>
            <p className="text-xs text-slate-400 mt-1">
              Access the operational early warning and hazard response desk.
            </p>
          </div>

          {/* Quick Demo Login Preset Buttons */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" /> 1-Click Demo Logins (Instant Hackathon Access)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('AUTHORITY')}
                className="p-2.5 rounded-lg bg-blue-950/50 border border-blue-800/60 hover:border-blue-500 hover:bg-blue-900/40 text-left transition-all group"
              >
                <div className="text-xs font-bold text-blue-300 group-hover:text-white flex items-center justify-between">
                  <span>Authority Officer</span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Disaster Management Command</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('ADMIN')}
                className="p-2.5 rounded-lg bg-purple-950/50 border border-purple-800/60 hover:border-purple-500 hover:bg-purple-900/40 text-left transition-all group"
              >
                <div className="text-xs font-bold text-purple-300 group-hover:text-white flex items-center justify-between">
                  <span>System Admin</span>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Sensor Config & Thresholds</div>
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleDemoLogin('FIELD_ENGINEER')}
              className="w-full p-2 rounded-lg bg-slate-800/70 border border-slate-700 hover:border-slate-500 text-left transition-all flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-slate-300">Field Geotech Engineer</span>
                <span className="text-[10px] text-slate-400 ml-2">Telemetry & Calibration</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[10px] font-mono uppercase text-slate-500">
              Or Sign In with Credentials
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Authorized Agency Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Passcode / Token
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0" />
                <span>Remember console</span>
              </label>
              <span className="text-blue-400 hover:underline cursor-pointer text-[11px]">
                Emergency Hotline?
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-950 transition-all flex items-center justify-center gap-2"
            >
              <span>Access Emergency Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
