/**
 * PreviewGallery.jsx
 * Responsive grid that renders an ImageCard for each uploaded image.
 * Shows a progress bar during batch conversion.
 */

import React from 'react';
import ImageCard from './ImageCard';

export default function PreviewGallery({
  images,
  settings,
  onRemove,
  isConverting,
  convertingIndex,
}) {
  if (images.length === 0) return null;

  const doneCount = images.filter((img) => img.status === 'done').length;
  const totalCount = images.length;
  const progressPct = isConverting && totalCount > 0
    ? Math.round((doneCount / totalCount) * 100)
    : 0;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="2" width="6" height="6" rx="1.5" fill="#0ea5e9" opacity="0.8"/>
            <rect x="10" y="2" width="6" height="6" rx="1.5" fill="#6366f1" opacity="0.8"/>
            <rect x="2" y="10" width="6" height="6" rx="1.5" fill="#f97316" opacity="0.8"/>
            <rect x="10" y="10" width="6" height="6" rx="1.5" fill="#10b981" opacity="0.8"/>
          </svg>
          Images
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-mono">
            {totalCount}
          </span>
        </h2>

        {doneCount > 0 && (
          <span className="text-xs text-emerald-600 font-semibold">
            ✓ {doneCount}/{totalCount} converted
          </span>
        )}
      </div>

      {/* Progress bar (shown during batch conversion) */}
      {isConverting && (
        <div className="mb-5 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span>Converting image {Math.min(convertingIndex + 1, totalCount)} of {totalCount}…</span>
            <span className="font-mono font-semibold text-brand-500">{progressPct}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full progress-bar rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Image grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            settings={settings}
            onRemove={onRemove}
          />
        ))}
      </div>
    </section>
  );
}
