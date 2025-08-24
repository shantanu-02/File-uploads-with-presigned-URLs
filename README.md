# File Uploads with Presigned URLs

A React-based issue management system that demonstrates file uploads using S3-style presigned URLs. The client directly uploads files to storage while the server issues presigned URLs and stores file metadata.

## 🚀 Features

- **Presigned URL Uploads**: Secure file uploads directly to storage
- **Issue Management**: Create, view, and manage project issues
- **File Attachments**: Support for multiple file types with drag-and-drop
- **Real-time Progress**: Upload progress tracking with visual indicators
- **File Validation**: Type and size validation (10MB limit)
- **Mock S3 Service**: Simulated cloud storage for development

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Mock Services**: Custom S3 simulation

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Modern web browser

## 🚀 Setup Instructions

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd "File uploads with presigned URLs"

# Install dependencies
npm install
```

### 2. Start Development Server

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

### 3. Build for Production

```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── AttachmentList.tsx    # File attachment display
│   ├── CreateIssueModal.tsx  # Issue creation modal
│   ├── FileUpload.tsx        # File upload interface
│   ├── IssueCard.tsx         # Issue summary card
│   └── IssueDetail.tsx       # Issue detail view
├── hooks/              # Custom React hooks
│   └── useFileUpload.ts      # File upload logic
├── services/           # Business logic services
│   ├── fileService.ts        # File management service
│   ├── issueService.ts       # Issue management service
│   └── mockS3Service.ts      # Mock S3 storage service
├── types/              # TypeScript type definitions
│   └── index.ts              # Application types
└── App.tsx            # Main application component
```

## 📊 Data Schema

### Issue Entity

```typescript
interface Issue {
  id: string; // Unique identifier
  title: string; // Issue title
  description: string; // Issue description
  status: "open" | "in-progress" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last update timestamp
  attachments: FileMetadata[]; // Associated files
}
```

### File Metadata

```typescript
interface FileMetadata {
  id: string; // Unique file identifier
  filename: string; // Storage filename
  originalName: string; // Original filename
  size: number; // File size in bytes
  contentType: string; // MIME type
  uploadedAt: Date; // Upload timestamp
  url: string; // File access URL
  issueId: string; // Associated issue ID
}
```

### Presigned URL Response

```typescript
interface PresignedUrlResponse {
  uploadUrl: string; // Presigned upload URL
  fileId: string; // Generated file ID
  expiresAt: Date; // URL expiration timestamp
}
```

### Upload Progress

```typescript
interface UploadProgress {
  fileId: string; // File identifier
  progress: number; // Upload percentage (0-100)
  status: "uploading" | "completed" | "error";
  error?: string; // Error message if failed
}
```

## 🌱 Seed Data

The application includes mock data for demonstration purposes:

### Sample Issues

```typescript
// Pre-populated issues with various statuses and priorities
const sampleIssues = [
  {
    id: "issue_1",
    title: "Fix login authentication bug",
    description: "Users are experiencing intermittent login failures...",
    status: "open",
    priority: "high",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    attachments: [],
  },
  {
    id: "issue_2",
    title: "Implement user profile page",
    description: "Create a comprehensive user profile interface...",
    status: "in-progress",
    priority: "medium",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-12"),
    attachments: [],
  },
];
```

### File Type Support

```typescript
// Supported file types for upload
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

// File size limit: 10MB
const maxFileSize = 10 * 1024 * 1024;
```

## 🔌 API Endpoints (Mock)

### File Upload Flow

```typescript
// 1. Generate presigned URL
POST /api/files/presigned-url
Body: { filename, contentType, size }
Response: PresignedUrlResponse

// 2. Upload file directly to storage
PUT {presignedUrl}
Body: File binary data
Headers: Content-Type, Content-Length

// 3. Confirm upload completion
POST /api/files/complete
Body: { fileId, issueId }
Response: FileMetadata
```

### Issue Management

```typescript
// Get all issues
GET /api/issues
Response: Issue[]

// Create new issue
POST /api/issues
Body: { title, description, status, priority }
Response: Issue

// Update issue
PUT /api/issues/{id}
Body: Issue
Response: Issue

// Get issue by ID
GET /api/issues/{id}
Response: Issue
```

## 📡 Example cURL Commands

### 1. Generate Presigned URL

```bash
curl -X POST http://localhost:5173/api/files/presigned-url \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "document.pdf",
    "contentType": "application/pdf",
    "size": 1048576
  }'
```

**Expected Response:**

```json
{
  "uploadUrl": "https://mock-s3-bucket.s3.amazonaws.com/file_1705123456789_abc123def",
  "fileId": "file_1705123456789_abc123def",
  "expiresAt": "2024-01-13T10:30:00.000Z"
}
```

### 2. Upload File Using Presigned URL

```bash
curl -X PUT "https://mock-s3-bucket.s3.amazonaws.com/file_1705123456789_abc123def" \
  -H "Content-Type: application/pdf" \
  -H "Content-Length: 1048576" \
  --upload-file "./document.pdf"
```

### 3. Create New Issue

```bash
curl -X POST http://localhost:5173/api/issues \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Feature Request",
    "description": "Add dark mode support to the application",
    "status": "open",
    "priority": "medium"
  }'
```

### 4. Get All Issues

```bash
curl -X GET http://localhost:5173/api/issues \
  -H "Content-Type: application/json"
```

### 5. Update Issue Status

```bash
curl -X PUT http://localhost:5173/api/issues/issue_1 \
  -H "Content-Type: application/json" \
  -d '{
    "id": "issue_1",
    "title": "Fix login authentication bug",
    "description": "Users are experiencing intermittent login failures...",
    "status": "in-progress",
    "priority": "high",
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z",
    "attachments": []
  }'
```

### 6. Download File

```bash
curl -X GET http://localhost:5173/api/files/file_1705123456789_abc123def/download \
  -H "Content-Type: application/json" \
  --output "downloaded_document.pdf"
```

## 🔧 Configuration

### Environment Variables

```bash
# Development configuration
VITE_API_BASE_URL=http://localhost:5173
VITE_MAX_FILE_SIZE=10485760  # 10MB in bytes
VITE_ALLOWED_FILE_TYPES=image/*,application/pdf,text/plain
```

### Mock Service Configuration

```typescript
// src/services/mockS3Service.ts
class MockS3Service {
  private baseUrl = "https://mock-s3-bucket.s3.amazonaws.com";
  private presignedUrlExpiry = 15 * 60 * 1000; // 15 minutes
  private maxFileSize = 10 * 1024 * 1024; // 10MB
}
``