
const GITHUB_REPO_OWNER = 'codingshot';
const GITHUB_REPO_NAME = 'nearmilestones';
const GITHUB_DATA_PATH = 'public/data/projects.json';
const GITHUB_API_BASE = 'https://api.github.com';

export class GitHubService {
  private static instance: GitHubService;
  private cache: Map<string, any> = new Map();
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes

  static getInstance(): GitHubService {
    if (!GitHubService.instance) {
      GitHubService.instance = new GitHubService();
    }
    return GitHubService.instance;
  }

  async fetchProjectsData(): Promise<any> {
    const cacheKey = 'projects-data';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${GITHUB_DATA_PATH}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      
      const fileData = await response.json();
      const content = JSON.parse(atob(fileData.content));
      
      this.cache.set(cacheKey, {
        data: content,
        timestamp: Date.now()
      });
      
      return content;
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
      // Return mock data as fallback
      return this.getMockData();
    }
  }

  async fetchIssues(): Promise<any[]> {
    const cacheKey = 'issues-data';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues?state=all&labels=milestone`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch issues: ${response.statusText}`);
      }
      
      const issues = await response.json();
      
      this.cache.set(cacheKey, {
        data: issues,
        timestamp: Date.now()
      });
      
      return issues;
    } catch (error) {
      console.error('Error fetching GitHub issues:', error);
      return [];
    }
  }

  generatePRUrl(projectData: any): string {
    const branchName = `update-${projectData.id}-${Date.now()}`;
    const title = `Update ${projectData.name} milestone data`;
    const body = `## Project Update\n\n**Project:** ${projectData.name}\n**Status:** ${projectData.status}\n**Next Milestone:** ${projectData.nextMilestone}\n**Due Date:** ${projectData.dueDate}\n\n### Changes Made:\n- Updated milestone information\n- Modified project status\n\n### Verification:\n- [ ] Data format is correct\n- [ ] All required fields are present\n- [ ] Dates are in ISO format`;
    
    return `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/compare/main...${branchName}?quick_pull=1&title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
  }

  generateIssueUrl(projectId: string, milestoneData: any): string {
    const title = `[${projectId}] Milestone: ${milestoneData.title}`;
    const body = `## Milestone Details\n\n**Project:** ${projectId}\n**Milestone:** ${milestoneData.title}\n**Due Date:** ${milestoneData.dueDate}\n**Status:** ${milestoneData.status}\n\n### Description\n${milestoneData.description || 'No description provided'}\n\n### Acceptance Criteria\n- [ ] Deliverable 1\n- [ ] Deliverable 2\n- [ ] Deliverable 3\n\n### Dependencies\n${milestoneData.dependencies?.map((dep: string) => `- ${dep}`).join('\n') || 'No dependencies'}\n\n---\n*This issue was created via the NEAR Ecosystem Tracker*`;
    
    return `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}&labels=milestone,${projectId}`;
  }

  private getMockData() {
    return {
      projects: [
        {
          id: "omnibridge",
          name: "Omnibridge",
          category: "Infrastructure",
          status: "on-track",
          progress: 85,
          nextMilestone: "Mainnet Beta",
          dueDate: "2024-08-15",
          team: ["Alice Chen", "Bob Rodriguez"],
          dependencies: ["NEAR Protocol Core"],
          description: "Cross-chain bridge infrastructure",
          githubRepo: "https://github.com/omnibridge/omnibridge",
          fundingType: "infrastructure",
          lastUpdated: "2024-07-02T10:00:00Z"
        },
        {
          id: "agent-hub-sdk",
          name: "Agent Hub SDK",
          category: "SDK",
          status: "at-risk",
          progress: 62,
          nextMilestone: "API Documentation",
          dueDate: "2024-07-28",
          team: ["Carol Kim", "David Park"],
          dependencies: ["NEAR Intents", "Lucid Wallet"],
          description: "SDK for building AI agents on NEAR",
          fundingType: "sdk",
          lastUpdated: "2024-07-01T15:30:00Z"
        },
        {
          id: "meteor-wallet",
          name: "Meteor Wallet",
          category: "Grantee",
          status: "delayed",
          progress: 45,
          nextMilestone: "Security Audit",
          dueDate: "2024-07-20",
          team: ["Eve Thompson", "Frank Liu"],
          dependencies: [],
          description: "Next-generation NEAR wallet",
          fundingType: "grant",
          lastUpdated: "2024-06-30T09:15:00Z"
        }
      ],
      lastUpdate: "2024-07-02T10:00:00Z",
      version: "1.0.0"
    };
  }
}
