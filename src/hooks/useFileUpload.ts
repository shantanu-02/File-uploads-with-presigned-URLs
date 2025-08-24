import { useState, useCallback } from 'react';
import type { FileMetadata, UploadProgress } from '../types';
import { fileService } from '../services/fileService';

export const useFileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<Map<string, UploadProgress>>(new Map());
  const [isUploading, setIsUploading] = useState(false);

  const uploadFiles = useCallback(async (files: File[], issueId: string): Promise<FileMetadata[]> => {
    setIsUploading(true);
    const uploadedFiles: FileMetadata[] = [];
    
    try {
      for (const file of files) {
        // Validate file
        if (!fileService.isValidFileType(file)) {
          throw new Error(`Invalid file type: ${file.name}`);
        }
        
        if (!fileService.isValidFileSize(file)) {
          throw new Error(`File too large: ${file.name} (max 10MB)`);
        }

        const fileMetadata = await fileService.uploadFile(
          file,
          issueId,
          (progress) => {
            setUploadProgress(prev => new Map(prev.set(progress.fileId, progress)));
          }
        );

        uploadedFiles.push(fileMetadata);
      }

      return uploadedFiles;
    } finally {
      setIsUploading(false);
      // Clear progress after a delay
      setTimeout(() => {
        setUploadProgress(new Map());
      }, 2000);
    }
  }, []);

  const downloadFile = useCallback(async (fileId: string, filename: string) => {
    try {
      const blob = await fileService.downloadFile(fileId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  }, []);

  return {
    uploadFiles,
    downloadFile,
    uploadProgress,
    isUploading
  };
};