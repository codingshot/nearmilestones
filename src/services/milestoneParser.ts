interface ParsedMilestone {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  dueDate: string;
  progress: number;
  description: string;
  definitionOfDone?: string;
  isGrantMilestone?: boolean;
  dependencies?: string[];
  links?: Record<string, string>;
}

export class MilestoneParser {
  /**
   * Parse milestones.md content and return structured milestone data
   */
  static parseMilestonesMarkdown(content: string, projectId: string): ParsedMilestone[] {
    const milestones: ParsedMilestone[] = [];
    const lines = content.split('\n');
    let currentMilestone: Partial<ParsedMilestone> | null = null;
    let currentSection = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // New milestone (starts with ## or ###)
      if (line.startsWith('## ') || line.startsWith('### ')) {
        // Save previous milestone if exists
        if (currentMilestone && currentMilestone.title) {
          milestones.push(this.completeMilestone(currentMilestone, projectId, milestones.length));
        }

        // Start new milestone
        currentMilestone = {
          title: line.replace(/^#+\s+/, ''),
          status: 'pending',
          progress: 0,
          description: '',
          isGrantMilestone: false,
          dependencies: [],
          links: {}
        };
        currentSection = '';
        continue;
      }

      if (!currentMilestone) continue;

      // Status indicators
      if (line.includes('✅') || line.toLowerCase().includes('completed')) {
        currentMilestone.status = 'completed';
        currentMilestone.progress = 100;
      } else if (line.includes('🚧') || line.toLowerCase().includes('in progress') || line.toLowerCase().includes('in-progress')) {
        currentMilestone.status = 'in-progress';
      } else if (line.includes('⚠️') || line.toLowerCase().includes('delayed')) {
        currentMilestone.status = 'delayed';
      }

      // Due date
      const dueDateMatch = line.match(/due[:\s]+(\d{4}-\d{2}-\d{2})/i);
      if (dueDateMatch) {
        currentMilestone.dueDate = dueDateMatch[1];
      }

      // Progress percentage
      const progressMatch = line.match(/(\d+)%/);
      if (progressMatch) {
        currentMilestone.progress = parseInt(progressMatch[1]);
      }

      // Grant milestone indicator
      if (line.toLowerCase().includes('grant milestone') || line.includes('💰')) {
        currentMilestone.isGrantMilestone = true;
      }

      // Section headers
      if (line.startsWith('**') || line.startsWith('###')) {
        currentSection = line.toLowerCase();
      }

      // Description
      if (currentSection.includes('description') && line && !line.startsWith('**') && !line.startsWith('#')) {
        currentMilestone.description = (currentMilestone.description || '') + ' ' + line;
      }

      // Definition of done
      if (currentSection.includes('definition') || currentSection.includes('done') || currentSection.includes('acceptance')) {
        if (line && !line.startsWith('**') && !line.startsWith('#')) {
          currentMilestone.definitionOfDone = (currentMilestone.definitionOfDone || '') + ' ' + line;
        }
      }

      // Dependencies
      if (currentSection.includes('dependencies') || currentSection.includes('depends')) {
        if (line.startsWith('- ')) {
          currentMilestone.dependencies = currentMilestone.dependencies || [];
          currentMilestone.dependencies.push(line.substring(2));
        }
      }

      // Links
      const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        currentMilestone.links = currentMilestone.links || {};
        currentMilestone.links[linkMatch[1].toLowerCase()] = linkMatch[2];
      }

      // GitHub links
      const githubMatch = line.match(/github[:\s]+([^\s]+)/i);
      if (githubMatch) {
        currentMilestone.links = currentMilestone.links || {};
        currentMilestone.links.github = githubMatch[1];
      }
    }

    // Don't forget the last milestone
    if (currentMilestone && currentMilestone.title) {
      milestones.push(this.completeMilestone(currentMilestone, projectId, milestones.length));
    }

    return milestones;
  }

  private static completeMilestone(milestone: Partial<ParsedMilestone>, projectId: string, index: number): ParsedMilestone {
    return {
      id: milestone.id || `${projectId}-m${index + 1}`,
      title: milestone.title || '',
      status: milestone.status || 'pending',
      dueDate: milestone.dueDate || '',
      progress: milestone.progress || 0,
      description: (milestone.description || '').trim(),
      definitionOfDone: (milestone.definitionOfDone || '').trim(),
      isGrantMilestone: milestone.isGrantMilestone || false,
      dependencies: milestone.dependencies || [],
      links: milestone.links || {}
    };
  }

  /**
   * Extract repository info from GitHub URL
   */
  static parseGitHubUrl(url: string): { owner: string; repo: string } | null {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return null;
    
    return {
      owner: match[1],
      repo: match[2].replace(/\.git$/, '')
    };
  }
}