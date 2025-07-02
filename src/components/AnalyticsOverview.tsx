
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target, Clock } from 'lucide-react';

interface Project {
  id: string | number;
  name: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'delayed' | 'completed';
  dueDate: string;
}

interface AnalyticsOverviewProps {
  projects: Project[];
}

export const AnalyticsOverview = ({ projects }: AnalyticsOverviewProps) => {
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const onTrackProjects = projects.filter(p => p.status === 'on-track').length;
  const atRiskProjects = projects.filter(p => p.status === 'at-risk').length;
  const delayedProjects = projects.filter(p => p.status === 'delayed').length;
  
  const avgProgress = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects);
  const completionRate = Math.round((completedProjects / totalProjects) * 100);
  const healthyRate = Math.round(((onTrackProjects + completedProjects) / totalProjects) * 100);
  
  const overdueMilestones = projects.filter(p => 
    new Date(p.dueDate) < new Date() && p.status !== 'completed'
  ).length;

  const stats = [
    {
      title: 'Overall Progress',
      value: `${avgProgress}%`,
      icon: TrendingUp,
      color: 'text-[#00ec97]',
      bgColor: 'bg-[#00ec97]/10',
      progress: avgProgress
    },
    {
      title: 'Project Health',
      value: `${healthyRate}%`,
      icon: Target,
      color: 'text-[#17d9d4]',
      bgColor: 'bg-[#17d9d4]/10',
      progress: healthyRate
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: 'text-[#00ec97]',
      bgColor: 'bg-[#00ec97]/10',
      progress: completionRate
    },
    {
      title: 'Overdue Items',
      value: overdueMilestones.toString(),
      icon: Clock,
      color: 'text-[#ff7966]',
      bgColor: 'bg-[#ff7966]/10',
      progress: null
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white border-black/10 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-black">{stat.value}</div>
                <div className="text-sm text-black/60 font-medium">{stat.title}</div>
              </div>
            </div>
            {stat.progress !== null && (
              <Progress value={stat.progress} className="h-2" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
