
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, Calendar, TrendingDown } from 'lucide-react';
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
}

interface DelaysViewProps {
  projects: Project[];
}

export const DelaysView = ({ projects }: DelaysViewProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysOverdue = (dateString: string) => {
    const dueDate = new Date(dateString);
    const today = new Date();
    const diffTime = today.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'at-risk':
        return 'bg-[#ff7966]/10 text-black border-[#ff7966]/30';
      case 'delayed':
        return 'bg-[#ff7966]/20 text-black border-[#ff7966]/40';
      default:
        return 'bg-black/5 text-black border-black/20';
    }
  };

  const delayedProjects = projects.filter(p => p.status === 'delayed' || getDaysOverdue(p.dueDate) > 0);
  const atRiskProjects = projects.filter(p => p.status === 'at-risk');
  const overdueProjects = projects.filter(p => getDaysOverdue(p.dueDate) > 0);

  const totalDelayedDays = delayedProjects.reduce((sum, project) => sum + getDaysOverdue(project.dueDate), 0);
  const avgDelayDays = delayedProjects.length > 0 ? Math.round(totalDelayedDays / delayedProjects.length) : 0;

  return (
    <div className="space-y-6">
      {/* Delay Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border-black/10 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-black">Delayed Projects</CardTitle>
            <AlertTriangle className="h-5 w-5 text-[#ff7966]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-[#ff7966]">{delayedProjects.length}</div>
            <p className="text-sm text-black/60 font-medium mt-1">Projects behind schedule</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-black/10 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-black">At Risk</CardTitle>
            <Clock className="h-5 w-5 text-[#ff7966]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-[#ff7966]">{atRiskProjects.length}</div>
            <p className="text-sm text-black/60 font-medium mt-1">Projects at risk of delay</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-black/10 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-black">Overdue</CardTitle>
            <Calendar className="h-5 w-5 text-[#ff7966]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-[#ff7966]">{overdueProjects.length}</div>
            <p className="text-sm text-black/60 font-medium mt-1">Past due date</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-black/10 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-black">Avg Delay</CardTitle>
            <TrendingDown className="h-5 w-5 text-[#ff7966]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-[#ff7966]">{avgDelayDays}</div>
            <p className="text-sm text-black/60 font-medium mt-1">Days behind schedule</p>
          </CardContent>
        </Card>
      </div>

      {/* Delayed Projects List */}
      <Card className="bg-white border-black/10 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-xl font-semibold text-black">
            <AlertTriangle className="h-5 w-5 text-[#ff7966]" />
            <span>Delayed Projects</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {delayedProjects.length > 0 ? (
            <div className="space-y-4">
              {delayedProjects
                .sort((a, b) => getDaysOverdue(b.dueDate) - getDaysOverdue(a.dueDate))
                .map((project) => (
                  <div key={project.id} className="p-4 bg-[#ff7966]/5 border border-[#ff7966]/20 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Link to={`/project/${project.id}`} className="text-lg font-semibold text-black hover:text-[#00ec97] transition-colors">
                          {project.name}
                        </Link>
                        <div className="flex items-center space-x-3 mt-2">
                          <Badge variant="outline" className="text-xs font-medium border-black/20 text-black">
                            {project.category}
                          </Badge>
                          <Badge className={`text-xs font-medium ${getStatusColor(project.status)}`}>
                            {project.status.replace('-', ' ')}
                          </Badge>
                          {getDaysOverdue(project.dueDate) > 0 && (
                            <Badge variant="destructive" className="text-xs font-medium">
                              {getDaysOverdue(project.dueDate)} days overdue
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-[#ff7966]">{project.progress}%</div>
                        <div className="text-sm text-black/60 font-medium">Complete</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-black">Progress</span>
                          <span className="text-sm text-black/70 font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-semibold text-black">Next Milestone:</span>
                          <div className="text-black/70 font-medium">{project.nextMilestone}</div>
                        </div>
                        <div>
                          <span className="font-semibold text-black">Due Date:</span>
                          <div className="text-black/70 font-medium">{formatDate(project.dueDate)}</div>
                        </div>
                        <div>
                          <span className="font-semibold text-black">Team:</span>
                          <div className="text-black/70 font-medium">{project.team.join(', ')}</div>
                        </div>
                      </div>

                      {project.dependencies.length > 0 && (
                        <div>
                          <span className="text-sm font-semibold text-black">Dependencies:</span>
                          <div className="mt-2 space-x-2">
                            {project.dependencies.map((dep, index) => (
                              <Badge key={index} variant="outline" className="text-xs font-medium border-[#9797ff]/30 text-black bg-[#9797ff]/5">
                                {dep}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#ff7966]/20">
                      <Link to={`/project/${project.id}`}>
                        <Button variant="outline" size="sm" className="font-medium border-[#ff7966]/30 hover:border-[#ff7966] hover:bg-[#ff7966]/5">
                          View Project Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12 text-black/60">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2 text-black">No Delayed Projects</h3>
              <p className="font-medium">All projects are on track or ahead of schedule!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* At Risk Projects */}
      {atRiskProjects.length > 0 && (
        <Card className="bg-white border-black/10 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-xl font-semibold text-black">
              <Clock className="h-5 w-5 text-[#ff7966]" />
              <span>Projects At Risk</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {atRiskProjects.map((project) => (
                <div key={project.id} className="p-4 bg-[#ff7966]/5 border border-[#ff7966]/20 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Link to={`/project/${project.id}`} className="font-semibold text-black hover:text-[#00ec97] transition-colors">
                        {project.name}
                      </Link>
                      <Badge className="mt-2 text-xs font-medium bg-[#ff7966]/10 text-black border-[#ff7966]/30">
                        At Risk
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-[#ff7966]">{project.progress}%</div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="text-black/70 font-medium mb-1">{project.nextMilestone}</div>
                    <div className="text-black/60 font-medium">Due: {formatDate(project.dueDate)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
