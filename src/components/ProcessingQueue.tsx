import React from 'react';
import { ImageFile } from '../types';
import { Loader2, CheckCircle, XCircle, Download, Trash2 } from 'lucide-react';

interface ProcessingQueueProps {
  queue: ImageFile[];
  onRemove: (id: string) => void;
  onDownload: (id: string) => void;
  onClear: () => void;
  onDownloadAll: () => void;
}

export default function ProcessingQueue({ 
  queue, 
  onRemove, 
  onDownload,
  onClear,
  onDownloadAll 
}: ProcessingQueueProps) {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getStatusIcon = (status: ImageFile['status']) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const completedCount = queue.filter(item => item.status === 'completed').length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Processing Queue</h3>
          <p className="text-sm text-gray-500">
            {queue.length} image{queue.length !== 1 ? 's' : ''} in queue
          </p>
        </div>
        <div className="flex gap-2">
          {completedCount > 0 && (
            <button
              onClick={onDownloadAll}
              className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors flex items-center gap-1"
            >
              <Download size={16} />
              Download All
            </button>
          )}
          {queue.length > 0 && (
            <button
              onClick={onClear}
              className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors flex items-center gap-1"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          )}
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {queue.map((item) => (
          <div
            key={item.id}
            className="p-4 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              {item.preview && (
                <img
                  src={item.preview}
                  alt=""
                  className="w-10 h-10 rounded object-cover flex-shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatSize(item.originalSize)}
                  {item.convertedSize && (
                    <span className="text-green-500">
                      {' → '}
                      {formatSize(item.convertedSize)}
                    </span>
                  )}
                </p>
                {item.error && (
                  <p className="text-xs text-red-500 mt-1">{item.error}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {getStatusIcon(item.status)}
              {item.status === 'completed' && (
                <button
                  onClick={() => onDownload(item.id)}
                  className="text-green-600 hover:text-green-700"
                  title="Download"
                >
                  <Download size={16} />
                </button>
              )}
              <button
                onClick={() => onRemove(item.id)}
                className="text-gray-400 hover:text-gray-600"
                title="Remove"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}