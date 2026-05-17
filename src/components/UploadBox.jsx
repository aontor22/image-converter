/**
 * UploadBox.jsx
 * Drag-and-drop upload area with file picker fallback.
 * Validates files and emits them to the parent component.
 */

import React, { useRef, useState, useCallback } from 'react';
import { validateFile, SUPPORTED_EXTENSIONS } from '../utils/imageUtils';

export default function UploadBox({ onFilesAdded }) {
  const inputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragError, setDragError] = useState(null);

  // Process a FileList: validate and pass valid ones up
  const processFiles = useCallback((fileList) => {
    const files = Array.from(fileList);
    const validFiles = [];
    const errors = [];

    files.forEach((file) => {
      const { valid, error } = validateFile(file);
      if (valid) {
        validFiles.push(file);
      } else {
        errors.push(`"${file.name}": ${error}`);
      }
    });

    if (validFiles.length > 0) {
      onFilesAdded(validFiles);
    }

    if (errors.length > 0) {
      setDragError(errors.join('\n'));
      setTimeout(() => setDragError(null), 5000);
    }
  }, [onFilesAdded]);

  // Drag event handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    // Only trigger when leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  // File input change
  const handleInputChange = (e) => {
    if (e.target.files?.length) {
      processFiles(e.target.files);
      // Reset input so same files can be re-selected
      e.target.value = '';
    }
  };

  return (
    <div id="upload-section" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        aria-label="Upload images by clicking or dragging files here"
        className={`
          relative border-2 border-dashed rounded-2xl p-10 sm:p-14 text-center cursor-pointer
          transition-all duration-200 ease-out select-none
          ${isDragOver
            ? 'border-brand-500 bg-brand-50 scale-[1.01] shadow-upload'
            : 'border-slate-200 bg-white hover:border-brand-400 hover:bg-brand-50/40 shadow-card hover:shadow-card-hover'
          }
        `}
      >
        {/* Upload icon */}
        <div className={`mx-auto mb-5 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200 ${
          isDragOver ? 'bg-brand-100 scale-110' : 'bg-slate-100'
        }`}>
          <svg
            width="32" height="32" viewBox="0 0 32 32" fill="none"
            className={`transition-transform duration-200 ${isDragOver ? 'animate-bounce-gentle' : ''}`}
          >
            <path
              d="M16 6v14M10 11l6-5 6 5"
              stroke={isDragOver ? '#0ea5e9' : '#64748b'}
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            />
            <path
              d="M6 22h20"
              stroke={isDragOver ? '#0ea5e9' : '#94a3b8'}
              strokeWidth="2.5" strokeLinecap="round"
            />
            <path
              d="M4 26h24"
              stroke={isDragOver ? '#bae6fd' : '#cbd5e1'}
              strokeWidth="2" strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Text */}
        {isDragOver ? (
          <div>
            <p className="text-xl font-bold text-brand-600 mb-1">Drop your images here!</p>
            <p className="text-sm text-brand-400">We'll take it from here.</p>
          </div>
        ) : (
          <div>
            <p className="text-lg font-bold text-slate-800 mb-1.5">
              Drop images here, or{' '}
              <span className="text-brand-500 underline underline-offset-2">browse files</span>
            </p>
            <p className="text-sm text-slate-400 mb-4">
              Supports JPG, JPEG, JFIF, PNG, WEBP, GIF, BMP, SVG, AVIF
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1.5v7M4.5 5.5L7 3l2.5 2.5" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round"/>
                  <path d="M2 11h10" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                Multiple files OK
              </span>
              <span>·</span>
              <span>Max 50 MB each</span>
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept={SUPPORTED_EXTENSIONS.map(ext => ext).join(',')}
          multiple
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {/* Error message */}
      {dragError && (
        <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 animate-fade-in">
          <div className="flex items-start gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
              <circle cx="8" cy="8" r="7" stroke="#ef4444" strokeWidth="1.5"/>
              <path d="M8 5v4M8 11v.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <pre className="text-xs text-red-600 font-medium whitespace-pre-wrap break-all">{dragError}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
