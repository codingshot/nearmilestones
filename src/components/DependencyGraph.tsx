
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
        return 'border-[#00ec97] bg-[#00ec97]/5 text-black';
      case 'at-risk':
        return 'border-[#ff7966] bg-[#ff7966]/5 text-black';
      case 'delayed':
        return 'border-[#ff7966] bg-[#ff7966]/10 text-black';
      default:
        return 'border-black/20 bg-black/5 text-black';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-black/60 mb-6 font-medium">
        Visualization showing project dependencies and their current status
      </div>
      
      {projects.map((project) => (
        <Card key={project.id} className="overflow-hidden bg-white border-black/10 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              {/* Project Node */}
              <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg border-2 ${getStatusColor(project.status)}`}>
                <GitBranch className="h-4 w-4" />
                <span className="font-semibold">{project.name}</span>
              </div>
              
              {/* Dependencies */}
              {project.dependencies.length > 0 && (
                <>
                  <ArrowRight className="h-5 w-5 text-black/40" />
                  <div className="flex flex-wrap gap-2">
                    {project.dependencies.map((dep, index) => (
                      <Badge key={index} variant="outline" className="text-xs font-medium border-[#9797ff]/30 text-black bg-[#9797ff]/5">
                        {dep}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
              
              {project.dependencies.length === 0 && (
                <span className="text-sm text-black/50 italic font-medium">
                  No dependencies
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="bg-[#17d9d4]/5 border border-[#17d9d4]/20 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="w-5 h-5 rounded-full bg-[#17d9d4] flex-shrink-0 mt-0.5"></div>
          <div>
            <h4 className="font-semibold text-black mb-2">Enhanced Visualization Coming Soon</h4>
            <p className="text-sm text-black/70 font-medium">
              Interactive network graph with drag-and-drop nodes, critical path highlighting, 
              and real-time dependency impact analysis will be available in the next update.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
