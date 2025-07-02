import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, Users, GitBranch, ExternalLink, Github, Globe, MessageCircle, FileText } from 'lucide-react';
import { MilestoneTimeline } from '@/components/MilestoneTimeline';
import { useGitHubData } from '@/hooks/useGitHubData';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const { projects, generatePRUrl, generateIssueUrl } = useGitHubData();

  // Mock data structure - in real app this would come from GitHub data
  const mockProjects = [
    {
      id: "omnibridge",
      name: "Omnibridge",
      category: "Infrastructure",
      status: "on-track",
      progress: 85,
      nextMilestone: "Mainnet Beta",
      dueDate: "2024-08-15",
      team: ["Alice Chen", "Bob Rodriguez"],
      dependencies: ["NEAR Protocol Core"],
      description: "Cross-chain bridge infrastructure enabling seamless asset transfers between NEAR and other blockchain networks. Built with security and user experience as top priorities.",
      githubRepo: "https://github.com/omnibridge/omnibridge",
      website: "https://omnibridge.near.org",
      twitter: "https://twitter.com/omnibridge",
      discord: "https://discord.gg/omnibridge",
      fundingType: "Infrastructure Grant",
      totalFunding: "$500,000",
      fundingRounds: [
        { round: "Seed", amount: "$200,000", date: "2024-01-15" },
        { round: "Development", amount: "$300,000", date: "2024-04-01" }
      ],
      milestones: [
        { id: 1, title: "Technical Architecture", status: "completed", dueDate: "2024-02-01", progress: 100 },
        { id: 2, title: "Smart Contract Development", status: "completed", dueDate: "2024-04-15", progress: 100 },
        { id: 3, title: "Security Audit", status: "completed", dueDate: "2024-06-01", progress: 100 },
        { id: 4, title: "Testnet Launch", status: "completed", dueDate: "2024-07-01", progress: 100 },
        { id: 5, title: "Mainnet Beta", status: "in-progress", dueDate: "2024-08-15", progress: 75 },
        { id: 6, title: "Full Mainnet Launch", status: "pending", dueDate: "2024-09-30", progress: 0 }
      ],
      recentUpdates: [
        { date: "2024-07-01", title: "Testnet Successfully Launched", description: "All core functionality tested and verified on testnet." },
        { date: "2024-06-15", title: "Security Audit Completed", description: "No critical vulnerabilities found. Minor recommendations implemented." },
        { date: "2024-06-01", title: "UI/UX Improvements", description: "Enhanced user interface based on community feedback." }
      ]
    },
    {
      id: "agent-hub-sdk",
      name: "Agent Hub SDK",
      category: "SDK",
      status: "at-risk",
      progress: 62,
      nextMilestone: "API Documentation",
      dueDate: "2024-07-28",
      team: ["Carol Kim", "David Park"],
      dependencies: ["NEAR Intents", "Lucid Wallet"],
      description: "Comprehensive SDK for building AI agents on NEAR Protocol. Provides tools, libraries, and documentation for developers to create intelligent applications.",
      githubRepo: "https://github.com/agenthub/sdk",
      website: "https://agenthub.near.org",
      fundingType: "SDK Development Grant",
      totalFunding: "$300,000",
      fundingRounds: [
        { round: "Initial", amount: "$300,000", date: "2024-03-01" }
      ],
      milestones: [
        { id: 1, title: "Core SDK Framework", status: "completed", dueDate: "2024-04-15", progress: 100 },
        { id: 2, title: "Agent Templates", status: "completed", dueDate: "2024-05-30", progress: 100 },
        { id: 3, title: "API Documentation", status: "in-progress", dueDate: "2024-07-28", progress: 60 },
        { id: 4, title: "Example Applications", status: "pending", dueDate: "2024-08-30", progress: 10 }
      ],
      recentUpdates: [
        { date: "2024-06-30", title: "Documentation Progress Update", description: "API documentation is 60% complete. Some delays due to scope expansion." },
        { date: "2024-06-15", title: "Agent Templates Released", description: "Five new agent templates added to the SDK." }
      ]
    }
  ];

  // Find project by ID (from GitHub data or mock data)
  const project = projects.find(p => p.id === projectId) || mockProjects.find(p => p.id === projectId);
  const allProjects = projects.length > 0 ? projects : mockProjects;

  if (!project) {
    return (
      <div className="min-h-screen bg-[#f2f1e9] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-black mb-4">Project Not Found</h1>
          <Link to="/">
            <Button className="bg-[#00ec97] hover:bg-[#00ec97]/90 text-black font-medium">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-[#00ec97]/10 text-black border-[#00ec97]/30';
      case 'at-risk':
        return 'bg-[#ff7966]/10 text-black border-[#ff7966]/30';
      case 'delayed':
        return 'bg-[#ff7966]/20 text-black border-[#ff7966]/40';
      default:
        return 'bg-black/5 text-black border-black/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#f2f1e9]">
      {/* Header */}
      <header className="bg-white border-b border-black/10 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link to="/">
              <Button variant="ghost" className="font-medium hover:bg-black/5">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              {project.website && (
                <Button variant="outline" size="sm" asChild className="font-medium border-black/20">
                  <a href={project.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-4 w-4" />
                    Website
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              )}
              {project.docs && (
                <Button variant="outline" size="sm" asChild className="font-medium border-black/20">
                  <a href={project.docs} target="_blank" rel="noopener noreferrer">
                    <FileText className="mr-2 h-4 w-4" />
                    Docs
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              )}
              {project.githubRepo && (
                <Button variant="outline" size="sm" asChild className="font-medium border-black/20">
                  <a href={project.githubRepo} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              )}
              {project.twitter && (
                <Button variant="outline" size="sm" asChild className="font-medium border-black/20">
                  <a href={project.twitter} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Twitter
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              )}
              {project.discord && (
                <Button variant="outline" size="sm" asChild className="font-medium border-black/20">
                  <a href={project.discord} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Discord
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-black mb-2">{project.name}</h1>
              <div className="flex items-center space-x-4 mb-3">
                <Badge variant="outline" className="font-medium border-black/20 text-black">
                  {project.category}
                </Badge>
                <Badge className={`font-medium ${getStatusColor(project.status)}`}>
                  {project.status.replace('-', ' ')}
                </Badge>
                {project.fundingType && (
                  <Badge variant="outline" className="font-medium border-[#17d9d4]/30 text-black bg-[#17d9d4]/5">
                    {project.fundingType}
                  </Badge>
                )}
              </div>
              <p className="text-black/70 font-medium max-w-3xl">{project.description}</p>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-semibold text-[#00ec97] mb-1">{project.progress}%</div>
              <div className="text-sm text-black/60 font-medium">Complete</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px] bg-white border border-black/10">
            <TabsTrigger value="overview" className="font-medium data-[state=active]:bg-[#00ec97] data-[state=active]:text-black">Overview</TabsTrigger>
            <TabsTrigger value="milestones" className="font-medium data-[state=active]:bg-[#00ec97] data-[state=active]:text-black">Milestones</TabsTrigger>
            <TabsTrigger value="team" className="font-medium data-[state=active]:bg-[#00ec97] data-[state=active]:text-black">Team & Links</TabsTrigger>
            <TabsTrigger value="updates" className="font-medium data-[state=active]:bg-[#00ec97] data-[state=active]:text-black">Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Progress Overview */}
              <Card className="bg-white border-black/10 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-black">Progress Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-black">Overall Progress</span>
                      <span className="text-sm text-black/70 font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-3" />
                  </div>
                  
                  <div className="pt-3 border-t border-black/10">
                    <div className="flex items-center space-x-3 text-sm mb-2">
                      <Calendar className="h-4 w-4 text-black/60" />
                      <span className="font-semibold text-black">Next Milestone:</span>
                    </div>
                    <div className="ml-7">
                      <div className="font-medium text-black">{project.nextMilestone}</div>
                      <div className="text-sm text-black/60">Due: {formatDate(project.dueDate)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Team Information */}
              <Card className="bg-white border-black/10 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-black">Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 text-sm">
                    <Users className="h-4 w-4 text-black/60" />
                    <div>
                      <div className="font-semibold text-black mb-1">Core Team</div>
                      <div className="space-y-1">
                        {project.team.map((member, index) => (
                          <div key={index} className="text-black/70 font-medium">{member}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dependencies */}
              <Card className="bg-white border-black/10 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-black">Dependencies</CardTitle>
                </CardHeader>
                <CardContent>
                  {project.dependencies && project.dependencies.length > 0 ? (
                    <div className="flex items-start space-x-3 text-sm">
                      <GitBranch className="h-4 w-4 text-black/60 mt-0.5" />
                      <div className="space-y-2">
                        {project.dependencies.map((dep, index) => (
                          <Badge key={index} variant="outline" className="block w-fit font-medium border-[#9797ff]/30 text-black bg-[#9797ff]/5">
                            {dep}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-black/60 font-medium">No dependencies</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Funding Information */}
            {project.totalFunding && (
              <Card className="bg-white border-black/10 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-black">Funding Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm font-semibold text-black mb-2">Total Funding</div>
                      <div className="text-2xl font-semibold text-[#00ec97]">{project.totalFunding}</div>
                    </div>
                    {project.fundingRounds && (
                      <div>
                        <div className="text-sm font-semibold text-black mb-3">Funding Rounds</div>
                        <div className="space-y-2">
                          {project.fundingRounds.map((round, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-sm font-medium text-black">{round.round}</span>
                              <span className="text-sm text-black/70">{round.amount}</span>
                              <span className="text-xs text-black/50">{formatDate(round.date)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="milestones">
            <Card className="bg-white border-black/10 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-black">Project Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <MilestoneTimeline projects={[project]} allProjects={allProjects} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border-black/10 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-black">Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.team.map((member, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-black/5 rounded-lg">
                        <div className="w-10 h-10 bg-[#00ec97]/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-black">{member.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-medium text-black">{member}</div>
                          <div className="text-sm text-black/60">Core Developer</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-black/10 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-black">Project Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.website && (
                      <a href={project.website} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center space-x-3 p-3 bg-black/5 rounded-lg hover:bg-black/10 transition-colors">
                        <Globe className="h-5 w-5 text-black/60" />
                        <div>
                          <div className="font-medium text-black">Website</div>
                          <div className="text-sm text-black/60">Official project website</div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-black/40 ml-auto" />
                      </a>
                    )}
                    {project.githubRepo && (
                      <a href={project.githubRepo} target="_blank" rel="noopener noreferrer"
                         className="flex items-center space-x-3 p-3 bg-black/5 rounded-lg hover:bg-black/10 transition-colors">
                        <Github className="h-5 w-5 text-black/60" />
                        <div>
                          <div className="font-medium text-black">GitHub Repository</div>
                          <div className="text-sm text-black/60">Source code and documentation</div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-black/40 ml-auto" />
                      </a>
                    )}
                    {project.twitter && (
                      <a href={project.twitter} target="_blank" rel="noopener noreferrer"
                         className="flex items-center space-x-3 p-3 bg-black/5 rounded-lg hover:bg-black/10 transition-colors">
                        <MessageCircle className="h-5 w-5 text-black/60" />
                        <div>
                          <div className="font-medium text-black">Twitter</div>
                          <div className="text-sm text-black/60">Follow for updates</div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-black/40 ml-auto" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="updates">
            <Card className="bg-white border-black/10 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-black">Recent Updates</CardTitle>
              </CardHeader>
              <CardContent>
                {project.recentUpdates && project.recentUpdates.length > 0 ? (
                  <div className="space-y-4">
                    {project.recentUpdates.map((update, index) => (
                      <div key={index} className="border-l-2 border-[#00ec97] pl-4 pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-black">{update.title}</h4>
                          <span className="text-sm text-black/60 font-medium">{formatDate(update.date)}</span>
                        </div>
                        <p className="text-black/70 font-medium">{update.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-black/60">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">No recent updates available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectDetail;
