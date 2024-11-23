import React from 'react';
import { Settings, Loader2 } from 'lucide-react';
import { ConversionSettings } from '../types';

interface ConversionOptionsProps {
  settings: ConversionSettings;
  onSettingsChange: (settings: Partial<ConversionSettings>) => void;
  onProcess: () => void;
  processing: boolean;
  queueCount: number;
}

const PRESET_SIZES = [
  'Square (1080x1080)',
  'Story (1080x1920)',
  'Social (1200x630)',
  'Original'
];

export default function ConversionOptions({
  settings,
  onSettingsChange,
  onProcess,
  processing,
  queueCount
}: ConversionOptionsProps) {
  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings size={20} className="text-gray-500" />
          <h3 className="text-lg font-semibold">Conversion Options</h3>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Output Format
          </label>
          <select
            value={settings.format}
            onChange={(e) => onSettingsChange({ format: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="original">Original Format</option>
            <option value="jpg">JPG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quality: {settings.quality}%
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={settings.quality}
            onChange={(e) => onSettingsChange({ quality: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Preset Sizes
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PRESET_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => onSettingsChange({ size })}
                className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                  settings.size === size
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {queueCount > 0 && (
          <button
            onClick={onProcess}
            disabled={processing}
            className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
              processing
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              {processing && <Loader2 size={16} className="animate-spin" />}
              {processing
                ? 'Processing...'
                : `Process ${queueCount} Image${queueCount !== 1 ? 's' : ''}`}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}