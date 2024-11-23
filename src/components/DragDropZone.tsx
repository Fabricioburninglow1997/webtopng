import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface DragDropZoneProps {
  onFilesDrop: (files: File[]) => void;
}

export default function DragDropZone({ onFilesDrop }: DragDropZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesDrop(acceptedFiles);
  }, [onFilesDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.avif']
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full p-8 border-2 border-dashed rounded-xl transition-colors duration-200 cursor-pointer
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-4 text-gray-600">
        <Upload size={48} className={isDragActive ? 'text-blue-500' : 'text-gray-400'} />
        <p className="text-lg font-medium text-center">
          {isDragActive
            ? 'Drop your images here...'
            : 'Drag & drop images here, or click to select'}
        </p>
        <p className="text-sm text-gray-500">
          Supports PNG, JPG, WebP, and AVIF formats
        </p>
      </div>
    </div>
  );
}