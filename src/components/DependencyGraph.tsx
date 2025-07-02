
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitBranch, ArrowRight } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  status: 'on-track' | 'at-risk' | 'delayed';
  dependencies: string[];
}

interface DependencyGraphProps {
  projects: Project[];
}

export const DependencyGraph = ({ projects }: DependencyGraphProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'border-green-500 bg-green-50 text-green-700';
      case 'at-risk':
        return 'border-yellow-500 bg-yellow-50 text-yellow-700';
      case 'delayed':
        return 'border-red-500 bg-red-50 text-red-700';
      default:
        return 'border-gray-500 bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground mb-4">
        Visualization showing project dependencies and their current status
      </div>
      
      {projects.map((project) => (
        <Card key={project.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              {/* Project Node */}
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border-2 ${getStatusColor(project.status)}`}>
                <GitBranch className="h-4 w-4" />
                <span className="font-medium">{project.name}</span>
              </div>
              
              {/* Dependencies */}
              {project.dependencies.length > 0 && (
                <>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-wrap gap-2">
                    {project.dependencies.map((dep, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {dep}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
              
              {project.dependencies.length === 0 && (
                <span className="text-sm text-muted-foreground italic">
                  No dependencies
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 rounded-full bg-blue-500 flex-shrink-0 mt-0.5"></div>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Enhanced Visualization Coming Soon</h4>
            <p className="text-sm text-blue-700">
              Interactive network graph with drag-and-drop nodes, critical path highlighting, 
              and real-time dependency impact analysis will be available in the next update.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
