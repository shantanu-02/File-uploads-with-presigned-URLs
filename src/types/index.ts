export interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  updatedAt: Date;
  attachments: FileMetadata[];
}

export interface FileMetadata {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  contentType: string;
  uploadedAt: Date;
  url: string;
  issueId: string;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  fileId: string;
  expiresAt: Date;
}

export interface UploadProgress {
  fileId: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}