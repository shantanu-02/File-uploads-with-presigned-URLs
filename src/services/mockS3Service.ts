import type { PresignedUrlResponse, FileMetadata } from '../types';

class MockS3Service {
  private baseUrl = 'https://mock-s3-bucket.s3.amazonaws.com';
  private uploadedFiles = new Map<string, Blob>();

  async generatePresignedUrl(
    filename: string,
    contentType: string,
    size: number
  ): Promise<PresignedUrlResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const uploadUrl = `${this.baseUrl}/${fileId}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    return {
      uploadUrl,
      fileId,
      expiresAt
    };
  }

  async uploadFile(uploadUrl: string, file: File, onProgress?: (progress: number) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      // Extract fileId from upload URL
      const fileId = uploadUrl.split('/').pop()!;
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 95) {
          progress = 95;
        }
        onProgress?.(progress);
      }, 100);

      // Simulate upload time based on file size
      const uploadTime = Math.min(2000 + (file.size / 1000), 5000);
      
      setTimeout(() => {
        clearInterval(interval);
        onProgress?.(100);
        
        // Store file in mock storage
        this.uploadedFiles.set(fileId, file);
        resolve();
      }, uploadTime);
    });
  }

  getFileUrl(fileId: string): string {
    return `${this.baseUrl}/${fileId}`;
  }

  async downloadFile(fileId: string): Promise<Blob> {
    const file = this.uploadedFiles.get(fileId);
    if (!file) {
      throw new Error('File not found');
    }
    return file;
  }
}

export const mockS3Service = new MockS3Service();