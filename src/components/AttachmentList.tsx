import React from 'react';
import { Download, File, Image, FileText, Trash2 } from 'lucide-react';
import type { FileMetadata } from '../types';

interface AttachmentListProps {
  attachments: FileMetadata[];
  onDownload: (fileId: string, filename: string) => void;
  onDelete?: (fileId: string) => void;
  showDelete?: boolean;
}

const AttachmentList: React.FC<AttachmentListProps> = ({
  attachments,
  onDownload,
  onDelete,
  showDelete = false
}) => {
  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) {
      return <Image className="w-5 h-5 text-blue-500" />;
    } else if (contentType === 'application/pdf' || contentType.startsWith('text/')) {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (attachments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <File className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No attachments yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {getFileIcon(attachment.contentType)}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {attachment.originalName}
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>{formatFileSize(attachment.size)}</span>
                <span>{new Date(attachment.uploadedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onDownload(attachment.id, attachment.originalName)}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors rounded-md hover:bg-gray-100"
              title="Download file"
            >
              <Download className="w-4 h-4" />
            </button>
            
            {showDelete && onDelete && (
              <button
                onClick={() => onDelete(attachment.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-md hover:bg-gray-100"
                title="Delete file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttachmentList;