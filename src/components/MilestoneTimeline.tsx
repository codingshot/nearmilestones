import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, FileText, Calendar, CheckCircle, Clock, AlertCircle, GitPullRequest } from 'lucide-react';
import { useGitHubData } from '@/hooks/useGitHubData';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from './LoadingSpinner';
import { MilestoneFilters } from './MilestoneFilters';
import { useState, useMemo } from 'react';

interface Milestone {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'pending' | 'delayed';
  dueDate: string;
  progress: number;
  description: string;
  definitionOfDone: string;
  isGrantMilestone: boolean;
  dependencies: string[];
  links: {
    github?: string;
    docs?: string;
    testnet?: string;
    examples?: string;
    auditReport?: string;
  };
}

interface Project {
  id: string;
  name: string;
  status: 'on-track' | 'at-risk' | 'delayed';
  milestones: Milestone[];
}

interface MilestoneTimelineProps {
  projects: Project[];
  allProjects?: Project[];
}

export const MilestoneTimeline = ({ projects, allProjects = [] }: MilestoneTimelineProps) => {
  const { generatePRUrl } = useGitHubData();
  const navigate = useNavigate();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');

  // Create a map of all milestones for dependency lookup
  const allMilestones = new Map<string, { milestone: Milestone; projectName: string; projectId: string }>();
  allProjects.forEach(project => {
    project.milestones?.forEach(milestone => {
      allMilestones.set(milestone.id, { milestone, projectName: project.name, projectId: project.id });
    });
  });

  // Get all milestones from all projects
  const allProjectMilestones = projects.flatMap(project => 
    (project.milestones || []).map(milestone => ({
      ...milestone,
      projectName: project.name,
      projectId: project.id
    }))
  );

  // Available projects for filtering
  const availableProjects = [...new Set(projects.map(p => p.name))];

  // Filtered and sorted milestones
  const filteredMilestones = useMemo(() => {
    let filtered = allProjectMilestones;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(milestone =>
        milestone.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        milestone.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        milestone.projectName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(milestone => milestone.status === statusFilter);
    }

    // Apply project filter
    if (projectFilter !== 'all') {
      filtered = filtered.filter(milestone => milestone.projectName === projectFilter);
    }

    // Sort by due date
    return filtered.sort((a, b) => 
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  }, [allProjectMilestones, searchTerm, statusFilter, projectFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-[#00ec97] bg-[#00ec97]/5';
      case 'in-progress':
        return 'border-[#17d9d4] bg-[#17d9d4]/5';
      case 'at-risk':
        return 'border-[#ff7966] bg-[#ff7966]/5';
      case 'delayed':
        return 'border-[#ff7966] bg-[#ff7966]/10';
      case 'pending':
        return 'border-black/20 bg-black/5';
      default:
        return 'border-black/20 bg-black/5';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-[#00ec97]" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-[#17d9d4]" />;
      case 'delayed':
        return <AlertCircle className="w-4 h-4 text-[#ff7966]" />;
      default:
        return <Calendar className="w-4 h-4 text-black/60" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dateString: string, status: string) => {
    return new Date(dateString) < new Date() && status !== 'completed';
  };

  const getDependencyInfo = (dependencyId: string) => {
    return allMilestones.get(dependencyId);
  };

  const handleMarkComplete = async (milestone: any) => {
    const prUrl = generatePRUrl({
      projectId: milestone.projectId,
      milestoneId: milestone.id,
      action: 'mark-complete'
    });
    window.open(prUrl, '_blank');
  };

  const handleDependencyClick = (projectId: string) => {
    navigate(`/project/${projectId}?tab=milestones`);
  };

  const getCompletionPercentage = (status: string, progress: number) => {
    switch (status) {
      case 'completed':
        return 100;
      case 'in-progress':
        return progress;
      case 'pending':
        return 0;
      case 'delayed':
        return progress;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <MilestoneFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        projectFilter={projectFilter}
        onProjectFilterChange={setProjectFilter}
        availableProjects={availableProjects}
      />

      {/* Results count */}
      <div className="text-sm text-black/60 font-medium">
        Showing {filteredMilestones.length} of {allProjectMilestones.length} milestones
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line - hidden on mobile */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-black/10 hidden md:block"></div>
        
        {filteredMilestones.length > 0 ? (
          filteredMilestones.map((milestone, index) => (
            <div key={milestone.id} className="relative flex items-start space-x-0 md:space-x-4 pb-8">
              {/* Timeline dot - adjusted for mobile */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 ${getStatusColor(milestone.status)} flex items-center justify-center z-10 mb-4 md:mb-0`}>
                {getStatusIcon(milestone.status)}
              </div>
              
              {/* Content */}
              <Card className="flex-1 md:ml-2 bg-white border-black/10 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01]">
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between space-y-3 md:space-y-0">
                      <div className="space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
                          <h4 className="font-semibold text-black text-lg">{milestone.title}</h4>
                          {milestone.isGrantMilestone && (
                            <Badge className="bg-[#9797ff]/10 text-black border-[#9797ff]/30 text-xs font-medium w-fit">
                              Grant Milestone
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-black/60 font-medium">{milestone.projectName}</p>
                        <p className="text-sm text-black/80">{milestone.description}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 md:gap-3">
                        <Badge 
                          variant={isOverdue(milestone.dueDate, milestone.status) ? "destructive" : "outline"}
                          className={`text-xs font-medium ${!isOverdue(milestone.dueDate, milestone.status) ? 'border-[#17d9d4]/30 text-black bg-[#17d9d4]/5' : ''}`}
                        >
                          {formatDate(milestone.dueDate)}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs font-medium ${
                            milestone.status === 'completed' ? 'border-[#00ec97]/30 text-black bg-[#00ec97]/5' :
                            milestone.status === 'in-progress' ? 'border-[#17d9d4]/30 text-black bg-[#17d9d4]/5' :
                            milestone.status === 'delayed' ? 'border-[#ff7966]/40 text-black bg-[#ff7966]/10' :
                            'border-black/20 text-black bg-black/5'
                          }`}
                        >
                          {milestone.status.replace('-', ' ')}
                        </Badge>
                        {milestone.status !== 'completed' && (
                          <Button
                            size="sm"
                            onClick={() => handleMarkComplete(milestone)}
                            className="bg-[#00ec97] hover:bg-[#00ec97]/90 text-black font-medium text-xs px-2 py-1 h-auto"
                          >
                            <GitPullRequest className="w-3 h-3 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-black">Progress</span>
                        <span className="text-sm text-black/70 font-medium">{getCompletionPercentage(milestone.status, milestone.progress)}%</span>
                      </div>
                      <div className="w-full bg-black/10 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            milestone.status === 'completed' ? 'bg-[#00ec97]' : 
                            milestone.status === 'in-progress' ? 'bg-[#17d9d4]' : 
                            milestone.status === 'delayed' ? 'bg-[#ff7966]' : 
                            'bg-black/20'
                          }`}
                          style={{ width: `${getCompletionPercentage(milestone.status, milestone.progress)}%` }}
                        />
                      </div>
                    </div>

                    {/* Definition of Done */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-semibold text-black">Definition of Done</h5>
                      <p className="text-sm text-black/70 bg-black/5 p-3 rounded-lg">{milestone.definitionOfDone}</p>
                    </div>

                    {/* Dependencies */}
                    {milestone.dependencies.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-semibold text-black">Dependencies</h5>
                        <div className="space-y-2">
                          {milestone.dependencies.map((depId, idx) => {
                            const depInfo = getDependencyInfo(depId);
                            return (
                              <div 
                                key={idx} 
                                className={`flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 p-3 bg-[#9797ff]/5 rounded-lg border border-[#9797ff]/20 ${
                                  depInfo ? 'cursor-pointer hover:bg-[#9797ff]/10 transition-colors' : ''
                                }`}
                                onClick={() => depInfo && handleDependencyClick(depInfo.projectId)}
                              >
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-black">
                                    {depInfo ? depInfo.milestone.title : depId}
                                  </div>
                                  {depInfo && (
                                    <div className="text-xs text-black/60">{depInfo.projectName}</div>
                                  )}
                                </div>
                                {depInfo && (
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs w-fit ${
                                      depInfo.milestone.status === 'completed' ? 'border-[#00ec97]/30 text-black bg-[#00ec97]/5' :
                                      depInfo.milestone.status === 'in-progress' ? 'border-[#17d9d4]/30 text-black bg-[#17d9d4]/5' :
                                      'border-[#ff7966]/30 text-black bg-[#ff7966]/5'
                                    }`}
                                  >
                                    {depInfo.milestone.status.replace('-', ' ')}
                                  </Badge>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Links */}
                    {Object.keys(milestone.links).length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-semibold text-black">Related Links</h5>
                        <div className="flex flex-wrap gap-2">
                          {milestone.links.github && (
                            <a 
                              href={milestone.links.github} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-xs bg-black/5 hover:bg-black/10 text-black px-3 py-2 rounded-full transition-all duration-200 hover:scale-105"
                            >
                              <Github className="w-3 h-3" />
                              <span>GitHub</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {milestone.links.docs && (
                            <a 
                              href={milestone.links.docs} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-xs bg-[#17d9d4]/5 hover:bg-[#17d9d4]/10 text-black px-3 py-2 rounded-full transition-all duration-200 hover:scale-105"
                            >
                              <FileText className="w-3 h-3" />
                              <span>Docs</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {milestone.links.testnet && (
                            <a 
                              href={milestone.links.testnet} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-xs bg-[#ff7966]/5 hover:bg-[#ff7966]/10 text-black px-3 py-2 rounded-full transition-all duration-200 hover:scale-105"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Testnet</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {milestone.links.examples && (
                            <a 
                              href={milestone.links.examples} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-xs bg-[#00ec97]/5 hover:bg-[#00ec97]/10 text-black px-3 py-2 rounded-full transition-all duration-200 hover:scale-105"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Examples</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {milestone.links.auditReport && (
                            <a 
                              href={milestone.links.auditReport} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-xs bg-[#9797ff]/5 hover:bg-[#9797ff]/10 text-black px-3 py-2 rounded-full transition-all duration-200 hover:scale-105"
                            >
                              <FileText className="w-3 h-3" />
                              <span>Audit Report</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-black/60">
            <div className="text-lg font-medium mb-2">No milestones found</div>
            <div className="text-sm">Try adjusting your search or filter criteria</div>
          </div>
        )}
      </div>
    </div>
  );
};
