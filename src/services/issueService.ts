import type { Issue } from '../types';

class IssueService {
  private issues = new Map<string, Issue>();

  constructor() {
    // Initialize with sample data
    this.createSampleData();
  }

  private createSampleData() {
    const sampleIssues: Omit<Issue, 'id'>[] = [
      {
        title: 'Login page not responsive on mobile',
        description: 'The login form overflows on small screens and buttons are not properly aligned.',
        status: 'open',
        priority: 'high',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        attachments: []
      },
      {
        title: 'API timeout on user profile fetch',
        description: 'Users are experiencing timeouts when loading their profile page during peak hours.',
        status: 'in-progress',
        priority: 'urgent',
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-16'),
        attachments: []
      },
      {
        title: 'Dark mode toggle not working',
        description: 'The dark mode toggle in settings does not persist after page refresh.',
        status: 'closed',
        priority: 'medium',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-12'),
        attachments: []
      }
    ];

    sampleIssues.forEach(issue => {
      const id = `issue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.issues.set(id, { ...issue, id });
    });
  }

  createIssue(issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'attachments'>): Issue {
    const id = `issue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const issue: Issue = {
      id,
      ...issueData,
      createdAt: now,
      updatedAt: now,
      attachments: []
    };

    this.issues.set(id, issue);
    return issue;
  }

  getIssue(id: string): Issue | undefined {
    return this.issues.get(id);
  }

  getAllIssues(): Issue[] {
    return Array.from(this.issues.values()).sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  updateIssue(id: string, updates: Partial<Omit<Issue, 'id' | 'createdAt'>>): Issue | null {
    const issue = this.issues.get(id);
    if (!issue) return null;

    const updatedIssue = {
      ...issue,
      ...updates,
      updatedAt: new Date()
    };

    this.issues.set(id, updatedIssue);
    return updatedIssue;
  }

  deleteIssue(id: string): boolean {
    return this.issues.delete(id);
  }

  addAttachmentToIssue(issueId: string, attachment: any): boolean {
    const issue = this.issues.get(issueId);
    if (!issue) return false;

    issue.attachments.push(attachment);
    issue.updatedAt = new Date();
    return true;
  }

  removeAttachmentFromIssue(issueId: string, attachmentId: string): boolean {
    const issue = this.issues.get(issueId);
    if (!issue) return false;

    const index = issue.attachments.findIndex(att => att.id === attachmentId);
    if (index === -1) return false;

    issue.attachments.splice(index, 1);
    issue.updatedAt = new Date();
    return true;
  }
}

export const issueService = new IssueService();