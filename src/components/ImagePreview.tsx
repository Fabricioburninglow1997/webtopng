import React from 'react';
import { X } from 'lucide-react';

interface ImagePreviewProps {
  file: File;
  onRemove: (file: File) => void;
}

export default function ImagePreview({ file, onRemove }: ImagePreviewProps) {
  const previewUrl = URL.createObjectURL(file);

  React.useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  return (
    <div className="relative group">
      <img
        src={previewUrl}
        alt={file.name}
        className="w-full h-32 object-cover rounded-lg"
      />
      <button
        onClick={() => onRemove(file)}
        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <X size={16} className="text-white" />
      </button>
      <p className="mt-1 text-sm text-gray-600 truncate max-w-full">
        {file.name}
      </p>
    </div>
  );
}