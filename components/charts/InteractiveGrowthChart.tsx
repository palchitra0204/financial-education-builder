'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@/lib/financialMath';

export interface ChartDataPoint {
  label: string; // e.g. "Year 1" or "Yr 5"
  value1: number; // e.g. Total Invested
  value2?: number; // e.g. Future Value / Interest
  value3?: number; // e.g. Real Inflation Adjusted Value
}

interface InteractiveGrowthChartProps {
  data: ChartDataPoint[];
  series1Name: string;
  series2Name?: string;
  series3Name?: string;
  title?: string;
  height?: number;
  currency?: string;
}

export const InteractiveGrowthChart: React.FC<InteractiveGrowthChartProps> = ({
  data,
  series1Name,
  series2Name,
  series3Name,
  title,
  height = 260,
  currency = '$',
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
        No chart data available
      </div>
    );
  }

  // Calculate scales
  const maxValue = Math.max(
    ...data.flatMap((d) => [d.value1, d.value2 ?? 0, d.value3 ?? 0])
  );
  const safeMax = maxValue > 0 ? maxValue * 1.1 : 100;

  const width = 600;
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const getX = (index: number) => {
    if (data.length <= 1) return padding.left + chartWidth / 2;
    return padding.left + (index / (data.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    return padding.top + chartHeight - (val / safeMax) * chartHeight;
  };

  // Generate SVG paths
  const generatePath = (getValue: (d: ChartDataPoint) => number) => {
    return data
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(getValue(d))}`)
      .join(' ');
  };

  const generateAreaPath = (getValue: (d: ChartDataPoint) => number) => {
    const linePath = generatePath(getValue);
    const bottomY = padding.top + chartHeight;
    return `${linePath} L ${getX(data.length - 1)} ${bottomY} L ${getX(0)} ${bottomY} Z`;
  };

  const activePoint = hoverIndex !== null ? data[hoverIndex] : data[data.length - 1];

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
      {title && (
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{title}</h4>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              {series1Name}
            </span>
            {series2Name && (
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                {series2Name}
              </span>
            )}
            {series3Name && (
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                {series3Name}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Active snapshot display */}
      {activePoint && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Period</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {activePoint.label}
            </span>
          </div>
          <div>
            <span className="text-blue-500 block text-[11px] font-medium">{series1Name}</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {formatCurrency(activePoint.value1, currency)}
            </span>
          </div>
          {series2Name && activePoint.value2 !== undefined && (
            <div>
              <span className="text-emerald-500 block text-[11px] font-medium">{series2Name}</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {formatCurrency(activePoint.value2, currency)}
              </span>
            </div>
          )}
          {series3Name && activePoint.value3 !== undefined && (
            <div>
              <span className="text-amber-500 block text-[11px] font-medium">{series3Name}</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {formatCurrency(activePoint.value3, currency)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* SVG Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="grad-blue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="grad-emerald" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal) */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
            const y = padding.top + chartHeight * (1 - pct);
            const val = safeMax * pct;
            return (
              <g key={pct}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-800"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 dark:fill-slate-500 font-mono"
                >
                  {val >= 1000000
                    ? `${currency}${(val / 1000000).toFixed(1)}M`
                    : val >= 1000
                    ? `${currency}${(val / 1000).toFixed(0)}k`
                    : `${currency}${Math.round(val)}`}
                </text>
              </g>
            );
          })}

          {/* X axis labels */}
          {data.map((d, i) => {
            // Show every few labels if data is large
            const step = Math.ceil(data.length / 6);
            if (i % step !== 0 && i !== data.length - 1) return null;
            return (
              <text
                key={i}
                x={getX(i)}
                y={height - padding.bottom + 20}
                textAnchor="middle"
                className="text-[10px] fill-slate-400 dark:fill-slate-500 font-mono"
              >
                {d.label}
              </text>
            );
          })}

          {/* Area under series 2 (Future Value) */}
          {series2Name && (
            <path
              d={generateAreaPath((d) => d.value2 ?? 0)}
              fill="url(#grad-emerald)"
            />
          )}

          {/* Area under series 1 (Principal) */}
          <path
            d={generateAreaPath((d) => d.value1)}
            fill="url(#grad-blue)"
          />

          {/* Series 1 Line */}
          <path
            d={generatePath((d) => d.value1)}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Series 2 Line */}
          {series2Name && (
            <path
              d={generatePath((d) => d.value2 ?? 0)}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Series 3 Line (Inflation Adjusted) */}
          {series3Name && (
            <path
              d={generatePath((d) => d.value3 ?? 0)}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="4 3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Hover guideline and dots */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={padding.top}
                x2={getX(hoverIndex)}
                y2={padding.top + chartHeight}
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <circle
                cx={getX(hoverIndex)}
                cy={getY(data[hoverIndex].value1)}
                r="4.5"
                fill="#3b82f6"
                stroke="#ffffff"
                strokeWidth="2"
              />
              {series2Name && data[hoverIndex].value2 !== undefined && (
                <circle
                  cx={getX(hoverIndex)}
                  cy={getY(data[hoverIndex].value2!)}
                  r="4.5"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              )}
              {series3Name && data[hoverIndex].value3 !== undefined && (
                <circle
                  cx={getX(hoverIndex)}
                  cy={getY(data[hoverIndex].value3!)}
                  r="4.5"
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              )}
            </g>
          )}

          {/* Interactive touch/mouse overlay rectangles */}
          {data.map((_, i) => {
            const stepW = chartWidth / (data.length - 1 || 1);
            return (
              <rect
                key={i}
                x={getX(i) - stepW / 2}
                y={padding.top}
                width={stepW}
                height={chartHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoverIndex(i)}
                onClick={() => setHoverIndex(i)}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};
