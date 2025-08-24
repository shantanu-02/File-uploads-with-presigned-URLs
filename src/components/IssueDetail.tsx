import React, { useState } from 'react';
import { ArrowLeft, Calendar, User, Tag, AlertCircle, Clock, CheckCircle, Plus } from 'lucide-react';
import type { Issue, FileMetadata } from '../types';
import AttachmentList from './AttachmentList';
import FileUpload from './FileUpload';
import { useFileUpload } from '../hooks/useFileUpload';

interface IssueDetailProps {
  issue: Issue;
  onBack: () => void;
  onIssueUpdate: (issue: Issue) => void;
}

const IssueDetail: React.FC<IssueDetailProps> = ({ issue, onBack, onIssueUpdate }) => {
  const [showFileUpload, setShowFileUpload] = useState(false);
  const { uploadFiles, downloadFile, uploadProgress, isUploading } = useFileUpload();

  const handleFilesUploaded = (uploadedFiles: FileMetadata[]) => {
    const updatedIssue = {
      ...issue,
      attachments: [...issue.attachments, ...uploadedFiles],
      updatedAt: new Date()
    };
    onIssueUpdate(updatedIssue);
    setShowFileUpload(false);
  };

  const handleDeleteAttachment = (fileId: string) => {
    const updatedIssue = {
      ...issue,
      attachments: issue.attachments.filter(att => att.id !== fileId),
      updatedAt: new Date()
    };
    onIssueUpdate(updatedIssue);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'closed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Issues</span>
        </button>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{issue.title}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon(issue.status)}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(issue.status)}`}>
                  {issue.status.replace('-', ' ')}
                </span>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(issue.priority)}`}>
                <Tag className="w-3 h-3 mr-1" />
                {issue.priority} priority
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Issue Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">{issue.description}</p>
          </div>

          {/* Attachments */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Attachments ({issue.attachments.length})
              </h2>
              <button
                onClick={() => setShowFileUpload(!showFileUpload)}
                className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Files</span>
              </button>
            </div>

            {showFileUpload && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <FileUpload
                  onFilesUploaded={handleFilesUploaded}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                  issueId={issue.id}
                  uploadFiles={uploadFiles}
                />
              </div>
            )}

            <AttachmentList
              attachments={issue.attachments}
              onDownload={downloadFile}
              onDelete={handleDeleteAttachment}
              showDelete={true}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Issue Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Issue Info</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="text-sm font-medium">{new Date(issue.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Updated</p>
                  <p className="text-sm font-medium">{new Date(issue.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Assignee</p>
                  <p className="text-sm font-medium">Unassigned</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                Change Status
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                Update Priority
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                Assign User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetail;