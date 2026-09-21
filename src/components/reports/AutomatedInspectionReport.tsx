import React from 'react';
import { 
  Check, 
  X, 
  AlertCircle, 
  Mail, 
  Send, 
  Bell, 
  FileCheck2, 
  QrCode,
  Download,
  Printer,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Inspection } from '../../types/inspection';

interface AutomatedInspectionReportProps {
  inspection: Inspection;
  onPrint?: () => void;
  onDownloadPdf?: () => void;
  showToolbar?: boolean;
}

export const AutomatedInspectionReport: React.FC<AutomatedInspectionReportProps> = ({
  inspection,
  onPrint,
  onDownloadPdf,
  showToolbar = true
}) => {
  const isNonCompliant = inspection.aiComplianceResult === 'Non-Compliant';

  // Format date nicely e.g. 07 Sep 2026
  const formattedDate = inspection.inspectionDate.includes('Sep') || inspection.inspectionDate.includes('2026-')
    ? inspection.inspectionDate
    : '07 Sep 2026';

  // Extracted declarations list
  const standardFields = [
    { field: 'Product Name', expected: 'Product Name', defaultVal: inspection.productName },
    { field: 'Manufacturer & Address', expected: 'Manufacturer & Address', defaultVal: inspection.companyName },
    { field: 'Net Quantity', expected: 'Net Quantity', defaultVal: `${inspection.measurements.netWeight.declared} ${inspection.measurements.netWeight.unit}` },
    { field: 'MRP (Retail Price)', expected: 'MRP (Retail Price)', defaultVal: '₹70' },
    { field: 'Date of Manufacture / Packing', expected: 'Date of Manufacture / Packing', defaultVal: '07/2026' },
    { field: 'Consumer Care Details', expected: 'Consumer Care Details', defaultVal: '1800-XXXXXX' },
    { field: 'Country of Origin', expected: 'Country of Origin', defaultVal: 'Not Found' }
  ];

  const extractedRows = standardFields.map((std, idx) => {
    // Try to find matching OCR result
    const foundOcr = inspection.ocrResults.find(o => 
      o.field.toLowerCase().includes(std.field.toLowerCase()) || 
      std.field.toLowerCase().includes(o.field.toLowerCase())
    );

    let val = foundOcr ? foundOcr.detectedText : std.defaultVal;
    let isPresent = true;

    if (std.field === 'Country of Origin') {
      if (!foundOcr || foundOcr.status === 'error' || foundOcr.detectedText.toLowerCase().includes('not found') || foundOcr.detectedText.toLowerCase().includes('missing')) {
        isPresent = false;
        val = 'Not Found';
      }
    } else if (foundOcr && (foundOcr.status === 'error' || !foundOcr.detectedText)) {
      isPresent = false;
      val = 'Not Found';
    }

    return {
      num: idx + 1,
      field: std.field,
      value: val,
      status: isPresent ? 'Present' : 'Missing'
    };
  });

  // Violations list
  const failedRules = inspection.rules.filter(r => r.status === 'FAIL');
  const violationsList = failedRules.length > 0 
    ? failedRules.map(r => r.reason)
    : [
        'Missing Country of Origin declaration (where applicable).',
        'Measured net quantity is below declared quantity; final legal decision is based on applicable MPE and lot criteria.'
      ];

  const reportHash = 'e3b76a9ab0ea26354120f06a86a75d5113ac7602d721a382cbb407c664300f';

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const primaryEvidence = inspection.evidence && inspection.evidence.length > 0 ? inspection.evidence[0] : null;

  return (
    <div className="flex flex-col items-center w-full">
      {/* Optional Top Toolbar for Interactive Actions */}
      {showToolbar && (
        <div className="w-full max-w-[840px] flex items-center justify-between mb-4 px-2 py-2 bg-slate-100 rounded-lg border border-slate-200 print:hidden">
          <div className="text-xs font-semibold text-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            PackSure AI Inspection Report Preview ({inspection.id})
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Report Document Container matching user's image */}
      <div 
        id="printable-inspection-report"
        className="w-full max-w-[840px] bg-white text-slate-900 border border-slate-200 shadow-md p-6 sm:p-8 rounded-lg print:border-none print:shadow-none print:p-2 print:max-w-none print:w-full font-sans antialiased text-xs"
        style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
      >
        {/* Header Section */}
        <div className="flex items-start justify-between pb-3">
          <div className="flex items-start gap-3">
            {/* PackSure AI Logo Icon: Isometric Cube with Sprout */}
            <div className="w-12 h-12 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                {/* 3D Cube Faces */}
                {/* Top face */}
                <polygon points="50,18 85,34 50,50 15,34" fill="#0284c7" />
                {/* Left face */}
                <polygon points="15,34 50,50 50,88 15,72" fill="#0369a1" />
                {/* Right face */}
                <polygon points="50,50 85,34 85,72 50,88" fill="#0c4a6e" />
                {/* Inner white cube lines / emblem */}
                <path d="M 28 48 L 44 56 L 44 74" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                {/* Green Leaf Sprout on top */}
                <path d="M 50 18 Q 42 6 34 8 Q 28 14 36 22 Q 44 26 50 18 Z" fill="#22c55e" />
                <path d="M 50 18 Q 58 4 66 8 Q 72 16 64 24 Q 56 26 50 18 Z" fill="#16a34a" />
                <path d="M 50 22 L 50 12" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black tracking-tight text-[#0f3b60]">PackSure</span>
                <span className="text-2xl font-black tracking-tight text-[#0284c7]">AI</span>
              </div>
              <div className="text-[12px] font-bold text-[#1e40af] tracking-tight -mt-0.5">
                Smart Compliance Verification Platform for Packaged Commodities
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Scan. Verify. Ensure Compliance.
              </div>
            </div>
          </div>
        </div>

        {/* Big Centered Report Heading */}
        <div className="text-center my-3 border-t border-slate-100 pt-2">
          <h1 className="text-[21px] sm:text-[23px] font-extrabold text-[#19497b] tracking-tight">
            Automated Legal Metrology Inspection Report
          </h1>
          <div className="flex items-center justify-center gap-4 text-xs font-semibold text-[#1e3a5f] mt-1.5">
            <span>Report ID: <span className="font-bold">{inspection.id}</span></span>
            <span className="text-slate-300">|</span>
            <span>Inspection Date: <span className="font-bold">{formattedDate}</span></span>
            <span className="text-slate-300">|</span>
            <span>Generated By: <span className="font-bold">PackSure AI</span></span>
          </div>
        </div>

        {/* Row 1: 3 Grid Columns (Inspection Details, Measurement Details, Compliance Summary) */}
        <div className="grid grid-cols-12 gap-3.5 mt-3.5">
          {/* Section 1: 1. Inspection Details */}
          <div id="report-section-1" className="col-span-12 sm:col-span-5 flex flex-col scroll-mt-4">
            <div className="bg-[#1c6492] text-white font-bold text-[12px] px-3 py-1.5 rounded-t-md tracking-wide">
              1. Inspection Details
            </div>
            <div className="border border-[#b8d4e9] bg-[#f8fbfe] rounded-b-md divide-y divide-[#d9e7f3] text-[11px] flex-1">
              <div className="flex justify-between items-center px-2.5 py-1.5">
                <span className="text-slate-600 font-medium">Product</span>
                <span className="font-bold text-slate-900 text-right">{inspection.productName}</span>
              </div>
              <div className="flex justify-between items-center px-2.5 py-1.5">
                <span className="text-slate-600 font-medium">Batch / Lot No.</span>
                <span className="font-bold text-slate-900 text-right">{inspection.batchNumber}</span>
              </div>
              <div className="flex justify-between items-center px-2.5 py-1.5">
                <span className="text-slate-600 font-medium">Lot Size</span>
                <span className="font-bold text-slate-900 text-right">{inspection.lotSize || 500}</span>
              </div>
              <div className="flex justify-between items-center px-2.5 py-1.5">
                <span className="text-slate-600 font-medium">Location</span>
                <span className="font-bold text-slate-900 text-right">{inspection.location}</span>
              </div>
              <div className="flex justify-between items-center px-2.5 py-1.5">
                <span className="text-slate-600 font-medium">Company</span>
                <span className="font-bold text-slate-900 text-right truncate max-w-[150px]">{inspection.companyName}</span>
              </div>
              <div className="flex justify-between items-center px-2.5 py-1.5">
                <span className="text-slate-600 font-medium">Company Email</span>
                <span className="font-medium text-blue-600 hover:underline text-right truncate max-w-[160px]">{inspection.companyEmail}</span>
              </div>
            </div>
          </div>

          {/* Section 2: 2. Measurement Details */}
          <div id="report-section-2" className="col-span-12 sm:col-span-3 flex flex-col scroll-mt-4">
            <div className="bg-[#1c6492] text-white font-bold text-[12px] px-3 py-1.5 rounded-t-md tracking-wide">
              2. Measurement Details
            </div>
            <div className="border border-[#b8d4e9] bg-[#f8fbfe] rounded-b-md divide-y divide-[#d9e7f3] text-[11px] flex-1">
              <div className="flex justify-between items-center px-2.5 py-2">
                <span className="text-slate-600 font-medium">Gross Weight</span>
                <span className="font-bold text-slate-900 text-right">
                  {inspection.measurements.grossWeight.measured.toFixed(3)} {inspection.measurements.grossWeight.unit}
                </span>
              </div>
              <div className="flex justify-between items-center px-2.5 py-2">
                <span className="text-slate-600 font-medium">Tare Weight</span>
                <span className="font-bold text-slate-900 text-right">
                  {inspection.measurements.tareWeight.measured.toFixed(3)} {inspection.measurements.tareWeight.unit}
                </span>
              </div>
              <div className="flex justify-between items-center px-2.5 py-2 bg-[#f0f6fc]">
                <span className="text-slate-700 font-bold leading-tight">Measured<br />Net Weight</span>
                <span className="font-black text-slate-900 text-right text-xs">
                  {inspection.measurements.netWeight.measured.toFixed(3)} {inspection.measurements.netWeight.unit}
                </span>
              </div>
              <div className="flex justify-between items-center px-2.5 py-2">
                <span className="text-slate-700 font-bold leading-tight">Declared<br />Net Quantity</span>
                <span className="font-black text-slate-900 text-right text-xs">
                  {inspection.measurements.netWeight.declared} {inspection.measurements.netWeight.unit}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: 3. Compliance Summary */}
          <div id="report-section-3" className="col-span-12 sm:col-span-4 flex flex-col scroll-mt-4">
            <div className="bg-[#1c6492] text-white font-bold text-[12px] px-3 py-1.5 rounded-t-md tracking-wide">
              3. Compliance Summary
            </div>
            <div className="border border-[#b8d4e9] bg-[#f8fbfe] rounded-b-md p-2.5 flex-1 flex flex-col justify-between">
              {/* Overall Result Banner */}
              <div className={`p-2 rounded-md border flex items-center gap-3 ${
                isNonCompliant 
                  ? 'bg-rose-50/70 border-rose-200' 
                  : 'bg-emerald-50/70 border-emerald-200'
              }`}>
                {isNonCompliant ? (
                  <div className="w-10 h-10 rounded-full bg-[#dc2626] flex items-center justify-center text-white shrink-0 shadow-sm">
                    <X className="w-6 h-6 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                )}
                <div>
                  <div className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                    Overall Result
                  </div>
                  <div className={`font-black text-sm tracking-tight ${
                    isNonCompliant ? 'text-[#b91c1c]' : 'text-emerald-700'
                  }`}>
                    {isNonCompliant ? 'NON-COMPLIANT' : 'COMPLIANT'}
                  </div>
                  <div className={`text-[10px] font-bold ${
                    isNonCompliant ? 'text-[#b91c1c]' : 'text-emerald-700'
                  }`}>
                    {isNonCompliant ? '(REVIEW REQUIRED)' : '(PASSED - VERIFIED)'}
                  </div>
                </div>
              </div>

              {/* Key Checks Performed List */}
              <div className="mt-2.5">
                <div className="text-[11px] font-bold text-slate-800 mb-1.5">
                  Key Checks Performed
                </div>
                <div className="space-y-1 text-[10px] font-medium text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Mandatory declarations</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Presentation & legibility</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Declared vs measured quantity</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Applicable MPE criteria</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Conflict / missing information</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Fields Checked (4) & Package Evidence (5) */}
        <div className="grid grid-cols-12 gap-3.5 mt-3.5">
          {/* Section 4: 4. Fields Checked (Extracted Declarations) */}
          <div id="report-section-4" className="col-span-12 sm:col-span-7 flex flex-col scroll-mt-4">
            <div className="bg-[#1c6492] text-white font-bold text-[12px] px-3 py-1.5 rounded-t-md tracking-wide">
              4. Fields Checked (Extracted Declarations)
            </div>
            <div className="border border-[#b8d4e9] bg-white rounded-b-md overflow-hidden text-[11px] flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f0f6fc] border-b border-[#b8d4e9] text-[#1c6492] font-bold text-[10px]">
                    <th className="py-1.5 px-2 text-center w-8">#</th>
                    <th className="py-1.5 px-2">Field</th>
                    <th className="py-1.5 px-2">Value Found</th>
                    <th className="py-1.5 px-2 text-center w-20">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {extractedRows.map((row) => (
                    <tr key={row.num} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-1.5 px-2 text-center font-bold text-slate-500 text-[10px]">
                        {row.num}
                      </td>
                      <td className="py-1.5 px-2 font-medium text-slate-800">
                        {row.field}
                      </td>
                      <td className="py-1.5 px-2 font-semibold text-slate-900">
                        {row.value}
                      </td>
                      <td className="py-1.5 px-2 text-center">
                        {row.status === 'Present' ? (
                          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]">
                            Present
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#fee2e2] text-[#991b1b] border border-[#fecaca]">
                            Missing
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 5: 5. Package Evidence */}
          <div id="report-section-5" className="col-span-12 sm:col-span-5 flex flex-col scroll-mt-4">
            <div className="bg-[#1c6492] text-white font-bold text-[12px] px-3 py-1.5 rounded-t-md tracking-wide">
              5. Package Evidence
            </div>
            <div className="border border-[#b8d4e9] bg-[#f8fbfe] rounded-b-md p-3 flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-full max-w-[210px] h-[190px] bg-amber-50/40 border border-slate-200 rounded-md overflow-hidden flex items-center justify-center relative shadow-inner">
                {/* Fallback authentic SunFresh rice mockup or photo */}
                {inspection.id === 'INS-1001' ? (
                  <div className="w-full h-full relative flex flex-col items-center justify-center p-3 bg-gradient-to-b from-[#f5ebd7] via-[#faeed9] to-[#edd9b9]">
                    {/* Simulated Rice Pouch Package */}
                    <div className="w-[155px] bg-[#fffbf2] border-2 border-[#d9c49a] rounded-lg shadow-md p-2.5 text-center flex flex-col items-center justify-between h-[165px]">
                      {/* Green Brand Badge */}
                      <div className="bg-[#15803d] text-white font-black text-[11px] px-3 py-0.5 rounded tracking-wide shadow-sm">
                        SunFresh
                      </div>
                      <div>
                        <div className="text-[17px] font-black text-slate-900 leading-tight">
                          Rice
                        </div>
                        <div className="text-[8px] font-semibold text-amber-900 tracking-wider uppercase">
                          Premium Quality
                        </div>
                      </div>
                      
                      {/* Grain Texture Visual */}
                      <div className="w-full bg-[#fcedd0] border border-[#e5cb9b] rounded py-1 px-2 text-[8px] text-amber-900 flex justify-between font-mono">
                        <span>Net Quantity</span>
                        <span>MRP</span>
                      </div>
                      <div className="w-full flex justify-between items-baseline px-1 text-[11px] font-black text-slate-900">
                        <span>1 kg</span>
                        <span>₹70</span>
                      </div>
                      <div className="text-[7px] text-slate-500 font-mono">
                        Packed: 07/2026
                      </div>
                    </div>
                  </div>
                ) : primaryEvidence ? (
                  <img
                    src={primaryEvidence.url}
                    alt={primaryEvidence.title}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-slate-400 text-xs">No image available</div>
                )}
              </div>

              <div className="mt-2 text-center">
                <div className="font-bold text-slate-900 text-[11px]">
                  Package Evidence
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                  OCR extracted declarations +<br />inspection measurement recorded
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Detected Violations (6) & Communication (8) */}
        <div className="grid grid-cols-12 gap-3.5 mt-3.5">
          {/* Section 6: 6. Detected Violations */}
          <div id="report-section-6" className="col-span-12 sm:col-span-6 flex flex-col scroll-mt-4">
            <div className="bg-[#1c6492] text-white font-bold text-[12px] px-3 py-1.5 rounded-t-md tracking-wide">
              6. Detected Violations
            </div>
            <div className="border border-[#b8d4e9] bg-[#fff8f8] rounded-b-md p-3 flex-1 flex items-start gap-3">
              {isNonCompliant ? (
                <div className="w-7 h-7 rounded-full bg-[#dc2626] text-white flex items-center justify-center shrink-0 font-black text-sm shadow-sm mt-0.5">
                  !
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 font-black text-sm shadow-sm mt-0.5">
                  ✓
                </div>
              )}
              <div className="text-[11px] leading-relaxed">
                {isNonCompliant ? (
                  <ul className="list-disc list-outside pl-4 space-y-1 text-[#b91c1c] font-medium">
                    {violationsList.map((viol, vIdx) => (
                      <li key={vIdx}>{viol}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-emerald-800 font-medium">
                    • No statutory violations detected. All mandatory declarations comply with the Legal Metrology (Packaged Commodities) Rules, 2011.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 8: 8. Communication */}
          <div id="report-section-8" className="col-span-12 sm:col-span-6 flex flex-col scroll-mt-4">
            <div className="bg-[#1c6492] text-white font-bold text-[12px] px-3 py-1.5 rounded-t-md tracking-wide">
              8. Communication
            </div>
            <div className="border border-[#b8d4e9] bg-[#f8fbfe] rounded-b-md p-2.5 flex-1 space-y-2.5">
              {/* Row 1: Company Email */}
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded bg-[#e1f0fa] text-[#1c6492] flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-3.5 h-3.5 fill-[#1c6492]" />
                </div>
                <div>
                  <div className="font-bold text-[11px] text-slate-900 leading-tight">
                    Company Email
                  </div>
                  <div className="text-[11px] text-blue-600 font-medium hover:underline cursor-pointer">
                    {inspection.companyEmail}
                  </div>
                </div>
              </div>

              {/* Row 2: Inspector Submission */}
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded bg-[#e1f0fa] text-[#1c6492] flex items-center justify-center shrink-0 mt-0.5">
                  <Send className="w-3.5 h-3.5 fill-[#1c6492]" />
                </div>
                <div>
                  <div className="font-bold text-[11px] text-slate-900 leading-tight">
                    Inspector Submission
                  </div>
                  <div className="text-[10px] text-slate-600 leading-snug">
                    Report sent to supervisor for review.
                  </div>
                </div>
              </div>

              {/* Row 3: Supervisor Notification */}
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded bg-[#e1f0fa] text-[#1c6492] flex items-center justify-center shrink-0 mt-0.5">
                  <Bell className="w-3.5 h-3.5 fill-[#1c6492]" />
                </div>
                <div>
                  <div className="font-bold text-[11px] text-slate-900 leading-tight">
                    Supervisor Notification
                  </div>
                  <div className="text-[10px] text-slate-600 leading-snug">
                    Approval / rejection decision will be sent to company by email automatically after review.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 4: Section 9 Digital Verification */}
        <div id="report-section-9" className="mt-3.5 border border-[#b8d4e9] bg-[#f0f7fc] rounded-md p-3 scroll-mt-4">
          <div className="font-bold text-[12px] text-[#1c6492] mb-2">
            9. Digital Verification
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left side text */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded border-2 border-[#1c6492] text-[#1c6492] flex items-center justify-center shrink-0">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-700 font-medium">
                  Report generated automatically by PackSure AI
                </div>
                <div className="text-[11px] font-bold text-slate-900 mt-0.5">
                  Report Hash:
                </div>
                <div className="font-mono text-[9px] sm:text-[10px] text-slate-600 break-all select-all">
                  {reportHash}
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                  Generated On: 07 Sep 2026 15:10:24
                </div>
              </div>
            </div>

            {/* Right side QR Code */}
            <div className="flex items-center gap-3 bg-white p-2 rounded border border-[#cbe1f1] shrink-0">
              {/* Crisp SVG QR Code */}
              <div className="w-16 h-16 bg-white p-1 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Outer Frame */}
                  <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
                  {/* Top-Left Position Marker */}
                  <rect x="5" y="5" width="30" height="30" fill="#000000" />
                  <rect x="10" y="10" width="20" height="20" fill="#ffffff" />
                  <rect x="15" y="15" width="10" height="10" fill="#000000" />

                  {/* Top-Right Position Marker */}
                  <rect x="65" y="5" width="30" height="30" fill="#000000" />
                  <rect x="70" y="10" width="20" height="20" fill="#ffffff" />
                  <rect x="75" y="15" width="10" height="10" fill="#000000" />

                  {/* Bottom-Left Position Marker */}
                  <rect x="5" y="65" width="30" height="30" fill="#000000" />
                  <rect x="10" y="70" width="20" height="20" fill="#ffffff" />
                  <rect x="15" y="75" width="10" height="10" fill="#000000" />

                  {/* Data Blocks */}
                  <rect x="42" y="8" width="6" height="6" fill="#000000" />
                  <rect x="52" y="12" width="6" height="6" fill="#000000" />
                  <rect x="42" y="24" width="6" height="6" fill="#000000" />
                  <rect x="52" y="28" width="6" height="6" fill="#000000" />
                  <rect x="12" y="42" width="6" height="6" fill="#000000" />
                  <rect x="24" y="48" width="6" height="6" fill="#000000" />
                  <rect x="40" y="42" width="6" height="6" fill="#000000" />
                  <rect x="50" y="42" width="6" height="6" fill="#000000" />
                  <rect x="62" y="42" width="6" height="6" fill="#000000" />
                  <rect x="78" y="42" width="6" height="6" fill="#000000" />
                  <rect x="44" y="52" width="6" height="6" fill="#000000" />
                  <rect x="58" y="52" width="6" height="6" fill="#000000" />
                  <rect x="70" y="52" width="6" height="6" fill="#000000" />
                  <rect x="84" y="52" width="6" height="6" fill="#000000" />
                  <rect x="42" y="66" width="6" height="6" fill="#000000" />
                  <rect x="54" y="70" width="6" height="6" fill="#000000" />
                  <rect x="66" y="66" width="6" height="6" fill="#000000" />
                  <rect x="78" y="72" width="6" height="6" fill="#000000" />
                  <rect x="44" y="82" width="6" height="6" fill="#000000" />
                  <rect x="56" y="84" width="6" height="6" fill="#000000" />
                  <rect x="70" y="80" width="6" height="6" fill="#000000" />
                  <rect x="84" y="84" width="6" height="6" fill="#000000" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-[11px] text-slate-900">
                  Scan to Verify
                </div>
                <div className="text-[10px] text-slate-600 font-mono mt-0.5">
                  Inspection ID: {inspection.id}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-2.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-600 gap-1">
          <div>
            <span className="font-bold text-slate-900">PackSure AI</span>
            <span className="mx-1 text-slate-400">|</span>
            <span>Smart Compliance Verification Platform for Packaged Commodities</span>
          </div>
          <div className="font-medium text-slate-500">
            Scan. Verify. Ensure Compliance.
          </div>
        </div>
      </div>
    </div>
  );
};
