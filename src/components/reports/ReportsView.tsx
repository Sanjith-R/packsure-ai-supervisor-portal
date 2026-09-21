import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Scale, 
  Building2, 
  Calendar, 
  FileCheck,
  FileSpreadsheet,
  ChevronRight,
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';
import { Inspection, ComplianceStatus } from '../../types/inspection';
import { InspectionReportModal } from './InspectionReportModal';

interface ReportsViewProps {
  inspections: Inspection[];
  onSelectInspection: (inspection: Inspection) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ inspections, onSelectInspection }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Compliant' | 'Non-Compliant'>('All');
  const [sortBy, setSortBy] = useState<'date' | 'id' | 'product'>('date');
  const [activeReportModal, setActiveReportModal] = useState<Inspection | null>(null);

  // Statistics
  const totalCount = inspections.length;
  const nonCompliantCount = inspections.filter(i => i.aiComplianceResult === 'Non-Compliant').length;
  const compliantCount = inspections.filter(i => i.aiComplianceResult === 'Compliant').length;
  const reviewRequiredCount = inspections.filter(i => i.supervisorDecision === 'Pending Review').length;

  // Filter & Search logic
  const filteredInspections = useMemo(() => {
    return inspections.filter(item => {
      const matchesSearch = 
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = 
        statusFilter === 'All' ? true : item.aiComplianceResult === statusFilter;

      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      if (sortBy === 'id') return a.id.localeCompare(b.id);
      if (sortBy === 'product') return a.productName.localeCompare(b.productName);
      return new Date(b.inspectionDate).getTime() - new Date(a.inspectionDate).getTime();
    });
  }, [inspections, searchTerm, statusFilter, sortBy]);

  return (
    <div className="space-y-6 text-slate-800">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Legal Metrology Inspection Reports
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tabular registry of official Form-V inspection reports. Click any report to view and download the official PDF.
          </p>
        </div>

        {/* Quick Stat Counter Pills */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
            <span className="text-slate-500 font-medium">Total Reports: </span>
            <span className="font-bold text-slate-900">{totalCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800">
            <span className="font-medium">Non-Compliant: </span>
            <span className="font-bold">{nonCompliantCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
            <span className="font-medium">Compliant: </span>
            <span className="font-bold">{compliantCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search report ID, product, company, batch..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            {(['All', 'Non-Compliant', 'Compliant'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Tabular List of Reports */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Report ID</th>
                <th className="py-3 px-4">Commodity & Brand</th>
                <th className="py-3 px-4">Manufacturer / Packer</th>
                <th className="py-3 px-3">Batch / Lot</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Net Quantity Check</th>
                <th className="py-3 px-3 text-center">Compliance</th>
                <th className="py-3 px-4 text-right">PDF Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInspections.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-semibold text-slate-600">No inspection reports match your filter criteria.</p>
                    <p className="text-xs text-slate-400 mt-1">Try clearing your search query or status filter.</p>
                  </td>
                </tr>
              ) : (
                filteredInspections.map((item) => {
                  const isNonCompliant = item.aiComplianceResult === 'Non-Compliant';
                  const declaredWt = item.measurements.netWeight.declared;
                  const measuredWt = item.measurements.netWeight.measured;
                  const unit = item.measurements.netWeight.unit;
                  const isShortage = measuredWt < declaredWt;

                  return (
                    <tr 
                      key={item.id} 
                      onClick={() => setActiveReportModal(item)}
                      className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                    >
                      {/* Report ID */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded bg-slate-100 group-hover:bg-blue-100 text-slate-700 group-hover:text-blue-700 transition-colors">
                            <FileText className="w-3.5 h-3.5" />
                          </span>
                          <div>
                            <span className="font-mono font-bold text-blue-700 group-hover:underline text-[12px]">
                              {item.id}
                            </span>
                            <div className="text-[10px] text-slate-400 font-mono">
                              Form-V Verified
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Commodity & Brand */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <div className="font-bold text-slate-900 group-hover:text-blue-900 truncate">
                          {item.productName}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {item.brand} • <span className="text-slate-400">{item.category}</span>
                        </div>
                      </td>

                      {/* Manufacturer */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <div className="font-medium text-slate-800 truncate">
                          {item.companyName}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {item.location}
                        </div>
                      </td>

                      {/* Batch & Lot */}
                      <td className="py-3.5 px-3">
                        <div className="font-mono font-semibold text-slate-700">
                          {item.batchNumber}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Lot: {item.lotSize || 500} units
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-3 text-slate-600 font-medium whitespace-nowrap">
                        {item.inspectionDate}
                      </td>

                      {/* Net Quantity Check */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-slate-900 text-xs">
                            {measuredWt} {unit}
                          </span>
                          <span className="text-slate-400 text-[10px]">
                            / {declaredWt} {unit}
                          </span>
                        </div>
                        {isShortage ? (
                          <span className="text-[10px] font-semibold text-rose-600">
                            Shortage: {(declaredWt - measuredWt).toFixed(3)} {unit}
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-emerald-600">
                            Gravimetrically Compliant
                          </span>
                        )}
                      </td>

                      {/* Compliance Status */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          isNonCompliant
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {isNonCompliant ? (
                            <>
                              <AlertCircle className="w-3 h-3 text-rose-600" />
                              <span>Non-Compliant</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Compliant</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Action Button: Open PDF */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveReportModal(item);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs transition-all cursor-pointer group-hover:shadow"
                          title="Open official PDF report"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer summary bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-800">{filteredInspections.length}</strong> of <strong className="text-slate-800">{totalCount}</strong> inspection reports
          </span>
          <span className="font-medium text-slate-400">
            Click any row to open and download the official Automated Legal Metrology Inspection Report PDF
          </span>
        </div>
      </div>

      {/* Dedicated PDF Report Modal (opens ONLY when row / button clicked) */}
      <InspectionReportModal
        isOpen={!!activeReportModal}
        onClose={() => setActiveReportModal(null)}
        inspection={activeReportModal}
      />
    </div>
  );
};
