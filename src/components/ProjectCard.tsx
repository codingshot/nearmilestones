
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar, Users, GitBranch, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Project {
  id: number | string;
  name: string;
  category: string;
  status: 'on-track' | 'at-risk' | 'delayed';
  progress: number;
  nextMilestone: string;
  dueDate: string;
  team: string[];
  dependencies: string[];
  milestonesSource?: 'local' | 'external';
  milestoneRepo?: string;
}

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-[#00ec97]/10 text-black border-[#00ec97]/30';
      case 'at-risk':
        return 'bg-[#ff7966]/10 text-black border-[#ff7966]/30';
      case 'delayed':
        return 'bg-[#ff7966]/20 text-black border-[#ff7966]/40';
      default:
        return 'bg-black/5 text-black border-black/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="bg-white border-black/10 shadow-sm hover:shadow-md transition-all duration-200 hover:border-[#00ec97]/30 cursor-pointer">
      <Link to={`/project/${project.id}`} className="block">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg text-black hover:text-[#00ec97] transition-colors">{project.name}</h3>
                {project.milestonesSource === 'external' && (
                  <Badge variant="outline" className="text-xs font-medium border-[#00ec97]/30 text-[#00ec97] bg-[#00ec97]/5 flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    External Roadmap
                  </Badge>
                )}
              </div>
              <Badge variant="outline" className="text-xs font-medium border-black/20 text-black">
                {project.category}
              </Badge>
            </div>
            <Badge className={`font-medium ${getStatusColor(project.status)}`}>
              {project.status.replace('-', ' ')}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-5">
          {/* Progress */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-black">Progress</span>
              <span className="text-sm text-black/70 font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>

          {/* Next Milestone */}
          <div className="flex items-center space-x-3 text-sm">
            <Calendar className="h-4 w-4 text-black/60" />
            <span className="font-semibold text-black">Next:</span>
            <span className="text-black/80">{project.nextMilestone}</span>
            <Badge variant="outline" className="text-xs font-medium border-[#17d9d4]/30 text-black bg-[#17d9d4]/5">
              {formatDate(project.dueDate)}
            </Badge>
          </div>

          {/* Team */}
          <div className="flex items-center space-x-3 text-sm">
            <Users className="h-4 w-4 text-black/60" />
            <span className="font-semibold text-black">Team:</span>
            <span className="text-black/70 font-medium">
              {project.team.join(', ')}
            </span>
          </div>

          {/* Dependencies */}
          {project.dependencies.length > 0 && (
            <div className="flex items-start space-x-3 text-sm">
              <GitBranch className="h-4 w-4 text-black/60 mt-0.5" />
              <div>
                <span className="font-semibold text-black">Dependencies:</span>
                <div className="mt-2 space-x-2">
                  {project.dependencies.map((dep, index) => {
                    const isUrl = dep.startsWith('http://') || dep.startsWith('https://');
                    const isMilestone = dep.includes('-m') || dep.includes('milestone');
                    
                    if (isUrl) {
                      return (
                        <a 
                          key={index} 
                          href={dep} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Badge variant="outline" className="text-xs font-medium border-[#9797ff]/30 text-[#9797ff] bg-[#9797ff]/5 hover:bg-[#9797ff]/10 transition-colors cursor-pointer flex items-center gap-1">
                            {dep}
                            <ExternalLink className="h-2.5 w-2.5" />
                          </Badge>
                        </a>
                      );
                    }
                    
                    if (isMilestone) {
                      // Extract project ID from milestone dependency (e.g., "omnibridge-m3" -> "omnibridge")
                      const projectId = dep.split('-m')[0];
                      return (
                        <Link 
                          key={index} 
                          to={`/project/${projectId}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-block"
                        >
                          <Badge variant="outline" className="text-xs font-medium border-[#9797ff]/30 text-[#9797ff] bg-[#9797ff]/5 hover:bg-[#9797ff]/10 transition-colors cursor-pointer">
                            {dep}
                          </Badge>
                        </Link>
                      );
                    }
                    
                    // Check if it's a project name that exists in our project list
                    // This handles cases like "NEAR Protocol Core" or other project names
                    return (
                      <Badge key={index} variant="outline" className="text-xs font-medium border-[#9797ff]/30 text-black bg-[#9797ff]/5">
                        {dep}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Link>
      
      <div className="px-6 pb-6">
        <Link to={`/project/${project.id}`}>
          <Button variant="outline" size="sm" className="w-full font-medium border-black/20 hover:border-[#00ec97] hover:bg-[#00ec97]/5">
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
};
