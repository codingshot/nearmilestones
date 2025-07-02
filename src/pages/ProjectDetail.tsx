import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, Users, GitBranch, ExternalLink, Github, Globe, MessageCircle, FileText } from 'lucide-react';
import { MilestoneTimeline } from '@/components/MilestoneTimeline';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useGitHubData } from '@/hooks/useGitHubData';
import { useEffect } from 'react';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const { projects, loading, generatePRUrl, generateIssueUrl } = useGitHubData();

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
      team: [
        { 
          name: "Alice Chen", 
          role: "Lead Developer",
          github: "https://github.com/alicechen",
          twitter: "https://twitter.com/alicechen" 
        },
        { 
          name: "Bob Rodriguez", 
          role: "Smart Contract Developer",
          github: "https://github.com/bobrodriguez" 
        }
      ],
      dependencies: ["NEAR Protocol Core"],
      description: "Cross-chain bridge infrastructure enabling seamless asset transfers between NEAR and other blockchain networks. Built with security and user experience as top priorities.",
      githubRepo: "https://github.com/omnibridge/omnibridge",
      website: "https://omnibridge.near.org",
      docs: "https://docs.omnibridge.near.org",
      twitter: "https://twitter.com/omnibridge",
      discord: "https://discord.gg/omnibridge",
      fundingType: "Infrastructure Grant",
      totalFunding: "$500,000",
      fundingRounds: [
        { round: "Seed", amount: "$200,000", date: "2024-01-15" },
        { round: "Development", amount: "$300,000", date: "2024-04-01" }
      ],
      milestones: [
        { 
          id: "milestone-1", 
          title: "Technical Architecture", 
          status: "completed", 
          dueDate: "2024-02-01", 
          progress: 100,
          description: "Complete system architecture design and technical specifications",
          definitionOfDone: "Architecture document approved, technical stack finalized, and development roadmap created",
          isGrantMilestone: true,
          dependencies: [],
          links: {
            docs: "https://docs.omnibridge.near.org/architecture",
            github: "https://github.com/omnibridge/architecture"
          }
        },
        { 
          id: "milestone-2", 
          title: "Smart Contract Development", 
          status: "completed", 
          dueDate: "2024-04-15", 
          progress: 100,
          description: "Core smart contracts for cross-chain bridge functionality",
          definitionOfDone: "All smart contracts deployed on testnet, unit tests passing with 95% coverage",
          isGrantMilestone: true,
          dependencies: ["milestone-1"],
          links: {
            github: "https://github.com/omnibridge/contracts",
            testnet: "https://testnet.near.org/omnibridge"
          }
        },
        { 
          id: "milestone-3", 
          title: "Security Audit", 
          status: "completed", 
          dueDate: "2024-06-01", 
          progress: 100,
          description: "Comprehensive security audit by third-party auditors",
          definitionOfDone: "Audit report published, all critical vulnerabilities fixed, security recommendations implemented",
          isGrantMilestone: true,
          dependencies: ["milestone-2"],
          links: {
            auditReport: "https://audits.omnibridge.near.org/report-2024-06",
            docs: "https://docs.omnibridge.near.org/security"
          }
        },
        { 
          id: "milestone-4", 
          title: "Testnet Launch", 
          status: "completed", 
          dueDate: "2024-07-01", 
          progress: 100,
          description: "Full testnet deployment with user interface",
          definitionOfDone: "Testnet operational, UI deployed, community testing completed with feedback incorporated",
          isGrantMilestone: false,
          dependencies: ["milestone-3"],
          links: {
            testnet: "https://testnet.omnibridge.near.org",
            examples: "https://examples.omnibridge.near.org"
          }
        },
        { 
          id: "milestone-5", 
          title: "Mainnet Beta", 
          status: "in-progress", 
          dueDate: "2024-08-15", 
          progress: 75,
          description: "Limited mainnet release for early adopters",
          definitionOfDone: "Mainnet contracts deployed, beta testing program launched, initial user onboarding completed",
          isGrantMilestone: true,
          dependencies: ["milestone-4"],
          links: {
            github: "https://github.com/omnibridge/mainnet-beta"
          }
        },
        { 
          id: "milestone-6", 
          title: "Full Mainnet Launch", 
          status: "pending", 
          dueDate: "2024-09-30", 
          progress: 0,
          description: "Public mainnet launch with full feature set",
          definitionOfDone: "Full mainnet deployment, marketing campaign executed, user documentation complete",
          isGrantMilestone: true,
          dependencies: ["milestone-5"],
          links: {}
        }
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

  const project = projects.find(p => p.id === projectId) || mockProjects.find(p => p.id === projectId);
  const allProjects = projects.length > 0 ? projects : mockProjects;
  const initialTab = searchParams.get('tab') || 'overview';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f2f1e9] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#f2f1e9] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-semibold text-black mb-4">Project Not Found</h1>
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
      <header className="bg-white border-b border-black/10 px-4 md:px-6 py-4 md:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 space-y-3 md:space-y-0">
            <Link to="/">
              <Button variant="ghost" className="font-medium hover:bg-black/5 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="text-center lg:text-right bg-[#00ec97]/5 p-4 rounded-lg border border-[#00ec97]/20">
              <div className="text-2xl md:text-3xl font-semibold text-[#00ec97] mb-1">{project.progress}%</div>
              <div className="text-sm text-black/60 font-medium">Complete</div>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-start justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-semibold text-black mb-3">{project.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mb-3">
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
              <p className="text-black/70 font-medium max-w-3xl leading-relaxed mb-4">{project.description}</p>
              
              {/* Social Links - Now underneath description */}
              <div className="flex flex-wrap items-center gap-3">
                {project.website && (
                  <a 
                    href={project.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-sm text-black/70 hover:text-black transition-colors hover:scale-105"
                  >
                    <Globe className="h-4 w-4" />
                    <span>Website</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {project.docs && (
                  <a 
                    href={project.docs} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-sm text-black/70 hover:text-black transition-colors hover:scale-105"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Docs</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {project.githubRepo && (
                  <a 
                    href={project.githubRepo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-sm text-black/70 hover:text-black transition-colors hover:scale-105"
                  >
                    <Github className="h-4 w-4" />
                    <span>GitHub</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {project.twitter && (
                  <a 
                    href={project.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-sm text-black/70 hover:text-black transition-colors hover:scale-105"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Twitter</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {project.discord && (
                  <a 
                    href={project.discord} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-sm text-black/70 hover:text-black transition-colors hover:scale-105"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Discord</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Tabs defaultValue={initialTab} className="space-y-6 md:space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-[500px] bg-white border border-black/10">
            <TabsTrigger value="overview" className="font-medium data-[state=active]:bg-[#00ec97] data-[state=active]:text-black text-xs md:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="milestones" className="font-medium data-[state=active]:bg-[#00ec97] data-[state=active]:text-black text-xs md:text-sm">Milestones</TabsTrigger>
            <TabsTrigger value="team" className="font-medium data-[state=active]:bg-[#00ec97] data-[state=active]:text-black text-xs md:text-sm">Team</TabsTrigger>
            <TabsTrigger value="updates" className="font-medium data-[state=active]:bg-[#00ec97] data-[state=active]:text-black text-xs md:text-sm">Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Progress Overview */}
              <Card className="bg-white border-black/10 shadow-sm hover:shadow-md transition-shadow">
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
              <Card className="bg-white border-black/10 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-black">Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 text-sm">
                    <Users className="h-4 w-4 text-black/60" />
                    <div>
                      <div className="font-semibold text-black mb-2">Core Team</div>
                      <div className="space-y-2">
                        {project.team.map((member, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="text-black/70 font-medium">
                              {typeof member === 'string' ? member : member.name}
                            </div>
                            {typeof member === 'object' && (member.github || member.twitter) && (
                              <div className="flex space-x-1">
                                {member.github && (
                                  <a 
                                    href={member.github} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-1 hover:bg-black/5 rounded transition-colors"
                                  >
                                    <Github className="w-3 h-3 text-black/60" />
                                  </a>
                                )}
                                {member.twitter && (
                                  <a 
                                    href={member.twitter} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-1 hover:bg-black/5 rounded transition-colors"
                                  >
                                    <MessageCircle className="w-3 h-3 text-black/60" />
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dependencies */}
              <Card className="bg-white border-black/10 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-black">Dependencies</CardTitle>
                </CardHeader>
                <CardContent>
                  {project.dependencies && project.dependencies.length > 0 ? (
                    <div className="flex items-start space-x-3 text-sm">
                      <GitBranch className="h-4 w-4 text-black/60 mt-0.5" />
                      <div className="space-y-2">
                        {project.dependencies.map((dep, index) => (
                          <Badge key={index} variant="outline" className="block w-fit font-medium border-[#9797ff]/30 text-black bg-[#9797ff]/5 hover:bg-[#9797ff]/10 transition-colors">
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
              <Card className="bg-white border-black/10 shadow-sm hover:shadow-md transition-shadow">
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
                            <div key={index} className="flex justify-between items-center text-sm">
                              <span className="font-medium text-black">{round.round}</span>
                              <span className="text-black/70">{round.amount}</span>
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
              <Card className="bg-white border-black/10 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-black">Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.team.map((member, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-black/5 rounded-lg hover:bg-black/10 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[#00ec97]/20 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-black">
                              {typeof member === 'string' ? member.charAt(0) : member.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-black">
                              {typeof member === 'string' ? member : member.name}
                            </div>
                            <div className="text-sm text-black/60">
                              {typeof member === 'object' && member.role ? member.role : 'Core Developer'}
                            </div>
                          </div>
                        </div>
                        {typeof member === 'object' && (member.github || member.twitter) && (
                          <div className="flex space-x-2">
                            {member.github && (
                              <a 
                                href={member.github} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-black/10 rounded-full transition-colors"
                              >
                                <Github className="w-4 h-4 text-black/60" />
                              </a>
                            )}
                            {member.twitter && (
                              <a 
                                href={member.twitter} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-black/10 rounded-full transition-colors"
                              >
                                <MessageCircle className="w-4 h-4 text-black/60" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-black/10 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-black">Project Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.website && (
                      <a href={project.website} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center space-x-3 p-3 bg-black/5 rounded-lg hover:bg-black/10 transition-all hover:scale-[1.02]">
                        <Globe className="h-5 w-5 text-black/60" />
                        <div className="flex-1">
                          <div className="font-medium text-black">Website</div>
                          <div className="text-sm text-black/60">Official project website</div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-black/40" />
                      </a>
                    )}
                    {project.githubRepo && (
                      <a href={project.githubRepo} target="_blank" rel="noopener noreferrer"
                         className="flex items-center space-x-3 p-3 bg-black/5 rounded-lg hover:bg-black/10 transition-all hover:scale-[1.02]">
                        <Github className="h-5 w-5 text-black/60" />
                        <div className="flex-1">
                          <div className="font-medium text-black">GitHub Repository</div>
                          <div className="text-sm text-black/60">Source code and documentation</div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-black/40" />
                      </a>
                    )}
                    {project.twitter && (
                      <a href={project.twitter} target="_blank" rel="noopener noreferrer"
                         className="flex items-center space-x-3 p-3 bg-black/5 rounded-lg hover:bg-black/10 transition-all hover:scale-[1.02]">
                        <MessageCircle className="h-5 w-5 text-black/60" />
                        <div className="flex-1">
                          <div className="font-medium text-black">Twitter</div>
                          <div className="text-sm text-black/60">Follow for updates</div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-black/40" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="updates">
            <Card className="bg-white border-black/10 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-black">Recent Updates</CardTitle>
              </CardHeader>
              <CardContent>
                {project.recentUpdates && project.recentUpdates.length > 0 ? (
                  <div className="space-y-4">
                    {project.recentUpdates.map((update, index) => (
                      <div key={index} className="border-l-2 border-[#00ec97] pl-4 pb-4 hover:bg-black/5 p-3 rounded-r-lg transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 space-y-1 md:space-y-0">
                          <h4 className="font-semibold text-black">{update.title}</h4>
                          <span className="text-sm text-black/60 font-medium">{formatDate(update.date)}</span>
                        </div>
                        <p className="text-black/70 font-medium leading-relaxed">{update.description}</p>
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
