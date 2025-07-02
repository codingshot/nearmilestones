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
      const [mainCommits, prodCommits, mainData, prodData] = await Promise.all([
        this.fetchCommitsFromBranch('main'),
        this.fetchCommitsFromBranch('prod'),
        this.fetchDataFromBranch('main'),
        this.fetchDataFromBranch('prod')
      ]);

      const changelog = await this.generateChangelogFromDifferences(
        mainCommits,
        prodCommits,
        mainData,
        prodData
      );
      
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

  private async fetchCommitsFromBranch(branch: string): Promise<any[]> {
    try {
      const response = await fetch(
        `https://api.github.com/repos/codingshot/nearmilestones/commits?sha=${branch}&per_page=50&path=public/data`
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

  private async fetchDataFromBranch(branch: string): Promise<any> {
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/codingshot/nearmilestones/${branch}/public/data/projects.json`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${branch} data: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${branch} data:`, error);
      return { projects: [] };
    }
  }

  private async generateChangelogFromDifferences(
    mainCommits: any[],
    prodCommits: any[],
    mainData: any,
    prodData: any
  ): Promise<ChangelogEntry[]> {
    const changelog: ChangelogEntry[] = [];
    
    // Find commits that are in main but not in prod (recent changes)
    const prodCommitShas = new Set(prodCommits.map(c => c.sha));
    const newCommits = mainCommits.filter(c => !prodCommitShas.has(c.sha));

    // Process new commits
    for (const commit of newCommits.slice(0, 10)) {
      const changes = await this.analyzeDataChanges(commit, mainData, prodData);
      
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

    // Analyze data differences between main and prod
    const dataChanges = this.analyzeDifferencesInData(mainData, prodData);
    if (dataChanges.length > 0) {
      changelog.push({
        id: `data-diff-${Date.now()}`,
        date: new Date().toISOString(),
        version: '1.0.0',
        changes: dataChanges,
        commitHash: 'latest',
        commitMessage: 'Data synchronization update',
        author: 'NEAR Ecosystem Team'
      });
    }

    return changelog.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  private async analyzeDataChanges(commit: any, mainData: any, prodData: any): Promise<Change[]> {
    const changes: Change[] = [];
    const message = commit.commit.message.toLowerCase();

    // Analyze commit message for data-related patterns
    if (message.includes('public/data') || message.includes('projects.json')) {
      if (message.includes('milestone') && (message.includes('complete') || message.includes('update'))) {
        changes.push({
          type: 'milestone_completed',
          title: 'Milestone Status Updated',
          description: commit.commit.message,
          details: { commitHash: commit.sha.substring(0, 7) }
        });
      }

      if (message.includes('project') && message.includes('add')) {
        changes.push({
          type: 'project_added',
          title: 'New Project Added to Ecosystem',
          description: commit.commit.message,
          details: { commitHash: commit.sha.substring(0, 7) }
        });
      }

      if (message.includes('update') || message.includes('modify')) {
        changes.push({
          type: 'updated',
          title: 'Project Data Updated',
          description: commit.commit.message,
          details: { commitHash: commit.sha.substring(0, 7) }
        });
      }
    }

    return changes;
  }

  private analyzeDifferencesInData(mainData: any, prodData: any): Change[] {
    const changes: Change[] = [];
    
    // Compare project counts
    const mainProjects = mainData.projects || [];
    const prodProjects = prodData.projects || [];
    
    if (mainProjects.length > prodProjects.length) {
      const newProjects = mainProjects.filter(
        (mp: any) => !prodProjects.find((pp: any) => pp.id === mp.id)
      );
      
      newProjects.forEach((project: any) => {
        changes.push({
          type: 'project_added',
          title: `${project.name} Added to Ecosystem`,
          description: `New project "${project.name}" has been added to the NEAR ecosystem tracker`,
          projectId: project.id
        });
      });
    }

    // Compare milestone completions
    mainProjects.forEach((mainProject: any) => {
      const prodProject = prodProjects.find((pp: any) => pp.id === mainProject.id);
      if (prodProject) {
        const mainMilestones = mainProject.milestones || [];
        const prodMilestones = prodProject.milestones || [];
        
        mainMilestones.forEach((mainMilestone: any) => {
          const prodMilestone = prodMilestones.find((pm: any) => pm.id === mainMilestone.id);
          if (prodMilestone && prodMilestone.status !== 'completed' && mainMilestone.status === 'completed') {
            changes.push({
              type: 'milestone_completed',
              title: `${mainMilestone.title} Completed`,
              description: `Milestone "${mainMilestone.title}" for ${mainProject.name} has been marked as completed`,
              projectId: mainProject.id,
              milestoneId: mainMilestone.id
            });
          }
        });
      }
    });

    return changes;
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
