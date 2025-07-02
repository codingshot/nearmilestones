
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
      status: "on-track" as const,
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
      status: "at-risk" as const,
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
      status: "delayed" as const,
      progress: 45,
      nextMilestone: "Security Audit",
      dueDate: "2024-07-20",
      team: ["Eve Thompson", "Frank Liu"],
      dependencies: []
    }
  ];

  return (
    <div className="min-h-screen bg-[#f2f1e9]">
      {/* Header */}
      <header className="bg-white border-b border-black/10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-black mb-2">NEAR Ecosystem Tracker</h1>
            <p className="text-black/70 font-medium">Milestone tracking and dependency management</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-[#00ec97]/10 text-black border-[#00ec97]/30 font-medium">
              {ecosystemStats.onTrackProjects} On Track
            </Badge>
            <Badge variant="outline" className="bg-[#ff7966]/10 text-black border-[#ff7966]/30 font-medium">
              {ecosystemStats.atRiskProjects} At Risk
            </Badge>
            <Badge variant="outline" className="bg-[#ff7966]/20 text-black border-[#ff7966]/40 font-medium">
              {ecosystemStats.delayedProjects} Delayed
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px] bg-white border border-black/10">
            <TabsTrigger value="dashboard" className="font-medium data-[state=active]:bg-[#00ec97] data-[state=active]:text-black">Dashboard</TabsTrigger>
            <TabsTrigger value="projects" className="font-medium data-[state=active]:bg-[#00ec97] data-[state=active]:text-black">Projects</TabsTrigger>
            <TabsTrigger value="dependencies" className="font-medium data-[state=active]:bg-[#00ec97] data-[state=active]:text-black">Dependencies</TabsTrigger>
            <TabsTrigger value="analytics" className="font-medium data-[state=active]:bg-[#00ec97] data-[state=active]:text-black">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white border-black/10 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-black">Total Projects</CardTitle>
                  <GitBranch className="h-5 w-5 text-black/60" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold text-black">{ecosystemStats.totalProjects}</div>
                  <p className="text-sm text-black/60 font-medium mt-1">Active ecosystem projects</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-black/10 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-black">Upcoming Milestones</CardTitle>
                  <CalendarDays className="h-5 w-5 text-black/60" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold text-black">{ecosystemStats.upcomingMilestones}</div>
                  <p className="text-sm text-black/60 font-medium mt-1">Due in next 30 days</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-black/10 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-black">At Risk</CardTitle>
                  <AlertTriangle className="h-5 w-5 text-[#ff7966]" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold text-[#ff7966]">{ecosystemStats.atRiskProjects}</div>
                  <p className="text-sm text-black/60 font-medium mt-1">Projects needing attention</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-black/10 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-black">Completion Rate</CardTitle>
                  <TrendingUp className="h-5 w-5 text-[#00ec97]" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold text-[#00ec97]">{ecosystemStats.completionRate}%</div>
                  <Progress value={ecosystemStats.completionRate} className="mt-3 h-2" />
                </CardContent>
              </Card>
            </div>

            {/* Recent Projects */}
            <Card className="bg-white border-black/10 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-black">Recent Project Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Timeline Overview */}
            <Card className="bg-white border-black/10 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-black">Milestone Timeline</CardTitle>
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
            <Card className="bg-white border-black/10 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-black">Ecosystem Dependencies</CardTitle>
              </CardHeader>
              <CardContent>
                <DependencyGraph projects={recentProjects} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border-black/10 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-black">Project Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-black/60 font-medium">
                    Analytics charts will be implemented here
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-black/10 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-black">Milestone Completion Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-black/60 font-medium">
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
