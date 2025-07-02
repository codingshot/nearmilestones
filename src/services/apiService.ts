
import { GitHubService } from './githubService';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: string;
  status: number;
  message: string;
}

export class ApiService {
  private static instance: ApiService;
  private githubService: GitHubService;

  constructor() {
    this.githubService = GitHubService.getInstance();
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Projects endpoints
  async getProjects(filters?: {
    category?: string;
    status?: string;
    limit?: number;
    page?: number;
  }): Promise<ApiResponse<any[]>> {
    try {
      const data = await this.githubService.fetchProjectsData();
      let projects = data.projects || [];

      // Apply filters
      if (filters?.category) {
        projects = projects.filter((p: any) => 
          p.category?.toLowerCase() === filters.category?.toLowerCase()
        );
      }
      if (filters?.status) {
        projects = projects.filter((p: any) => 
          p.status?.toLowerCase() === filters.status?.toLowerCase()
        );
      }

      // Apply pagination
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProjects = projects.slice(startIndex, endIndex);

      return {
        data: paginatedProjects,
        status: 200,
        pagination: {
          page,
          limit,
          total: projects.length,
          totalPages: Math.ceil(projects.length / limit)
        }
      };
    } catch (error) {
      throw {
        error: 'FETCH_ERROR',
        status: 500,
        message: 'Failed to fetch projects'
      } as ApiError;
    }
  }

  async getProject(id: string): Promise<ApiResponse<any>> {
    try {
      const data = await this.githubService.fetchProjectsData();
      const project = data.projects?.find((p: any) => p.id === id);
      
      if (!project) {
        throw {
          error: 'NOT_FOUND',
          status: 404,
          message: `Project with id '${id}' not found`
        } as ApiError;
      }

      return {
        data: project,
        status: 200
      };
    } catch (error) {
      if ((error as ApiError).status) {
        throw error;
      }
      throw {
        error: 'FETCH_ERROR',
        status: 500,
        message: 'Failed to fetch project'
      } as ApiError;
    }
  }

  async getProjectMilestones(projectId: string, filters?: {
    status?: string;
    limit?: number;
    page?: number;
  }): Promise<ApiResponse<any[]>> {
    try {
      const projectResponse = await this.getProject(projectId);
      let milestones = projectResponse.data.milestones || [];

      // Apply filters
      if (filters?.status) {
        milestones = milestones.filter((m: any) => 
          m.status?.toLowerCase() === filters.status?.toLowerCase()
        );
      }

      // Apply pagination
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedMilestones = milestones.slice(startIndex, endIndex);

      return {
        data: paginatedMilestones,
        status: 200,
        pagination: {
          page,
          limit,
          total: milestones.length,
          totalPages: Math.ceil(milestones.length / limit)
        }
      };
    } catch (error) {
      if ((error as ApiError).status) {
        throw error;
      }
      throw {
        error: 'FETCH_ERROR',
        status: 500,
        message: 'Failed to fetch project milestones'
      } as ApiError;
    }
  }

  async getProjectDependencies(projectId: string): Promise<ApiResponse<string[]>> {
    try {
      const projectResponse = await this.getProject(projectId);
      const dependencies = projectResponse.data.dependencies || [];

      return {
        data: dependencies,
        status: 200
      };
    } catch (error) {
      if ((error as ApiError).status) {
        throw error;
      }
      throw {
        error: 'FETCH_ERROR',
        status: 500,
        message: 'Failed to fetch project dependencies'
      } as ApiError;
    }
  }

  // Milestones endpoints
  async getMilestones(filters?: {
    status?: string;
    project?: string;
    dueDate?: string;
    limit?: number;
    page?: number;
  }): Promise<ApiResponse<any[]>> {
    try {
      const data = await this.githubService.fetchProjectsData();
      let allMilestones: any[] = [];

      // Flatten all milestones from all projects
      data.projects?.forEach((project: any) => {
        if (project.milestones) {
          project.milestones.forEach((milestone: any) => {
            allMilestones.push({
              ...milestone,
              projectId: project.id,
              projectName: project.name
            });
          });
        }
      });

      // Apply filters
      if (filters?.status) {
        allMilestones = allMilestones.filter((m: any) => 
          m.status?.toLowerCase() === filters.status?.toLowerCase()
        );
      }
      if (filters?.project) {
        allMilestones = allMilestones.filter((m: any) => 
          m.projectId === filters.project
        );
      }

      // Apply pagination
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedMilestones = allMilestones.slice(startIndex, endIndex);

      return {
        data: paginatedMilestones,
        status: 200,
        pagination: {
          page,
          limit,
          total: allMilestones.length,
          totalPages: Math.ceil(allMilestones.length / limit)
        }
      };
    } catch (error) {
      throw {
        error: 'FETCH_ERROR',
        status: 500,
        message: 'Failed to fetch milestones'
      } as ApiError;
    }
  }

  async getMilestone(id: string): Promise<ApiResponse<any>> {
    try {
      const milestonesResponse = await this.getMilestones();
      const milestone = milestonesResponse.data.find((m: any) => m.id === id);
      
      if (!milestone) {
        throw {
          error: 'NOT_FOUND',
          status: 404,
          message: `Milestone with id '${id}' not found`
        } as ApiError;
      }

      return {
        data: milestone,
        status: 200
      };
    } catch (error) {
      if ((error as ApiError).status) {
        throw error;
      }
      throw {
        error: 'FETCH_ERROR',
        status: 500,
        message: 'Failed to fetch milestone'
      } as ApiError;
    }
  }

  async getUpcomingMilestones(limit: number = 10): Promise<ApiResponse<any[]>> {
    try {
      const milestonesResponse = await this.getMilestones();
      const now = new Date();
      
      const upcomingMilestones = milestonesResponse.data
        .filter((m: any) => {
          const dueDate = new Date(m.dueDate);
          return dueDate > now && m.status !== 'completed';
        })
        .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, limit);

      return {
        data: upcomingMilestones,
        status: 200
      };
    } catch (error) {
      throw {
        error: 'FETCH_ERROR',
        status: 500,
        message: 'Failed to fetch upcoming milestones'
      } as ApiError;
    }
  }

