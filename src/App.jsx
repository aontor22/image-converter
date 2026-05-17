/**
 * App.jsx
 * Root component — composes all sections and wires together state.
 */

import React, { useState, useRef } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import UploadBox from './components/UploadBox';
import ConversionSettings from './components/ConversionSettings';
import PreviewGallery from './components/PreviewGallery';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import { useImages } from './hooks/useImages';
import { downloadAllAsZip } from './utils/zipUtils';

// Default conversion settings
const DEFAULT_SETTINGS = {
  format: 'image/jpeg',
  ext: 'jpg',
  quality: 0.85,
  width: '',
  height: '',
  keepAspect: true,
};

export default function App() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const uploadRef = useRef(null);

  const {
    images,
    isConverting,
    convertingIndex,
    addImages,
    removeImage,
    clearAll,
    convertAll,
  } = useImages();

  // Images that have been successfully converted
  const convertedImages = images.filter((img) => img.status === 'done');

  // Scroll to upload area on hero CTA click
  const scrollToUpload = () => {
    document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle batch download
  const handleDownloadAll = async () => {
    await downloadAllAsZip(
      convertedImages.map((img) => ({
        file: img.file,
        result: img.result,
        settings,
      }))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navigation */}
      <Header />

      {/* Hero */}
      <HeroSection onScrollToUpload={scrollToUpload} />

      {/* Main content area */}
      <main className="flex-1 pb-16">
        {/* Upload Box */}
        <UploadBox onFilesAdded={addImages} />

        {/* Settings & Actions (only shown once images are loaded) */}
        {images.length > 0 && (
          <>
            <ConversionSettings
              settings={settings}
              onChange={setSettings}
              onConvert={() => convertAll(settings)}
              onClearAll={clearAll}
              onDownloadAll={handleDownloadAll}
              imageCount={images.length}
              convertedCount={convertedImages.length}
              isConverting={isConverting}
            />

            {/* Preview Gallery */}
            <PreviewGallery
              images={images}
              settings={settings}
              onRemove={removeImage}
              isConverting={isConverting}
              convertingIndex={convertingIndex}
            />
          </>
        )}

        {/* Empty state hint when no images */}
        {images.length === 0 && (
          <div className="max-w-xl mx-auto px-4 mt-10 text-center animate-fade-in">
            <div className="grid grid-cols-3 gap-3 mb-6">
              {['JPG → PNG', 'WEBP → JPG', 'PNG → WEBP'].map((label) => (
                <div key={label} className="bg-white rounded-xl p-3 shadow-card border border-slate-100 text-xs font-mono text-slate-400">
                  {label}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-400">
              Upload your first image above to get started
            </p>
          </div>
        )}
      </main>

      {/* FAQ */}
      <FAQ />

      {/* Footer */}
      <Footer />
    </div>
  );
}
