import React, { useState } from 'react';
import { 
  RotateCw, 
  X, 
  Link as LinkIcon, 
  AlertTriangle, 
  Calendar, 
  User, 
  CheckCircle2, 
  Layers, 
  Send
} from 'lucide-react';
import { Inspection, ReinspectionRecord } from '../../types/inspection';
import { OFFICER_ACTIVITY_DATA } from '../../data/mockData';

interface ReinspectionModalProps {
  inspection: Inspection;
  onClose: () => void;
  onSubmitReinspection: (newInspection: Inspection, reinspectionRec: ReinspectionRecord) => void;
}

export const ReinspectionModal: React.FC<ReinspectionModalProps> = ({
  inspection,
  onClose,
  onSubmitReinspection
}) => {
  const [newBatchNumber, setNewBatchNumber] = useState<string>(
    inspection.batchNumber ? `${inspection.batchNumber.split('-')[0] || 'LOT'}-2026-REV2` : 'LOT-2026-REV2'
  );
  const [assignedOfficer, setAssignedOfficer] = useState<string>(inspection.officerName);
  const [reason, setReason] = useState<string>(
    `Mandatory follow-up lot inspection ordered due to: ${
      inspection.rules.find(r => r.status === 'FAIL')?.reason || 'Statutory PCR Non-Conformity'
    }`
  );
  const [sampleSize, setSampleSize] = useState<string>('30 Units (Schedule-V Standard Sample)');
  const [targetDeadlineDays, setTargetDeadlineDays] = useState<string>('7 Days (Statutory Notice Period)');
  const [specialInstructions, setSpecialInstructions] = useState<string>(
    'Field officer must collect physical samples from fresh production lot or warehouse depot. Verify that manufacturer has corrected print plates and calibrated gravimetric filling machinery.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newId = `RE-${inspection.id}-L2`;
    const selectedOfficerData = OFFICER_ACTIVITY_DATA.find(o => o.name === assignedOfficer);

    // Create the child inspection record
    const childInspection: Inspection = {
      ...inspection,
      id: newId,
      batchNumber: newBatchNumber,
      inspectionDate: 'Scheduled - Pending Field Visit',
      officerName: assignedOfficer,
      officerBadge: selectedOfficerData?.badge || inspection.officerBadge,
      aiComplianceResult: 'Partially Compliant',
      aiComplianceScore: 75,
      supervisorDecision: 'Pending Review',
      supervisorComment: `Linked Reinspection for lot ${newBatchNumber}. Triggered from parent ${inspection.id}.`,
      priority: 'High',
      reinspectionHistory: {
        isReinspection: true,
        parentInspectionId: inspection.id,
        originalBatch: inspection.batchNumber,
        newBatch: newBatchNumber,
        orderReason: reason
      },
      auditTimeline: [
        {
          id: `aud-re-${Date.now()}-1`,
          title: 'Inspection Created',
          timestamp: new Date().toLocaleString(),
          actor: 'Supervisor Amit K. Deshmukh',
          role: 'Legal Metrology Supervisor',
          description: `Formal Reinspection Order dispatched. Linked to parent audit dossier #${inspection.id}. Mandated fresh lot: ${newBatchNumber}.`,
          digitalHash: 'SHA-256: 7f89d2...ec91',
          status: 'completed'
        },
        {
          id: `aud-re-${Date.now()}-2`,
          title: 'Images Uploaded',
          timestamp: 'Awaiting Officer Field Visit',
          actor: assignedOfficer,
          role: 'Assigned Field Inspector',
          description: `Field inspection scheduled within ${targetDeadlineDays}.`,
          status: 'pending'
        },
        {
          id: `aud-re-${Date.now()}-3`,
          title: 'OCR Completed',
          timestamp: 'Pending',
          actor: 'PackSure AI OCR',
          role: 'Machine Learning Subsystem',
          description: 'Awaiting package images.',
          status: 'pending'
        },
        {
          id: `aud-re-${Date.now()}-4`,
          title: 'Rule Evaluation Completed',
          timestamp: 'Pending',
          actor: 'LM-PCR Rule Engine v2026.3',
          role: 'Automated Regulatory Engine',
          description: 'Awaiting field data.',
          status: 'pending'
        },
        {
          id: `aud-re-${Date.now()}-5`,
          title: 'Supervisor Review',
          timestamp: 'Pending',
          actor: 'Supervisor Portal',
          role: 'Authorized Officer',
          description: 'Pending determination.',
          status: 'pending'
        },
        {
          id: `aud-re-${Date.now()}-6`,
          title: 'Final Decision',
          timestamp: 'Pending',
          actor: 'Supervisor Portal',
          role: 'Legal Metrology Supervisor',
          description: 'Pending determination.',
          status: 'pending'
        }
      ]
    };

    const reinspectionRecord: ReinspectionRecord = {
      id: `RE-REC-${Date.now().toString().slice(-4)}`,
      originalInspectionId: inspection.id,
      newInspectionId: newId,
      productName: inspection.productName,
      previousBatch: inspection.batchNumber,
      newBatch: newBatchNumber,
      orderedDate: new Date().toLocaleString(),
      reason,
      supervisorNotes: specialInstructions,
      assignedOfficer,
      status: 'Pending Officer Visit'
    };

    onSubmitReinspection(childInspection, reinspectionRecord);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex items-center justify-between border-b border-blue-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/40 border border-blue-400/40 text-blue-200">
              <RotateCw className="w-5 h-5 animate-spin-reverse" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                Order Linked Reinspection
                <span className="text-[10px] bg-blue-500/30 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded font-mono">
                  Sec. 39 Mandate
                </span>
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Parent Inspection Summary Box */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
              <span className="flex items-center gap-1.5 text-blue-700">
                <LinkIcon className="w-3.5 h-3.5" />
                Parent Inspection Link
              </span>
              <span className="font-mono text-slate-500">{inspection.id}</span>
            </div>
            <div className="text-sm font-bold text-slate-900">{inspection.productName}</div>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-slate-500 text-[11px]">
              <span>Original Batch: <strong className="text-slate-800 font-mono">{inspection.batchNumber}</strong></span>
              <span>Retail Location: <strong className="text-slate-800">{inspection.location}</strong></span>
              <span>AI Result: <strong className="text-rose-600">{inspection.aiComplianceResult} ({inspection.aiComplianceScore}%)</strong></span>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* New Batch ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Rectified / Fresh Batch Number *
              </label>
              <input
                type="text"
                required
                value={newBatchNumber}
                onChange={(e) => setNewBatchNumber(e.target.value)}
                placeholder="e.g. BG-2026-A501"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Target batch submitted by manufacturer for verification
              </span>
            </div>

            {/* Assigned Officer */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Assigned Field Officer *
              </label>
              <select
                value={assignedOfficer}
                onChange={(e) => setAssignedOfficer(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {OFFICER_ACTIVITY_DATA.map((off) => (
                  <option key={off.badge} value={off.name}>
                    {off.name} ({off.badge} - {off.zone.split('(')[0]})
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Officer will receive push dispatch on PackSure Mobile
              </span>
            </div>

            {/* Target Sample Size */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sample Size Protocol
              </label>
              <select
                value={sampleSize}
                onChange={(e) => setSampleSize(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="30 Units (Schedule-V Standard Sample)">30 Units (Schedule-V Standard Lot)</option>
                <option value="50 Units (Statistical High-Confidence Audit)">50 Units (High Confidence Lot)</option>
                <option value="5 Units (Retail Spot Check & Label Audit)">5 Units (Retail Spot Check)</option>
                <option value="Single Master Case (Outer & Inner Packaging)">Single Master Case</option>
              </select>
            </div>

            {/* Target Deadline */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Statutory SLA / Deadline
              </label>
              <select
                value={targetDeadlineDays}
                onChange={(e) => setTargetDeadlineDays(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="3 Days (Urgent Section 39 Notice)">3 Days (Urgent Priority)</option>
                <option value="7 Days (Statutory Notice Period)">7 Days (Standard SLA)</option>
                <option value="14 Days (Depot Warehouse Verification)">14 Days (Extended Audit)</option>
              </select>
            </div>
          </div>

          {/* Reason for Reinspection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Statutory Reason for Reinspection *
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Special Instructions for Field Officer */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Field Officer Verification Instructions
            </label>
            <textarea
              rows={3}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Compliance Linkage Guarantee */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2 text-xs text-blue-900">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Inspection Record Linkage:</span> The new inspection ID will link directly to parent record <code className="font-bold">{inspection.id}</code> with all historical test readings and findings preserved.
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              Dispatch Reinspection Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
