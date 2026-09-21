import React, { useState } from 'react';
import { TrendingUp, Award, AlertCircle, Info } from 'lucide-react';
import { COMPLIANCE_TREND_DATA } from '../../data/mockData';

export const ComplianceChart: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [metricView, setMetricView] = useState<'rate' | 'volume'>('rate');

  // Chart dimensions
  const width = 640;
  const height = 220;
  const paddingX = 45;
  const paddingY = 30;

  const data = COMPLIANCE_TREND_DATA;
  const maxVolume = Math.max(...data.map(d => d.total)) * 1.15;

  // Coordinate calculators
  const getX = (index: number) => {
    return paddingX + (index * (width - 2 * paddingX)) / (data.length - 1);
  };

  const getYRate = (rate: number) => {
    // scale 70% to 90%
    const min = 70;
    const max = 90;
    const clamped = Math.max(min, Math.min(max, rate));
    return height - paddingY - ((clamped - min) / (max - min)) * (height - 2 * paddingY);
  };

  const getYVolume = (val: number) => {
    return height - paddingY - (val / maxVolume) * (height - 2 * paddingY);
  };

  // Build SVG path for compliance rate
  const ratePath = data.reduce((acc, curr, idx) => {
    const x = getX(idx);
    const y = getYRate(curr.rate);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Area path for gradient fill
  const rateAreaPath = `${ratePath} L ${getX(data.length - 1)} ${height - paddingY} L ${getX(0)} ${height - paddingY} Z`;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 text-slate-800">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Compliance Trend Analysis
            </h3>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +2.8% vs Q1
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Legal Metrology (Packaged Commodities) Rules inspection pass velocity across field zones
          </p>
        </div>

        {/* View toggle buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setMetricView('rate')}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              metricView === 'rate'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pass Rate %
          </button>
          <button
            onClick={() => setMetricView('volume')}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              metricView === 'volume'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Volume & Violations
          </button>
        </div>
      </div>

      {/* SVG Chart Canvas */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-56 select-none overflow-visible"
        >
          <defs>
            <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="violationGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#BE123C" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = paddingY + ratio * (height - 2 * paddingY);
            const rateLabel = Math.round(90 - ratio * 20);
            const volumeLabel = Math.round(maxVolume * (1 - ratio));
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill="#94A3B8"
                  fontWeight="500"
                >
                  {metricView === 'rate' ? `${rateLabel}%` : volumeLabel}
                </text>
              </g>
            );
          })}

          {/* Render metric view */}
          {metricView === 'rate' ? (
            <>
              {/* Shaded Area */}
              <path d={rateAreaPath} fill="url(#rateGradient)" />

              {/* Line */}
              <path
                d={ratePath}
                fill="none"
                stroke="#2563EB"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {data.map((point, index) => {
                const cx = getX(index);
                const cy = getYRate(point.rate);
                const isHovered = hoveredIndex === index;
                return (
                  <g
                    key={index}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 6 : 4}
                      fill={isHovered ? '#1D4ED8' : '#FFFFFF'}
                      stroke="#2563EB"
                      strokeWidth={isHovered ? 3 : 2}
                      className="transition-all duration-200"
                    />
                    {/* Hover vertical guide */}
                    {isHovered && (
                      <line
                        x1={cx}
                        y1={paddingY}
                        x2={cx}
                        y2={height - paddingY}
                        stroke="#94A3B8"
                        strokeDasharray="2 2"
                        strokeWidth="1"
                      />
                    )}
                  </g>
                );
              })}
            </>
          ) : (
            // Bar graph for total vs violations
            data.map((point, index) => {
              const xCenter = getX(index);
              const barWidth = 24;
              const yTotal = getYVolume(point.total);
              const yViolations = getYVolume(point.violations);
              const totalHeight = (height - paddingY) - yTotal;
              const violationsHeight = (height - paddingY) - yViolations;
              const isHovered = hoveredIndex === index;

              return (
                <g
                  key={index}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Total audits bar */}
                  <rect
                    x={xCenter - barWidth / 2}
                    y={yTotal}
                    width={barWidth}
                    height={totalHeight}
                    fill={isHovered ? '#1E40AF' : '#3B82F6'}
                    rx="3"
                    className="transition-colors duration-150"
                  />
                  {/* Violations overlay bar */}
                  <rect
                    x={xCenter - barWidth / 2}
                    y={yViolations}
                    width={barWidth}
                    height={violationsHeight}
                    fill={isHovered ? '#9F1239' : '#F43F5E'}
                    rx="3"
                    className="transition-colors duration-150"
                  />
                </g>
              );
            })
          )}

          {/* X Axis month labels */}
          {data.map((point, index) => {
            const x = getX(index);
            const isHovered = hoveredIndex === index;
            return (
              <text
                key={index}
                x={x}
                y={height - 10}
                textAnchor="middle"
                fontSize="11"
                fontWeight={isHovered ? '700' : '500'}
                fill={isHovered ? '#1E293B' : '#64748B'}
              >
                {point.month}
              </text>
            );
          })}
        </svg>

        {/* Hover Tooltip Card */}
        {hoveredIndex !== null && (
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3.5 py-2 rounded-lg shadow-xl border border-slate-700 text-xs flex items-center gap-4 z-20 pointer-events-none"
          >
            <div>
              <span className="text-slate-400 font-medium">{data[hoveredIndex].month}</span>
              <div className="font-bold text-blue-400 text-sm">
                {data[hoveredIndex].rate}% Pass Rate
              </div>
            </div>
            <div className="h-6 w-px bg-slate-700" />
            <div className="space-y-0.5">
              <div className="text-slate-300">
                Audited: <span className="font-bold text-white">{data[hoveredIndex].total}</span>
              </div>
              <div className="text-rose-400">
                Violations: <span className="font-bold text-rose-300">{data[hoveredIndex].violations}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-blue-600" />
            <span>Compliant Products</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-rose-500" />
            <span>PCR Violations</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-400 italic">
          Data source: Central Legal Metrology Surveillance Cloud
        </div>
      </div>
    </div>
  );
};
