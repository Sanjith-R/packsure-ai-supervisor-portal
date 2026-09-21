import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileCheck2, 
  Clock, 
  RotateCw, 
  FileText, 
  Users, 
  Settings,
  Shield,
  Scale,
  Smartphone,
  X
} from 'lucide-react';
import { SidebarMenuItem } from '../../types/inspection';

const OFFICERS_STATUS_LIST = [
  { id: '1', name: 'Rajesh V. Sharma', badge: 'LM-OFF-MH-4019', isOnline: true, lastSeen: 'Active now' },
  { id: '2', name: 'Sunita P. Jadhav', badge: 'LM-OFF-MH-3108', isOnline: true, lastSeen: 'Active now' },
  { id: '3', name: 'Pooja R. Kulkarni', badge: 'LM-OFF-MH-5120', isOnline: true, lastSeen: 'Active now' },
  { id: '4', name: 'Sanjay S. Patil', badge: 'LM-OFF-MH-2940', isOnline: true, lastSeen: 'Active now' },
  { id: '5', name: 'Vijay M. Kapse', badge: 'LM-OFF-MH-1802', isOnline: true, lastSeen: 'Active now' },
  { id: '6', name: 'Anand R. Joshi', badge: 'LM-OFF-MH-1104', isOnline: false, lastSeen: '2h ago' },
  { id: '7', name: 'K. Senthil Kumar', badge: 'LM-OFF-MH-0842', isOnline: false, lastSeen: 'Offline' },
];

