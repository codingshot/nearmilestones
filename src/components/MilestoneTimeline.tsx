
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface Project {
  id: number;
  name: string;
  status: 'on-track' | 'at-risk' | 'delayed';
  nextMilestone: string;
  dueDate: string;
}

interface MilestoneTimelineProps {
  projects: Project[];
}

export const MilestoneTimeline = ({ projects }: MilestoneTimelineProps) => {
  const sortedProjects = [...projects].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'border-green-500 bg-green-50';
      case 'at-risk':
        return 'border-yellow-500 bg-yellow-50';
      case 'delayed':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        {sortedProjects.map((project, index) => (
          <div key={project.id} className="relative flex items-start space-x-4 pb-6">
            {/* Timeline dot */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 ${getStatusColor(project.status)} flex items-center justify-center z-10`}>
              <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
            </div>
            
            {/* Content */}
            <Card className="flex-1 ml-2">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">{project.name}</h4>
                    <p className="text-sm text-muted-foreground">{project.nextMilestone}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={isOverdue(project.dueDate) ? "destructive" : "outline"}
                      className="text-xs"
                    >
                      {formatDate(project.dueDate)}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        project.status === 'on-track' ? 'border-green-500 text-green-700' :
                        project.status === 'at-risk' ? 'border-yellow-500 text-yellow-700' :
                        'border-red-500 text-red-700'
                      }`}
                    >
                      {project.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
