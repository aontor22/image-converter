/**
 * FAQ.jsx
 * Accordion FAQ section with smooth expand/collapse animations.
 */

import React, { useState } from 'react';

const FAQ_ITEMS = [
  {
    q: 'Is this image converter free?',
    a: 'Yes, completely free. No account required, no subscription, no watermarks. ImageShift is free to use for personal and commercial purposes.',
  },
  {
    q: 'Are my images uploaded to a server?',
    a: 'No. All image processing happens entirely in your browser using the Canvas API and Web APIs. Your files never leave your device. We do not have any servers that receive or store your images.',
  },
  {
    q: 'Can I convert multiple images at once?',
    a: 'Yes! You can upload as many images as you want. Use the "Convert All" button to convert them all in one go, then download them individually or as a single ZIP archive.',
  },
  {
    q: 'Which input formats are supported?',
    a: 'We support: JPG, JPEG, JFIF, PNG, WEBP, GIF, BMP, SVG, and AVIF. If your image format is not listed, please let us know and we will consider adding it.',
  },
  {
    q: 'Which output formats can I convert to?',
    a: 'You can convert to JPG, PNG, WEBP, GIF, and BMP. Note that AVIF output is not yet supported by most browsers natively, so it is not listed as an output option.',
  },
  {
    q: 'Can I resize images while converting?',
    a: 'Yes. In the Conversion Settings panel, enter a target width and/or height. Enable "Keep Aspect Ratio" to avoid distortion. Leave both blank to keep the original dimensions.',
  },
  {
    q: 'What does the quality slider do?',
    a: 'The quality slider controls the compression level when converting to JPG or WEBP. Higher quality means a larger file size but better visual fidelity. It has no effect on PNG, GIF, or BMP since those use lossless compression.',
  },
  {
    q: 'Is there a file size limit?',
    a: 'Each file can be up to 50 MB. Very large images (e.g. 20+ MP) may take a few seconds to process depending on your device speed, since everything runs in your browser.',
  },
];

function FaqItem({ item, isOpen, onClick }) {
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={onClick}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
      >
        <span className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-brand-500 transition-colors">
          {item.q}
        </span>
        <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          isOpen ? 'border-brand-500 bg-brand-500' : 'border-slate-200 group-hover:border-brand-300'
        }`}>
          <svg
            width="10" height="10" viewBox="0 0 10 10" fill="none"
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          >
            <path d="M2 3.5l3 3 3-3" stroke={isOpen ? 'white' : '#94a3b8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>

      {/* Answer — uses max-height for smooth animation */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? '200px' : '0px' }}
      >
        <p className="text-sm text-slate-500 leading-relaxed pb-5">
          {item.a}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => setOpenIndex(openIndex === idx ? null : idx);

  return (
    <section id="faq-section" className="bg-white py-16 mt-16 border-t border-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-base">
            Everything you need to know about ImageShift.
          </p>
        </div>

        {/* Accordion */}
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 px-6">
          {FAQ_ITEMS.map((item, idx) => (
            <FaqItem
              key={idx}
              item={item}
              isOpen={openIndex === idx}
              onClick={() => toggle(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
