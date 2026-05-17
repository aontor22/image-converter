/**
 * Footer.jsx
 * Modern footer with branding, links, and developer credit.
 */

import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 py-10 mt-0 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 9.5l2.5-3.5L7 9l1.5-2L11 9.5H2z"
                  fill="white"
                  opacity="0.95"
                />
                <circle cx="10" cy="4" r="1.2" fill="white" />
              </svg>
            </div>

            <div>
              <h2 className="font-display text-lg font-extrabold text-white tracking-wide">
                Image<span className="text-brand-400">Shift</span>
              </h2>

              <p className="text-xs text-slate-500 font-medium">
                Fast • Secure • Browser Based
              </p>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-sm text-center text-slate-400 max-w-md leading-relaxed font-medium">
            Convert JPG, PNG, WEBP, AVIF, JFIF and more directly in your browser.
            No uploads, no tracking, and no server processing.
          </p>

          {/* Navigation */}
          <div className="flex items-center gap-6 text-sm font-semibold">
            <a
              href="#faq-section"
              className="hover:text-white transition-colors duration-200"
            >
              FAQ
            </a>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-200"
            >
              GitHub
            </a>

            <a
              href="#"
              className="hover:text-white transition-colors duration-200"
            >
              Privacy
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Copyright */}
          <p className="text-sm font-extrabold tracking-wide text-white text-center sm:text-left">
            © {new Date().getFullYear()} ImageShift • Developed by{" "}
            <span className="text-brand-400 font-black">
              Udoy Chowdhury
            </span>
          </p>

          {/* Status */}
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}