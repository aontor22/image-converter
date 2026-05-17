/**
 * ConversionSettings.jsx
 * Global settings panel: output format, quality, resize, and action buttons.
 */

import React from 'react';
import { OUTPUT_FORMATS } from '../utils/imageUtils';

export default function ConversionSettings({
  settings,
  onChange,
  onConvert,
  onClearAll,
  onDownloadAll,
  imageCount,
  convertedCount,
  isConverting,
}) {
  const { format, quality, width, height, keepAspect } = settings;

  // Quality applies only to JPEG and WEBP
  const showQuality = format === 'image/jpeg' || format === 'image/webp';

  const handleChange = (key, value) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7.5" stroke="#0ea5e9" strokeWidth="1.5"/>
              <path d="M6 9h6M9 6v6" stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Conversion Settings
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            {imageCount} image{imageCount !== 1 ? 's' : ''} loaded
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Output Format */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Output Format
            </label>
            <select
              value={format}
              onChange={(e) => {
                const found = OUTPUT_FORMATS.find(f => f.value === e.target.value);
                onChange({ ...settings, format: e.target.value, ext: found?.ext || 'jpg' });
              }}
              className="w-full px-3 py-2.5 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            >
              {OUTPUT_FORMATS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>

          {/* Quality Slider */}
          <div className={`transition-opacity duration-200 ${showQuality ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Quality
              <span className="ml-1 text-brand-500 font-mono normal-case">
                {Math.round(quality * 100)}%
              </span>
              {!showQuality && <span className="ml-1 text-slate-400 normal-case font-normal">(JPG/WEBP only)</span>}
            </label>
            <div className="flex items-center gap-3 pt-1.5">
              <span className="text-xs text-slate-400">Low</span>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={quality}
                onChange={(e) => handleChange('quality', parseFloat(e.target.value))}
                className="flex-1"
                style={{
                  background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${(quality - 0.1) / 0.9 * 100}%, #e2e8f0 ${(quality - 0.1) / 0.9 * 100}%, #e2e8f0 100%)`
                }}
              />
              <span className="text-xs text-slate-400">High</span>
            </div>
          </div>

          {/* Resize Width & Height */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Resize (px)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Width"
                value={width}
                min="1"
                max="16000"
                onChange={(e) => handleChange('width', e.target.value ? parseInt(e.target.value) : '')}
                className="w-full px-3 py-2.5 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
              <span className="text-slate-300 font-bold text-lg">×</span>
              <input
                type="number"
                placeholder="Height"
                value={height}
                min="1"
                max="16000"
                onChange={(e) => handleChange('height', e.target.value ? parseInt(e.target.value) : '')}
                className="w-full px-3 py-2.5 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Aspect Ratio Toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Aspect Ratio
            </label>
            <button
              onClick={() => handleChange('keepAspect', !keepAspect)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                keepAspect
                  ? 'bg-brand-50 border-brand-200 text-brand-700'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              <div className={`w-4 h-4 rounded flex items-center justify-center border-2 flex-shrink-0 transition-colors ${
                keepAspect ? 'bg-brand-500 border-brand-500' : 'border-slate-300'
              }`}>
                {keepAspect && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              Keep Aspect Ratio
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 pt-5 border-t border-slate-100">
          {/* Convert Button */}
          <button
            onClick={onConvert}
            disabled={imageCount === 0 || isConverting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {isConverting ? (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-spin">
                  <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="2" strokeDasharray="28" strokeDashoffset="8" strokeLinecap="round"/>
                </svg>
                Converting...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8a5 5 0 019.9-1M13 8a5 5 0 01-9.9 1" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
                  <path d="M13 4v3h-3M3 12v-3h3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Convert All ({imageCount})
              </>
            )}
          </button>

          {/* Download All ZIP */}
          {convertedCount > 0 && (
            <button
              onClick={onDownloadAll}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v8M5 7l3 3 3-3M2 13h12" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Download All as ZIP ({convertedCount})
            </button>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Clear All */}
          {imageCount > 0 && (
            <button
              onClick={onClearAll}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-red-50 text-red-500 hover:text-red-600 font-semibold text-sm transition-all duration-200 border border-slate-200 hover:border-red-200"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 3.5h10M5.5 3.5V2.5h3v1M6 6v4M8 6v4M3 3.5l.7 8h6.6l.7-8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