interface SidebarProps {
  currentMenu?: SidebarMenuItem;
  activeItem?: SidebarMenuItem;
  onSelectMenu?: (menu: SidebarMenuItem) => void;
  onSelectItem?: (menu: SidebarMenuItem) => void;
  pendingCount?: number;
  reinspectionCount?: number;
  onOpenMobileSync?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentMenu,
  activeItem,
  onSelectMenu,
  onSelectItem,
  pendingCount = 0,
  reinspectionCount = 0,
  onOpenMobileSync
}) => {
  const [isOfficerCanvasOpen, setIsOfficerCanvasOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOfficerCanvasOpen(false);
      }
    };
    if (isOfficerCanvasOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOfficerCanvasOpen]);

  const activeMenu = activeItem || currentMenu || 'Dashboard';
  const handleSelect = (item: SidebarMenuItem) => {
    if (onSelectMenu) {
      onSelectMenu(item);
    } else if (onSelectItem) {
      onSelectItem(item);
    }
  };
  const menuItems: Array<{
    name: SidebarMenuItem;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }> = [
    { name: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { 
      name: 'Inspections', 
      icon: <FileCheck2 className="w-4 h-4" />,
      badge: pendingCount > 0 ? pendingCount : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
    },
    { 
      name: 'Reinspections', 
      icon: <RotateCw className="w-4 h-4" />,
      badge: reinspectionCount,
      badgeColor: 'bg-amber-500/20 text-[#f5b342] border border-amber-500/30'
    },
    { name: 'Reports', icon: <FileText className="w-4 h-4" /> },
    { name: 'Officers', icon: <Users className="w-4 h-4" /> },
    { name: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-[#14100d] text-stone-300 flex flex-col shrink-0 border-r border-stone-800 select-none min-h-screen">
      {/* Brand & Emblem Header - Click to go Home/Dashboard */}
      <div 
        onClick={() => handleSelect('Dashboard')}
        className="p-4 border-b border-stone-800 bg-[#0e0b08] cursor-pointer hover:bg-stone-900/60 transition-colors"
        title="Go to Dashboard Home"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f5b342] to-[#f59042] flex items-center justify-center shadow-lg shadow-amber-950/40 border border-[#f5b342]/40 text-slate-950 font-black text-xl">
            <Scale className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold text-white tracking-tight">PackSure</span>
              <span className="text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#f59042] to-[#f5b342] text-slate-950 px-1.5 py-0.2 rounded text-[10px] shadow-sm">
                AI
              </span>
            </div>
            <div className="text-[11px] text-[#f5b342]/90 font-medium leading-none mt-1">
              Supervisor Portal
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider px-3 mb-2">
          Main Menu
        </div>
        {menuItems.map((item) => {
          const isActive = activeMenu === item.name;
          return (
            <button
              key={item.name}
              id={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => handleSelect(item.name)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 group ${
                isActive
                  ? 'bg-gradient-to-r from-[#f59042] to-[#f5b342] text-slate-950 shadow-md shadow-amber-950/30 font-bold'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`transition-colors ${isActive ? 'text-slate-950' : 'text-stone-400 group-hover:text-[#f5b342]'}`}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-slate-950 text-[#f5b342] font-extrabold' : item.badgeColor
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Mobile App Sync Status Footer with Anchored Officers Online Canvas */}
      <div className="p-3 border-t border-stone-800 bg-[#0e0b08]/90 text-xs relative" ref={popoverRef}>
        <button
          type="button"
          onClick={() => setIsOfficerCanvasOpen(prev => !prev)}
          className={`w-full text-left p-2.5 rounded-lg border text-[11px] transition-all cursor-pointer group shadow-sm active:scale-[0.98] ${
            isOfficerCanvasOpen 
              ? 'bg-stone-800/90 border-[#f5b342] ring-1 ring-[#f5b342]/40' 
              : 'bg-stone-900/90 hover:bg-stone-800/90 border-stone-800 hover:border-[#f5b342]/60'
          }`}
          title="Click to view officers online status"
        >
          <div className="flex items-center justify-between text-stone-300 group-hover:text-white">
            <span className="flex items-center gap-1.5 font-medium">
              <Smartphone className="w-3.5 h-3.5 text-[#f5b342] group-hover:scale-110 transition-transform" />
              PackSure Mobile Sync
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-stone-400 group-hover:text-stone-300 text-[10px] mt-1 flex justify-between">
            <span>5 Officers Online</span>
            <span className="font-mono text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live
            </span>
          </div>
        </button>

        {/* Small Canvas Flyout right next to PackSure Mobile Sync (no background blur) */}
        {isOfficerCanvasOpen && (
          <div 
            className="absolute left-[calc(100%+12px)] bottom-2 w-76 sm:w-80 bg-[#14100d] border border-stone-700/90 text-stone-100 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Directional arrow pointing to the sync button */}
            <div className="absolute -left-1.5 bottom-5 w-3 h-3 bg-[#14100d] border-l border-b border-stone-700/90 rotate-45 pointer-events-none" />

            {/* Header */}
            <div className="px-3.5 py-2.5 border-b border-stone-800 bg-[#0e0b08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#f5b342]" />
                <div>
                  <h4 className="text-xs font-bold text-white leading-none">Officers Online</h4>
                  <div className="text-[10px] text-stone-400 mt-1 flex items-center gap-1.5">
                    <span className="text-emerald-400 font-semibold">5 online</span>
                    <span className="text-stone-600">•</span>
                    <span>2 offline</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOfficerCanvasOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Officer Status List */}
            <div className="divide-y divide-stone-800/60 max-h-72 overflow-y-auto">
              {OFFICERS_STATUS_LIST.map((officer) => (
                <div 
                  key={officer.id}
                  className="px-3.5 py-2 flex items-center justify-between hover:bg-stone-900/70 transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-semibold text-stone-200 truncate">
                      {officer.name}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono flex items-center gap-1 mt-0.5">
                      <span>{officer.badge}</span>
                      <span className="text-stone-600">•</span>
                      <span>{officer.lastSeen}</span>
                    </div>
                  </div>

                  {officer.isOnline ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/90 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Online
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-900 text-stone-400 border border-stone-800 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-500" />
                      Offline
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Micro footer */}
            <div className="px-3.5 py-1.5 bg-[#0e0b08] border-t border-stone-800/80 flex items-center justify-between text-[10px] text-stone-400">
              <span className="font-mono text-emerald-400/90 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Handset Sync
              </span>
              <button 
                onClick={() => setIsOfficerCanvasOpen(false)}
                className="text-[#f5b342] hover:underline cursor-pointer font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
