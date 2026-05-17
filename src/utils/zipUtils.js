/**
 * zipUtils.js
 * Handles bundling converted images into a ZIP archive for batch download.
 * Uses JSZip (browser-compatible) + FileSaver.
 */

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { getBaseName } from './imageUtils';

/**
 * Download a single converted image blob.
 * 
 * @param {Blob}   blob     - The converted image blob
 * @param {string} filename - Original filename
 * @param {string} ext      - Target extension (e.g. 'png')
 */
export function downloadSingle(blob, filename, ext) {
  const baseName = getBaseName(filename);
  saveAs(blob, `${baseName}.${ext}`);
}

/**
 * Bundle all converted images into a ZIP and trigger download.
 * 
 * @param {Array} images - Array of image objects with:
 *   { file: File, result: { blob, ... }, settings: { ext, ... } }
 */
export async function downloadAllAsZip(images) {
  const zip = new JSZip();

  // Track used filenames to avoid collisions inside the ZIP
  const usedNames = {};

  for (const img of images) {
    if (!img.result?.blob) continue;

    const baseName = getBaseName(img.file.name);
    const ext = img.settings.ext;
    let zipName = `${baseName}.${ext}`;

    // Handle filename collisions
    if (usedNames[zipName]) {
      usedNames[zipName]++;
      zipName = `${baseName}_${usedNames[zipName]}.${ext}`;
    } else {
      usedNames[zipName] = 1;
    }

    zip.file(zipName, img.result.blob);
  }

  // Generate ZIP blob and trigger download
  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  const timestamp = new Date().toISOString().slice(0, 10);
  saveAs(zipBlob, `converted-images-${timestamp}.zip`);
}
