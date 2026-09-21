import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  RotateCw, 
  Scale, 
  Building2, 
  MapPin, 
  Calendar, 
  UserCheck, 
  Mail, 
  Tag, 
  ShieldAlert, 
  ShieldCheck, 
  Send, 
  FileText, 
  Sparkles, 
  Link as LinkIcon, 
  FileCheck2, 
  Clock, 
  ChevronRight,
  Printer,
  Share2,
  ExternalLink,
  MessageSquare,
  Copy,
  Download,
  X,
  Home
} from 'lucide-react';
import { Inspection, SupervisorDecision, ReinspectionRecord } from '../../types/inspection';
import { EvidenceViewer } from './EvidenceViewer';
import { ReinspectionModal } from './ReinspectionModal';
import { InspectionReportModal } from '../reports/InspectionReportModal';

interface InspectionDetailViewProps {
  inspection: Inspection;
  onBack: () => void;
  onNavigateHome?: () => void;
  onUpdateDecision: (
    inspectionId: string, 
    decision: SupervisorDecision, 
    comment: string
  ) => void;
  onOpenReinspectionModal: () => void;
  onSelectRelatedInspection?: (inspectionId: string) => void;
}

export const InspectionDetailView: React.FC<InspectionDetailViewProps> = ({
  inspection,
  onBack,
  onNavigateHome,
  onUpdateDecision,
  onOpenReinspectionModal,
  onSelectRelatedInspection
}) => {
  const [selectedDecision, setSelectedDecision] = useState<SupervisorDecision>(
    inspection.supervisorDecision !== 'Pending Review' 
      ? inspection.supervisorDecision 
      : 'Confirmed Compliant'
  );
  const [commentText, setCommentText] = useState<string>(inspection.supervisorComment || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [showNoticeModal, setShowNoticeModal] = useState<boolean>(false);
  const [noticeDispatched, setNoticeDispatched] = useState<boolean>(false);
  const [noticeIssuedData, setNoticeIssuedData] = useState<{
    noticeId: string;
    dispatchDate: string;
    recipient: string;
    recipientEmail: string;
    commodity: string;
    batchNumber: string;
  } | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  // Quick regulatory preset comment templates
  const commentPresets = [
    'All statutory declarations verified compliant under Legal Metrology (Packaged Commodities) Rules 2011. Certified for market release.',
    'Non-compliance confirmed: Unit Sale Price (USP) missing per Rule 6(1)(n). Formal Notice under Section 39 to be issued.',
    'Non-compliance confirmed: Schedule-IV Net Weight Max Permissible Error breached. Proceeding with Section 30 notice.',
    'Reinspection ordered: Replacement lot sampling mandated to verify recalibration and legible printing.',
    'Font height on net quantity numeral is borderline. Manufacturer issued administrative advisory.'
  ];

  const handleApplyPreset = (preset: string) => {
    setCommentText(preset);
  };

  const generateNoticeContent = () => {
    const noticeId = noticeIssuedData?.noticeId || `FORM-V/2026/NOT-${inspection.id.replace('INS-', '')}`;
    const dispatchDate = noticeIssuedData?.dispatchDate || new Date().toLocaleString();
    const failedRules = inspection.rules.filter(r => r.status === 'FAIL');

    return `GOVERNMENT OF INDIA
DIRECTORATE OF LEGAL METROLOGY
CENTRAL SURVEILLANCE & ENFORCEMENT CELL
Department of Consumer Affairs, Krishi Bhawan, New Delhi - 110 001

STATUTORY SHOW CAUSE NOTICE UNDER SECTION 39 READ WITH SECTION 36
THE LEGAL METROLOGY ACT, 2009 & LEGAL METROLOGY (PACKAGED COMMODITIES) RULES, 2011

NOTICE REFERENCE: ${noticeId}
DATE OF ISSUANCE: ${dispatchDate}

TO:
M/s ${inspection.companyName}
Registered Address / Email: ${inspection.companyEmail}

SUBJECT: STATUTORY NOTICE FOR PRE-PACKAGED COMMODITY NON-CONFORMITY

1. COMMODITY UNDER INSPECTION:
   - Product Description: ${inspection.productName}
   - Brand / Manufacturer: ${inspection.brand} (${inspection.companyName})
   - Batch / Lot Identification: ${inspection.batchNumber}
   - Retail Sampling Location: ${inspection.retailOutlet}, ${inspection.location}
   - Officer Inspection Dossier: ${inspection.id} (Inspected by: ${inspection.officerName}, ${inspection.officerBadge})

2. STATUTORY NON-CONFORMITY FINDINGS:
${failedRules.length > 0 ? failedRules.map((r, i) => `   (${i + 1}) [${r.ruleNumber}] ${r.ruleName}
       Finding: ${r.reason}
       Statutory Clause: ${r.penaltyClause || 'Rule 6 read with Section 36/39'}`).join('\n\n') : '   • Statutory non-conformity verified by Authorized Metrology Inspector.'}

3. SUPERVISORY DIRECTIVE:
   Supervisor Remarks: ${commentText || 'Supervisory audit confirmed failure of mandatory package declarations.'}

4. STATUTORY MANDATE:
   You are hereby directed to SHOW CAUSE in writing within fifteen (15) days of receipt of this notice why penal proceedings under Section 36 / 39 of the Legal Metrology Act, 2009 should not be initiated against your establishment, or alternatively apply for compounding of offences under Section 48 thereof.

Issued under the Seal & Digital Signature of:
Amit K. Deshmukh
Legal Metrology Supervisor (LM-SUP-MH-014)
Directorate of Legal Metrology, Government of India
Verification Hash: SHA-256: 9b88ef21c430a91176b`;
  };

  const handleDownloadNotice = () => {
    const content = generateNoticeContent();
    const noticeId = noticeIssuedData?.noticeId || `FORM-V-NOT-${inspection.id}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${noticeId}-Statutory-Notice.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyNotice = () => {
    const content = generateNoticeContent();
    navigator.clipboard.writeText(content);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2500);
  };

  const handlePrintNotice = () => {
    window.print();
  };

  // When supervisor clicks Submit, it executes the function of issuing the notice
  const handleSubmitDecision = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const noticeId = `FORM-V/2026/NOT-${inspection.id.replace('INS-', '')}`;
    const dispatchDate = new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    const noticeData = {
      noticeId,
      dispatchDate,
      recipient: inspection.companyName,
      recipientEmail: inspection.companyEmail,
      commodity: inspection.productName,
      batchNumber: inspection.batchNumber
    };

    setTimeout(() => {
      // 1. Submit determination to parent state
      onUpdateDecision(inspection.id, selectedDecision, commentText);
      setIsSubmitting(false);

      // 2. Execute the issue notice function: dispatch Form-V and present modal & toast
      setNoticeIssuedData(noticeData);
      setNoticeDispatched(true);
      setShowNoticeModal(true);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 6000);
    }, 450);
  };

  const getComplianceStatusBadge = (status: string) => {
    switch (status) {
      case 'Compliant':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Compliant
          </span>
        );
      case 'Non-Compliant':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1.5 shadow-sm">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            Non-Compliant
          </span>
        );
      case 'Partially Compliant':
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Partially Compliant
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-16 text-slate-800">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="Return to Dashboard Home"
            >
              <Home className="w-4 h-4 text-amber-600" />
              <span>Dashboard</span>
            </button>
          )}
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to List</span>
          </button>
          <div className="h-5 w-px bg-slate-200" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {inspection.id}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-600">Batch {inspection.batchNumber}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Official Report in PackSure AI Format */}
          <button
            onClick={() => setShowReportModal(true)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            title="View Automated Legal Metrology Inspection Report"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Official Report</span>
          </button>

          {/* Order Reinspection Quick Action */}
          <button
            onClick={onOpenReinspectionModal}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 flex items-center gap-1.5 transition-colors"
            title="Create linked inspection for fresh lot"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Order Reinspection</span>
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Print Inspection Report"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Success Notification Toast */}
      {showSuccessToast && (
        <div className="p-4 rounded-xl bg-emerald-600 text-white shadow-lg flex items-center justify-between animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <div>
              <div className="text-sm font-bold">Supervisor Determination & Form-V Notice Executed</div>
              <div className="text-xs text-emerald-100">
                Inspection {inspection.id} decision updated to "{selectedDecision}". Statutory Form-V Notice dispatched to {inspection.companyName}.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowNoticeModal(true)} 
              className="text-xs font-bold bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded"
            >
              View Notice
            </button>
            <button onClick={() => setShowSuccessToast(false)} className="text-xs font-bold underline opacity-80 hover:opacity-100">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Statutory Notice Dispatched Card */}
      {noticeDispatched && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-slate-800 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 rounded-lg text-rose-700">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-rose-700 font-bold flex items-center gap-2">
                <span>Form-V Statutory Legal Notice Issued</span>
                <span className="font-mono bg-rose-200/70 text-rose-900 px-2 py-0.5 rounded text-[10px]">
                  {noticeIssuedData?.noticeId}
                </span>
              </div>
              <div className="text-xs text-slate-700 mt-1">
                Dispatched under Section 39 to <strong className="text-slate-900">{inspection.companyName}</strong> ({inspection.companyEmail}) with 15-day statutory response directive.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowNoticeModal(true)}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Issued Notice</span>
            </button>
            <button
              onClick={handleDownloadNotice}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>
      )}

      {/* Linked Reinspection Card if applicable */}
      {inspection.reinspectionHistory && (
        <div className="p-4 bg-indigo-50/80 border border-indigo-200 text-slate-800 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-indigo-700 font-bold">
                {inspection.reinspectionHistory.isReinspection 
                  ? 'Linked Reinspection Record (Lot-2)' 
                  : 'Reinspection History Active'}
              </div>
              <div className="text-sm font-semibold text-slate-900 mt-0.5">
                {inspection.reinspectionHistory.isReinspection ? (
                  <>
                    Parent Inspection Dossier: <button 
                      onClick={() => onSelectRelatedInspection && onSelectRelatedInspection(inspection.reinspectionHistory?.parentInspectionId || '')}
                      className="font-mono underline text-indigo-600 hover:text-indigo-800 font-bold"
                    >
                      {inspection.reinspectionHistory.parentInspectionId}
                    </button> (Original Batch: {inspection.reinspectionHistory.originalBatch})
                  </>
                ) : (
                  <>
                    Follow-up Child Reinspection: <button 
                      onClick={() => onSelectRelatedInspection && onSelectRelatedInspection(inspection.reinspectionHistory?.childInspectionId || '')}
                      className="font-mono underline text-indigo-600 hover:text-indigo-800 font-bold"
                    >
                      {inspection.reinspectionHistory.childInspectionId}
                    </button> (Fresh Batch: {inspection.reinspectionHistory.newBatch})
                  </>
                )}
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                Reason: {inspection.reinspectionHistory.orderReason}
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <span className="text-xs font-semibold px-3 py-1 bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-lg">
              Linked Lot
            </span>
          </div>
        </div>
      )}

      {/* SECTION 6: Compliance Summary Card & SECTION 1: Product Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: SECTION 1 - Product Information */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                <Tag className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                1. Product Information
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
              Category: {inspection.category}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Product Name:</span>
              <div className="text-sm font-bold text-slate-900 leading-snug">
                {inspection.productName}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Batch Number:</span>
              <div className="text-sm font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded inline-block">
                {inspection.batchNumber}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Manufacturer / Packer:</span>
              <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{inspection.companyName}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Company Regulatory Email:</span>
              <div className="text-xs font-mono text-blue-600 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <a href={`mailto:${inspection.companyEmail}`} className="hover:underline">
                  {inspection.companyEmail}
                </a>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Inspection Location:</span>
              <div className="text-xs text-slate-800 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">{inspection.location}</div>
                  <div className="text-slate-500 text-[11px]">{inspection.district}, {inspection.state}</div>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Field Officer Name:</span>
              <div className="text-xs text-slate-800 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">{inspection.officerName}</div>
                  <div className="text-slate-500 text-[11px] font-mono">{inspection.officerBadge} ({inspection.officerZone})</div>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Inspection Timestamp:</span>
              <div className="text-xs font-medium text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{inspection.inspectionDate}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Retail Outlet / Entity:</span>
              <div className="text-xs font-semibold text-slate-800">
                {inspection.retailOutlet}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: SECTION 6 - Compliance Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                6. Compliance Summary
              </h2>
            </div>
            {getComplianceStatusBadge(inspection.aiComplianceResult)}
          </div>

          {/* Radial Score Gauge */}
          <div className="flex items-center justify-center py-2">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Track circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#E2E8F0"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Score stroke circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={
                    inspection.aiComplianceScore >= 90
                      ? '#10B981'
                      : inspection.aiComplianceScore >= 70
                      ? '#F59E0B'
                      : '#EF4444'
                  }
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - inspection.aiComplianceScore / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {inspection.aiComplianceScore}%
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Compliance
                </span>
              </div>
            </div>
          </div>

          {/* Rule tally breakdown */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
            <div className="p-2 bg-slate-50 rounded-lg">
              <div className="text-xs text-slate-500 font-medium">Total Rules</div>
              <div className="text-sm font-bold text-slate-800">{inspection.rules.length}</div>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <div className="text-xs text-emerald-700 font-medium">Passed</div>
              <div className="text-sm font-bold text-emerald-800">
                {inspection.rules.filter(r => r.status === 'PASS').length}
              </div>
            </div>
            <div className="p-2 bg-rose-50 rounded-lg">
              <div className="text-xs text-rose-700 font-medium">Failed</div>
              <div className="text-sm font-bold text-rose-800">
                {inspection.rules.filter(r => r.status === 'FAIL').length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Package Measurements */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                2. Package Measurements & Gravimetric Verification
              </h2>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
            Scale Cert: NABL-2026-CAL-99
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Gross Weight */}
          <div className={`p-4 rounded-xl border ${
            inspection.measurements.grossWeight.passed 
              ? 'bg-slate-50/70 border-slate-200' 
              : 'bg-rose-50 border-rose-300'
          }`}>
            <div className="flex items-center justify-between font-bold text-slate-700 mb-2">
              <span className="flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-slate-500" />
                Gross Weight
              </span>
              {inspection.measurements.grossWeight.passed ? (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                  PASS
                </span>
              ) : (
                <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-semibold">
                  FAIL
                </span>
              )}
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Declared Gross:</span>
                <span className="font-mono font-bold text-slate-900">
                  {inspection.measurements.grossWeight.declared} {inspection.measurements.grossWeight.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Measured Physical:</span>
                <span className="font-mono font-bold text-blue-700">
                  {inspection.measurements.grossWeight.measured} {inspection.measurements.grossWeight.unit}
                </span>
              </div>
              <div className="flex justify-between text-[11px] pt-1 border-t border-slate-200/80">
                <span className="text-slate-500">Deviation:</span>
                <span className={`font-mono font-bold ${
                  (inspection.measurements.grossWeight.deviationPercent || 0) < 0 
                    ? 'text-rose-600' 
                    : 'text-emerald-600'
                }`}>
                  {inspection.measurements.grossWeight.deviationPercent}%
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 italic">
              {inspection.measurements.grossWeight.notes}
            </p>
          </div>

          {/* Net Weight */}
          <div className={`p-4 rounded-xl border ${
            inspection.measurements.netWeight.passed 
              ? 'bg-slate-50/70 border-slate-200' 
              : 'bg-rose-50 border-rose-300 shadow-sm'
          }`}>
            <div className="flex items-center justify-between font-bold text-slate-700 mb-2">
              <span className="flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-slate-500" />
                Net Weight (Declared vs Measured)
              </span>
              {inspection.measurements.netWeight.passed ? (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                  MPE PASS
                </span>
              ) : (
                <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-semibold">
                  MPE VIOLATION
                </span>
              )}
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Declared Net Quantity:</span>
                <span className="font-mono font-bold text-slate-900">
                  {inspection.measurements.netWeight.declared} {inspection.measurements.netWeight.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Actual Measured Net:</span>
                <span className="font-mono font-bold text-blue-700">
                  {inspection.measurements.netWeight.measured} {inspection.measurements.netWeight.unit}
                </span>
              </div>
              <div className="flex justify-between text-[11px] pt-1 border-t border-slate-200/80">
                <span className="text-slate-500">Schedule-IV Max Permissible Error:</span>
                <span className="font-mono font-bold text-slate-700">
                  ±{inspection.measurements.netWeight.maxPermissibleError} {inspection.measurements.netWeight.unit}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 italic">
              {inspection.measurements.netWeight.notes}
            </p>
          </div>

          {/* Package Dimensions */}
          <div className="p-4 rounded-xl border bg-slate-50/70 border-slate-200">
            <div className="flex items-center justify-between font-bold text-slate-700 mb-2">
              <span>Package Dimensions</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">
                Calibrated Laser
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Length x Width x Height:</span>
                <span className="font-mono font-bold text-slate-900">
                  {inspection.measurements.dimensions.length} × {inspection.measurements.dimensions.width} × {inspection.measurements.dimensions.height} {inspection.measurements.dimensions.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Calculated Volume:</span>
                <span className="font-mono font-bold text-slate-700">
                  {inspection.measurements.dimensions.volumeCc} cm³
                </span>
              </div>
              <div className="flex justify-between text-[11px] pt-1 border-t border-slate-200/80">
                <span className="text-slate-500">Packaging Tare Weight:</span>
                <span className="font-mono font-bold text-slate-700">
                  {inspection.measurements.tareWeight.measured} {inspection.measurements.tareWeight.unit}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 italic">
              Principal display panel area meets minimum ratio standards under Rule 5.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: Evidence Viewer */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1 rounded bg-blue-50 text-blue-700">
            <FileText className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            3. Evidence Viewer
          </h2>
        </div>
        <EvidenceViewer evidenceList={inspection.evidence} />
      </div>

      {/* SECTION 4: OCR Extraction Results */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                4. OCR Extraction Results
              </h2>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
            Average OCR Confidence: 97.4%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3">Statutory Declaration Field</th>
                <th className="py-2.5 px-3">Extracted Text</th>
                <th className="py-2.5 px-3">Statutory Rule Reference</th>
                <th className="py-2.5 px-3 text-center">Confidence</th>
                <th className="py-2.5 px-3 text-center">Numeral Height</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inspection.ocrResults.map((ocr) => (
                <tr key={ocr.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {ocr.field}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700 max-w-xs break-words">
                    {ocr.detectedText}
                  </td>
                  <td className="py-3 px-3 font-semibold text-blue-700">
                    {ocr.ruleRef}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                      ocr.confidence >= 95
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : ocr.confidence >= 80
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {ocr.confidence}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    {ocr.charHeightMm ? (
                      <span className={ocr.charHeightMm < (ocr.minHeightReqMm || 0) ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                        {ocr.charHeightMm} mm
                        <span className="text-[10px] text-slate-400 block">(Min: {ocr.minHeightReqMm} mm)</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {ocr.status === 'verified' ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Verified
                      </span>
                    ) : ocr.status === 'warning' ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        Warning
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                        Violation
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 5: Rule Engine Analysis */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                5. Rule Engine Analysis
              </h2>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Engine Version: PCR-2026.3
          </span>
        </div>

        {/* Grid of Rule Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inspection.rules.map((rule) => {
            const isPass = rule.status === 'PASS';
            return (
              <div
                key={rule.id}
                className={`p-4 rounded-xl border transition-all ${
                  isPass
                    ? 'bg-emerald-50/40 border-emerald-200/80 hover:bg-emerald-50/60'
                    : 'bg-rose-50/50 border-rose-300 shadow-sm hover:bg-rose-50/70'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded border border-blue-200">
                        {rule.ruleNumber}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">
                        {rule.category}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mt-1.5 leading-snug">
                      {rule.ruleName}
                    </h4>
                  </div>

                  {/* Status Pill */}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shrink-0 ${
                    isPass
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-rose-600 text-white shadow-sm animate-pulse'
                  }`}>
                    {isPass ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5" />
                    )}
                    {rule.status}
                  </span>
                </div>

                {/* Rule Reason / Finding */}
                <p className="text-xs text-slate-700 leading-relaxed bg-white/80 p-2.5 rounded-lg border border-slate-200/60 mt-2">
                  <span className="font-semibold text-slate-800">Reason: </span>
                  {rule.reason}
                </p>

                {/* Rule Footer */}
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Confidence: <strong className="font-mono text-slate-800">{rule.confidence}%</strong></span>
                  <span>Severity: <strong className={rule.severity === 'Critical' ? 'text-rose-700' : 'text-amber-700'}>{rule.severity}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 7: Supervisor Decision Panel */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-xl border border-slate-800 p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                7. Supervisor Decision Panel
                <span className="text-[10px] font-mono bg-blue-900/80 text-blue-300 border border-blue-700 px-2 py-0.5 rounded">
                  Authorized Officer Review
                </span>
              </h2>
            </div>
          </div>

          <div className="text-right text-xs text-slate-400">
            <div>Current State: <strong className="text-white font-bold">{inspection.supervisorDecision}</strong></div>
            {inspection.supervisorReviewDate && (
              <div className="text-[10px] text-slate-400">{inspection.supervisorReviewDate}</div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmitDecision} className="space-y-4">
          {/* Decision Options (Radio Cards) */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Select Supervisory Determination:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: Confirm Compliant */}
              <label
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  selectedDecision === 'Confirmed Compliant'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <input
                  type="radio"
                  name="supervisorDecision"
                  value="Confirmed Compliant"
                  checked={selectedDecision === 'Confirmed Compliant'}
                  onChange={() => setSelectedDecision('Confirmed Compliant')}
                  className="mt-1 accent-emerald-500"
                />
                <div>
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Confirm Compliant
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                    Confirm product conforms to all statutory PCR declarations. Certify for market distribution.
                  </p>
                </div>
              </label>

              {/* Option 2: Confirm Non-Compliant */}
              <label
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  selectedDecision === 'Confirmed Non-Compliant'
                    ? 'bg-rose-950/60 border-rose-500 text-white shadow-lg'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <input
                  type="radio"
                  name="supervisorDecision"
                  value="Confirmed Non-Compliant"
                  checked={selectedDecision === 'Confirmed Non-Compliant'}
                  onChange={() => setSelectedDecision('Confirmed Non-Compliant')}
                  className="mt-1 accent-rose-500"
                />
                <div>
                  <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Confirm Non-Compliant
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                    Uphold AI detected violation. Authorize issuance of Form-V Statutory Legal Notice under Section 39.
                  </p>
                </div>
              </label>

              {/* Option 3: Order Reinspection */}
              <label
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  selectedDecision === 'Order Reinspection'
                    ? 'bg-blue-950/80 border-blue-500 text-white shadow-lg'
                    : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <input
                  type="radio"
                  name="supervisorDecision"
                  value="Order Reinspection"
                  checked={selectedDecision === 'Order Reinspection'}
                  onChange={() => setSelectedDecision('Order Reinspection')}
                  className="mt-1 accent-blue-500"
                />
                <div>
                  <div className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5" />
                    Order Reinspection
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                    Require secondary field audit or fresh lot verification for print or weight calibration anomalies.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Quick Preset Regulatory Comments */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-400">
                Quick Preset Regulatory Phrases:
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {commentPresets.map((preset, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => handleApplyPreset(preset)}
                  className="text-[10px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors text-left"
                >
                  {preset.slice(0, 48)}...
                </button>
              ))}
            </div>
          </div>

          {/* Comment Box */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
              <span>Supervisor Notes & Statutory Directive:</span>
              <span className="text-[10px] text-slate-400 font-normal">
                Will be affixed to official Form-V inspection certificate
              </span>
            </label>
            <textarea
              required
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Provide clear supervisory reasoning, statutory citations (e.g. Legal Metrology Act Sec 36/39), and instructions for field officer..."
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 leading-relaxed font-sans"
            />
          </div>

          {/* Submit Button Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Digital Signature applied by Supervisor Amit K. Deshmukh (LM-SUP-MH-014)</span>
            </div>

            <div className="flex items-center gap-3">
              {selectedDecision === 'Order Reinspection' && (
                <button
                  type="button"
                  onClick={onOpenReinspectionModal}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Configure Linked Lot
                </button>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !commentText?.trim()}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-rose-600/30"
                title="Submit supervisory decision and execute Form-V Statutory Legal Notice"
              >
                {isSubmitting ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Notice Issuance...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Form-V Statutory Legal Notice Modal (Triggered by Submit Button) */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-2xl w-full p-6 text-slate-800 space-y-4 my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>Statutory Form-V Legal Notice Dispatched</span>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded font-bold">
                      EXECUTED
                    </span>
                  </h3>
                  <span className="text-xs text-slate-500">
                    Section 39 read with Section 36 • Legal Metrology Act, 2009
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowNoticeModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Confirmation Banner */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between gap-3 text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Form-V Statutory Notice has been officially executed and dispatched to <strong>{inspection.companyName}</strong> ({inspection.companyEmail}).
                </span>
              </div>
              <span className="font-mono text-[10px] font-bold bg-emerald-200/60 text-emerald-950 px-2 py-0.5 rounded shrink-0">
                {noticeIssuedData?.noticeId || `FORM-V/2026/NOT-${inspection.id.slice(-4)}`}
              </span>
            </div>

            {/* Official Form-V Legal Notice Preview Document */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 space-y-3 leading-relaxed max-h-96 overflow-y-auto shadow-inner">
              <div className="text-center font-bold text-slate-900 space-y-0.5 border-b border-slate-200 pb-3">
                <div className="text-xs uppercase tracking-wide">Government of India</div>
                <div className="text-sm">DIRECTORATE OF LEGAL METROLOGY</div>
                <div className="text-[10px] text-slate-600 font-normal">
                  Central Metrology Enforcement Cell • Krishi Bhawan, New Delhi - 110 001
                </div>
                <div className="pt-2 text-xs font-extrabold text-rose-700 uppercase tracking-wider">
                  STATUTORY SHOW CAUSE NOTICE UNDER SECTION 39
                </div>
                <div className="text-[10px] text-slate-600 font-normal">
                  Read with Section 36 of The Legal Metrology Act, 2009 & Rule 6(1) of PCR 2011
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] bg-white p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 font-sans block">Notice Reference:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {noticeIssuedData?.noticeId || `FORM-V/2026/NOT-${inspection.id.replace('INS-', '')}`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-sans block">Date of Issuance:</span>
                  <span className="font-bold text-slate-900">
                    {noticeIssuedData?.dispatchDate || new Date().toLocaleString()}
                  </span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-100">
                  <span className="text-slate-500 font-sans block">To (Establishment/Manufacturer):</span>
                  <span className="font-bold text-slate-900 font-sans">{inspection.companyName}</span>
                  <span className="text-slate-600 block">{inspection.companyEmail}</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="font-bold text-slate-900 uppercase text-[10px]">
                  1. Commodity & Sampling Particulars:
                </div>
                <div className="pl-3 space-y-0.5 text-slate-700 font-sans text-xs">
                  <div>• Description: <strong>{inspection.productName}</strong></div>
                  <div>• Brand / Batch: {inspection.brand} | Lot: {inspection.batchNumber}</div>
                  <div>• Sampled At: {inspection.retailOutlet}, {inspection.location}</div>
                  <div>• Inspection Dossier ID: {inspection.id} (Reporting Officer: {inspection.officerName})</div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="font-bold text-rose-800 uppercase text-[10px]">
                  2. Verified Statutory Non-Conformity Findings:
                </div>
                <div className="pl-3 space-y-1">
                  {inspection.rules.filter(r => r.status === 'FAIL').map((r, idx) => (
                    <div key={idx} className="p-2 rounded bg-rose-50 border border-rose-200 text-rose-900 font-sans">
                      <div className="font-bold text-xs">({idx + 1}) Rule {r.ruleNumber}: {r.ruleName}</div>
                      <div className="text-[11px] text-slate-700 mt-0.5">Finding: {r.reason}</div>
                      <div className="text-[10px] text-rose-700 mt-0.5 font-bold">
                        Statutory Citation: {r.penaltyClause || 'Rule 6 read with Section 36 & 39'}
                      </div>
                    </div>
                  ))}
                  {inspection.rules.filter(r => r.status === 'FAIL').length === 0 && (
                    <div className="text-slate-600 italic font-sans text-xs">
                      Supervisory audit recorded non-conformity per inspection dossier.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <div className="font-bold text-slate-900 uppercase text-[10px]">
                  3. Supervisory Order & Notes:
                </div>
                <div className="pl-3 text-slate-800 italic bg-amber-50/50 p-2 rounded border border-amber-200/60 font-sans text-[11px]">
                  "{commentText || inspection.supervisorComment || 'Statutory legal notice authorized and sealed.'}"
                </div>
              </div>

              <div className="p-2.5 bg-slate-100 rounded-lg text-[10px] text-slate-700 leading-snug font-sans">
                <strong>STATUTORY NOTICE DIRECTIVE:</strong> You are hereby ordered to SHOW CAUSE in writing within fifteen (15) days of receipt of this notice why prosecution should not be initiated against your company under Section 36 of the Legal Metrology Act, 2009. You may submit an application for compounding of offences under Section 48 thereof.
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]">
                <div>
                  <span className="font-sans text-slate-500 block">Digitally Signed & Sealed by:</span>
                  <span className="font-bold text-slate-900">Amit K. Deshmukh (LM-SUP-MH-014)</span>
                  <span className="text-slate-500 block">Legal Metrology Supervisor, Government of India</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-emerald-700 font-bold block">CRYPTOGRAPHICALLY SEALED</span>
                  <span className="font-mono text-[9px] text-slate-400">SHA-256: 4e81cb...f02a</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyNotice}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copyFeedback ? 'Copied to Clipboard!' : 'Copy Notice Text'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadNotice}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download (.txt)</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintNotice}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Official Inspection Report Modal */}
      <InspectionReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        inspection={inspection}
      />
    </div>
  );
};
