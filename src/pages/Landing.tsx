
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Calendar, 
  GitBranch, 
  Clock, 
  Target, 
  Users, 
  TrendingUp, 
  FileText,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Project Analytics",
      description: "Comprehensive analytics dashboard with project health metrics, completion rates, and performance insights."
    },
    {
      icon: Calendar,
      title: "Milestone Tracking",
      description: "Visual timeline and calendar views to track project milestones, deadlines, and progress updates."
    },
    {
      icon: GitBranch,
      title: "Dependency Management",
      description: "Interactive dependency graphs to visualize project relationships and identify potential bottlenecks."
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Live project status updates with filtering and search capabilities across all milestones."
    },
    {
      icon: Target,
      title: "Status Monitoring",
      description: "Track project statuses: On Track, At Risk, Delayed, and Completed with visual indicators."
    },
    {
      icon: FileText,
      title: "API Integration",
      description: "RESTful API endpoints for third-party integrations with comprehensive documentation."
    }
  ];

  const stats = [
    { label: "Active Projects", value: "25+", icon: Target },
    { label: "Milestones Tracked", value: "150+", icon: CheckCircle },
    { label: "API Endpoints", value: "12", icon: FileText },
    { label: "Real-time Updates", value: "24/7", icon: TrendingUp }
  ];

  const statusExamples = [
    { label: "On Track", color: "bg-[#00ec97]", icon: CheckCircle },
    { label: "At Risk", color: "bg-[#ff7966]", icon: AlertCircle },
    { label: "Delayed", color: "bg-[#ff4444]", icon: XCircle },
    { label: "Completed", color: "bg-[#17d9d4]", icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">ProjectHub</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-primary transition">
                Dashboard
              </Link>
              <Link to="/api" className="text-gray-600 hover:text-primary transition">
                API Docs
              </Link>
              <Button asChild>
                <Link to="/">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4">
            Project Management Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Streamline Your
            <span className="text-primary"> Project Management</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Comprehensive project tracking with real-time analytics, milestone management, 
            and powerful API integrations for seamless workflow automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/">
                View Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link to="/api">
                Explore API
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage projects effectively, from tracking to analytics
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Project Status Demo */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Project Status Tracking
            </h2>
            <p className="text-xl text-gray-600">
              Monitor project health with intuitive status indicators
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statusExamples.map((status, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-full ${status.color} flex items-center justify-center mx-auto mb-3`}>
                    <status.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="font-semibold text-gray-900">{status.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary to-blue-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of teams already using ProjectHub for better project management
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                <Link to="/">
                  Start Managing Projects
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary">
                <Link to="/api">
                  View API Documentation
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Target className="h-6 w-6" />
                <span className="text-xl font-bold">ProjectHub</span>
              </div>
              <p className="text-gray-400">
                Streamline your project management with powerful analytics and real-time tracking.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white">Analytics</Link></li>
                <li><Link to="/" className="hover:text-white">Milestones</Link></li>
                <li><Link to="/" className="hover:text-white">Dependencies</Link></li>
                <li><Link to="/" className="hover:text-white">Status Tracking</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Developer</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/api" className="hover:text-white">API Documentation</Link></li>
                <li><Link to="/api" className="hover:text-white">Integration Guide</Link></li>
                <li><Link to="/api" className="hover:text-white">Rate Limits</Link></li>
                <li><Link to="/api" className="hover:text-white">Authentication</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Status Page</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ProjectHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
