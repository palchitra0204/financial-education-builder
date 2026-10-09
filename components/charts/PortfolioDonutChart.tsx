'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@/lib/financialMath';

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
  percentage?: number;
}

interface PortfolioDonutChartProps {
  segments: DonutSegment[];
  title?: string;
  centerLabel?: string;
  centerValue?: string | number;
  currency?: string;
  size?: number;
}

export const PortfolioDonutChart: React.FC<PortfolioDonutChartProps> = ({
  segments,
  title,
  centerLabel,
  centerValue,
  currency = '$',
  size = 200,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = segments.reduce((sum, s) => sum + s.value, 0);

  if (total <= 0) {
    return (
      <div className="flex items-center justify-center p-6 text-sm text-slate-400">
        No portfolio allocation data
      </div>
    );
  }

  const radius = 80;
  const innerRadius = 54;
  const center = size / 2;

  let cumulativeAngle = 0;
  const slices = segments.map((seg, idx) => {
    const fraction = seg.value / total;
    const angle = fraction * 2 * Math.PI;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle += angle;

    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    const ix1 = center + innerRadius * Math.cos(endAngle);
    const iy1 = center + innerRadius * Math.sin(endAngle);
    const ix2 = center + innerRadius * Math.cos(startAngle);
    const iy2 = center + innerRadius * Math.sin(startAngle);

    const largeArcFlag = angle > Math.PI ? 1 : 0;

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${ix1} ${iy1}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${ix2} ${iy2}`,
      'Z',
    ].join(' ');

    return {
      ...seg,
      pathData,
      pct: Math.round(fraction * 100),
      idx,
    };
  });

  const activeSegment = hoveredIdx !== null ? segments[hoveredIdx] : null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
        >
          {slices.map((slice) => (
            <path
              key={slice.idx}
              d={slice.pathData}
              fill={slice.color}
              className="transition-all duration-200 cursor-pointer hover:opacity-90"
              style={{
                transform: hoveredIdx === slice.idx ? 'scale(1.04)' : 'scale(1)',
                transformOrigin: `${center}px ${center}px`,
              }}
              onMouseEnter={() => setHoveredIdx(slice.idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          ))}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {activeSegment ? activeSegment.label : centerLabel || 'Total'}
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[110px]">
            {activeSegment
              ? `${activeSegment.percentage ?? Math.round((activeSegment.value / total) * 100)}%`
              : typeof centerValue === 'number'
              ? formatCurrency(centerValue, currency)
              : centerValue || formatCurrency(total, currency)}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 w-full space-y-2">
        {title && (
          <h4 className="font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            {title}
          </h4>
        )}
        <div className="space-y-2">
          {segments.map((seg, idx) => {
            const pct = Math.round((seg.value / total) * 100);
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`flex items-center justify-between text-xs p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isHovered
                    ? 'bg-slate-100 dark:bg-slate-800'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                    {seg.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-slate-500 dark:text-slate-400 font-mono">
                    {formatCurrency(seg.value, currency)}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono w-9 text-right">
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
