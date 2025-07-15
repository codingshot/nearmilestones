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
    
    for (let i = 0; i < commits.length && i < 15; i++) {
      const commit = commits[i];
      const previousCommit = commits[i + 1];
      
      console.log(`Analyzing commit ${commit.sha.substring(0, 7)}:`, commit.commit.message);
      
      const changes = await this.analyzeCommitChanges(commit, previousCommit);
      
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
      
      if (!currentData) {
        console.log(`No data found for commit ${currentCommit.sha.substring(0, 7)}`);
        return changes;
      }

      // Get the previous version for comparison
      let previousData = null;
      if (previousCommit) {
        previousData = await this.fetchProjectsDataAtCommit(previousCommit.sha);
      }

      // If we have both current and previous data, compare them
      if (currentData && previousData) {
        console.log(`Comparing data between commits ${currentCommit.sha.substring(0, 7)} and ${previousCommit.sha.substring(0, 7)}`);
        const dataChanges = this.compareProjectData(currentData, previousData, currentCommit);
        changes.push(...dataChanges);
      } else if (currentData && !previousData) {
        // This is likely the first commit or we couldn't fetch previous data
        console.log(`First commit or no previous data for ${currentCommit.sha.substring(0, 7)}`);
        changes.push({
          type: 'added',
          title: 'Project Data Initialized',
          description: `Initial project data with ${currentData.projects?.length || 0} projects`,
          details: { commitHash: currentCommit.sha.substring(0, 7) }
        });
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
      console.log(`Fetching projects.json at commit ${sha.substring(0, 7)}`);
      const response = await fetch(
        `https://raw.githubusercontent.com/codingshot/nearmilestones/${sha}/public/data/projects.json`
      );
      
      if (!response.ok) {
        console.log(`Failed to fetch data at ${sha.substring(0, 7)}: ${response.statusText}`);
        return null;
      }
      
      const data = await response.json();
      console.log(`Successfully fetched data at ${sha.substring(0, 7)}: ${data.projects?.length || 0} projects`);
      return data;
    } catch (error) {
      console.error(`Error fetching data at commit ${sha.substring(0, 7)}:`, error);
      return null;
    }
  }

  private compareProjectData(currentData: any, previousData: any, commit: any): Change[] {
    const changes: Change[] = [];
    
    const currentProjects = currentData.projects || [];
    const previousProjects = previousData.projects || [];
    
    console.log(`Comparing ${currentProjects.length} current projects with ${previousProjects.length} previous projects`);
    
    // Check for new projects
    currentProjects.forEach((currentProject: any) => {
      const existsInPrevious = previousProjects.find((p: any) => p.id === currentProject.id);
      if (!existsInPrevious) {
        console.log(`New project found: ${currentProject.name}`);
        changes.push({
          type: 'project_added',
          title: `${currentProject.name} Added`,
          description: `New project "${currentProject.name}" (${currentProject.category}) has been added to the ecosystem with ${currentProject.milestones?.length || 0} milestones and ${currentProject.progress}% overall progress`,
          projectId: currentProject.id,
          details: { 
            commitHash: commit.sha.substring(0, 7),
            projectData: {
              category: currentProject.category,
              status: currentProject.status,
              progress: currentProject.progress,
              team: currentProject.team,
              milestoneCount: currentProject.milestones?.length || 0
            }
          }
        });
      }
    });

    // Check for removed projects
    previousProjects.forEach((previousProject: any) => {
      const existsInCurrent = currentProjects.find((p: any) => p.id === previousProject.id);
      if (!existsInCurrent) {
        console.log(`Project removed: ${previousProject.name}`);
        changes.push({
          type: 'removed',
          title: `${previousProject.name} Removed`,
          description: `Project "${previousProject.name}" (${previousProject.category}) has been removed from the ecosystem`,
          projectId: previousProject.id,
          details: { 
            commitHash: commit.sha.substring(0, 7),
            removedProjectData: {
              category: previousProject.category,
              status: previousProject.status,
              progress: previousProject.progress
            }
          }
        });
      }
    });

    // Check for project updates
    currentProjects.forEach((currentProject: any) => {
      const previousProject = previousProjects.find((p: any) => p.id === currentProject.id);
      if (previousProject) {
        
        // Check for project status changes
        if (previousProject.status !== currentProject.status) {
          console.log(`Project status changed for ${currentProject.name}: ${previousProject.status} -> ${currentProject.status}`);
          changes.push({
            type: 'updated',
            title: `${currentProject.name} Status Changed`,
            description: `Project status updated from "${previousProject.status}" to "${currentProject.status}"`,
            projectId: currentProject.id,
            details: { 
              commitHash: commit.sha.substring(0, 7),
              changeType: 'status',
              oldValue: previousProject.status,
              newValue: currentProject.status
            }
          });
        }

        // Check for progress changes
        if (previousProject.progress !== currentProject.progress) {
          console.log(`Project progress changed for ${currentProject.name}: ${previousProject.progress}% -> ${currentProject.progress}%`);
          const progressDiff = currentProject.progress - previousProject.progress;
          changes.push({
            type: 'updated',
            title: `${currentProject.name} Progress Updated`,
            description: `Overall progress ${progressDiff > 0 ? 'increased' : 'decreased'} from ${previousProject.progress}% to ${currentProject.progress}% (${progressDiff > 0 ? '+' : ''}${progressDiff}%)`,
            projectId: currentProject.id,
            details: { 
              commitHash: commit.sha.substring(0, 7),
              changeType: 'progress',
              oldValue: previousProject.progress,
              newValue: currentProject.progress,
              difference: progressDiff
            }
          });
        }

        // Check for next milestone changes
        if (previousProject.nextMilestone !== currentProject.nextMilestone) {
          changes.push({
            type: 'updated',
            title: `${currentProject.name} Next Milestone Updated`,
            description: `Next milestone changed from "${previousProject.nextMilestone}" to "${currentProject.nextMilestone}"`,
            projectId: currentProject.id,
            details: { 
              commitHash: commit.sha.substring(0, 7),
              changeType: 'nextMilestone',
              oldValue: previousProject.nextMilestone,
              newValue: currentProject.nextMilestone
            }
          });
        }

        // Check for due date changes
        if (previousProject.dueDate !== currentProject.dueDate) {
          changes.push({
            type: 'updated',
            title: `${currentProject.name} Due Date Updated`,
            description: `Project due date changed from ${previousProject.dueDate} to ${currentProject.dueDate}`,
            projectId: currentProject.id,
            details: { 
              commitHash: commit.sha.substring(0, 7),
              changeType: 'dueDate',
              oldValue: previousProject.dueDate,
              newValue: currentProject.dueDate
            }
          });
        }

        // Check for team changes
        const prevTeam = previousProject.team || [];
        const currTeam = currentProject.team || [];
        if (JSON.stringify(prevTeam.sort()) !== JSON.stringify(currTeam.sort())) {
          const addedMembers = currTeam.filter((member: string) => !prevTeam.includes(member));
          const removedMembers = prevTeam.filter((member: string) => !currTeam.includes(member));
          
          let teamChangeDesc = 'Team composition updated';
          if (addedMembers.length > 0) {
            teamChangeDesc += ` (Added: ${addedMembers.join(', ')})`;
          }
          if (removedMembers.length > 0) {
            teamChangeDesc += ` (Removed: ${removedMembers.join(', ')})`;
          }

          changes.push({
            type: 'updated',
            title: `${currentProject.name} Team Updated`,
            description: teamChangeDesc,
            projectId: currentProject.id,
            details: { 
              commitHash: commit.sha.substring(0, 7),
              changeType: 'team',
              oldTeam: prevTeam,
              newTeam: currTeam,
              addedMembers,
              removedMembers
            }
          });
        }

        // Check milestone changes
        const currentMilestones = currentProject.milestones || [];
        const previousMilestones = previousProject.milestones || [];
        
        currentMilestones.forEach((currentMilestone: any) => {
          const previousMilestone = previousMilestones.find((m: any) => m.id === currentMilestone.id);
          
          if (!previousMilestone) {
            // New milestone added
            console.log(`New milestone added: ${currentMilestone.title} for ${currentProject.name}`);
            changes.push({
              type: 'added',
              title: `${currentMilestone.title} Added`,
              description: `New milestone "${currentMilestone.title}" added to ${currentProject.name} (Due: ${currentMilestone.dueDate}, Status: ${currentMilestone.status})`,
              projectId: currentProject.id,
              milestoneId: currentMilestone.id,
              details: { 
                commitHash: commit.sha.substring(0, 7),
                changeType: 'milestoneAdded',
                milestoneData: {
                  title: currentMilestone.title,
                  status: currentMilestone.status,
                  dueDate: currentMilestone.dueDate,
                  progress: currentMilestone.progress,
                  isGrantMilestone: currentMilestone.isGrantMilestone
                }
              }
            });
          } else {
            // Check for milestone status changes
            if (previousMilestone.status !== currentMilestone.status) {
              console.log(`Milestone status changed: ${currentMilestone.title} from ${previousMilestone.status} to ${currentMilestone.status}`);
              if (currentMilestone.status === 'completed') {
                changes.push({
                  type: 'milestone_completed',
                  title: `${currentMilestone.title} Completed`,
                  description: `Milestone "${currentMilestone.title}" for ${currentProject.name} has been completed (Progress: ${currentMilestone.progress}%)${currentMilestone.isGrantMilestone ? ' [Grant Milestone]' : ''}`,
                  projectId: currentProject.id,
                  milestoneId: currentMilestone.id,
                  details: { 
                    commitHash: commit.sha.substring(0, 7),
                    changeType: 'milestoneCompleted',
                    previousStatus: previousMilestone.status,
                    isGrantMilestone: currentMilestone.isGrantMilestone,
                    completionProgress: currentMilestone.progress
                  }
                });
              } else if (currentMilestone.status === 'delayed') {
                changes.push({
                  type: 'milestone_delayed',
                  title: `${currentMilestone.title} Delayed`,
                  description: `Milestone "${currentMilestone.title}" for ${currentProject.name} has been delayed (Previous Status: ${previousMilestone.status})${currentMilestone.isGrantMilestone ? ' [Grant Milestone]' : ''}`,
                  projectId: currentProject.id,
                  milestoneId: currentMilestone.id,
                  details: { 
                    commitHash: commit.sha.substring(0, 7),
                    changeType: 'milestoneDelayed',
                    previousStatus: previousMilestone.status,
                    isGrantMilestone: currentMilestone.isGrantMilestone
                  }
                });
              } else {
                changes.push({
                  type: 'updated',
                  title: `${currentMilestone.title} Status Updated`,
                  description: `Milestone status changed from "${previousMilestone.status}" to "${currentMilestone.status}"${currentMilestone.isGrantMilestone ? ' [Grant Milestone]' : ''}`,
                  projectId: currentProject.id,
                  milestoneId: currentMilestone.id,
                  details: { 
                    commitHash: commit.sha.substring(0, 7),
                    changeType: 'milestoneStatus',
                    oldValue: previousMilestone.status,
                    newValue: currentMilestone.status,
                    isGrantMilestone: currentMilestone.isGrantMilestone
                  }
                });
              }
            }
            
            // Check for milestone progress changes
            if (previousMilestone.progress !== currentMilestone.progress) {
              console.log(`Milestone progress changed: ${currentMilestone.title} from ${previousMilestone.progress}% to ${currentMilestone.progress}%`);
              const progressDiff = currentMilestone.progress - previousMilestone.progress;
              changes.push({
                type: 'updated',
                title: `${currentMilestone.title} Progress Updated`,
                description: `Milestone progress ${progressDiff > 0 ? 'increased' : 'decreased'} from ${previousMilestone.progress}% to ${currentMilestone.progress}% (${progressDiff > 0 ? '+' : ''}${progressDiff}%)${currentMilestone.isGrantMilestone ? ' [Grant Milestone]' : ''}`,
                projectId: currentProject.id,
                milestoneId: currentMilestone.id,
                details: { 
                  commitHash: commit.sha.substring(0, 7),
                  changeType: 'milestoneProgress',
                  oldValue: previousMilestone.progress,
                  newValue: currentMilestone.progress,
                  difference: progressDiff,
                  isGrantMilestone: currentMilestone.isGrantMilestone
                }
              });
            }

            // Check for milestone due date changes
            if (previousMilestone.dueDate !== currentMilestone.dueDate) {
              changes.push({
                type: 'updated',
                title: `${currentMilestone.title} Due Date Updated`,
                description: `Milestone due date changed from ${previousMilestone.dueDate} to ${currentMilestone.dueDate}${currentMilestone.isGrantMilestone ? ' [Grant Milestone]' : ''}`,
                projectId: currentProject.id,
                milestoneId: currentMilestone.id,
                details: { 
                  commitHash: commit.sha.substring(0, 7),
                  changeType: 'milestoneDueDate',
                  oldValue: previousMilestone.dueDate,
                  newValue: currentMilestone.dueDate,
                  isGrantMilestone: currentMilestone.isGrantMilestone
                }
              });
            }
          }
        });

        // Check for removed milestones
        previousMilestones.forEach((previousMilestone: any) => {
          const existsInCurrent = currentMilestones.find((m: any) => m.id === previousMilestone.id);
          if (!existsInCurrent) {
            console.log(`Milestone removed: ${previousMilestone.title} from ${currentProject.name}`);
            changes.push({
              type: 'removed',
              title: `${previousMilestone.title} Removed`,
              description: `Milestone "${previousMilestone.title}" removed from ${currentProject.name}${previousMilestone.isGrantMilestone ? ' [Was Grant Milestone]' : ''}`,
              projectId: currentProject.id,
              milestoneId: previousMilestone.id,
              details: { 
                commitHash: commit.sha.substring(0, 7),
                changeType: 'milestoneRemoved',
                removedMilestoneData: {
                  title: previousMilestone.title,
                  status: previousMilestone.status,
                  progress: previousMilestone.progress,
                  isGrantMilestone: previousMilestone.isGrantMilestone
                }
              }
            });
          }
        });
      }
    });

    console.log(`Found ${changes.length} changes in this commit`);
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
