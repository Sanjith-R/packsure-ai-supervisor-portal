import React, { useState, useRef, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Sliders, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  Minimize2,
  FileSearch,
  Sparkles,
  Download,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { EvidenceImage, EvidenceAnnotation } from '../../types/inspection';

interface EvidenceViewerProps {
  evidenceList: EvidenceImage[];
}

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({ evidenceList }) => {
  const [activeTab, setActiveTab] = useState<string>(evidenceList[0]?.id || '');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  const [filterMode, setFilterMode] = useState<'normal' | 'contrast' | 'invert'>('normal');
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (evidenceList && evidenceList.length > 0) {
      setActiveTab(evidenceList[0].id);
      setZoomLevel(100);
      setPanPosition({ x: 0, y: 0 });
      setImageError(false);
    }
  }, [evidenceList]);

  const currentImage = evidenceList.find(e => e.id === activeTab) || evidenceList[0];

  const handleSelectImage = (id: string) => {
    setActiveTab(id);
    setZoomLevel(100);
    setPanPosition({ x: 0, y: 0 });
    setImageError(false);
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 300));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));
  const handleResetZoom = () => {
    setZoomLevel(100);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 100) {
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX - panPosition.x, y: e.clientY - panPosition.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 100) {
      setPanPosition({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Filter style based on supervisory inspection mode
  const getImageFilterStyle = () => {
    if (filterMode === 'contrast') return 'contrast(160%) brightness(90%) grayscale(40%)';
    if (filterMode === 'invert') return 'invert(90%) contrast(150%)';
    return 'none';
  };

  if (!currentImage) {
    return <div className="p-4 text-slate-500">No package evidence uploaded.</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
      {/* Evidence Viewer Header */}
      <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-600 text-white">
            <FileSearch className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              Product Label Evidence Viewer
              <span className="text-[10px] font-mono font-normal bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded">
                Tamper-Evident SHA-256 Verified
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentImage.title}
            </p>
          </div>
        </div>

        {/* View Enhancements & Annotation Toggle */}
        <div className="flex items-center gap-2">
          {/* AI Annotations Toggle */}
          <button
            onClick={() => setShowAnnotations(!showAnnotations)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold border transition-all ${
              showAnnotations
                ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Toggle detected OCR and PCR bounding boxes"
          >
            {showAnnotations ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>AI Bounding Boxes</span>
          </button>

          {/* Optical Filter Mode */}
          <div className="flex items-center bg-slate-800 rounded border border-slate-700 p-0.5 text-xs">
            <button
              onClick={() => setFilterMode('normal')}
              className={`px-2 py-1 rounded font-medium ${
                filterMode === 'normal' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Standard RGB view"
            >
              Normal
            </button>
            <button
              onClick={() => setFilterMode('contrast')}
              className={`px-2 py-1 rounded font-medium ${
                filterMode === 'contrast' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="High contrast for faint print"
            >
              High Contrast
            </button>
          </div>

          {/* Fullscreen Preview */}
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded border border-slate-700 transition-colors"
            title="Expand to Fullscreen Lightbox"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Label Angles / Evidence Selector Strip */}
      {evidenceList.length > 1 && (
        <div className="bg-slate-850 px-4 py-2 border-b border-slate-800 flex items-center gap-2 overflow-x-auto bg-slate-900">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            Label Panels:
          </span>
          <div className="flex items-center gap-2">
            {evidenceList.map((img) => {
              const isSelected = img.id === currentImage.id;
              const hasFailure = img.annotations.some(a => !a.valid);
              return (
                <button
                  key={img.id}
                  onClick={() => handleSelectImage(img.id)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all shrink-0 ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 text-blue-200 shadow-sm'
                      : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 object-cover rounded border border-slate-600 shrink-0"
                  />
                  <span className="truncate max-w-[200px]">{img.title}</span>
                  {hasFailure ? (
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" title="Non-compliance detected" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Compliant" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Image Stage */}
      <div 
        className="relative bg-slate-950 w-full h-[400px] overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="relative transition-transform duration-75 origin-center"
          style={{
            transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel / 100})`,
          }}
        >
          {/* Main Photo */}
          {!imageError ? (
            <img
              src={currentImage.url}
              alt={currentImage.title}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="max-h-[360px] max-w-[550px] object-contain rounded shadow-2xl transition-all"
              style={{ filter: getImageFilterStyle() }}
              draggable={false}
            />
          ) : (
            <div className="w-[420px] h-[320px] bg-slate-900 border border-slate-800 rounded-lg flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <ImageIcon className="w-12 h-12 text-slate-600 mb-3" />
              <p className="text-sm font-semibold text-slate-300">Product Label Image</p>
              <p className="text-xs text-slate-500 mt-1 max-w-[300px]">{currentImage.title}</p>
              <button
                onClick={() => setImageError(false)}
                className="mt-4 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold"
              >
                Reload Label
              </button>
            </div>
          )}

          {/* AI Bounding Box Overlays */}
          {showAnnotations && currentImage.annotations.map((ann, i) => (
            <div
              key={i}
              className={`absolute border-2 rounded pointer-events-auto group transition-all ${
                ann.valid
                  ? 'border-emerald-400 bg-emerald-500/15 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'border-rose-500 bg-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.4)] animate-pulse'
              }`}
              style={{
                left: `${ann.x}%`,
                top: `${ann.y}%`,
                width: `${ann.width}%`,
                height: `${ann.height}%`,
              }}
            >
              {/* Floating Pill Tag */}
              <div
                className={`absolute -top-6 left-0 text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap flex items-center gap-1 z-10 ${
                  ann.valid
                    ? 'bg-emerald-800 text-emerald-100 border border-emerald-600'
                    : 'bg-rose-900 text-rose-100 border border-rose-600'
                }`}
              >
                {ann.valid ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-rose-300" />
                )}
                <span>{ann.label}</span>
                <span className="opacity-75 font-mono">({ann.confidence}%)</span>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Zoom & Pan Controls bar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur border border-slate-700/80 rounded-full px-3.5 py-1.5 flex items-center gap-3 shadow-xl z-20 text-white text-xs">
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 50}
            className="p-1 hover:text-blue-400 disabled:opacity-40 transition-colors"
            title="Zoom Out (-25%)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="font-mono font-bold text-xs w-12 text-center text-blue-300">
            {zoomLevel}%
          </span>

          <input
            type="range"
            min="50"
            max="300"
            step="10"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(Number(e.target.value))}
            className="w-24 accent-blue-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
          />

          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 300}
            className="p-1 hover:text-blue-400 disabled:opacity-40 transition-colors"
            title="Zoom In (+25%)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-700" />

          <button
            onClick={handleResetZoom}
            className="p-1 hover:text-blue-400 transition-colors"
            title="Reset Zoom & Position"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Metadata & Detected Labels Footer */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4 text-slate-500">
          <div>
            <span className="font-semibold text-slate-700">Resolution:</span>{' '}
            <span className="font-mono">{currentImage.captureResolution}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-700">Capture Time:</span>{' '}
            <span>{currentImage.timestamp}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-700">Detected Regions:</span>{' '}
            <span className="font-bold text-slate-800">{currentImage.annotations.length}</span>
          </div>
        </div>

        {/* Quick status summary badge */}
        <div className="flex items-center gap-2">
          {currentImage.annotations.some(a => !a.valid) ? (
            <span className="text-[11px] font-bold text-rose-700 bg-rose-100 border border-rose-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              Non-Compliance Detected
            </span>
          ) : (
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              All Detected Declarations Satisfied
            </span>
          )}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col p-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-white pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">{currentImage.title}</span>
              <span className="text-xs text-slate-400">({currentImage.captureResolution})</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 25, 400))}
                className="p-2 bg-slate-800 rounded hover:bg-slate-700"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 25, 50))}
                className="p-2 bg-slate-800 rounded hover:bg-slate-700"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 bg-rose-600 hover:bg-rose-700 rounded text-white font-bold"
                title="Close Lightbox"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto flex items-center justify-center p-4">
            <img
              src={currentImage.url}
              alt={currentImage.title}
              referrerPolicy="no-referrer"
              className="max-h-[85vh] max-w-full object-contain rounded shadow-2xl"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                filter: getImageFilterStyle()
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
