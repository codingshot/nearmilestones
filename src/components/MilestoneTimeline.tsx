
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
        return 'border-[#00ec97] bg-[#00ec97]/5';
      case 'at-risk':
        return 'border-[#ff7966] bg-[#ff7966]/5';
      case 'delayed':
        return 'border-[#ff7966] bg-[#ff7966]/10';
      default:
        return 'border-black/20 bg-black/5';
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
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-black/10"></div>
        
        {sortedProjects.map((project, index) => (
          <div key={project.id} className="relative flex items-start space-x-4 pb-6">
            {/* Timeline dot */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 ${getStatusColor(project.status)} flex items-center justify-center z-10`}>
              <div className="w-2 h-2 rounded-full bg-current opacity-70"></div>
            </div>
            
            {/* Content */}
            <Card className="flex-1 ml-2 bg-white border-black/10 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-black">{project.name}</h4>
                    <p className="text-sm text-black/70 font-medium">{project.nextMilestone}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant={isOverdue(project.dueDate) ? "destructive" : "outline"}
                      className={`text-xs font-medium ${!isOverdue(project.dueDate) ? 'border-[#17d9d4]/30 text-black bg-[#17d9d4]/5' : ''}`}
                    >
                      {formatDate(project.dueDate)}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`text-xs font-medium ${
                        project.status === 'on-track' ? 'border-[#00ec97]/30 text-black bg-[#00ec97]/5' :
                        project.status === 'at-risk' ? 'border-[#ff7966]/30 text-black bg-[#ff7966]/5' :
                        'border-[#ff7966]/40 text-black bg-[#ff7966]/10'
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
