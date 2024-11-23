import React, { useState, useCallback } from 'react';
import { ImageIcon } from 'lucide-react';
import DragDropZone from './components/DragDropZone';
import ProcessingQueue from './components/ProcessingQueue';
import ConversionOptions from './components/ConversionOptions';
import { useImageProcessor } from './hooks/useImageProcessor';
import { ConversionSettings } from './types';

function App() {
  const {
    queue,
    processing,
    addToQueue,
    removeFromQueue,
    clearQueue,
    processImages,
    downloadImage,
    downloadAll
  } = useImageProcessor();

  const [settings, setSettings] = useState<ConversionSettings>({
    quality: 80,
    format: 'original',
    size: 'Original',
    mode: 'single'
  });

  const handleSettingsChange = useCallback((newSettings: Partial<ConversionSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const handleProcess = useCallback(() => {
    processImages(settings);
  }, [processImages, settings]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <ImageIcon size={24} className="text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">ImageOptimizer Pro</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <DragDropZone onFilesDrop={addToQueue} />
            {queue.length > 0 && (
              <ProcessingQueue
                queue={queue}
                onRemove={removeFromQueue}
                onClear={clearQueue}
                onDownload={downloadImage}
                onDownloadAll={downloadAll}
              />
            )}
          </div>

          <div className="lg:col-span-1">
            <ConversionOptions
              settings={settings}
              onSettingsChange={handleSettingsChange}
              onProcess={handleProcess}
              processing={processing}
              queueCount={queue.length}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;