
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Project {
  id: string | number;
  name: string;
  status: 'on-track' | 'at-risk' | 'delayed' | 'completed';
}

interface ProjectStatusChartProps {
  projects: Project[];
}

const COLORS = {
  'on-track': '#00ec97',
  'at-risk': '#ff7966',
  'delayed': '#ff4444',
  'completed': '#17d9d4'
};

const STATUS_LABELS = {
  'on-track': 'On Track',
  'at-risk': 'At Risk',
  'delayed': 'Delayed',
  'completed': 'Completed'
};

export const ProjectStatusChart = ({ projects }: ProjectStatusChartProps) => {
  const statusCounts = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status,
    value: count,
    color: COLORS[status as keyof typeof COLORS] || '#666666'
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-black/10 rounded-lg shadow-lg">
          <p className="font-medium text-black">{data.name}</p>
          <p className="text-black/70">
            <span className="font-semibold">{data.value}</span> projects
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white border-black/10 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-black">Project Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium text-black">{item.name}: {item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
