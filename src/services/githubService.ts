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
      // Try to fetch from the raw GitHub content first
      const rawUrl = `https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/main/${GITHUB_DATA_PATH}`;
      const rawResponse = await fetch(rawUrl);
      
      if (rawResponse.ok) {
        const content = await rawResponse.json();
        this.cache.set(cacheKey, {
          data: content,
          timestamp: Date.now()
        });
        return content;
      }

      // Fallback to GitHub API
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
    if (projectData.action === 'mark-complete') {
      const baseUrl = 'https://github.com/near/ecosystem-directory/compare/main...';
      const branch = `milestone-complete-${projectData.projectId}-${projectData.milestoneId}`;
      const title = encodeURIComponent(`Mark milestone ${projectData.milestoneId} as complete for ${projectData.projectId}`);
      const body = encodeURIComponent(`This PR marks milestone ${projectData.milestoneId} as completed for project ${projectData.projectId}.

**Changes:**
- Updated milestone status to 'completed'
- Set progress to 100%
- Updated completion date

Please review and merge if the milestone completion criteria have been met.`);
      
      return `${baseUrl}${branch}?quick_pull=1&title=${title}&body=${body}`;
    }

    const baseUrl = 'https://github.com/near/ecosystem-directory/compare/main...';
    const branch = `update-${projectData.id || 'project'}-${Date.now()}`;
    const title = encodeURIComponent(`Update project: ${projectData.name || projectData.id}`);
    const body = encodeURIComponent(`Automated update for project ${projectData.name || projectData.id}`);
    
    return `${baseUrl}${branch}?quick_pull=1&title=${title}&body=${body}`;
  }

  generateIssueUrl(projectId: string, milestoneData: any): string {
    const title = `[${projectId}] Milestone: ${milestoneData.title}`;
    const body = `## Milestone Details\n\n**Project:** ${projectId}\n**Milestone:** ${milestoneData.title}\n**Due Date:** ${milestoneData.dueDate}\n**Status:** ${milestoneData.status}\n\n### Description\n${milestoneData.description || 'No description provided'}\n\n### Acceptance Criteria\n- [ ] Deliverable 1\n- [ ] Deliverable 2\n- [ ] Deliverable 3\n\n### Dependencies\n${milestoneData.dependencies?.map((dep: string) => `- ${dep}`).join('\n') || 'No dependencies'}\n\n---\n*This issue was created via the NEAR Ecosystem Tracker*`;
    
    return `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}&labels=milestone,${projectId}`;
  }

  getDataUrl(): string {
    return `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/blob/main/${GITHUB_DATA_PATH}`;
  }

  getRepoUrl(): string {
    return `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`;
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
          dependencies: [],
          description: "Cross-chain bridge infrastructure",
          githubRepo: "https://github.com/omnibridge/omnibridge",
          website: "https://omnibridge.near.org",
          docs: "https://docs.omnibridge.near.org",
          twitter: "https://twitter.com/omnibridge",
          discord: "https://discord.gg/omnibridge",
          fundingType: "infrastructure",
          lastUpdated: "2024-07-02T10:00:00Z",
          milestones: [
            {
              id: "omnibridge-m1",
              title: "Technical Architecture",
              status: "completed",
              dueDate: "2024-02-01",
              progress: 100,
              description: "Complete technical architecture design and documentation",
              definitionOfDone: "Architecture document approved, technical specs reviewed by security team, and implementation plan finalized",
              isGrantMilestone: true,
              dependencies: [],
              links: {
                github: "https://github.com/omnibridge/omnibridge/milestone/1",
                docs: "https://docs.omnibridge.near.org/architecture"
              }
            },
            {
              id: "omnibridge-m2",
              title: "Smart Contract Development",
              status: "completed",
              dueDate: "2024-04-15",
              progress: 100,
              description: "Develop and test core smart contracts for cross-chain bridge functionality",
              definitionOfDone: "All smart contracts deployed on testnet, unit tests passing with 95% coverage, and integration tests completed",
              isGrantMilestone: true,
              dependencies: ["omnibridge-m1"],
              links: {
                github: "https://github.com/omnibridge/omnibridge/milestone/2",
                testnet: "https://testnet.omnibridge.near.org"
              }
            },
            {
              id: "omnibridge-m3",
              title: "Security Audit",
              status: "completed",
              dueDate: "2024-06-01",
              progress: 100,
              description: "Third-party security audit of smart contracts and infrastructure",
              definitionOfDone: "Security audit completed with no critical issues, all medium/high issues resolved, and audit report published",
              isGrantMilestone: true,
              dependencies: ["omnibridge-m2"],
              links: {
                auditReport: "https://omnibridge.near.org/audit-report.pdf"
              }
            },
            {
              id: "omnibridge-m4",
              title: "Testnet Launch",
              status: "completed",
              dueDate: "2024-07-01",
              progress: 100,
              description: "Deploy bridge on testnet and conduct comprehensive testing",
              definitionOfDone: "Testnet deployment successful, user testing completed, and performance benchmarks met",
              isGrantMilestone: false,
              dependencies: ["omnibridge-m3"],
              links: {
                testnet: "https://testnet.omnibridge.near.org",
                docs: "https://docs.omnibridge.near.org/testnet"
              }
            },
            {
              id: "omnibridge-m5",
              title: "Mainnet Beta",
              status: "in-progress",
              dueDate: "2024-08-15",
              progress: 75,
              description: "Launch beta version on mainnet with limited functionality",
              definitionOfDone: "Beta launched with basic bridge functionality, monitoring systems active, and user onboarding process established",
              isGrantMilestone: true,
              dependencies: ["omnibridge-m4"],
              links: {
                github: "https://github.com/omnibridge/omnibridge/milestone/5"
              }
            },
            {
              id: "omnibridge-m6",
              title: "Full Mainnet Launch",
              status: "pending",
              dueDate: "2024-09-30",
              progress: 0,
              description: "Full mainnet launch with all features and full liquidity support",
              definitionOfDone: "Full mainnet deployment, all features active, liquidity providers onboarded, and 24/7 monitoring established",
              isGrantMilestone: true,
              dependencies: ["omnibridge-m5"],
              links: {}
            }
          ]
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
          dependencies: [],
          description: "SDK for building AI agents on NEAR",
          githubRepo: "https://github.com/agenthub/sdk",
          website: "https://agenthub.near.org",
          docs: "https://docs.agenthub.near.org",
          fundingType: "sdk",
          lastUpdated: "2024-07-01T15:30:00Z",
          milestones: [
            {
              id: "agent-hub-m1",
              title: "Core SDK Framework",
              status: "completed",
              dueDate: "2024-04-15",
              progress: 100,
              description: "Build foundational SDK framework and core libraries",
              definitionOfDone: "SDK framework completed, core APIs implemented, and developer documentation drafted",
              isGrantMilestone: true,
              dependencies: [],
              links: {
                github: "https://github.com/agenthub/sdk/milestone/1",
                docs: "https://docs.agenthub.near.org/core"
              }
            },
            {
              id: "agent-hub-m2",
              title: "Agent Templates",
              status: "completed",
              dueDate: "2024-05-30",
              progress: 100,
              description: "Create reusable agent templates for common use cases",
              definitionOfDone: "5 agent templates created, tested, and documented with example implementations",
              isGrantMilestone: false,
              dependencies: ["agent-hub-m1"],
              links: {
                github: "https://github.com/agenthub/sdk/tree/main/templates",
                examples: "https://examples.agenthub.near.org"
              }
            },
            {
              id: "agent-hub-m3",
              title: "API Documentation",
              status: "in-progress",
              dueDate: "2024-07-28",
              progress: 60,
              description: "Complete comprehensive API documentation and developer guides",
              definitionOfDone: "Complete API reference, developer guides, tutorials, and interactive examples published",
              isGrantMilestone: true,
              dependencies: ["agent-hub-m1", "agent-hub-m2"],
              links: {
                github: "https://github.com/agenthub/sdk/milestone/3",
                docs: "https://docs.agenthub.near.org"
              }
            },
            {
              id: "agent-hub-m4",
              title: "Example Applications",
              status: "pending",
              dueDate: "2024-08-30",
              progress: 10,
              description: "Build example applications demonstrating SDK capabilities",
              definitionOfDone: "3 example applications built, deployed, and documented with source code available",
              isGrantMilestone: true,
              dependencies: ["agent-hub-m3"],
              links: {}
            }
          ]
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
          githubRepo: "https://github.com/meteor/wallet",
          website: "https://meteor.near.org",
          fundingType: "grant",
          lastUpdated: "2024-06-30T09:15:00Z",
          milestones: [
            {
              id: "meteor-m1",
              title: "Core Wallet Features",
              status: "completed",
              dueDate: "2024-05-15",
              progress: 100,
              description: "Implement basic wallet functionality",
              definitionOfDone: "Wallet creation, transaction signing, and account management features completed",
              isGrantMilestone: true,
              dependencies: [],
              links: {
                github: "https://github.com/meteor/wallet/milestone/1"
              }
            },
            {
              id: "meteor-m2",
              title: "Security Audit",
              status: "delayed",
              dueDate: "2024-07-20",
              progress: 30,
              description: "Comprehensive security audit and vulnerability assessment",
              definitionOfDone: "Security audit completed, all critical vulnerabilities addressed, and security report published",
              isGrantMilestone: true,
              dependencies: ["meteor-m1", "omnibridge-m3"],
              links: {
                github: "https://github.com/meteor/wallet/milestone/2"
              }
            }
          ]
        }
      ],
      lastUpdate: "2024-07-02T10:00:00Z",
      version: "1.0.0"
    };
  }
}
