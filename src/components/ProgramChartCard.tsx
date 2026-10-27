import React, { useState } from 'react';
import { FlagshipProgram } from '../types/program';
import { 
  BarChart3, 
  TrendingUp, 
  Table2, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Flag,
  Target,
  Edit3,
  Trash2
} from 'lucide-react';

interface ProgramChartCardProps {
  program: FlagshipProgram;
  onOpenJournalLink?: (category: string) => void;
  isLoggedIn?: boolean;
  onEditProgram?: (program: FlagshipProgram) => void;
  onDeleteProgram?: (id: string) => void;
}

export const ProgramChartCard: React.FC<ProgramChartCardProps> = ({
  program,
  onOpenJournalLink,
  isLoggedIn = false,
  onEditProgram,
  onDeleteProgram,
}) => {
  const [chartMode, setChartMode] = useState<'trend' | 'bar' | 'table'>('trend');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const targets = program.targets;
  const maxTargetValue = Math.max(...targets.map((t) => t.targetValue));
  

  // Cumulative progress calculation
  const completed2025 = targets.find((t) => t.year === 2025)?.realizationValue || 0;
  const inProgress2026 = targets.find((t) => t.year === 2026)?.realizationValue || 0;
  const currentTotalAchieved = completed2025 + inProgress2026;
  const cumulativePct = Math.min(100, Math.round((currentTotalAchieved / program.totalFiveYearTarget) * 100));

  // Visual Theme Mapping with luminous color schemes
  const colorMap = {
    indigo: {
      primary: '#4f46e5',
      secondary: '#818cf8',
      lightBg: 'bg-indigo-50/80',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      glow: 'rgba(79, 70, 229, 0.4)',
      areaTop: '#4f46e5',
    },
    emerald: {
      primary: '#059669',
      secondary: '#34d399',
      lightBg: 'bg-emerald-50/80',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      glow: 'rgba(5, 150, 105, 0.4)',
      areaTop: '#059669',
    },
    amber: {
      primary: '#d97706',
      secondary: '#fbbf24',
      lightBg: 'bg-amber-50/80',
      text: 'text-amber-700',
      border: 'border-amber-200',
      glow: 'rgba(217, 119, 6, 0.4)',
      areaTop: '#d97706',
    },
    rose: {
      primary: '#e11d48',
      secondary: '#fb7185',
      lightBg: 'bg-rose-50/80',
      text: 'text-rose-700',
      border: 'border-rose-200',
      glow: 'rgba(225, 29, 72, 0.4)',
      areaTop: '#e11d48',
    },
    violet: {
      primary: '#7c3aed',
      secondary: '#a78bfa',
      lightBg: 'bg-violet-50/80',
      text: 'text-violet-700',
      border: 'border-violet-200',
      glow: 'rgba(124, 58, 237, 0.4)',
      areaTop: '#7c3aed',
    },
  }[program.accentColor] || {
    primary: '#171717',
    secondary: '#525252',
    lightBg: 'bg-neutral-100',
    text: 'text-neutral-900',
    border: 'border-neutral-200',
    glow: 'rgba(23, 23, 23, 0.4)',
    areaTop: '#171717',
  };

  // SVG Dimension Math
  const svgWidth = 480;
  const svgHeight = 220;
  const paddingLeft = 48;
  const paddingRight = 44;
  const paddingTop = 36;
  const paddingBottom = 40;
  const chartInnerWidth = svgWidth - paddingLeft - paddingRight;
  const chartInnerHeight = svgHeight - paddingTop - paddingBottom;

  // Calculate coordinates for target points
  const points = targets.map((t, idx) => {
    const x = paddingLeft + (idx / (targets.length - 1)) * chartInnerWidth;
    const y = paddingTop + chartInnerHeight - (t.targetValue / maxTargetValue) * chartInnerHeight;
    return { x, y, ...t };
  });

  // Smooth spline curve path for target
  const pathD = points.reduce((acc, pt, idx, arr) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[idx - 1];
    const cp1x = prev.x + (pt.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (pt.x - prev.x) / 2;
    const cp2y = pt.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pt.x} ${pt.y}`;
  }, '');

  // Fill area under curve
  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartInnerHeight} L ${points[0].x} ${paddingTop + chartInnerHeight} Z`;

  // Realization path (historical verified: 2025 & 2026)
  const realPoints = targets.filter(t => typeof t.realizationValue === 'number').map(t => {
    const origPt = points.find(p => p.year === t.year)!;
    const y = paddingTop + chartInnerHeight - (t.realizationValue! / maxTargetValue) * chartInnerHeight;
    return { x: origPt.x, y, ...t };
  });

  const realPathD = realPoints.length > 1 ? realPoints.reduce((acc, pt, idx, arr) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[idx - 1];
    const cp1x = prev.x + (pt.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (pt.x - prev.x) / 2;
    const cp2y = pt.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pt.x} ${pt.y}`;
  }, '') : '';

  // Active highlighted point
  const activePoint = points.find(p => p.year === (hoveredYear ?? selectedYear)) || points[1];

  return (
    <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 sm:p-7 hover:border-neutral-300 transition-all shadow-xs flex flex-col justify-between">
      <div>
        {/* Card Header: Program Code, Category, Actions & Mode Switcher */}
        <div className="flex flex-col gap-2.5 mb-4">
          <div className="flex items-center justify-between gap-2">
            {/* Left: Code & Category */}
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="font-mono text-2xs px-2.5 py-1 bg-emerald-800 text-white rounded-lg font-semibold tracking-wider shrink-0 shadow-2xs">
                {program.code}
              </span>
              <span className={`text-2xs font-semibold px-2.5 py-1 rounded-lg shrink-0 ${colorMap.lightBg} ${colorMap.text}`}>
                {program.category}
              </span>
            </div>

            {/* Right: Admin Action Buttons (Neatly contained, never overflow) */}
            {isLoggedIn && (
              <div className="flex items-center gap-1.5 shrink-0 bg-neutral-100/90 p-1 rounded-xl border border-neutral-200/80">
                <button
                  onClick={() => onEditProgram?.(program)}
                  title="Sunting Sasaran Program Ini"
                  className="px-2.5 py-1 bg-white hover:bg-emerald-700 hover:text-white text-neutral-800 rounded-lg transition-all flex items-center gap-1 text-2xs font-semibold shadow-2xs border border-neutral-200/60 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-neutral-600 group-hover:text-white" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Hapus program "${program.title}" beserta seluruh target grafiknya?`)) {
                      onDeleteProgram?.(program.id);
                    }
                  }}
                  title="Hapus Program Ini"
                  className="p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mode Switcher: Full-width responsive track */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-100">
            <div className="inline-flex items-center p-1 bg-neutral-100 rounded-xl text-2xs font-medium text-neutral-600 border border-neutral-200/60 overflow-x-auto max-w-full">
              <button
                onClick={() => setChartMode('trend')}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all whitespace-nowrap ${
                  chartMode === 'trend' ? 'bg-white text-neutral-900 shadow-2xs font-bold' : 'hover:text-neutral-900'
                }`}
                title="Grafik Kurva Dinamis"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Kurva Spektrum</span>
              </button>
              <button
                onClick={() => setChartMode('bar')}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all whitespace-nowrap ${
                  chartMode === 'bar' ? 'bg-white text-neutral-900 shadow-2xs font-bold' : 'hover:text-neutral-900'
                }`}
                title="Grafik Batang Komparasi"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Batang</span>
              </button>
              <button
                onClick={() => setChartMode('table')}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all whitespace-nowrap ${
                  chartMode === 'table' ? 'bg-white text-neutral-900 shadow-2xs font-bold' : 'hover:text-neutral-900'
                }`}
                title="Matriks Kinerja Data"
              >
                <Table2 className="w-3.5 h-3.5" />
                <span>Matriks</span>
              </button>
            </div>

            <span className="text-2xs font-mono text-neutral-400 hidden sm:inline shrink-0">
              CAGR: {program.cagrRate}
            </span>
          </div>
        </div>

        {/* Program Title & Overview */}
        <h3 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight leading-snug mb-1.5">
          {program.title}
        </h3>

        <p className="text-xs text-neutral-600 leading-relaxed mb-4 line-clamp-2">
          {program.description}
        </p>

        {/* 5-Year Milestone Progress Gauge */}
        <div className="bg-neutral-50/90 border border-neutral-200/80 rounded-2xl p-4 mb-5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-neutral-500" />
              <span className="text-neutral-700 font-semibold">Target Puncak Renstra 2029:</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-base font-extrabold text-neutral-900 tabular-nums">
                {program.totalFiveYearTarget.toLocaleString('id-ID')}
              </span>
              <span className="text-2xs text-neutral-500 font-semibold">{program.unit}</span>
            </div>
          </div>

          {/* Dual-color Progress Bar with animated fill */}
          <div className="relative w-full h-2.5 bg-neutral-200 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ 
                width: `${cumulativePct}%`,
                backgroundColor: colorMap.primary 
              }}
            />
          </div>

          <div className="flex items-center justify-between text-2xs text-neutral-500 font-mono tabular-nums pt-0.5">
            <span className="flex items-center gap-1 font-medium">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Capaian Terhimpun: <strong>{currentTotalAchieved.toLocaleString('id-ID')}</strong> ({cumulativePct}%)</span>
            </span>
            <span className="font-semibold text-neutral-800">CAGR: {program.cagrRate}</span>
          </div>
        </div>

        {/* DEDICATED RESPONSIVE CHART CANVAS */}
        <div className="border border-neutral-200/90 rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-neutral-50/70 via-white to-white mb-5 shadow-2xs relative overflow-hidden">
          {/* Header of Chart Canvas */}
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-3 border-b border-neutral-200/50 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorMap.primary }} />
              <span className="font-bold text-neutral-900 text-xs">
                {chartMode === 'trend' && 'Kurva Pertumbuhan Target vs Realisasi (2025–2029)'}
                {chartMode === 'bar' && 'Distribusi Batang Capaian per Tahun'}
                {chartMode === 'table' && 'Tabel Kinerja & Prospek Tahunan'}
              </span>
            </div>
            <span className="text-2xs font-mono text-neutral-400">
              Satuan: {program.unit}
            </span>
          </div>

          {/* MODE 1: THE LUMINOUS INTERACTIVE CURVE (KURVA SPEKTRUM) */}
          {chartMode === 'trend' && (
            <div className="relative pt-2 overflow-hidden rounded-xl">
              <svg 
                viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                className="w-full h-48 sm:h-52 select-none overflow-hidden"
              >
                <defs>
                  {/* Glowing blur filter for the primary line */}
                  <filter id={`glow-${program.id}`} x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Gradient Area Fill under the curve */}
                  <linearGradient id={`curve-grad-${program.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colorMap.areaTop} stopOpacity="0.32" />
                    <stop offset="45%" stopColor={colorMap.areaTop} stopOpacity="0.12" />
                    <stop offset="85%" stopColor={colorMap.areaTop} stopOpacity="0.02" />
                    <stop offset="100%" stopColor={colorMap.areaTop} stopOpacity="0.0" />
                  </linearGradient>

                  {/* Secondary gradient for Realization line */}
                  <linearGradient id={`real-grad-${program.id}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor={colorMap.primary} />
                  </linearGradient>
                </defs>

                {/* Horizontal Reference Lines and Y-Axis Marks */}
                {[1, 0.66, 0.33, 0].map((ratio, i) => {
                  const yPos = paddingTop + chartInnerHeight * (1 - ratio);
                  const valLabel = Math.round(maxTargetValue * ratio);
                  const formatted = valLabel >= 1000 ? `${(valLabel / 1000).toFixed(valLabel % 1000 === 0 ? 0 : 1)}k` : `${valLabel}`;

                  return (
                    <g key={i}>
                      <line 
                        x1={paddingLeft} 
                        y1={yPos} 
                        x2={svgWidth - paddingRight} 
                        y2={yPos} 
                        stroke={ratio === 0 ? "#cbd5e1" : "#f1f5f9"} 
                        strokeWidth={ratio === 0 ? "1.5" : "1"}
                        strokeDasharray={ratio === 0 ? "none" : "4 4"} 
                      />
                      <text
                        x={paddingLeft - 8}
                        y={yPos + 3}
                        textAnchor="end"
                        fontSize="9"
                        fontFamily="JetBrains Mono, monospace"
                        fontWeight="500"
                        fill="#94a3b8"
                      >
                        {formatted}
                      </text>
                    </g>
                  );
                })}

                {/* Vertical Reticle Line for Active Selected/Hovered Point */}
                <line
                  x1={activePoint.x}
                  y1={paddingTop}
                  x2={activePoint.x}
                  y2={paddingTop + chartInnerHeight}
                  stroke={colorMap.primary}
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  opacity="0.6"
                />

                {/* Area Gradient Shape */}
                <path d={areaD} fill={`url(#curve-grad-${program.id})`} />

                {/* Soft Ambient Luminous Glow (Duplicate blurred stroke) */}
                <path 
                  d={pathD} 
                  fill="none" 
                  stroke={colorMap.primary} 
                  strokeWidth="6" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  opacity="0.2"
                  filter={`url(#glow-${program.id})`}
                />

                {/* Projected Target Curve Line (2025 to 2029) */}
                <path 
                  d={pathD} 
                  fill="none" 
                  stroke={colorMap.primary} 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />

                {/* Realization Line Overlay (2025 - 2026 actual track) */}
                {realPathD && (
                  <path
                    d={realPathD}
                    fill="none"
                    stroke={`url(#real-grad-${program.id})`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Interactive Data Points along the curve */}
                {points.map((pt) => {
                  const isSelected = selectedYear === pt.year;
                  const isHovered = hoveredYear === pt.year;
                  const active = isSelected || isHovered;

                  return (
                    <g 
                      key={pt.year} 
                      className="cursor-pointer group"
                      onClick={() => setSelectedYear(pt.year)}
                      onMouseEnter={() => setHoveredYear(pt.year)}
                      onMouseLeave={() => setHoveredYear(null)}
                    >
                      {/* Big Invisible Hit Area for smooth hover/touch */}
                      <circle cx={pt.x} cy={pt.y} r="22" fill="transparent" />

                      {/* Concentric Animated Radar Ring when active */}
                      {active && (
                        <>
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="14"
                            fill={colorMap.primary}
                            opacity="0.2"
                            className="animate-ping"
                          />
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="10"
                            fill={colorMap.primary}
                            opacity="0.3"
                          />
                        </>
                      )}

                      {/* Core Datapoint Node */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={active ? "7" : "5"}
                        fill="#ffffff"
                        stroke={colorMap.primary}
                        strokeWidth={active ? "3.5" : "2.5"}
                        className="transition-all duration-200 shadow-sm"
                      />

                      {/* Year Label below baseline */}
                      <text
                        x={pt.x}
                        y={paddingTop + chartInnerHeight + 20}
                        textAnchor="middle"
                        fontSize="11"
                        fontFamily="JetBrains Mono, monospace"
                        fontWeight={active ? "800" : "600"}
                        fill={active ? "#0f172a" : "#64748b"}
                      >
                        {pt.year}
                      </text>

                      {/* Floating Target Badge above the node */}
                      <g transform={`translate(${pt.x}, ${pt.y - 14})`}>
                        <rect
                          x="-22"
                          y="-16"
                          width="44"
                          height="16"
                          rx="4"
                          fill={active ? colorMap.primary : "#1e293b"}
                          opacity={active ? "1" : "0.85"}
                        />
                        <text
                          x="0"
                          y="-4"
                          textAnchor="middle"
                          fontSize="9"
                          fontFamily="JetBrains Mono, monospace"
                          fontWeight="700"
                          fill="#ffffff"
                        >
                          {pt.targetValue >= 1000 ? `${(pt.targetValue / 1000).toFixed(pt.targetValue % 1000 === 0 ? 0 : 1)}k` : pt.targetValue}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>

              {/* Floating Interactive HUD Card directly integrated into the chart */}
              <div className="mt-3 p-3 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-md border border-emerald-700/60">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: colorMap.secondary }} />
                  <div>
                    <span className="text-2xs text-neutral-400 font-mono">Tahun {activePoint.year}:</span>
                    <div className="text-sm font-bold text-white font-mono tabular-nums">
                      {activePoint.targetValue.toLocaleString('id-ID')} <span className="text-2xs text-neutral-300 font-normal">{program.unit}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activePoint.realizationValue && (
                    <span className="text-2xs font-mono px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-md">
                      Realisasi: {activePoint.realizationValue.toLocaleString('id-ID')}
                    </span>
                  )}
                  {activePoint.growthYoY && (
                    <span className="text-2xs font-mono px-2 py-0.5 bg-white/10 text-white rounded-md">
                      {activePoint.growthYoY} YoY
                    </span>
                  )}
                  <span className="text-2xs font-semibold px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded-md">
                    {activePoint.status === 'completed' && 'Selesai 100%'}
                    {activePoint.status === 'in_progress' && 'Sedang Berjalan'}
                    {activePoint.status === 'projected' && 'Rencana Renstra'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: RESPONSIVE BAR CHART */}
          {chartMode === 'bar' && (
            <div className="space-y-3 pt-2">
              {targets.map((t) => {
                const isSelected = selectedYear === t.year;
                const pct = Math.round((t.targetValue / maxTargetValue) * 100);
                const hasRealization = typeof t.realizationValue === 'number';

                return (
                  <div
                    key={t.year}
                    onClick={() => setSelectedYear(t.year)}
                    className={`p-2.5 rounded-xl cursor-pointer transition-all border ${
                      isSelected 
                        ? 'bg-white border-neutral-300 shadow-xs ring-1 ring-neutral-900/10' 
                        : 'border-transparent hover:bg-white/80'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold text-xs ${isSelected ? 'text-neutral-900 underline' : 'text-neutral-700'}`}>
                          {t.year}
                        </span>

                        {t.status === 'completed' && (
                          <span className="text-2xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Tuntas
                          </span>
                        )}
                        {t.status === 'in_progress' && (
                          <span className="text-2xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Berjalan
                          </span>
                        )}
                        {t.status === 'projected' && (
                          <span className="text-2xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md font-medium">
                            Target Proyeksi
                          </span>
                        )}

                        {t.growthYoY && (
                          <span className="text-2xs font-mono text-neutral-400 font-semibold">
                            {t.growthYoY} YoY
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-mono font-bold text-neutral-900 tabular-nums">
                        {t.targetValue.toLocaleString('id-ID')} {program.unit}
                        {hasRealization && (
                          <span className="text-emerald-700 font-medium text-2xs ml-1.5">
                            (Realisasi: {t.realizationValue?.toLocaleString('id-ID')})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="w-full h-3 bg-neutral-200/80 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: isSelected ? colorMap.primary : '#64748b',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* MODE 3: ANNUAL KPI MATRIX TABLE */}
          {chartMode === 'table' && (
            <div className="overflow-x-auto pt-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500 text-2xs font-semibold">
                    <th className="py-2.5 px-3">Tahun</th>
                    <th className="py-2.5 px-3">Target</th>
                    <th className="py-2.5 px-3">Realisasi</th>
                    <th className="py-2.5 px-3">Laju YoY</th>
                    <th className="py-2.5 px-3 text-right">Status Kinerja</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-mono tabular-nums">
                  {targets.map((t) => (
                    <tr 
                      key={t.year} 
                      onClick={() => setSelectedYear(t.year)}
                      className={`cursor-pointer transition-colors ${
                        selectedYear === t.year ? 'bg-neutral-100 font-bold' : 'hover:bg-neutral-50'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-bold text-neutral-900">{t.year}</td>
                      <td className="py-2.5 px-3">{t.targetValue.toLocaleString('id-ID')} {program.unit}</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-semibold">
                        {t.realizationValue ? `${t.realizationValue.toLocaleString('id-ID')} ${program.unit}` : '-'}
                      </td>
                      <td className="py-2.5 px-3 text-neutral-600">{t.growthYoY || '-'}</td>
                      <td className="py-2.5 px-3 text-right font-sans text-2xs">
                        {t.status === 'completed' && <span className="text-emerald-700 font-medium">Tuntas 100%</span>}
                        {t.status === 'in_progress' && <span className="text-amber-700 font-medium">Sedang Berjalan</span>}
                        {t.status === 'projected' && <span className="text-neutral-400">Proyeksi Rencana</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Interactive Year Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3">
          <span className="text-2xs text-neutral-400 font-medium mr-1 whitespace-nowrap">
            Fokus Tahun:
          </span>
          {targets.map((t) => (
            <button
              key={t.year}
              onClick={() => setSelectedYear(t.year)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap border cursor-pointer ${
                selectedYear === t.year
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-emerald-50/50 text-neutral-700 border-emerald-200/60 hover:bg-emerald-100/60'
              }`}
            >
              {t.year}
            </button>
          ))}
        </div>



        {/* Expandable Strategic Outcomes & Leadership */}
        {isExpanded && (
          <div className="my-3 pt-3 border-t border-neutral-100 text-xs space-y-3 animate-in fade-in duration-200">
            <div>
              <span className="font-bold text-neutral-900 block mb-1.5">Target Luaran Strategis (Outcomes):</span>
              <ul className="space-y-1.5 text-neutral-700">
                {program.strategicOutcomes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-neutral-100 text-2xs text-neutral-500">
              <span className="block text-neutral-400">Unit Pelaksana:</span>
              <span className="font-medium text-neutral-800">{program.leadAgency}</span>
            </div>
          </div>
        )}
      </div>

      {/* Card Bottom Toolbar */}
      <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1 font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Sembunyikan Rincian</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Lihat Rincian Luaran</span>
            </>
          )}
        </button>

        {onOpenJournalLink && (
          <button
            onClick={() => onOpenJournalLink(program.category)}
            className="inline-flex items-center gap-1 font-semibold text-neutral-900 hover:text-neutral-700 transition-colors"
          >
            <span>Jurnal Terkait</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
