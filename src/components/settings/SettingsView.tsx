import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Key, 
  Bell, 
  Sliders, 
  Database, 
  CheckCircle2, 
  Save,
  Server
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [savedToast, setSavedToast] = useState<boolean>(false);
  const [mpeTolerance, setMpeTolerance] = useState<string>('Standard (Schedule-IV)');
  const [minFontHeight, setMinFontHeight] = useState<string>('4.0');
  const [enableAutoFlag, setEnableAutoFlag] = useState<boolean>(true);
  const [notifyUrgent, setNotifyUrgent] = useState<boolean>(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6 text-slate-800">
      {savedToast && (
        <div className="p-4 rounded-xl bg-emerald-600 text-white shadow-lg flex items-center justify-between animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs font-bold">Regulatory System Preferences Saved Successfully</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Rule Engine Thresholds */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Rule Engine & Tolerances</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Net Weight Gravimetric MPE Table
              </label>
              <select
                value={mpeTolerance}
                onChange={(e) => setMpeTolerance(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              >
                <option value="Standard (Schedule-IV)">Schedule-IV Standard MPE (Default)</option>
                <option value="Schedule-IV Strict (Zero Negative Tolerance)">Strict Mode (Zero Negative Tolerance for Infant Foods)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Principal Display Panel Minimum Font Height (mm)
              </label>
              <input
                type="number"
                step="0.5"
                value={minFontHeight}
                onChange={(e) => setMinFontHeight(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Supervisor Digital Signature (DSC) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Supervisor Digital Signature & e-Sign</h3>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span>Amit K. Deshmukh (LM-SUP-MH-014)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                  Valid Certificate
                </span>
              </div>
              <div className="text-slate-500 font-mono text-[11px]">
                Issuer: National Informatics Centre (NIC-CA) • SHA-256 Fingerprint: 4f:9a:11:bc:...:88
              </div>
              <div className="text-slate-400 text-[10px]">Expires: December 31, 2027</div>
            </div>

            <button
              type="button"
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg font-semibold text-slate-700 text-xs"
            >
              Verify Token
            </button>
          </div>
        </div>

        {/* Section 3: Notification Alerts */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Enforcement Notifications</h3>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyUrgent}
                onChange={(e) => setNotifyUrgent(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              <span className="text-slate-700 font-medium">
                Immediately notify supervisor on High-Priority Non-Compliance or critical weight breaches
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enableAutoFlag}
                onChange={(e) => setEnableAutoFlag(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              <span className="text-slate-700 font-medium">
                Auto-generate Form-V notice draft when AI detects multiple critical PCR infractions
              </span>
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Configurations</span>
          </button>
        </div>
      </form>
    </div>
  );
};
