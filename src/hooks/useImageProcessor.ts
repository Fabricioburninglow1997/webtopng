import { useState, useCallback } from 'react';
import { ImageFile, ConversionSettings } from '../types';

const PRESET_SIZES = {
  'Square (1080x1080)': { width: 1080, height: 1080 },
  'Story (1080x1920)': { width: 1080, height: 1920 },
  'Social (1200x630)': { width: 1200, height: 630 },
  'Original': { width: 0, height: 0 }
};

export function useImageProcessor() {
  const [queue, setQueue] = useState<ImageFile[]>([]);
  const [processing, setProcessing] = useState(false);

  const addToQueue = useCallback((files: File[]) => {
    const newImages: ImageFile[] = files.map(file => ({
      id: crypto.randomUUID(),
      file,
      status: 'pending',
      originalSize: file.size,
      preview: URL.createObjectURL(file)
    }));

    setQueue(prev => [...prev, ...newImages]);
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setQueue(prev => {
      const image = prev.find(img => img.id === id);
      if (image?.preview) URL.revokeObjectURL(image.preview);
      if (image?.downloadUrl) URL.revokeObjectURL(image.downloadUrl);
      return prev.filter(img => img.id !== id);
    });
  }, []);

  const clearQueue = useCallback(() => {
    queue.forEach(img => {
      if (img.preview) URL.revokeObjectURL(img.preview);
      if (img.downloadUrl) URL.revokeObjectURL(img.downloadUrl);
    });
    setQueue([]);
  }, [queue]);

  const processImage = useCallback(async (image: ImageFile, settings: ConversionSettings): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        let targetWidth = img.width;
        let targetHeight = img.height;

        // Apply preset size if not Original
        if (settings.size !== 'Original') {
          const preset = PRESET_SIZES[settings.size as keyof typeof PRESET_SIZES];
          if (preset) {
            targetWidth = preset.width;
            targetHeight = preset.height;
          }
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Fill white background for JPG
        if (settings.format === 'jpg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
        }

        // Calculate dimensions to maintain aspect ratio
        let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;
        
        if (settings.size !== 'Original') {
          const targetRatio = targetWidth / targetHeight;
          const imageRatio = img.width / img.height;

          if (targetRatio > imageRatio) {
            sHeight = img.width / targetRatio;
            sy = (img.height - sHeight) / 2;
          } else {
            sWidth = img.height * targetRatio;
            sx = (img.width - sWidth) / 2;
          }
        }

        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);

        const format = settings.format === 'original' 
          ? image.file.type.split('/')[1] 
          : settings.format;
          
        const mimeType = `image/${format === 'jpg' ? 'jpeg' : format}`;

        canvas.toBlob(
          blob => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create image blob'));
            }
          },
          mimeType,
          settings.quality / 100
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(image.file);
    });
  }, []);

  const processImages = useCallback(async (settings: ConversionSettings) => {
    if (processing || queue.length === 0) return;
    
    setProcessing(true);
    
    try {
      for (const image of queue) {
        if (image.status !== 'pending') continue;

        // Update status to processing
        setQueue(prev => prev.map(img => 
          img.id === image.id ? { ...img, status: 'processing' } : img
        ));

        try {
          const processedBlob = await processImage(image, settings);
          const downloadUrl = URL.createObjectURL(processedBlob);

          setQueue(prev => prev.map(img =>
            img.id === image.id ? {
              ...img,
              status: 'completed',
              convertedSize: processedBlob.size,
              downloadUrl
            } : img
          ));
        } catch (error) {
          setQueue(prev => prev.map(img =>
            img.id === image.id ? {
              ...img,
              status: 'error',
              error: error instanceof Error ? error.message : 'Unknown error'
            } : img
          ));
        }
      }
    } finally {
      setProcessing(false);
    }
  }, [queue, processing, processImage]);

  const downloadImage = useCallback((id: string) => {
    const image = queue.find(img => img.id === id);
    if (!image?.downloadUrl) return;

    const link = document.createElement('a');
    link.href = image.downloadUrl;
    const extension = image.file.name.split('.').pop() || 'jpg';
    link.download = `optimized-${image.file.name.replace(/\.[^/.]+$/, '')}.${extension}`;
    link.click();
  }, [queue]);

  const downloadAll = useCallback(() => {
    queue.forEach(image => {
      if (image.status === 'completed' && image.downloadUrl) {
        const link = document.createElement('a');
        link.href = image.downloadUrl;
        const extension = image.file.name.split('.').pop() || 'jpg';
        link.download = `optimized-${image.file.name.replace(/\.[^/.]+$/, '')}.${extension}`;
        link.click();
      }
    });
  }, [queue]);

  return {
    queue,
    processing,
    addToQueue,
    removeFromQueue,
    clearQueue,
    processImages,
    downloadImage,
    downloadAll
  };
}