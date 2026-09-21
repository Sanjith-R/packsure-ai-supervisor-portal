import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Share2, 
  Check, 
  FileText, 
  ArrowLeft 
} from 'lucide-react';
import { Inspection } from '../../types/inspection';
import { AutomatedInspectionReport } from './AutomatedInspectionReport';

interface InspectionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  inspection: Inspection | null;
}

export const InspectionReportModal: React.FC<InspectionReportModalProps> = ({
  isOpen,
  onClose,
  inspection
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !inspection) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    const reportElement = document.getElementById('printable-inspection-report');
    if (!reportElement) {
      window.print();
      return;
    }

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>PackSure_Inspection_Report_${inspection.id}</title>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @media print {
                body { margin: 0; padding: 12px; background: #ffffff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                @page { size: A4 portrait; margin: 8mm; }
              }
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                background-color: #f8fafc;
                display: flex;
                justify-content: center;
                padding: 24px;
              }
              .report-wrapper {
                max-width: 820px;
                width: 100%;
                background: white;
              }
            </style>
          </head>
          <body>
            <div class="report-wrapper">
              ${reportElement.outerHTML}
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.focus();
                  window.print();
                }, 300);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      window.print();
    }
  };

  const handleDownloadHtml = () => {
    const reportElement = document.getElementById('printable-inspection-report');
    if (!reportElement) return;

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PackSure Legal Metrology Report - ${inspection.id}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      @page { size: A4; margin: 10mm; }
    }
  </style>
</head>
<body class="bg-slate-50 p-6 flex justify-center">
  <div style="max-width: 840px; width: 100%;">
    ${reportElement.outerHTML}
  </div>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PackSure_Report_${inspection.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://packsure.ai/verify/${inspection.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static animate-in fade-in duration-200">
      {/* Modal Card with fixed viewport height to support simple internal vertical scrolling */}
      <div className="bg-slate-100 rounded-2xl max-w-5xl w-full h-[92vh] max-h-[92vh] flex flex-col shadow-2xl border border-slate-700/60 overflow-hidden print:h-auto print:max-h-none print:border-none print:shadow-none print:w-full print:bg-white">
        
        {/* Top Header: Clean Document Actions & Download PDF */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title="Return to tabular list"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="h-4 w-px bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-white tracking-tight">
                  Inspection Report
                </span>
                <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-950/70 border border-amber-800/80 px-2 py-0.5 rounded">
                  {inspection.id}
                </span>
              </div>
            </div>
          </div>

          {/* Document export & action buttons */}
          <div className="flex items-center gap-2">
            {/* Primary Download / Print PDF Button */}
            <button
              onClick={handleDownloadPdf}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                downloadSuccess
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-[#f59042] hover:bg-[#dd742b] text-slate-950 active:scale-95'
              }`}
              title="Open print-to-PDF dialog to save as PDF"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span className="text-white">PDF Ready!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download / Print PDF</span>
                </>
              )}
            </button>

            {/* Save HTML Document */}
            <button
              onClick={handleDownloadHtml}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
              title="Download standalone HTML document"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden md:inline">Save HTML</span>
            </button>

            {/* Print directly */}
            <button
              onClick={handlePrint}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
              title="Print directly"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Print</span>
            </button>

            {/* Copy Verification Link */}
            <button
              onClick={handleCopyLink}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-colors cursor-pointer"
              title="Copy Report Verification Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ml-1"
              title="Close PDF Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable PDF Document Canvas with a Simple, Native Vertical Scrollbar */}
        <div className="flex-1 min-h-0 overflow-y-auto report-scrollbar p-4 sm:p-6 lg:p-8 flex justify-center bg-slate-200/90 print:p-0 print:bg-white print:overflow-visible">
          <div className="w-full max-w-[840px] shadow-xl rounded-lg overflow-hidden bg-white border border-slate-300 print:shadow-none print:border-none">
            <AutomatedInspectionReport
              inspection={inspection}
              onPrint={handlePrint}
              onDownloadPdf={handleDownloadPdf}
              showToolbar={false}
            />
          </div>
        </div>

        {/* Clean, minimal footer */}
        <div className="bg-slate-900 text-slate-400 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs border-t border-slate-800 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-medium">Standard Legal Metrology A4 Format</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">{inspection.productName} ({inspection.batchNumber})</span>
          </div>
          <div className="text-slate-400 font-mono text-[11px]">
            Scroll to view full dossier
          </div>
        </div>

      </div>
    </div>
  );
};
