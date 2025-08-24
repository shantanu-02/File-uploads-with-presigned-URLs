import type {
  FileMetadata,
  PresignedUrlResponse,
  UploadProgress,
} from "../types";
import { mockS3Service } from "./mockS3Service";

class FileService {
  private fileMetadata = new Map<string, FileMetadata>();

  async uploadFile(
    file: File,
    issueId: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<FileMetadata> {
    try {
      // Generate presigned URL
      const presignedResponse = await mockS3Service.generatePresignedUrl(
        file.name,
        file.type,
        file.size
      );

      // Log presigned URL for debugging
      console.log("🔗 Generated Presigned URL:", presignedResponse.uploadUrl);
      console.log("🆔 File ID:", presignedResponse.fileId);
      console.log("⏰ Expires at:", presignedResponse.expiresAt);

      const fileMetadata: FileMetadata = {
        id: presignedResponse.fileId,
        filename: presignedResponse.fileId,
        originalName: file.name,
        size: file.size,
        contentType: file.type,
        uploadedAt: new Date(),
        url: mockS3Service.getFileUrl(presignedResponse.fileId),
        issueId,
      };

      // Update progress to uploading
      onProgress?.({
        fileId: presignedResponse.fileId,
        progress: 0,
        status: "uploading",
      });

      // Upload file directly to mock S3
      await mockS3Service.uploadFile(
        presignedResponse.uploadUrl,
        file,
        (progress) => {
          onProgress?.({
            fileId: presignedResponse.fileId,
            progress,
            status: "uploading",
          });
        }
      );

      // Store file metadata
      this.fileMetadata.set(fileMetadata.id, fileMetadata);

      // Update progress to completed
      onProgress?.({
        fileId: presignedResponse.fileId,
        progress: 100,
        status: "completed",
      });

      return fileMetadata;
    } catch (error) {
      onProgress?.({
        fileId: "unknown",
        progress: 0,
        status: "error",
        error: error instanceof Error ? error.message : "Upload failed",
      });
      throw error;
    }
  }

  getFileMetadata(fileId: string): FileMetadata | undefined {
    return this.fileMetadata.get(fileId);
  }

  getAllFilesByIssue(issueId: string): FileMetadata[] {
    return Array.from(this.fileMetadata.values()).filter(
      (file) => file.issueId === issueId
    );
  }

  async downloadFile(fileId: string): Promise<Blob> {
    return mockS3Service.downloadFile(fileId);
  }

  deleteFile(fileId: string): boolean {
    return this.fileMetadata.delete(fileId);
  }

  isValidFileType(file: File): boolean {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    return allowedTypes.includes(file.type);
  }

  isValidFileSize(file: File): boolean {
    const maxSize = 10 * 1024 * 1024; // 10MB
    return file.size <= maxSize;
  }
}

export const fileService = new FileService();
