/**
 * Footer.jsx
 * Simple site footer with links and copyright notice.
 */

import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 mt-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-500 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 9.5l2.5-3.5L7 9l1.5-2L11 9.5H2z" fill="white" opacity="0.9"/>
                <circle cx="10" cy="4" r="1.2" fill="white"/>
              </svg>
            </div>
            <span className="font-display font-bold text-white text-sm">
              Image<span className="text-brand-400">Shift</span>
            </span>
          </div>

          {/* Tagline */}
          <p className="text-xs text-center text-slate-500 max-w-xs leading-relaxed">
            Free, open-source image converter. All processing happens in your browser.
            No data is ever sent to a server.
          </p>

          {/* Links */}
          <div className="flex items-center gap-5 text-xs">
            <a href="#faq-section" className="hover:text-slate-200 transition-colors">FAQ</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-200 transition-colors">GitHub</a>
            <a href="#" className="hover:text-slate-200 transition-colors">Privacy</a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} ImageShift. Free forever.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
