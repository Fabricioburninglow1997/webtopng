export interface ImageFile {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  preview?: string;
  originalSize: number;
  convertedSize?: number;
  error?: string;
  downloadUrl?: string;
}

export interface ConversionSettings {
  format: string;
  quality: number;
  size: string;
  mode: 'single' | 'batch';
}

export type PresetSize = {
  name: string;
  width: number;
  height: number;
};