
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CalendarDays, GitBranch, AlertTriangle, TrendingUp } from 'lucide-react';
import { ProjectCard } from '@/components/ProjectCard';
import { MilestoneTimeline } from '@/components/MilestoneTimeline';
import { DependencyGraph } from '@/components/DependencyGraph';
import { ProjectExplorer } from '@/components/ProjectExplorer';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data for demonstration
  const ecosystemStats = {
    totalProjects: 47,
    onTrackProjects: 32,
    atRiskProjects: 12,
    delayedProjects: 3,
    upcomingMilestones: 23,
    completionRate: 68
  };

  const recentProjects = [
    {
      id: 1,
      name: "Omnibridge",
      category: "Infrastructure",
      status: "on-track",
      progress: 85,
      nextMilestone: "Mainnet Beta",
      dueDate: "2024-08-15",
      team: ["Alice Chen", "Bob Rodriguez"],
      dependencies: ["NEAR Protocol Core"]
    },
    {
      id: 2,
      name: "Agent Hub SDK",
      category: "SDK",
      status: "at-risk",
      progress: 62,
      nextMilestone: "API Documentation",
      dueDate: "2024-07-28",
      team: ["Carol Kim", "David Park"],
      dependencies: ["NEAR Intents", "Lucid Wallet"]
    },
    {
      id: 3,
      name: "Meteor Wallet",
      category: "Grantee",
      status: "delayed",
      progress: 45,
      nextMilestone: "Security Audit",
      dueDate: "2024-07-20",
      team: ["Eve Thompson", "Frank Liu"],
      dependencies: []
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">NEAR Ecosystem Tracker</h1>
            <p className="text-gray-600">Milestone tracking and dependency management</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {ecosystemStats.onTrackProjects} On Track
            </Badge>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              {ecosystemStats.atRiskProjects} At Risk
            </Badge>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              {ecosystemStats.delayedProjects} Delayed
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                  <GitBranch className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{ecosystemStats.totalProjects}</div>
                  <p className="text-xs text-muted-foreground">Active ecosystem projects</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Milestones</CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{ecosystemStats.upcomingMilestones}</div>
                  <p className="text-xs text-muted-foreground">Due in next 30 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">At Risk</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{ecosystemStats.atRiskProjects}</div>
                  <p className="text-xs text-muted-foreground">Projects needing attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{ecosystemStats.completionRate}%</div>
                  <Progress value={ecosystemStats.completionRate} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Recent Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Project Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Timeline Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Milestone Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <MilestoneTimeline projects={recentProjects} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <ProjectExplorer projects={recentProjects} />
          </TabsContent>

          <TabsContent value="dependencies">
            <Card>
              <CardHeader>
                <CardTitle>Ecosystem Dependencies</CardTitle>
              </CardHeader>
              <CardContent>
                <DependencyGraph projects={recentProjects} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Analytics charts will be implemented here
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Milestone Completion Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Trend analysis charts will be implemented here
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
