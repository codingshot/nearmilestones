
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Github, FileText, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

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
  // Create a map of all milestones for dependency lookup
  const allMilestones = new Map<string, { milestone: Milestone; projectName: string }>();
  allProjects.forEach(project => {
    project.milestones?.forEach(milestone => {
      allMilestones.set(milestone.id, { milestone, projectName: project.name });
    });
  });

  // Get all milestones from all projects and sort by due date
  const allProjectMilestones = projects.flatMap(project => 
    (project.milestones || []).map(milestone => ({
      ...milestone,
      projectName: project.name,
      projectId: project.id
    }))
  );

  const sortedMilestones = allProjectMilestones.sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

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

  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-black/10"></div>
        
        {sortedMilestones.map((milestone, index) => (
          <div key={milestone.id} className="relative flex items-start space-x-4 pb-8">
            {/* Timeline dot */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 ${getStatusColor(milestone.status)} flex items-center justify-center z-10`}>
              {getStatusIcon(milestone.status)}
            </div>
            
            {/* Content */}
            <Card className="flex-1 ml-2 bg-white border-black/10 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-black text-lg">{milestone.title}</h4>
                        {milestone.isGrantMilestone && (
                          <Badge className="bg-[#9797ff]/10 text-black border-[#9797ff]/30 text-xs font-medium">
                            Grant Milestone
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-black/60 font-medium">{milestone.projectName}</p>
                      <p className="text-sm text-black/80">{milestone.description}</p>
                    </div>
                    <div className="flex items-center space-x-3">
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
                    </div>
                  </div>

                  {/* Progress */}
                  {milestone.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-black">Progress</span>
                        <span className="text-sm text-black/70 font-medium">{milestone.progress}%</span>
                      </div>
                      <div className="w-full bg-black/10 rounded-full h-2">
                        <div 
                          className="bg-[#00ec97] h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${milestone.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

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
                            <div key={idx} className="flex items-center space-x-2 p-2 bg-[#9797ff]/5 rounded-lg border border-[#9797ff]/20">
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
                                  className={`text-xs ${
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
                            className="inline-flex items-center space-x-1 text-xs bg-black/5 hover:bg-black/10 text-black px-3 py-1 rounded-full transition-colors"
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
                            className="inline-flex items-center space-x-1 text-xs bg-[#17d9d4]/5 hover:bg-[#17d9d4]/10 text-black px-3 py-1 rounded-full transition-colors"
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
                            className="inline-flex items-center space-x-1 text-xs bg-[#ff7966]/5 hover:bg-[#ff7966]/10 text-black px-3 py-1 rounded-full transition-colors"
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
                            className="inline-flex items-center space-x-1 text-xs bg-[#00ec97]/5 hover:bg-[#00ec97]/10 text-black px-3 py-1 rounded-full transition-colors"
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
                            className="inline-flex items-center space-x-1 text-xs bg-[#9797ff]/5 hover:bg-[#9797ff]/10 text-black px-3 py-1 rounded-full transition-colors"
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
        ))}
      </div>
    </div>
  );
};
