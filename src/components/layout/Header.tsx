import React from 'react';
import { 
  Bell, 
  Search, 
  ShieldCheck, 
  Clock,
  ChevronDown
} from 'lucide-react';
import { Inspection } from '../../types/inspection';

interface HeaderProps {
  currentViewTitle?: string;
  pendingCount?: number;
  onNavigateHome?: () => void;
  onNavigateToPending?: () => void;
  onOpenPending?: () => void;
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
  onSearch?: (val: string) => void;
  onSelectInspection?: (inspection: Inspection) => void;
  inspections?: Inspection[];
}

export const Header: React.FC<HeaderProps> = ({
  currentViewTitle = 'Dashboard',
  pendingCount = 0,
  onNavigateHome,
  onNavigateToPending,
  onOpenPending,
  searchTerm,
  onSearchChange,
  onSearch,
  onSelectInspection,
  inspections = []
}) => {
  const [internalSearchTerm, setInternalSearchTerm] = React.useState('');
  const [showNotificationMenu, setShowNotificationMenu] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  // Use controlled searchTerm if provided, otherwise internal state
  const activeSearch = searchTerm !== undefined ? searchTerm : internalSearchTerm;
  const trimmedSearch = (activeSearch || '').trim();

  const handlePendingClick = () => {
    if (onNavigateToPending) {
      onNavigateToPending();
    } else if (onOpenPending) {
      onOpenPending();
    }
  };

  const handleSearchInputChange = (val: string) => {
    if (searchTerm === undefined) {
      setInternalSearchTerm(val);
    }
    if (onSearchChange) {
      onSearchChange(val);
    }
    // Note: Do NOT trigger full page navigation on every keystroke
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(activeSearch);
      setInternalSearchTerm('');
    }
  };

  // Quick search results
  const matchingInspections = React.useMemo(() => {
    if (!trimmedSearch) return [];
    const query = trimmedSearch.toLowerCase();
    const safeInspections = Array.isArray(inspections) ? inspections : [];
    return safeInspections.filter(i => 
      (i.productName || '').toLowerCase().includes(query) ||
      (i.id || '').toLowerCase().includes(query) ||
      (i.batchNumber || '').toLowerCase().includes(query) ||
      (i.officerName || '').toLowerCase().includes(query)
    ).slice(0, 5);
  }, [trimmedSearch, inspections]);

  return (
    <header className="h-16 bg-[#14100d] border-b border-stone-800 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm text-stone-100">
      {/* Search Bar */}
      <div className="relative w-80 lg:w-96">
        <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search inspection ID, batch, product... (Enter to view)"
              value={activeSearch}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full pl-9 pr-4 py-1.5 bg-stone-900/80 border border-stone-700/80 rounded-lg text-sm text-stone-200 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#f59042] focus:border-[#f5b342] transition-colors"
            />
          </div>

        {/* Search dropdown suggestions */}
        {trimmedSearch.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-stone-900 border border-stone-700 rounded-lg shadow-xl overflow-hidden z-50">
            <div className="p-2 border-b border-stone-800 text-xs font-semibold text-stone-400 flex justify-between">
              <span>Matching Records</span>
              <span>{matchingInspections.length} results</span>
            </div>
            {matchingInspections.length === 0 ? (
              <div className="p-3 text-sm text-stone-400 text-center">
                No matching inspections found
              </div>
            ) : (
              <div className="divide-y divide-stone-800 max-h-60 overflow-y-auto">
                {matchingInspections.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (onSelectInspection) onSelectInspection(item);
                      handleSearchInputChange('');
                    }}
                    className="w-full text-left p-2.5 hover:bg-stone-800/80 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#f5b342]">{item.id}</span>
                        <span className="text-xs text-stone-400">• {item.batchNumber}</span>
                      </div>
                      <div className="text-sm font-medium text-stone-200 truncate max-w-[240px]">
                        {item.productName}
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      item.aiComplianceResult === 'Compliant'
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                        : item.aiComplianceResult === 'Non-Compliant'
                        ? 'bg-rose-950/60 text-rose-400 border-rose-800'
                        : 'bg-amber-950/60 text-amber-400 border-amber-800'
                    }`}>
                      {item.aiComplianceResult}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls: Notifications & Supervisor Profile */}
      <div className="flex items-center space-x-3">
        {/* Pending Reviews Pill Button */}
        <button
          onClick={handlePendingClick}
          className="relative flex items-center gap-2 px-3 py-1.5 bg-[#f59042]/20 hover:bg-[#f59042]/30 border border-[#f5b342]/40 text-[#f5b342] rounded-lg text-xs font-medium transition-colors"
          title="Review pending submissions"
        >
          <Clock className="w-3.5 h-3.5 text-[#f5b342] animate-pulse" />
          <span>Pending Queue:</span>
          <span className="px-1.5 py-0.2 bg-gradient-to-r from-[#f59042] to-[#f5b342] text-slate-950 font-bold rounded-full text-[11px]">
            {pendingCount}
          </span>
        </button>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationMenu(!showNotificationMenu)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {pendingCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
            )}
          </button>

          {showNotificationMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 overflow-hidden">
              <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  System Alerts
                </span>
                <span className="text-[11px] text-blue-400 cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="p-3 space-y-2 max-h-72 overflow-y-auto text-xs">
                <div className="p-2 bg-slate-800/60 rounded border border-slate-700">
                  <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    SLA Alert: 24h Review Window
                  </div>
                  <p className="text-slate-300 mt-1">
                    Inspection INS-2026-0841 (Britannia Cookies) has been pending for over 18 hours.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">15 mins ago</span>
                </div>
                <div className="p-2 bg-slate-800/60 rounded border border-slate-700">
                  <div className="font-semibold text-rose-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                    Critical Violation Flagged
                  </div>
                  <p className="text-slate-300 mt-1">
                    Aashirvaad Shudh Chakki Atta 5kg exceeds Schedule IV Max Permissible Error by 82g.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">2 hours ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-700" />

        {/* Supervisor User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 pl-2 pr-2.5 py-1 rounded-lg hover:bg-stone-800/80 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f5b342] to-[#f59042] border border-[#f5b342]/50 flex items-center justify-center text-slate-950 font-black text-xs shadow-inner">
              AD
            </div>
            <div className="hidden md:block">
              <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                Amit K. Deshmukh
                <ShieldCheck className="w-3.5 h-3.5 text-[#f5b342] inline" />
              </div>
              <div className="text-[10px] text-stone-400 leading-tight">
                Senior Legal Metrology Supervisor
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 p-3 text-xs">
              <div className="border-b border-slate-800 pb-2 mb-2">
                <div className="font-bold text-white">Amit K. Deshmukh</div>
                <div className="text-slate-400 font-mono text-[11px]">ID: LM-SUP-MH-014</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Authorized Digital Seal Active (Sec. 39)
                </div>
              </div>
              <div className="space-y-1 text-slate-300">
                <div className="p-1.5 hover:bg-slate-800 rounded cursor-pointer">
                  Directorate of Legal Metrology, Government of India
                </div>
                <div className="p-1.5 hover:bg-slate-800 rounded cursor-pointer">
                  Central Enforcement & Surveillance Wing
                </div>
                <div className="p-1.5 hover:bg-slate-800 rounded cursor-pointer">
                  Digital Certificate: Valid till Oct 2027
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
