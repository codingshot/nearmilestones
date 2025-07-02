
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar, Users, GitBranch } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  category: string;
  status: 'on-track' | 'at-risk' | 'delayed';
  progress: number;
  nextMilestone: string;
  dueDate: string;
  team: string[];
  dependencies: string[];
}

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'delayed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{project.name}</h3>
            <Badge variant="outline" className="text-xs">
              {project.category}
            </Badge>
          </div>
          <Badge className={getStatusColor(project.status)}>
            {project.status.replace('-', ' ')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        {/* Next Milestone */}
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Next:</span>
          <span>{project.nextMilestone}</span>
          <Badge variant="outline" className="text-xs">
            {formatDate(project.dueDate)}
          </Badge>
        </div>

        {/* Team */}
        <div className="flex items-center space-x-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Team:</span>
          <span className="text-muted-foreground">
            {project.team.join(', ')}
          </span>
        </div>

        {/* Dependencies */}
        {project.dependencies.length > 0 && (
          <div className="flex items-start space-x-2 text-sm">
            <GitBranch className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <span className="font-medium">Dependencies:</span>
              <div className="mt-1 space-x-1">
                {project.dependencies.map((dep, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {dep}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
