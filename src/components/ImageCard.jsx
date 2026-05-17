/**
 * ImageCard.jsx
 * Displays a single image with its metadata, conversion status,
 * preview, and download button.
 */

import React, { useState } from 'react';
import { formatBytes } from '../utils/imageUtils';
import { downloadSingle } from '../utils/zipUtils';

// Status badge colors
const STATUS_CONFIG = {
  idle: { label: 'Ready', bg: 'bg-slate-100', text: 'text-slate-500', dot: 'bg-slate-400' },
  converting: { label: 'Converting', bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' },
  done: { label: 'Done', bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  error: { label: 'Error', bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500' },
};

export default function ImageCard({ image, settings, onRemove }) {
  const { id, file, preview, dimensions, status, result, error } = image;
  const [showOriginal, setShowOriginal] = useState(false);

  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.idle;

  const handleDownload = () => {
    if (result?.blob) {
      downloadSingle(result.blob, file.name, settings.ext);
    }
  };

  // Which preview to show: converted (if done) or original
  const displayPreview = status === 'done' && !showOriginal
    ? result?.url
    : preview;

  return (
    <div className="img-card bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden animate-slide-up">
      {/* Image preview area */}
      <div className="relative bg-slate-50 aspect-video overflow-hidden group">
        <img
          src={displayPreview}
          alt={file.name}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 60"><rect width="80" height="60" fill="%23f1f5f9"/><path d="M20 40l12-15 10 12 8-8 10 11H20z" fill="%23cbd5e1"/><circle cx="55" cy="22" r="5" fill="%23cbd5e1"/></svg>';
          }}
        />

        {/* Status badge overlay */}
        <div className={`absolute top-2 left-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${status === 'converting' ? 'animate-pulse' : ''}`} />
          {cfg.label}
        </div>

        {/* Remove button */}
        <button
          onClick={() => onRemove(id)}
          className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-red-50 hover:text-red-500 text-slate-400 flex items-center justify-center transition-all duration-200 shadow-sm opacity-0 group-hover:opacity-100"
          title="Remove"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Toggle preview (original vs converted) */}
        {status === 'done' && (
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-white text-xs font-medium hover:bg-black/60 transition-all"
          >
            {showOriginal ? 'View Converted' : 'View Original'}
          </button>
        )}

        {/* Converting overlay */}
        {status === 'converting' && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="animate-spin">
                <circle cx="16" cy="16" r="12" stroke="#e2e8f0" strokeWidth="3"/>
                <path d="M16 4a12 12 0 0112 12" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              <span className="text-xs font-semibold text-brand-500">Processing…</span>
            </div>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4">
        {/* Filename */}
        <p
          className="text-sm font-semibold text-slate-800 truncate mb-1"
          title={file.name}
        >
          {file.name}
        </p>

        {/* File metadata */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-400 mb-3">
          <span className="flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <rect x="1" y="1" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M3 6l1.5-2 1.5 1.5L8 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            {formatBytes(file.size)}
          </span>
          {dimensions && (
            <span className="flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 3V1h2M7 1h2v2M9 7v2H7M3 9H1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {dimensions.width} × {dimensions.height}
            </span>
          )}
        </div>

        {/* Conversion result info */}
        {status === 'done' && result && (
          <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-600 font-medium">Converted</span>
              <span className="font-mono text-emerald-700 font-semibold">{formatBytes(result.size)}</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-emerald-500">Dimensions</span>
              <span className="font-mono text-emerald-600">{result.width} × {result.height}</span>
            </div>
            {/* Size comparison */}
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-emerald-500">Size change</span>
              <SizeDelta original={file.size} converted={result.size} />
            </div>
          </div>
        )}

        {/* Error message */}
        {status === 'error' && error && (
          <div className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-100">
            <p className="text-xs text-red-500 font-medium leading-relaxed">{error}</p>
          </div>
        )}

        {/* Download button */}
        {status === 'done' && (
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v7M4.5 5.5L7 8l2.5-2.5M2 11h10" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download .{settings.ext}
          </button>
        )}
      </div>
    </div>
  );
}

/** Shows size increase/decrease with color coding */
function SizeDelta({ original, converted }) {
  const diff = converted - original;
  const pct = Math.round((diff / original) * 100);
  const isSmaller = diff < 0;

  return (
    <span className={`font-mono font-semibold ${isSmaller ? 'text-emerald-600' : 'text-orange-500'}`}>
      {isSmaller ? '↓' : '↑'} {Math.abs(pct)}%
    </span>
  );
}
