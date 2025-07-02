
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
      // Get commits from prod branch that modified projects.json
      const prodCommits = await this.fetchCommitsForFile('prod');
      const changelog = await this.generateChangelogFromCommits(prodCommits);
      
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

  private async fetchCommitsForFile(branch: string): Promise<any[]> {
    try {
      const response = await fetch(
        `https://api.github.com/repos/codingshot/nearmilestones/commits?sha=${branch}&path=public/data/projects.json&per_page=20`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${branch} commits: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${branch} commits:`, error);
      return [];
    }
  }

  private async generateChangelogFromCommits(commits: any[]): Promise<ChangelogEntry[]> {
    const changelog: ChangelogEntry[] = [];
    
    for (let i = 0; i < commits.length && i < 10; i++) {
      const commit = commits[i];
      const changes = await this.analyzeCommitChanges(commit, commits[i + 1]);
      
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

    return changelog;
  }

  private async analyzeCommitChanges(currentCommit: any, previousCommit?: any): Promise<Change[]> {
    const changes: Change[] = [];
    
    try {
      // Get the current version of projects.json
      const currentData = await this.fetchProjectsDataAtCommit(currentCommit.sha);
      
      // Get the previous version for comparison
      let previousData = null;
      if (previousCommit) {
        previousData = await this.fetchProjectsDataAtCommit(previousCommit.sha);
      }

      // Analyze commit message for quick insights
      const message = currentCommit.commit.message.toLowerCase();
      
      if (message.includes('milestone') && (message.includes('complet') || message.includes('finish'))) {
        changes.push({
          type: 'milestone_completed',
          title: 'Milestone Completed',
          description: currentCommit.commit.message,
          details: { commitHash: currentCommit.sha.substring(0, 7) }
        });
      }

      if (message.includes('project') && (message.includes('add') || message.includes('new'))) {
        changes.push({
          type: 'project_added',
          title: 'New Project Added',
          description: currentCommit.commit.message,
          details: { commitHash: currentCommit.sha.substring(0, 7) }
        });
      }

      if (message.includes('delay') || message.includes('postpone')) {
        changes.push({
          type: 'milestone_delayed',
          title: 'Milestone Delayed',
          description: currentCommit.commit.message,
          details: { commitHash: currentCommit.sha.substring(0, 7) }
        });
      }

      // If we have both current and previous data, compare them
      if (currentData && previousData) {
        const dataChanges = this.compareProjectData(currentData, previousData, currentCommit);
        changes.push(...dataChanges);
      }

      // If no specific changes detected but there's a commit, add a generic update
      if (changes.length === 0) {
        changes.push({
          type: 'updated',
          title: 'Data Updated',
          description: currentCommit.commit.message || 'Project data has been updated',
          details: { commitHash: currentCommit.sha.substring(0, 7) }
        });
      }

    } catch (error) {
      console.error('Error analyzing commit changes:', error);
      // Fallback to commit message analysis
      changes.push({
        type: 'updated',
        title: 'Project Update',
        description: currentCommit.commit.message,
        details: { commitHash: currentCommit.sha.substring(0, 7) }
      });
    }

    return changes;
  }

  private async fetchProjectsDataAtCommit(sha: string): Promise<any> {
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/codingshot/nearmilestones/${sha}/public/data/projects.json`
      );
      
      if (!response.ok) {
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching data at commit ${sha}:`, error);
      return null;
    }
  }

  private compareProjectData(currentData: any, previousData: any, commit: any): Change[] {
    const changes: Change[] = [];
    
    const currentProjects = currentData.projects || [];
    const previousProjects = previousData.projects || [];
    
    // Check for new projects
    currentProjects.forEach((currentProject: any) => {
      const existsInPrevious = previousProjects.find((p: any) => p.id === currentProject.id);
      if (!existsInPrevious) {
        changes.push({
          type: 'project_added',
          title: `${currentProject.name} Added`,
          description: `New project "${currentProject.name}" has been added to the ecosystem`,
          projectId: currentProject.id,
          details: { commitHash: commit.sha.substring(0, 7) }
        });
      }
    });

    // Check for milestone status changes
    currentProjects.forEach((currentProject: any) => {
      const previousProject = previousProjects.find((p: any) => p.id === currentProject.id);
      if (previousProject) {
        const currentMilestones = currentProject.milestones || [];
        const previousMilestones = previousProject.milestones || [];
        
        currentMilestones.forEach((currentMilestone: any) => {
          const previousMilestone = previousMilestones.find((m: any) => m.id === currentMilestone.id);
          
          if (previousMilestone) {
            // Check for status changes
            if (previousMilestone.status !== currentMilestone.status) {
              if (currentMilestone.status === 'completed') {
                changes.push({
                  type: 'milestone_completed',
                  title: `${currentMilestone.title} Completed`,
                  description: `Milestone "${currentMilestone.title}" for ${currentProject.name} has been completed`,
                  projectId: currentProject.id,
                  milestoneId: currentMilestone.id,
                  details: { commitHash: commit.sha.substring(0, 7) }
                });
              } else if (currentMilestone.status === 'delayed') {
                changes.push({
                  type: 'milestone_delayed',
                  title: `${currentMilestone.title} Delayed`,
                  description: `Milestone "${currentMilestone.title}" for ${currentProject.name} has been delayed`,
                  projectId: currentProject.id,
                  milestoneId: currentMilestone.id,
                  details: { commitHash: commit.sha.substring(0, 7) }
                });
              }
            }
            
            // Check for progress changes
            if (previousMilestone.progress !== currentMilestone.progress) {
              changes.push({
                type: 'updated',
                title: `${currentMilestone.title} Progress Updated`,
                description: `Progress updated from ${previousMilestone.progress}% to ${currentMilestone.progress}%`,
                projectId: currentProject.id,
                milestoneId: currentMilestone.id,
                details: { commitHash: commit.sha.substring(0, 7) }
              });
            }
          }
        });

        // Check for project status changes
        if (previousProject.status !== currentProject.status) {
          changes.push({
            type: 'updated',
            title: `${currentProject.name} Status Changed`,
            description: `Project status changed from ${previousProject.status} to ${currentProject.status}`,
            projectId: currentProject.id,
            details: { commitHash: commit.sha.substring(0, 7) }
          });
        }

        // Check for progress changes
        if (previousProject.progress !== currentProject.progress) {
          changes.push({
            type: 'updated',
            title: `${currentProject.name} Progress Updated`,
            description: `Overall progress updated from ${previousProject.progress}% to ${currentProject.progress}%`,
            projectId: currentProject.id,
            details: { commitHash: commit.sha.substring(0, 7) }
          });
        }
      }
    });

    return changes;
  }

  private extractVersionFromCommit(commit: any): string {
    const message = commit.commit.message;
    const versionMatch = message.match(/v?(\d+\.\d+\.\d+)/);
    if (versionMatch) {
      return versionMatch[1];
    }
    
    // Generate version based on date
    const date = new Date(commit.commit.committer.date);
    return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
  }

  private getMockChangelog(): ChangelogEntry[] {
    return [
      {
        id: 'mock-1',
        date: new Date().toISOString(),
        version: '2024.07.02',
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
