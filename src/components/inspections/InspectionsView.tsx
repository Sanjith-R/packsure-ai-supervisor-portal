import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ChevronRight, 
  Eye, 
  ArrowUpDown, 
  Link as LinkIcon,
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { Inspection, ComplianceStatus, SupervisorDecision } from '../../types/inspection';

interface InspectionsViewProps {
  inspections: Inspection[];
  onSelectInspection: (inspection: Inspection) => void;
  filterPendingOnly?: boolean;
}

export const InspectionsView: React.FC<InspectionsViewProps> = ({
  inspections,
  onSelectInspection,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('date-desc');

  // Filter and sort inspections
  const filteredInspections = useMemo(() => {
    return inspections
      .filter((item) => {
        // Text search
        const matchSearch =
          item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.officerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.companyName.toLowerCase().includes(searchTerm.toLowerCase());

        // Status filter
        const matchStatus = statusFilter === 'All' || item.aiComplianceResult === statusFilter;

        // Category filter
        const matchCategory = categoryFilter === 'All' || item.category === categoryFilter;

        return matchSearch && matchStatus && matchCategory;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'date-asc':
            return new Date(a.inspectionDate).getTime() - new Date(b.inspectionDate).getTime();
          case 'date-desc':
            return new Date(b.inspectionDate).getTime() - new Date(a.inspectionDate).getTime();
          case 'pending-first': {
            const aIsPending = a.supervisorDecision === 'Pending Review' ? 1 : 0;
            const bIsPending = b.supervisorDecision === 'Pending Review' ? 1 : 0;
            if (bIsPending !== aIsPending) return bIsPending - aIsPending;
            return new Date(b.inspectionDate).getTime() - new Date(a.inspectionDate).getTime();
          }
          case 'score-asc':
            return a.aiComplianceScore - b.aiComplianceScore;
          case 'score-desc':
            return b.aiComplianceScore - a.aiComplianceScore;
          case 'product-asc':
            return a.productName.localeCompare(b.productName);
          case 'product-desc':
            return b.productName.localeCompare(a.productName);
          case 'id-asc':
            return a.id.localeCompare(b.id);
          case 'id-desc':
            return b.id.localeCompare(a.id);
          default:
            return new Date(b.inspectionDate).getTime() - new Date(a.inspectionDate).getTime();
        }
      });
  }, [inspections, searchTerm, statusFilter, categoryFilter, sortBy]);

  const categories = useMemo(() => {
    return Array.from(new Set(inspections.map(i => i.category)));
  }, [inspections]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Inspection ID', 'Product Name', 'Batch Number', 'Officer', 'Location', 'AI Compliance Result', 'AI Score', 'Supervisor Decision', 'Inspection Date'];
    const rows = filteredInspections.map(i => [
      i.id,
      `"${i.productName}"`,
      i.batchNumber,
      `"${i.officerName}"`,
      `"${i.location}"`,
      i.aiComplianceResult,
      `${i.aiComplianceScore}%`,
      i.supervisorDecision,
      `"${i.inspectionDate}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PackSure_Inspections_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Quick helper to toggle header sort
  const handleHeaderSort = (field: 'id' | 'product' | 'score' | 'date') => {
    if (field === 'id') {
      setSortBy(prev => prev === 'id-asc' ? 'id-desc' : 'id-asc');
    } else if (field === 'product') {
      setSortBy(prev => prev === 'product-asc' ? 'product-desc' : 'product-asc');
    } else if (field === 'score') {
      setSortBy(prev => prev === 'score-asc' ? 'score-desc' : 'score-asc');
    } else if (field === 'date') {
      setSortBy(prev => prev === 'date-desc' ? 'date-asc' : 'date-desc');
    }
  };

  return (
    <div className="space-y-4 text-slate-800">
      {/* Top Controls: Search, Filters & Sort Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, product name, batch, officer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Dedicated Sort Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-lg text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs text-slate-800 font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="date-desc">Date (Newest First)</option>
              <option value="date-asc">Date (Oldest First)</option>
              <option value="pending-first">Pending Reviews First</option>
              <option value="score-asc">AI Score (Lowest / High Risk)</option>
              <option value="score-desc">AI Score (Highest First)</option>
              <option value="product-asc">Product Name (A-Z)</option>
              <option value="product-desc">Product Name (Z-A)</option>
              <option value="id-asc">Inspection ID (Ascending)</option>
              <option value="id-desc">Inspection ID (Descending)</option>
            </select>
          </div>

          {/* AI Result Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Results</option>
            <option value="Compliant">Compliant</option>
            <option value="Non-Compliant">Non-Compliant</option>
            <option value="Partially Compliant">Partially Compliant</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 hidden xl:block"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            title="Export filtered records to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 text-xs">
          <span className="font-semibold text-slate-600">
            Showing <strong className="text-slate-900">{filteredInspections.length}</strong> of {inspections.length} total inspections
          </span>
          <span className="text-slate-500 italic">
            Click any record to inspect package photos, OCR extracts, and rule evidence
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 cursor-pointer hover:text-blue-700 select-none" onClick={() => handleHeaderSort('id')}>
                  <div className="flex items-center gap-1">
                    <span>Inspection ID</span>
                    <ArrowUpDown className={`w-3 h-3 ${sortBy.startsWith('id') ? 'text-blue-600 font-bold' : 'text-slate-400'}`} />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-blue-700 select-none" onClick={() => handleHeaderSort('product')}>
                  <div className="flex items-center gap-1">
                    <span>Product Name</span>
                    <ArrowUpDown className={`w-3 h-3 ${sortBy.startsWith('product') ? 'text-blue-600 font-bold' : 'text-slate-400'}`} />
                  </div>
                </th>
                <th className="py-3 px-3">Batch Number</th>
                <th className="py-3 px-3">Officer</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3 text-center cursor-pointer hover:text-blue-700 select-none" onClick={() => handleHeaderSort('score')}>
                  <div className="flex items-center justify-center gap-1">
                    <span>AI Compliance</span>
                    <ArrowUpDown className={`w-3 h-3 ${sortBy.startsWith('score') ? 'text-blue-600 font-bold' : 'text-slate-400'}`} />
                  </div>
                </th>
                <th className="py-3 px-3 text-center">Supervisor Decision</th>
                <th className="py-3 px-4 text-right cursor-pointer hover:text-blue-700 select-none" onClick={() => handleHeaderSort('date')}>
                  <div className="flex items-center justify-end gap-1">
                    <span>Date</span>
                    <ArrowUpDown className={`w-3 h-3 ${sortBy.startsWith('date') ? 'text-blue-600 font-bold' : 'text-slate-400'}`} />
                  </div>
                </th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredInspections.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No inspection records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredInspections.map((item) => {
                  const isCompliant = item.aiComplianceResult === 'Compliant';
                  const isNonCompliant = item.aiComplianceResult === 'Non-Compliant';
                  const isPendingReview = item.supervisorDecision === 'Pending Review';

                  return (
                    <tr
                      key={item.id}
                      onClick={() => onSelectInspection(item)}
                      className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                    >
                      {/* Column 1: Inspection ID */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-blue-700 group-hover:underline">
                            {item.id}
                          </span>
                          {item.reinspectionHistory?.isReinspection && (
                            <span title="Linked Reinspection" className="p-0.5 rounded bg-blue-100 text-blue-700">
                              <LinkIcon className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        {item.priority === 'High' && (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 mt-0.5 inline-block">
                            Priority High
                          </span>
                        )}
                      </td>

                      {/* Column 2: Product Name */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {item.productName}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {item.companyName}
                        </div>
                      </td>

                      {/* Column 3: Batch Number */}
                      <td className="py-3.5 px-3">
                        <span className="font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold">
                          {item.batchNumber}
                        </span>
                      </td>

                      {/* Column 4: Officer */}
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-800">{item.officerName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{item.officerBadge}</div>
                      </td>

                      {/* Column 5: Location */}
                      <td className="py-3.5 px-3 max-w-[180px]">
                        <div className="text-slate-800 truncate" title={item.location}>
                          {item.location.split(',')[0]}
                        </div>
                        <div className="text-[10px] text-slate-500">{item.district}, {item.state}</div>
                      </td>

                      {/* Column 6: AI Compliance Result */}
                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${
                          isCompliant
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : isNonCompliant
                            ? 'bg-rose-50 text-rose-700 border-rose-300'
                            : 'bg-amber-50 text-amber-700 border-amber-300'
                        }`}>
                          {isCompliant ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : isNonCompliant ? (
                            <AlertCircle className="w-3 h-3 text-rose-600" />
                          ) : (
                            <Clock className="w-3 h-3 text-amber-600" />
                          )}
                          <span>{item.aiComplianceResult}</span>
                          <span className="font-mono text-[10px] opacity-75">({item.aiComplianceScore}%)</span>
                        </span>
                      </td>

                      {/* Column 7: Supervisor Decision */}
                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          isPendingReview
                            ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse font-bold'
                            : item.supervisorDecision === 'Confirmed Compliant'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : item.supervisorDecision === 'Confirmed Non-Compliant'
                            ? 'bg-rose-100 text-rose-900 border-rose-300'
                            : 'bg-blue-100 text-blue-900 border-blue-300'
                        }`}>
                          {item.supervisorDecision}
                        </span>
                      </td>

                      {/* Column 8: Date */}
                      <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                        {item.inspectionDate.split(' ')[0]}
                        <span className="text-[10px] text-slate-400 block">{item.inspectionDate.split(' ').slice(1).join(' ')}</span>
                      </td>

                      {/* Column 9: Action */}
                      <td className="py-3.5 px-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectInspection(item);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 transition-colors"
                          title="View Full Detail Dossier"
                        >
                          <ChevronRight className="w-4 h-4" />
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
    </div>
  );
};
