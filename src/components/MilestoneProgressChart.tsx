
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Project {
  id: string | number;
  name: string;
  progress: number;
  category: string;
  status: 'on-track' | 'at-risk' | 'delayed' | 'completed';
}

interface MilestoneProgressChartProps {
  projects: Project[];
}

export const MilestoneProgressChart = ({ projects }: MilestoneProgressChartProps) => {
  // Group projects by category and calculate average progress
  const categoryProgress = projects.reduce((acc, project) => {
    if (!acc[project.category]) {
      acc[project.category] = { total: 0, count: 0, projects: [] };
    }
    acc[project.category].total += project.progress;
    acc[project.category].count += 1;
    acc[project.category].projects.push(project);
    return acc;
  }, {} as Record<string, { total: number; count: number; projects: Project[] }>);

  const chartData = Object.entries(categoryProgress).map(([category, data]) => ({
    category,
    avgProgress: Math.round(data.total / data.count),
    projectCount: data.count,
    onTrack: data.projects.filter(p => p.status === 'on-track').length,
    atRisk: data.projects.filter(p => p.status === 'at-risk').length,
    delayed: data.projects.filter(p => p.status === 'delayed').length,
    completed: data.projects.filter(p => p.status === 'completed').length
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-black/10 rounded-lg shadow-lg">
          <p className="font-medium text-black mb-2">{label}</p>
          <p className="text-sm text-black/70">Average Progress: <span className="font-semibold">{data.avgProgress}%</span></p>
          <p className="text-sm text-black/70">Total Projects: <span className="font-semibold">{data.projectCount}</span></p>
          <div className="mt-2 space-y-1">
            <p className="text-xs text-[#00ec97]">On Track: {data.onTrack}</p>
            <p className="text-xs text-[#ff7966]">At Risk: {data.atRisk}</p>
            <p className="text-xs text-[#ff4444]">Delayed: {data.delayed}</p>
            <p className="text-xs text-[#17d9d4]">Completed: {data.completed}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white border-black/10 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-black">Progress by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="category" 
                tick={{ fontSize: 12 }}
                stroke="#666666"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#666666"
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="avgProgress" 
                fill="#00ec97"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
