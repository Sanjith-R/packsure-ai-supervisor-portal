import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Smartphone, 
  CheckCircle2, 
  Clock, 
  Send, 
  Search, 
  ShieldCheck, 
  ChevronRight,
  Award,
  Plus,
  AlertTriangle,
  Building2,
  Calendar,
  Filter,
  FileCheck2,
  ExternalLink,
  PackageCheck
} from 'lucide-react';
import { OFFICER_ACTIVITY_DATA } from '../../data/mockData';
import { Inspection, OfficerProfile, DispatchAssignment } from '../../types/inspection';
import { DispatchAssignmentModal } from './DispatchAssignmentModal';

const INITIAL_DISPATCHES: DispatchAssignment[] = [
  {
    id: 'DSP-2026-0812',
    officerBadge: 'LM-OFF-MH-4019',
    officerName: 'Rajesh V. Sharma',
    targetType: 'Statutory Re-inspection',
    inspectionId: 'INSP-2026-0891',
    productName: 'Tata Tea Gold 500g (Batch: TT-2026-B81)',
    facilityName: 'D-Mart Supercenter, Andheri West',
    location: 'Linking Road, Andheri West, Mumbai',
    zone: 'West Zone - Region 2 (Mumbai Suburban)',
    priority: 'Urgent (24h)',
    scheduledDate: '2026-09-19',
    instructions: 'Re-audit of declared net weight deficiency. Draw 10 sealed retail packages from fresh delivery. Verify tare weight calibration.',
    dispatchedAt: '2026-09-18 09:30:00',
    dispatchedBy: 'Chief Legal Metrology Supervisor',
    status: 'In Progress'
  },
  {
    id: 'DSP-2026-0809',
    officerBadge: 'LM-OFF-MH-3108',
    officerName: 'Sunita P. Jadhav',
    targetType: 'MRP & Dual-Sticker Drive',
    inspectionId: 'INSP-2026-0888',
    productName: 'Fortune Sunlite Sunflower Oil 1L',
    facilityName: 'Reliance Fresh Retail Hub',
    location: 'Sector 17, Vashi, Navi Mumbai',
    zone: 'North Zone - Sector 4 (Thane & Navi Mumbai)',
    priority: 'High',
    scheduledDate: '2026-09-19',
    instructions: 'Investigate reports of dual price labels and obscured MRP text under Section 39 of Legal Metrology Act.',
    dispatchedAt: '2026-09-17 14:15:00',
    dispatchedBy: 'Chief Legal Metrology Supervisor',
    status: 'Dispatched to Mobile'
  },
  {
    id: 'DSP-2026-0801',
    officerBadge: 'LM-OFF-MH-2940',
    officerName: 'Sanjay S. Patil',
    targetType: 'Routine Surveillance',
    productName: 'Pre-Packaged Pulses & Grains',
    facilityName: 'Central Agricultural Mandi Wholesale Depot',
    location: 'APMC Market Yard, Powai',
    zone: 'Central Zone - Region 3 (Powai & Ghatkopar)',
    priority: 'Routine',
    scheduledDate: '2026-09-20',
    instructions: 'Spot check on 5kg and 10kg bulk packaged staples for mandatory packer address and consumer care declarations.',
    dispatchedAt: '2026-09-16 11:00:00',
    dispatchedBy: 'Chief Legal Metrology Supervisor',
    status: 'Acknowledged'
  },
  {
    id: 'DSP-2026-0795',
    officerBadge: 'LM-OFF-MH-5120',
    officerName: 'Pooja R. Kulkarni',
    targetType: 'Consumer Complaint',
    productName: 'Amul Taaza Homogenised Toned Milk 1L',
    facilityName: 'Dadar Station Daily Mart & Cold Store',
    location: 'Dr. B.A. Road, Dadar East, Mumbai',
    zone: 'Central Zone - Region 1 (Dadar & Wadala)',
    priority: 'High',
    scheduledDate: '2026-09-17',
    instructions: 'Verify refrigeration tare compensation and check net volume compliance under Rule 18.',
    dispatchedAt: '2026-09-15 16:45:00',
    dispatchedBy: 'Chief Legal Metrology Supervisor',
    status: 'Completed'
  }
];

interface OfficersViewProps {
  inspections?: Inspection[];
  onAssignDispatch?: (assignment: DispatchAssignment) => void;
  onSelectInspection?: (inspection: Inspection) => void;
}

