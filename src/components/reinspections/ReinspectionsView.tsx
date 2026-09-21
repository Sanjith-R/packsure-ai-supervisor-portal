import React, { useState, useMemo } from 'react';
import { 
  RotateCw, 
  Link as LinkIcon, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  ArrowRight,
  Plus, 
  FileCheck2, 
  Search,
  Filter,
  Calendar,
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import { Inspection, ReinspectionRecord } from '../../types/inspection';

interface ReinspectionsViewProps {
  inspections: Inspection[];
  reinspectionRecords: ReinspectionRecord[];
  onSelectInspection: (inspection: Inspection) => void;
  onOpenReinspectionModalForAny: () => void;
}

export const ReinspectionsView: React.FC<ReinspectionsViewProps> = ({
  inspections,
  reinspectionRecords,
  onSelectInspection,
  onOpenReinspectionModalForAny
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const pendingCount = useMemo(() => 
    reinspectionRecords.filter(r => r.status === 'Pending Officer Visit' || r.status === 'In Review').length,
    [reinspectionRecords]
  );
  
  const resolvedCount = useMemo(() => 
    reinspectionRecords.filter(r => r.status === 'Re-analyzed - Resolved').length,
    [reinspectionRecords]
  );

  const filteredRecords = useMemo(() => {
    return reinspectionRecords.filter(record => {
      // Tab filter
      if (activeFilter === 'pending' && !(record.status === 'Pending Officer Visit' || record.status === 'In Review')) {
        return false;
      }
      if (activeFilter === 'resolved' && record.status !== 'Re-analyzed - Resolved') {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          record.id.toLowerCase().includes(q) ||
          record.productName.toLowerCase().includes(q) ||
          record.originalInspectionId.toLowerCase().includes(q) ||
          record.newInspectionId.toLowerCase().includes(q) ||
          record.previousBatch.toLowerCase().includes(q) ||
          record.newBatch.toLowerCase().includes(q) ||
          record.assignedOfficer.toLowerCase().includes(q) ||
          record.reason.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [reinspectionRecords, activeFilter, searchQuery]);

  return (
    <div className="space-y-5 text-slate-800">
      {/* View Header with Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <RotateCw className="w-5 h-5 text-[#f59042]" />
            Statutory Reinspections & Chains
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Trace mandatory follow-up audits, re-tested batches, and linked inspection chains.
          </p>
        </div>

        <button
          onClick={onOpenReinspectionModalForAny}
          className="px-3.5 py-2 bg-[#f59042] hover:bg-[#e07f30] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Order Fresh Lot Reinspection</span>
        </button>
      </div>

      {/* Sub-Filters & Quick Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-xs">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Linked Records ({reinspectionRecords.length})
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'pending'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/70'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Field Visit ({pendingCount})</span>
          </button>
          <button
            onClick={() => setActiveFilter('resolved')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'resolved'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/70'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Resolved Compliant ({resolvedCount})</span>
          </button>
        </div>

        {/* Search Bar for Chains */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search chains, batches, IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Reinspection Chain Cards */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <RotateCw className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">No Reinspection Records Found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No linked reinspection records match the current filter or search criteria.
          </p>
          <button
            onClick={onOpenReinspectionModalForAny}
            className="mt-4 px-4 py-2 bg-[#f59042] hover:bg-[#e07f30] text-white font-bold rounded-lg text-xs inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Order Fresh Lot Reinspection</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record) => {
            const parentInspection = inspections.find(i => i.id === record.originalInspectionId);
            const childInspection = inspections.find(i => i.id === record.newInspectionId);

            return (
              <div
                key={record.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:border-amber-300 transition-all"
              >
                {/* Card Header */}
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-amber-100 text-amber-700">
                      <LinkIcon className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {record.id}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-bold text-slate-900">
                      {record.productName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                      record.status === 'Re-analyzed - Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800 animate-pulse'
                    }`}>
                      {record.status}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">{record.orderedDate}</span>
                  </div>
                </div>

                {/* Chain Diagram */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                  {/* Parent Block (5 cols) */}
                  <div className="md:col-span-5 bg-rose-50/50 border border-rose-200 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        Initial Audit (Failed)
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-800">
                        {record.originalInspectionId}
                      </span>
                    </div>
                    <div className="text-xs">
                      <div className="text-slate-500">Defective Batch:</div>
                      <div className="font-mono font-bold text-slate-900">{record.previousBatch}</div>
                    </div>
                    {parentInspection ? (
                      <button
                        onClick={() => onSelectInspection(parentInspection)}
                        className="text-xs font-semibold text-rose-700 hover:text-rose-900 hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                      >
                        <span>Inspect Parent Dossier</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Archived dossier</span>
                    )}
                  </div>

                  {/* Arrow Connector (1 col) */}
                  <div className="md:col-span-1 flex items-center justify-center text-amber-500 py-1">
                    <ArrowRight className="w-6 h-6 hidden md:block" />
                    <div className="md:hidden text-xs font-bold text-amber-600">↓ Mandated Follow-Up ↓</div>
                  </div>

                  {/* Child Block (5 cols) */}
                  <div className="md:col-span-5 bg-blue-50/60 border border-blue-200 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-blue-600" />
                        Rectified Reinspection Dossier
                      </span>
                      <span className="font-mono text-xs font-bold text-blue-800">
                        {record.newInspectionId}
                      </span>
                    </div>
                    <div className="text-xs">
                      <div className="text-slate-500">Verified New Batch:</div>
                      <div className="font-mono font-bold text-blue-900">{record.newBatch}</div>
                    </div>
                    {childInspection ? (
                      <button
                        onClick={() => onSelectInspection(childInspection)}
                        className="text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                      >
                        <span>Inspect Reinspection Record</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic block pt-1">
                        Officer assigned: {record.assignedOfficer}
                      </span>
                    )}
                  </div>
                </div>

                {/* Reasons & Supervisor Directive Footer */}
                <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <strong className="text-slate-800">Mandate Directive: </strong>
                    {record.reason}
                  </div>
                  <div className="text-slate-500 text-[11px] shrink-0">
                    Assigned Officer: <strong className="text-slate-800">{record.assignedOfficer}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
