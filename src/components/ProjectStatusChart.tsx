
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  const projectsByStatus = projects.reduce((acc, project) => {
    if (!acc[project.status]) {
      acc[project.status] = [];
    }
    acc[project.status].push(project);
    return acc;
  }, {} as Record<string, Project[]>);

  const chartData = Object.entries(projectsByStatus).map(([status, projectList]) => ({
    name: STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status,
    value: projectList.length,
    color: COLORS[status as keyof typeof COLORS] || '#666666',
    projects: projectList
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-4 border border-black/10 rounded-lg shadow-lg max-w-xs">
          <p className="font-semibold text-black mb-2">{data.name}</p>
          <p className="text-sm text-black/70 mb-2">
            <span className="font-semibold">{data.value}</span> projects
          </p>
          <div className="space-y-1">
            {data.payload.projects.map((project: Project) => (
              <Badge 
                key={project.id} 
                variant="outline" 
                className="text-xs mr-1 mb-1"
                style={{ 
                  borderColor: data.payload.color + '40',
                  backgroundColor: data.payload.color + '10'
                }}
              >
                {project.name}
              </Badge>
            ))}
          </div>
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
        <div className="mt-6 space-y-4">
          {chartData.map((item) => (
            <div key={item.name} className="border-l-4 pl-4" style={{ borderColor: item.color }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-black">{item.name}</span>
                <span className="text-sm text-black/60">{item.value} projects</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {item.projects.map((project) => (
                  <Badge 
                    key={project.id} 
                    variant="outline" 
                    className="text-xs"
                    style={{ 
                      borderColor: item.color + '40',
                      backgroundColor: item.color + '10'
                    }}
                  >
                    {project.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