  async getDelayedMilestones(): Promise<ApiResponse<any[]>> {
    try {
      const milestonesResponse = await this.getMilestones();
      const now = new Date();
      
      const delayedMilestones = milestonesResponse.data
        .filter((m: any) => {
          const dueDate = new Date(m.dueDate);
          return dueDate < now && m.status !== 'completed';
        })
        .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

      return {
        data: delayedMilestones,
        status: 200
      };
    } catch (error) {
      throw {
        error: 'FETCH_ERROR',
        status: 500,
        message: 'Failed to fetch delayed milestones'
      } as ApiError;
    }
  }

  // Reports endpoints
  async getProjectHealthReport(): Promise<ApiResponse<any>> {
    try {
      const projectsResponse = await this.getProjects();
      const projects = projectsResponse.data;

      const healthReport = {
        totalProjects: projects.length,
        projectsByStatus: {
          'on-track': projects.filter((p: any) => p.status === 'on-track').length,
          'at-risk': projects.filter((p: any) => p.status === 'at-risk').length,
          'delayed': projects.filter((p: any) => p.status === 'delayed').length,
          'completed': projects.filter((p: any) => p.status === 'completed').length
        },
        averageProgress: projects.reduce((sum: number, p: any) => sum + (p.progress || 0), 0) / projects.length,
        projectsByCategory: projects.reduce((acc: any, p: any) => {
          acc[p.category] = (acc[p.category] || 0) + 1;
          return acc;
        }, {}),
        generatedAt: new Date().toISOString()
      };

      return {
        data: healthReport,
        status: 200
      };
    } catch (error) {
      throw {
        error: 'FETCH_ERROR',
        status: 500,
        message: 'Failed to generate project health report'
      } as ApiError;
    }
  }

  async getMilestoneCompletionStats(): Promise<ApiResponse<any>> {
    try {
      const milestonesResponse = await this.getMilestones();
      const milestones = milestonesResponse.data;

      const stats = {
        totalMilestones: milestones.length,
        completedMilestones: milestones.filter((m: any) => m.status === 'completed').length,
        inProgressMilestones: milestones.filter((m: any) => m.status === 'in-progress').length,
        pendingMilestones: milestones.filter((m: any) => m.status === 'pending').length,
        delayedMilestones: milestones.filter((m: any) => m.status === 'delayed').length,
        completionRate: (milestones.filter((m: any) => m.status === 'completed').length / milestones.length) * 100,
        averageProgress: milestones.reduce((sum: number, m: any) => sum + (m.progress || 0), 0) / milestones.length,
        generatedAt: new Date().toISOString()
      };

      return {
        data: stats,
        status: 200
      };
    } catch (error) {
      throw {
        error: 'FETCH_ERROR',
        status: 500,
        message: 'Failed to generate milestone completion statistics'
      } as ApiError;
    }
  }

  // Export endpoints
  async exportToCSV(type: 'projects' | 'milestones'): Promise<ApiResponse<string>> {
    try {
      let csvContent = '';
      
      if (type === 'projects') {
        const projectsResponse = await this.getProjects();
        const projects = projectsResponse.data;
        
        csvContent = 'ID,Name,Category,Status,Progress,Next Milestone,Due Date,Team\n';
        projects.forEach((project: any) => {
          csvContent += `"${project.id}","${project.name}","${project.category}","${project.status}",${project.progress},"${project.nextMilestone}","${project.dueDate}","${project.team?.join(', ') || ''}"\n`;
        });
      } else {
        const milestonesResponse = await this.getMilestones();
        const milestones = milestonesResponse.data;
        
        csvContent = 'ID,Title,Project,Status,Progress,Due Date,Description\n';
        milestones.forEach((milestone: any) => {
          csvContent += `"${milestone.id}","${milestone.title}","${milestone.projectName}","${milestone.status}",${milestone.progress},"${milestone.dueDate}","${milestone.description || ''}"\n`;
        });
      }

      return {
        data: csvContent,
        status: 200
      };
    } catch (error) {
      throw {
        error: 'EXPORT_ERROR',
        status: 500,
        message: 'Failed to export data to CSV'
      } as ApiError;
    }
  }

  async exportToJSON(type: 'projects' | 'milestones'): Promise<ApiResponse<any>> {
    try {
      if (type === 'projects') {
        return await this.getProjects();
      } else {
        return await this.getMilestones();
      }
    } catch (error) {
      throw {
        error: 'EXPORT_ERROR',
        status: 500,
        message: 'Failed to export data to JSON'
      } as ApiError;
    }
  }
}
