import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  MapPin, 
  Building2, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Smartphone, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  Search,
  PackageCheck
} from 'lucide-react';
import { Inspection, OfficerProfile, DispatchAssignment } from '../../types/inspection';

interface DispatchAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  officers: OfficerProfile[];
  initialOfficerBadge?: string;
  inspections: Inspection[];
  onConfirmDispatch: (assignment: DispatchAssignment) => void;
}

export const DispatchAssignmentModal: React.FC<DispatchAssignmentModalProps> = ({
  isOpen,
  onClose,
  officers,
  initialOfficerBadge,
  inspections,
  onConfirmDispatch
}) => {
  const [selectedBadge, setSelectedBadge] = useState<string>(
    initialOfficerBadge || (officers[0]?.badge || '')
  );

  const [targetType, setTargetType] = useState<DispatchAssignment['targetType']>('Statutory Re-inspection');
  const [linkedInspectionId, setLinkedInspectionId] = useState<string>('');
  
  const [facilityName, setFacilityName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [zone, setZone] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  const [priority, setPriority] = useState<DispatchAssignment['priority']>('Urgent (24h)');
  const [scheduledDate, setScheduledDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [instructions, setInstructions] = useState<string>(
    'Draw 10 representative packages from retail shelf. Verify Rule 6(1) MRP declaration font height and conduct gravimetric net content check on calibrated balance. Submit photographic evidence via PackSure Mobile.'
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Update selected officer if initialOfficerBadge changes
  useEffect(() => {
    if (initialOfficerBadge) {
      setSelectedBadge(initialOfficerBadge);
      const matched = officers.find(o => o.badge === initialOfficerBadge);
      if (matched) {
        setZone(matched.zone);
      }
    } else if (officers.length > 0 && !selectedBadge) {
      setSelectedBadge(officers[0].badge);
      setZone(officers[0].zone);
    }
  }, [initialOfficerBadge, officers]);

  const currentOfficer = officers.find(o => o.badge === selectedBadge) || officers[0];

  // When an existing inspection case is selected, auto-populate details
  const handleSelectCase = (caseId: string) => {
    setLinkedInspectionId(caseId);
    if (!caseId) return;

    const matchedInsp = inspections.find(i => i.id === caseId);
    if (matchedInsp) {
      setFacilityName(matchedInsp.retailOutlet || matchedInsp.companyName);
      setLocation(matchedInsp.location);
      setZone(matchedInsp.officerZone || currentOfficer?.zone || '');
      setProductName(`${matchedInsp.productName} (Batch: ${matchedInsp.batchNumber})`);
      
      if (matchedInsp.aiComplianceResult === 'Non-Compliant') {
        setPriority('Urgent (24h)');
        setTargetType('Statutory Re-inspection');
        setInstructions(
          `Statutory re-audit for flagged violations in ${matchedInsp.id}. Verify correction of declared net weight & mandatory declarations under Legal Metrology Rules 2011. Check fresh batch samples.`
        );
      } else {
        setPriority('High');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOfficer) {
      setErrorMsg('Please select an active field officer.');
      return;
    }
    if (!facilityName.trim()) {
      setErrorMsg('Facility / Retail Outlet name is required.');
      return;
    }
    if (!location.trim()) {
      setErrorMsg('Inspection target location address is required.');
      return;
    }
    if (!productName.trim()) {
      setErrorMsg('Target product or commodity name is required.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      const newAssignment: DispatchAssignment = {
        id: `DSP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        officerBadge: currentOfficer.badge,
        officerName: currentOfficer.name,
        targetType,
        inspectionId: linkedInspectionId || undefined,
        productName: productName.trim(),
        facilityName: facilityName.trim(),
        location: location.trim(),
        zone: zone.trim() || currentOfficer.zone,
        priority,
        scheduledDate,
        instructions: instructions.trim(),
        dispatchedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        dispatchedBy: 'Chief Legal Metrology Supervisor',
        status: 'Dispatched to Mobile'
      };

      onConfirmDispatch(newAssignment);
      setIsSubmitting(false);
      onClose();
    }, 700);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>Dispatch Field Assignment</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  LM-ACT 2009 / RULE 24
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Deploy field officer for statutory surveillance, lot re-audit, or enforcement visit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 text-xs text-slate-700">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Assigned Officer Selection Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>Assigned Field Officer & Target Terminal</span>
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                PackSure Mobile v2.4.1 Online
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Designated Officer:
                </label>
                <select
                  value={selectedBadge}
                  onChange={(e) => {
                    setSelectedBadge(e.target.value);
                    const off = officers.find(o => o.badge === e.target.value);
                    if (off) setZone(off.zone);
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-xs"
                >
                  {officers.map(o => (
                    <option key={o.badge} value={o.badge}>
                      {o.name} ({o.badge})
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-slate-600 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Jurisdiction:</span>
                  <span className="font-bold text-slate-800 truncate max-w-[140px]" title={currentOfficer?.zone}>
                    {currentOfficer?.zone || 'Zone 1'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Current Workload:</span>
                  <span className="font-semibold text-amber-700">
                    {currentOfficer?.pendingAction || 0} active reviews
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Assignment Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Assignment Category / Drive Type:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                'Statutory Re-inspection',
                'Routine Surveillance',
                'Consumer Complaint',
                'MRP & Dual-Sticker Drive',
                'Special Lot Verification'
              ].map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setTargetType(type as DispatchAssignment['targetType'])}
                  className={`p-2.5 rounded-lg border text-left font-semibold transition-all flex flex-col gap-1 ${
                    targetType === type
                      ? 'bg-blue-50/80 border-blue-600 text-blue-900 shadow-2xs ring-1 ring-blue-600'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs">{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Link to Existing Case (Optional Autofill) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                Link to Prior Inspection Case (Optional):
              </label>
              {linkedInspectionId && (
                <button
                  type="button"
                  onClick={() => handleSelectCase('')}
                  className="text-[11px] text-blue-600 hover:underline font-semibold"
                >
                  Clear Link
                </button>
              )}
            </div>
            <select
              value={linkedInspectionId}
              onChange={(e) => handleSelectCase(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">-- No Linked Case (Direct Market Surveillance Dispatch) --</option>
              {inspections.map(i => (
                <option key={i.id} value={i.id}>
                  {i.id} • {i.productName} ({i.aiComplianceResult} - Score: {i.aiComplianceScore}%) • {i.retailOutlet || i.companyName}
                </option>
              ))}
            </select>
          </div>

          {/* Facility & Location Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Target Facility / Retail Outlet: <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. D-Mart Hypermarket / Reliance Retail"
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Target Product / Commodity: <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <PackageCheck className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Edible Oil 1L / Wheat Flour 5kg"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Target Street Address / Location: <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Linking Road, Andheri West, Mumbai"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Jurisdiction Zone:
              </label>
              <input
                type="text"
                placeholder="e.g. West Zone - Region 2"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>
          </div>

          {/* Priority & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Urgency & Priority:
              </label>
              <div className="flex items-center gap-2">
                {[
                  { label: 'Urgent (24h)', color: 'bg-rose-50 text-rose-700 border-rose-300' },
                  { label: 'High', color: 'bg-amber-50 text-amber-800 border-amber-300' },
                  { label: 'Routine', color: 'bg-blue-50 text-blue-700 border-blue-300' }
                ].map(p => (
                  <button
                    type="button"
                    key={p.label}
                    onClick={() => setPriority(p.label as DispatchAssignment['priority'])}
                    className={`flex-1 py-1.5 px-2 rounded-lg font-bold border transition-all text-center ${
                      priority === p.label
                        ? `${p.color} ring-2 ring-slate-900 shadow-2xs`
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Scheduled Execution Date:
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Specific Directives to Field Officer */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Field Directives & Inspection Instructions:
            </label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs leading-relaxed"
              placeholder="Specify sample size, rules to verify, gravimetric calibration instructions, or seizure orders..."
            />
          </div>

          {/* Mobile Sync Indicator */}
          <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-start gap-2.5 text-blue-900 text-[11px]">
            <Smartphone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Immediate Mobile Sync:</span>
              <span className="ml-1 text-blue-800">
                Submitting this dispatch transmits the legal assignment manifest directly to {currentOfficer.name}&apos;s mobile device cache with automated geofence prompts.
              </span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-md flex items-center gap-2 text-xs disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Transmitting Dispatch...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Confirm & Dispatch to Officer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
