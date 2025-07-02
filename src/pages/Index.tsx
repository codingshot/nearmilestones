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
import { GitHubIntegration } from '@/components/GitHubIntegration';
import { CalendarView } from '@/components/CalendarView';
import { DelaysView } from '@/components/DelaysView';
import { useGitHubData } from '@/hooks/useGitHubData';
import { ProjectStatusChart } from '@/components/ProjectStatusChart';
import { MilestoneProgressChart } from '@/components/MilestoneProgressChart';
import { AnalyticsOverview } from '@/components/AnalyticsOverview';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { projects: githubProjects, loading, error } = useGitHubData();
  const isMobile = useIsMobile();

  // Use GitHub data if available, otherwise fallback to mock data
  const recentProjects = githubProjects.length > 0 ? githubProjects : [
    {
      id: "omnibridge",
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
      id: "agent-hub-sdk",
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
      id: "meteor-wallet",
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

  // Update ecosystem stats based on actual data
  const ecosystemStats = {
    totalProjects: recentProjects.length,
    onTrackProjects: recentProjects.filter(p => p.status === 'on-track').length,
    atRiskProjects: recentProjects.filter(p => p.status === 'at-risk').length,
    delayedProjects: recentProjects.filter(p => p.status === 'delayed').length,
    upcomingMilestones: recentProjects.filter(p => new Date(p.dueDate) > new Date()).length,
    completionRate: Math.round(recentProjects.reduce((acc, p) => acc + p.progress, 0) / recentProjects.length)
  };

  return (
    <div className="bg-[#f2f1e9]">
      {/* Header */}
      <header className="bg-white border-b border-black/10 px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl font-semibold text-black mb-2">NEAR Milestones</h1>
              <p className="text-sm sm:text-base text-black/70 font-medium">
                Milestone tracking and dependency management
                {loading && <span className="ml-2 text-[#17d9d4]">(Loading GitHub data...)</span>}
                {error && <span className="ml-2 text-[#ff7966]">(Using cached data)</span>}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 sm:gap-4">
              <Badge variant="outline" className="bg-[#00ec97]/10 text-black border-[#00ec97]/30 font-medium text-xs sm:text-sm">
                {ecosystemStats.onTrackProjects} On Track
              </Badge>
              <Badge variant="outline" className="bg-[#ff7966]/10 text-black border-[#ff7966]/30 font-medium text-xs sm:text-sm">
                {ecosystemStats.atRiskProjects} At Risk
              </Badge>
              <Badge variant="outline" className="bg-[#ff7966]/20 text-black border-[#ff7966]/40 font-medium text-xs sm:text-sm">
                {ecosystemStats.delayedProjects} Delayed
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 sm:space-y-8">
          <div className="w-full overflow-x-auto">
            <TabsList className={`
              ${isMobile 
                ? 'flex w-full min-w-max bg-white border border-black/10' 
                : 'grid w-full grid-cols-7 lg:w-[800px] bg-white border border-black/10'
              }
            `}>
              <TabsTrigger value="dashboard" className="font-medium data-[state=active]:bg-[#00ec97] data-[state=active]:text-black whitespace-nowrap px-3 sm:px-4">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="projects" className="font-medium data-[state=active]:bg-[#00ec97] data-[state=active]:text-black whitespace-nowrap px-3 sm:px-4">
                Projects
              </TabsTrigger>
              <TabsTrigger value="calendar" className="font-medium data-[state=active]:bg-[#00ec97] data-[state=active]:text-black whitespace-nowrap px-3 sm:px-4">
                Calendar
              </TabsTrigger>
              <TabsTrigger value="delays" className="font-medium data-[state=active]:bg-[#00ec97] data-[state=active]:text-black whitespace-nowrap px-3 sm:px-4">
                Delays
              </TabsTrigger>
              <TabsTrigger value="dependencies" className="font-medium data-[state=active]:bg-[#00ec97] data-[state=active]:text-black whitespace-nowrap px-3 sm:px-4">
                Dependencies
              </TabsTrigger>
              <TabsTrigger value="github" className="font-medium data-[state=active]:bg-[#00ec97] data-[state=active]:text-black whitespace-nowrap px-3 sm:px-4">
                GitHub
              </TabsTrigger>
              <TabsTrigger value="analytics" className="font-medium data-[state=active]:bg-[#00ec97] data-[state=active]:text-black whitespace-nowrap px-3 sm:px-4">
                Analytics
              </TabsTrigger>
            </TabsList>
          </div>

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

          <TabsContent value="calendar">
            <CalendarView projects={recentProjects} />
          </TabsContent>

          <TabsContent value="delays">
            <DelaysView projects={recentProjects} />
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

          <TabsContent value="github">
            <GitHubIntegration />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <AnalyticsOverview projects={recentProjects} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProjectStatusChart projects={recentProjects} />
                <MilestoneProgressChart projects={recentProjects} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
