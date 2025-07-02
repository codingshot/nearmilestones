
import { GitHubService } from './githubService';

export interface ChangelogEntry {
  id: string;
  date: string;
  version: string;
  changes: Change[];
  commitHash?: string;
  commitMessage?: string;
  author?: string;
}

export interface Change {
  type: 'added' | 'updated' | 'removed' | 'milestone_completed' | 'milestone_delayed' | 'project_added';
  title: string;
  description: string;
  projectId?: string;
  milestoneId?: string;
  details?: any;
}

export class ChangelogService {
  private static instance: ChangelogService;
  private githubService: GitHubService;
  private cache: Map<string, any> = new Map();
  private cacheExpiry = 10 * 60 * 1000; // 10 minutes

  constructor() {
    this.githubService = GitHubService.getInstance();
  }

  static getInstance(): ChangelogService {
    if (!ChangelogService.instance) {
      ChangelogService.instance = new ChangelogService();
    }
    return ChangelogService.instance;
  }

  async getChangelog(): Promise<ChangelogEntry[]> {
    const cacheKey = 'changelog';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      const [commits, currentData] = await Promise.all([
        this.fetchRecentCommits(),
        this.githubService.fetchProjectsData()
      ]);

      const changelog = await this.generateChangelog(commits, currentData);
      
      this.cache.set(cacheKey, {
        data: changelog,
        timestamp: Date.now()
      });
      
      return changelog;
    } catch (error) {
      console.error('Error generating changelog:', error);
      return this.getMockChangelog();
    }
  }

  private async fetchRecentCommits(): Promise<any[]> {
    try {
      const response = await fetch(
        'https://api.github.com/repos/codingshot/nearmilestones/commits?per_page=20'
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch commits: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching commits:', error);
      return [];
    }
  }

  private async generateChangelog(commits: any[], currentData: any): Promise<ChangelogEntry[]> {
    const changelog: ChangelogEntry[] = [];
    
    // Process recent commits to detect changes
    for (const commit of commits.slice(0, 10)) {
      const changes = await this.analyzeCommitChanges(commit, currentData);
      
      if (changes.length > 0) {
        changelog.push({
          id: commit.sha,
          date: commit.commit.committer.date,
          version: this.extractVersionFromCommit(commit),
          changes,
          commitHash: commit.sha.substring(0, 7),
          commitMessage: commit.commit.message,
          author: commit.commit.author.name
        });
      }
    }

    // Add manual changelog entries based on data changes
    const manualEntries = this.generateManualEntries(currentData);
    changelog.push(...manualEntries);

    return changelog.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  private async analyzeCommitChanges(commit: any, currentData: any): Promise<Change[]> {
    const changes: Change[] = [];
    const message = commit.commit.message.toLowerCase();

    // Analyze commit message for common patterns
    if (message.includes('milestone') && message.includes('complete')) {
      changes.push({
        type: 'milestone_completed',
        title: 'Milestone Completed',
        description: commit.commit.message,
        details: { commitHash: commit.sha.substring(0, 7) }
      });
    }

    if (message.includes('project') && message.includes('add')) {
      changes.push({
        type: 'project_added',
        title: 'New Project Added',
        description: commit.commit.message,
        details: { commitHash: commit.sha.substring(0, 7) }
      });
    }

    if (message.includes('update') && message.includes('data')) {
      changes.push({
        type: 'updated',
        title: 'Data Updated',
        description: commit.commit.message,
        details: { commitHash: commit.sha.substring(0, 7) }
      });
    }

    return changes;
  }

  private generateManualEntries(currentData: any): ChangelogEntry[] {
    const entries: ChangelogEntry[] = [];
    
    // Check for recently completed milestones
    const recentlyCompleted = this.findRecentlyCompletedMilestones(currentData);
    if (recentlyCompleted.length > 0) {
      entries.push({
        id: `completed-${Date.now()}`,
        date: new Date().toISOString(),
        version: '1.0.0',
        changes: recentlyCompleted.map(milestone => ({
          type: 'milestone_completed' as const,
          title: `${milestone.title} Completed`,
          description: `Milestone "${milestone.title}" for ${milestone.projectName} has been marked as completed`,
          projectId: milestone.projectId,
          milestoneId: milestone.id
        }))
      });
    }

    // Check for delayed milestones
    const delayedMilestones = this.findDelayedMilestones(currentData);
    if (delayedMilestones.length > 0) {
      entries.push({
        id: `delayed-${Date.now()}`,
        date: new Date().toISOString(),
        version: '1.0.0',
        changes: delayedMilestones.map(milestone => ({
          type: 'milestone_delayed' as const,
          title: `${milestone.title} Delayed`,
          description: `Milestone "${milestone.title}" for ${milestone.projectName} is behind schedule`,
          projectId: milestone.projectId,
          milestoneId: milestone.id
        }))
      });
    }

    return entries;
  }

  private findRecentlyCompletedMilestones(data: any): any[] {
    const completed = [];
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    for (const project of data.projects || []) {
      for (const milestone of project.milestones || []) {
        if (milestone.status === 'completed' && 
            milestone.dueDate && 
            new Date(milestone.dueDate) > oneWeekAgo) {
          completed.push({
            ...milestone,
            projectId: project.id,
            projectName: project.name
          });
        }
      }
    }
    
    return completed;
  }

  private findDelayedMilestones(data: any): any[] {
    const delayed = [];
    const now = new Date();
    
    for (const project of data.projects || []) {
      for (const milestone of project.milestones || []) {
        if (milestone.status !== 'completed' && 
            milestone.dueDate && 
            new Date(milestone.dueDate) < now) {
          delayed.push({
            ...milestone,
            projectId: project.id,
            projectName: project.name
          });
        }
      }
    }
    
    return delayed;
  }

  private extractVersionFromCommit(commit: any): string {
    const message = commit.commit.message;
    const versionMatch = message.match(/v?(\d+\.\d+\.\d+)/);
    return versionMatch ? versionMatch[1] : '1.0.0';
  }

  private getMockChangelog(): ChangelogEntry[] {
    return [
      {
        id: 'mock-1',
        date: new Date().toISOString(),
        version: '1.0.0',
        changes: [
          {
            type: 'milestone_completed',
            title: 'Omnibridge Testnet Launch Completed',
            description: 'Successfully deployed Omnibridge on testnet with comprehensive testing completed',
            projectId: 'omnibridge',
            milestoneId: 'omnibridge-m4'
          },
          {
            type: 'updated',
            title: 'Project Progress Updated',
            description: 'Updated progress tracking for multiple projects based on latest developments'
          }
        ],
        commitHash: 'abc123f',
        commitMessage: 'Update milestone progress and project status',
        author: 'NEAR Team'
      }
    ];
  }
}