export const OfficersView: React.FC<OfficersViewProps> = ({
  inspections = [],
  onAssignDispatch,
  onSelectInspection
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'roster' | 'dispatches'>('roster');
  const [officersList, setOfficersList] = useState<OfficerProfile[]>(OFFICER_ACTIVITY_DATA);
  const [dispatches, setDispatches] = useState<DispatchAssignment[]>(INITIAL_DISPATCHES);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [targetOfficerBadge, setTargetOfficerBadge] = useState<string | undefined>(undefined);
  
  // Filter for dispatches tab
  const [dispatchFilter, setDispatchFilter] = useState<string>('All');
  
  // Success Toast Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter officers
  const filteredOfficers = officersList.filter(o => 
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.badge.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter dispatches
  const filteredDispatches = dispatches.filter(d => {
    const matchSearch = 
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.officerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.officerBadge.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.targetType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = dispatchFilter === 'All' || d.status === dispatchFilter || (dispatchFilter === 'Urgent' && d.priority.includes('Urgent'));

    return matchSearch && matchStatus;
  });

  const handleOpenDispatchModal = (badge?: string) => {
    setTargetOfficerBadge(badge);
    setIsModalOpen(true);
  };

  const handleConfirmDispatch = (assignment: DispatchAssignment) => {
    // 1. Add to dispatches list
    setDispatches(prev => [assignment, ...prev]);

    // 2. Increment officer's workload/pendingAction count
    setOfficersList(prev => prev.map(off => {
      if (off.badge === assignment.officerBadge) {
        return {
          ...off,
          pendingAction: off.pendingAction + 1
        };
      }
      return off;
    }));

    // 3. Trigger parent callback if provided
    if (onAssignDispatch) {
      onAssignDispatch(assignment);
    }

    // 4. Show confirmation notification
    setToastMessage(`Dispatch Order #${assignment.id} successfully assigned & transmitted to ${assignment.officerName} (${assignment.officerBadge}) terminal.`);
    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  const getOfficerActiveDispatchesCount = (badge: string) => {
    return dispatches.filter(d => d.officerBadge === badge && d.status !== 'Completed').length;
  };

  return (
    <div className="space-y-5 text-slate-800">
      {/* Toast Confirmation Notification */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 flex items-center justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-xs text-emerald-700 hover:text-emerald-950 font-bold px-2 py-0.5 rounded hover:bg-emerald-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Header Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-3.5 py-1.5 rounded-md font-bold transition-all flex items-center gap-2 ${
              activeTab === 'roster'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Officers Roster</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
              {officersList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('dispatches')}
            className={`px-3.5 py-1.5 rounded-md font-bold transition-all flex items-center gap-2 ${
              activeTab === 'dispatches'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-indigo-600" />
            <span>Active Dispatches</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
              {dispatches.length}
            </span>
          </button>
        </div>

        {/* Right: Search + Dispatch Action */}
        <div className="flex items-center gap-2.5 flex-1 md:justify-end">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={activeTab === 'roster' ? "Search officers, badges, zones..." : "Search dispatches, facilities..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <button
            onClick={() => handleOpenDispatchModal()}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Field Dispatch</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Officers Roster Grid */}
      {activeTab === 'roster' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOfficers.map((officer) => {
            const activeDispatchesCount = getOfficerActiveDispatchesCount(officer.badge);

            return (
              <div
                key={officer.badge}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 hover:border-blue-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-blue-700 text-white font-bold text-sm flex items-center justify-center shadow-md shrink-0">
                        {officer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          {officer.name}
                          <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active in Field" />
                        </h3>
                        <div className="text-xs font-mono text-blue-700 font-semibold">{officer.badge}</div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      {officer.status}
                    </span>
                  </div>

                  <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        Jurisdiction:
                      </span>
                      <span className="font-bold text-slate-800 text-right truncate max-w-[150px]" title={officer.zone}>
                        {officer.zone}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Smartphone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        Terminal:
                      </span>
                      <span className="font-mono font-semibold text-slate-700">v2.4.1 (Online)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs mt-3">
                    <div className="p-2 bg-blue-50/50 rounded-lg border border-blue-100">
                      <div className="text-slate-500 text-[11px]">Total Audits</div>
                      <div className="text-base font-bold text-blue-900">{officer.totalInspected}</div>
                    </div>
                    <div className="p-2 bg-emerald-50/50 rounded-lg border border-emerald-100">
                      <div className="text-emerald-700 text-[11px]">Pass Rate</div>
                      <div className="text-base font-bold text-emerald-800">{officer.complianceRate}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-2">
                  <div className="space-y-0.5">
                    <div className="text-slate-500 text-[11px]">
                      Pending Reviews: <strong className="text-slate-900">{officer.pendingAction}</strong>
                    </div>
                    {activeDispatchesCount > 0 && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        <Send className="w-2.5 h-2.5" />
                        {activeDispatchesCount} active {activeDispatchesCount === 1 ? 'dispatch' : 'dispatches'}
                      </span>
                    )}
                  </div>

                  {/* Assign / Dispatch Action Button */}
                  <button 
                    onClick={() => handleOpenDispatchModal(officer.badge)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs transition-all shadow-2xs hover:shadow-xs flex items-center gap-1.5 active:scale-95"
                    title={`Assign and dispatch a field task to ${officer.name}`}
                  >
                    <Send className="w-3 h-3" />
                    <span>Dispatch</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Active Dispatches & Task Orders */}
      {activeTab === 'dispatches' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-3">
          {/* Dispatch Sub-filters */}
          <div className="p-3 bg-slate-50/60 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mr-1">Filter:</span>
              {['All', 'Urgent', 'Dispatched to Mobile', 'Acknowledged', 'In Progress', 'Completed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setDispatchFilter(f)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    dispatchFilter === f
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="text-slate-500 text-xs">
              Showing <strong>{filteredDispatches.length}</strong> of {dispatches.length} orders
            </div>
          </div>

          {/* Dispatches Listing Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Dispatch Order ID</th>
                  <th className="py-3 px-4">Assigned Field Officer</th>
                  <th className="py-3 px-4">Target Facility & Location</th>
                  <th className="py-3 px-4">Category & Commodity</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Scheduled Date</th>
                  <th className="py-3 px-4">Mobile Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredDispatches.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500 italic">
                      No dispatched tasks match the selected filter or search query.
                    </td>
                  </tr>
                ) : (
                  filteredDispatches.map((dsp) => {
                    const isUrgent = dsp.priority.includes('Urgent');

                    return (
                      <tr key={dsp.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-blue-700">
                          <div>{dsp.id}</div>
                          <div className="text-[10px] text-slate-400 font-sans font-normal">{dsp.dispatchedAt.split(' ')[0]}</div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{dsp.officerName}</div>
                          <div className="text-[11px] font-mono text-slate-500">{dsp.officerBadge}</div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-800 flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[200px]" title={dsp.facilityName}>
                              {dsp.facilityName}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[200px]" title={dsp.location}>{dsp.location}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 inline-block mb-0.5">
                            {dsp.targetType}
                          </span>
                          <div className="text-[11px] text-slate-600 font-medium truncate max-w-[180px]" title={dsp.productName}>
                            {dsp.productName}
                          </div>
                          {dsp.inspectionId && (
                            <div className="text-[10px] font-mono text-blue-600 flex items-center gap-0.5">
                              <span>Linked: {dsp.inspectionId}</span>
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            isUrgent
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : dsp.priority === 'High'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {dsp.priority}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-medium text-slate-700">
                          <div className="flex items-center gap-1 text-slate-600">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{dsp.scheduledDate}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit border ${
                            dsp.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : dsp.status === 'In Progress'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : dsp.status === 'Acknowledged'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              dsp.status === 'Completed' ? 'bg-emerald-500' :
                              dsp.status === 'In Progress' ? 'bg-blue-500 animate-pulse' :
                              dsp.status === 'Acknowledged' ? 'bg-purple-500' : 'bg-amber-500'
                            }`} />
                            {dsp.status}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleOpenDispatchModal(dsp.officerBadge)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-md font-bold text-[11px] transition-colors"
                            title="Reassign or issue fresh task to this officer"
                          >
                            Reassign
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dispatch Assignment Modal */}
      <DispatchAssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        officers={officersList}
        initialOfficerBadge={targetOfficerBadge}
        inspections={inspections}
        onConfirmDispatch={handleConfirmDispatch}
      />
    </div>
  );
};
