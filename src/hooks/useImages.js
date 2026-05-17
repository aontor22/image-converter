/**
 * useImages.js
 * Custom React hook that manages the entire image list state:
 * - Adding images (with deduplication)
 * - Removing images
 * - Clearing all images
 * - Running batch conversions
 */

import { useState, useCallback } from 'react';
import {
  getImageDimensions,
  convertImage,
  generateId,
} from '../utils/imageUtils';

export function useImages() {
  // Array of image objects:
  // { id, file, preview, dimensions, status: 'idle'|'converting'|'done'|'error', result, error }
  const [images, setImages] = useState([]);

  // Index of the image currently being converted (for progress display)
  const [convertingIndex, setConvertingIndex] = useState(0);
  const [isConverting, setIsConverting] = useState(false);

  /**
   * Add new files to the images list.
   * Deduplicates by file name + size combination.
   * Loads preview URLs and dimensions asynchronously.
   */
  const addImages = useCallback(async (files) => {
    setImages((prev) => {
      // Build a set of existing "fingerprints" to avoid duplicates
      const existing = new Set(prev.map((img) => `${img.file.name}-${img.file.size}`));

      const newEntries = files
        .filter((file) => !existing.has(`${file.name}-${file.size}`))
        .map((file) => ({
          id: generateId(),
          file,
          preview: URL.createObjectURL(file),
          dimensions: null, // will be loaded below
          status: 'idle',
          result: null,
          error: null,
        }));

      if (newEntries.length === 0) return prev;

      // Load dimensions for new entries asynchronously
      newEntries.forEach(async (entry) => {
        try {
          const dims = await getImageDimensions(entry.file);
          setImages((cur) =>
            cur.map((img) => img.id === entry.id ? { ...img, dimensions: dims } : img)
          );
        } catch {
          // Non-critical: just skip dimension display
        }
      });

      return [...prev, ...newEntries];
    });
  }, []);

  /**
   * Remove a single image by ID.
   * Revokes the object URL to free memory.
   */
  const removeImage = useCallback((id) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) {
        URL.revokeObjectURL(target.preview);
        if (target.result?.url) URL.revokeObjectURL(target.result.url);
      }
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  /**
   * Clear all images and revoke all object URLs.
   */
  const clearAll = useCallback(() => {
    setImages((prev) => {
      prev.forEach((img) => {
        URL.revokeObjectURL(img.preview);
        if (img.result?.url) URL.revokeObjectURL(img.result.url);
      });
      return [];
    });
  }, []);

  /**
   * Convert all images sequentially using the provided settings.
   * Updates each image's status as it goes.
   */
  const convertAll = useCallback(async (settings) => {
    if (isConverting) return;

    setIsConverting(true);
    setConvertingIndex(0);

    // Get a snapshot of current image IDs in order
    const ids = [];
    setImages((prev) => {
      ids.push(...prev.map((img) => img.id));
      return prev;
    });

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      setConvertingIndex(i);

      // Mark as converting
      setImages((prev) =>
        prev.map((img) => img.id === id ? { ...img, status: 'converting' } : img)
      );

      try {
        // Get the file for this id
        let file;
        setImages((prev) => {
          const found = prev.find((img) => img.id === id);
          file = found?.file;
          return prev;
        });

        if (!file) continue;

        // Revoke previous result URL to free memory
        setImages((prev) => {
          const found = prev.find((img) => img.id === id);
          if (found?.result?.url) URL.revokeObjectURL(found.result.url);
          return prev;
        });

        const result = await convertImage(file, settings);

        // Mark as done
        setImages((prev) =>
          prev.map((img) =>
            img.id === id
              ? { ...img, status: 'done', result, error: null }
              : img
          )
        );
      } catch (err) {
        // Mark as error
        setImages((prev) =>
          prev.map((img) =>
            img.id === id
              ? { ...img, status: 'error', error: err.message, result: null }
              : img
          )
        );
      }

      // Small delay between conversions to keep UI responsive
      await new Promise((r) => setTimeout(r, 30));
    }

    setIsConverting(false);
  }, [isConverting]);

  return {
    images,
    isConverting,
    convertingIndex,
    addImages,
    removeImage,
    clearAll,
    convertAll,
  };
}
