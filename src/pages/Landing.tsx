
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GitBranch, 
  Calendar, 
  BarChart3, 
  Users, 
  Zap, 
  Shield, 
  ArrowRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from 'react';

const Landing = () => {
  const [stats, setStats] = useState([
    { value: "0", label: "Active Projects", icon: GitBranch },
    { value: "0", label: "Milestones Tracked", icon: CheckCircle },
    { value: "0%", label: "On-time Delivery", icon: Clock },
    { value: "Real-time", label: "Updates", icon: TrendingUp }
  ]);

  // Fetch real project data
  const { data: projectData } = useQuery({
    queryKey: ['projects-landing'],
    queryFn: async () => {
      const response = await fetch('/data/projects.json');
      if (!response.ok) {
        throw new Error('Failed to fetch project data');
      }
      return response.json();
    },
  });

  // Update stats with real data
  useEffect(() => {
    if (projectData?.projects) {
      const projects = projectData.projects;
      const totalProjects = projects.length;
      const totalMilestones = projects.reduce((acc: number, project: any) => 
        acc + (project.milestones?.length || 0), 0
      );
      const completedMilestones = projects.reduce((acc: number, project: any) => 
        acc + (project.milestones?.filter((m: any) => m.status === 'completed').length || 0), 0
      );
      const onTimeRate = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

      setStats([
        { value: `${totalProjects}`, label: "Active Projects", icon: GitBranch },
        { value: `${totalMilestones}`, label: "Milestones Tracked", icon: CheckCircle },
        { value: `${onTimeRate}%`, label: "Completion Rate", icon: Clock },
        { value: "Real-time", label: "Updates", icon: TrendingUp }
      ]);
    }
  }, [projectData]);

  const features = [
    {
      icon: GitBranch,
      title: "Project Tracking",
      description: "Monitor NEAR ecosystem projects with real-time status updates and progress tracking across all development stages."
    },
    {
      icon: Calendar,
      title: "Milestone Management",
      description: "Track project milestones, deadlines, and deliverables with automated notifications and timeline visualization."
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive analytics with project health metrics, completion rates, and ecosystem-wide performance insights."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Coordinate between teams, track dependencies, and manage cross-project relationships within the NEAR ecosystem."
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Get instant notifications on project status changes, milestone completions, and critical delays."
    },
    {
      icon: Shield,
      title: "GitHub Integration",
      description: "Seamlessly connect with GitHub repositories to automatically sync project data and development progress."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f2f1e9] to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-black/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00ec97] to-[#17d9d4] rounded-lg flex items-center justify-center">
              <GitBranch className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-black">NEAR Milestones</h1>
          </div>
          <Link to="/">
            <Button className="bg-[#00ec97] hover:bg-[#00ec97]/90 text-black font-semibold">
              Launch App
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-[#00ec97]/10 text-[#00ec97] border-[#00ec97]/20 font-semibold px-4 py-2">
            NEAR Protocol Ecosystem
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-black mb-6 leading-tight">
            Track Every
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ec97] to-[#17d9d4]">
              {" "}Milestone
            </span>
          </h1>
          <p className="text-xl text-black/70 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
            Comprehensive project management and milestone tracking for the NEAR Protocol ecosystem. 
            Monitor progress, manage dependencies, and ensure on-time delivery across all ecosystem projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" className="bg-[#00ec97] hover:bg-[#00ec97]/90 text-black font-semibold px-8 py-4 text-lg">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-black/20 text-black hover:bg-black/5 font-semibold px-8 py-4 text-lg">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#00ec97] to-[#17d9d4] rounded-lg mb-4">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-black mb-2">{stat.value}</div>
                <div className="text-black/60 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Carousel */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Powerful Features</h2>
            <p className="text-xl text-black/70 max-w-2xl mx-auto font-medium">
              Everything you need to manage and track NEAR ecosystem projects efficiently
            </p>
          </div>
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {features.map((feature, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <Card className="bg-white border-black/10 shadow-sm hover:shadow-md transition-shadow h-full">
                      <CardHeader>
                        <div className="w-12 h-12 bg-gradient-to-br from-[#00ec97]/10 to-[#17d9d4]/10 rounded-lg flex items-center justify-center mb-4">
                          <feature.icon className="h-6 w-6 text-[#00ec97]" />
                        </div>
                        <CardTitle className="text-xl font-semibold text-black">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-black/70 font-medium leading-relaxed">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Built for NEAR Ecosystem</h2>
            <p className="text-xl text-black/70 max-w-2xl mx-auto font-medium">
              Designed specifically for the unique needs of NEAR Protocol projects and teams
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#00ec97] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">Grant Management</h3>
                  <p className="text-black/70 font-medium">Track grant milestones and deliverables with automated reporting</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#17d9d4] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <AlertTriangle className="h-5 w-5 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">Risk Management</h3>
                  <p className="text-black/70 font-medium">Identify delays and risks early with predictive analytics</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#ff7966] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">Ecosystem Insights</h3>
                  <p className="text-black/70 font-medium">Get comprehensive analytics on ecosystem health and growth</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#00ec97]/5 to-[#17d9d4]/5 rounded-2xl p-8 border border-black/10">
              <div className="text-center">
                <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ec97] to-[#17d9d4] mb-4">
                  {stats[2].value}
                </div>
                <div className="text-xl font-semibold text-black mb-2">Average Project Completion Rate</div>
                <div className="text-black/70 font-medium">Projects using NEAR Milestones deliver successfully</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-black mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-black/70 max-w-2xl mx-auto mb-10 font-medium">
            Join the NEAR ecosystem teams already using Milestones to track their projects
          </p>
          <Link to="/">
            <Button size="lg" className="bg-[#00ec97] hover:bg-[#00ec97]/90 text-black font-semibold px-8 py-4 text-lg">
              Launch NEAR Milestones
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-black/10 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00ec97] to-[#17d9d4] rounded-lg flex items-center justify-center">
              <GitBranch className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-black">NEAR Milestones</span>
          </div>
          <p className="text-black/60 font-medium mb-6">
            Empowering the NEAR Protocol ecosystem with better project management
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link to="/" className="text-black/60 hover:text-[#00ec97] font-medium transition-colors">Dashboard</Link>
            <Link to="/api" className="text-black/60 hover:text-[#00ec97] font-medium transition-colors">API</Link>
            <a href="#" className="text-black/60 hover:text-[#00ec97] font-medium transition-colors">Documentation</a>
            <a href="#" className="text-black/60 hover:text-[#00ec97] font-medium transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
