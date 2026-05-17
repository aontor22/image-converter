/**
 * imageUtils.js
 * Core image processing utilities using the browser Canvas API.
 * All processing happens client-side — no server uploads.
 */

// Supported input formats (MIME types and extensions)
export const SUPPORTED_INPUT_FORMATS = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/svg+xml',
  'image/avif',
];

export const SUPPORTED_EXTENSIONS = [
  '.jpg', '.jpeg', '.jfif', '.png', '.webp',
  '.gif', '.bmp', '.svg', '.avif',
];

// Output formats the user can convert TO
export const OUTPUT_FORMATS = [
  { label: 'JPG', value: 'image/jpeg', ext: 'jpg' },
  { label: 'PNG', value: 'image/png', ext: 'png' },
  { label: 'WEBP', value: 'image/webp', ext: 'webp' },
  { label: 'GIF', value: 'image/gif', ext: 'gif' },
  { label: 'BMP', value: 'image/bmp', ext: 'bmp' },
];

// Max file size: 50 MB
export const MAX_FILE_SIZE_MB = 50;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * Validate a file before processing.
 * Returns { valid: bool, error: string|null }
 */
export function validateFile(file) {
  if (!file) return { valid: false, error: 'No file provided.' };

  // Size check
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File too large (${formatBytes(file.size)}). Max size is ${MAX_FILE_SIZE_MB} MB.`,
    };
  }

  // MIME type check
  const isMimeOk = SUPPORTED_INPUT_FORMATS.includes(file.type);

  // Extension fallback check (for files like .jfif which may have odd MIME)
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  const isExtOk = SUPPORTED_EXTENSIONS.includes(ext);

  if (!isMimeOk && !isExtOk) {
    return {
      valid: false,
      error: `Unsupported format "${file.type || ext}". Supported: JPG, PNG, WEBP, GIF, BMP, SVG, AVIF.`,
    };
  }

  return { valid: true, error: null };
}

/**
 * Load a File/Blob as an HTMLImageElement.
 * Handles SVG by converting to a data URL.
 */
export function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image. The file may be corrupted.'));
    };

    img.src = url;
  });
}

/**
 * Get image dimensions from a File without fully rendering it.
 */
export function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read dimensions.'));
    };
    img.src = url;
  });
}

/**
 * Convert an image file to the target format using Canvas.
 * 
 * @param {File}   file         - Input image file
 * @param {Object} settings     - Conversion settings
 * @param {string} settings.format      - Target MIME type (e.g. 'image/png')
 * @param {string} settings.ext         - Target extension (e.g. 'png')
 * @param {number} settings.quality     - Quality 0–1 (used for jpeg/webp)
 * @param {number|null} settings.width  - Target width (null = original)
 * @param {number|null} settings.height - Target height (null = original)
 * @param {boolean} settings.keepAspect - Maintain aspect ratio
 * 
 * @returns {Promise<{blob: Blob, url: string, size: number, width: number, height: number}>}
 */
export async function convertImage(file, settings) {
  const { format, quality, width: targetW, height: targetH, keepAspect } = settings;

  // Load the image
  const img = await loadImage(file);

  // Calculate output dimensions
  let outW = img.naturalWidth;
  let outH = img.naturalHeight;

  if (targetW || targetH) {
    const aspectRatio = img.naturalWidth / img.naturalHeight;

    if (targetW && targetH) {
      if (keepAspect) {
        // Fit inside the bounding box while maintaining ratio
        const scaleW = targetW / img.naturalWidth;
        const scaleH = targetH / img.naturalHeight;
        const scale = Math.min(scaleW, scaleH);
        outW = Math.round(img.naturalWidth * scale);
        outH = Math.round(img.naturalHeight * scale);
      } else {
        outW = targetW;
        outH = targetH;
      }
    } else if (targetW) {
      outW = targetW;
      outH = keepAspect ? Math.round(targetW / aspectRatio) : img.naturalHeight;
    } else if (targetH) {
      outH = targetH;
      outW = keepAspect ? Math.round(targetH * aspectRatio) : img.naturalWidth;
    }
  }

  // Ensure dimensions are at least 1px
  outW = Math.max(1, outW);
  outH = Math.max(1, outH);

  // Create an offscreen canvas and draw the image
  const canvas = document.createElement('canvas');
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext('2d');

  // White background for JPEG (transparent → white)
  if (format === 'image/jpeg' || format === 'image/bmp') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, outW, outH);
  }

  // Draw with high-quality smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, outW, outH);

  // Export canvas to Blob
  const blob = await new Promise((resolve, reject) => {
    // GIF and BMP don't support quality parameter in toBlob
    const useQuality = (format === 'image/jpeg' || format === 'image/webp')
      ? quality
      : undefined;

    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Canvas conversion failed. Format may not be supported by your browser.'));
      },
      format,
      useQuality,
    );
  });

  // Create an object URL for preview
  const url = URL.createObjectURL(blob);

  return {
    blob,
    url,
    size: blob.size,
    width: outW,
    height: outH,
  };
}

/**
 * Format byte count to human-readable string.
 * e.g. 1024 → "1.0 KB"
 */
export function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Strip extension from filename and return base name.
 */
export function getBaseName(filename) {
  return filename.replace(/\.[^/.]+$/, '');
}

/**
 * Generate a unique ID for each image entry.
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}
