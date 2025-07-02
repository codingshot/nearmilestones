
export interface GitHubProject {
  id: string;
  name: string;
  category: string;
  status: 'on-track' | 'at-risk' | 'delayed';
  progress: number;
  nextMilestone: string;
  dueDate: string;
  team: string[];
  dependencies: string[];
  description?: string;
  githubRepo?: string;
  website?: string;
  documentation?: string;
  socialLinks?: {
    twitter?: string;
    discord?: string;
    telegram?: string;
  };
  fundingType?: 'grant' | 'partnership' | 'infrastructure' | 'sdk';
  lastUpdated: string;
  updatedBy?: string;
}

export interface GitHubDataResponse {
  projects: GitHubProject[];
  lastUpdate: string;
  version: string;
}

export interface GitHubIssue {
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  labels: string[];
  assignees: string[];
  milestone?: {
    title: string;
    due_on: string;
  };
  created_at: string;
  updated_at: string;
}
