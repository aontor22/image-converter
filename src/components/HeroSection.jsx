/**
 * HeroSection.jsx
 * Landing hero with headline, subtitle, CTA buttons, and trust badge.
 */

import React from 'react';

const FORMAT_BADGES = ['JPG', 'PNG', 'WEBP', 'GIF', 'BMP', 'SVG', 'AVIF'];

export default function HeroSection({ onScrollToUpload }) {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-20 sm:pt-20 sm:pb-28">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-100 opacity-60 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-indigo-100 opacity-50 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-orange-50 opacity-40 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-semibold tracking-wide mb-6 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse-slow" />
          100% Free · No Account Required
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6 animate-slide-up">
          Free Online{' '}
          <span className="gradient-text">Image Converter</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.05s' }}>
          Convert JPG, PNG, JFIF, WEBP, GIF, BMP, SVG, and AVIF images
          instantly in your browser — with resize and quality controls.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={onScrollToUpload}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-base transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2v10M5 5l4-3 4 3M2 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Convert Images
          </button>

          <button
            onClick={onScrollToUpload}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-base transition-all duration-200 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="3" y="3" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M6 9h6M9 6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            Upload Files
          </button>
        </div>

        {/* Format badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 animate-fade-in" style={{ animationDelay: '0.15s' }}>
          {FORMAT_BADGES.map((fmt) => (
            <span
              key={fmt}
              className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-semibold border border-slate-200"
            >
              {fmt}
            </span>
          ))}
          <span className="text-slate-400 text-xs ml-1">supported</span>
        </div>

        {/* Trust banner */}
        <div className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2L3 5v5c0 3.5 2.5 6.2 6 7 3.5-.8 6-3.5 6-7V5L9 2z" fill="#d1fae5" stroke="#059669" strokeWidth="1.5"/>
            <path d="M6 9l2 2 4-4" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Your images are processed <strong>locally in your browser</strong> and are never uploaded to any server.
        </div>

        {/* Stats row */}
        <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: '0.25s' }}>
          {[
            { value: '9+', label: 'Input Formats' },
            { value: '5+', label: 'Output Formats' },
            { value: '∞', label: 'Files at Once' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-display font-extrabold text-slate-900">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-0.5 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
