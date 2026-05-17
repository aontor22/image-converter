/**
 * Header.jsx
 * Simple sticky navigation bar with logo and nav links.
 */

import React, { useState, useEffect } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  // Add shadow when user scrolls down
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToUpload = () => {
    document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white/90 backdrop-blur-md transition-all duration-300 ${
        scrolled ? 'shadow-card border-b border-slate-100' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-500 flex items-center justify-center shadow-sm">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 12l3.5-4.5L9 11l2-2.5L14 12H3z" fill="white" opacity="0.9"/>
                <circle cx="13" cy="5.5" r="1.5" fill="white"/>
              </svg>
            </div>
            <span className="font-display font-bold text-lg text-slate-900 tracking-tight">
              Image<span className="text-brand-500">Shift</span>
            </span>
          </div>

          {/* Nav links — hidden on mobile */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#faq-section"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              FAQ
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              GitHub
            </a>
          </nav>

          {/* CTA button */}
          <button
            onClick={scrollToUpload}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v8M4 4l3-3 3 3M2 11h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Convert Images
          </button>
        </div>
      </div>
    </header>
  );
}
