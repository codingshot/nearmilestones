import { AnalyticsOverview } from "@/components/AnalyticsOverview";
import { ProjectStatusChart } from "@/components/ProjectStatusChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Project {
  id: string | number;
  name: string;
  description: string;
  progress: number;
  status: "on-track" | "at-risk" | "delayed" | "completed";
  dueDate: string;
}

interface Milestone {
  id: string | number;
  projectId: string | number;
  name: string;
  dueDate: string;
  status: "open" | "in-progress" | "completed" | "blocked";
}

const Index = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Project Phoenix",
      description: "Revamping legacy systems",
      progress: 60,
      status: "on-track",
      dueDate: "2024-05-20",
    },
    {
      id: "2",
      name: "Project Nova",
      description: "Developing a new mobile app",
      progress: 95,
      status: "completed",
      dueDate: "2024-04-15",
    },
    {
      id: "3",
      name: "Project Titan",
      description: "Implementing AI solutions",
      progress: 30,
      status: "at-risk",
      dueDate: "2024-06-10",
    },
    {
      id: "4",
      name: "Project Atlas",
      description: "Upgrading network infrastructure",
      progress: 80,
      status: "on-track",
      dueDate: "2024-05-01",
    },
    {
      id: "5",
      name: "Project Nebula",
      description: "Creating a data warehouse",
      progress: 15,
      status: "delayed",
      dueDate: "2024-07-01",
    },
  ]);

  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: "101",
      projectId: "1",
      name: "Phase 1 Development",
      dueDate: "2024-03-01",
      status: "completed",
    },
    {
      id: "102",
      projectId: "1",
      name: "User Interface Design",
      dueDate: "2024-03-15",
      status: "completed",
    },
    {
      id: "103",
      projectId: "2",
      name: "Backend Architecture Setup",
      dueDate: "2024-02-20",
      status: "completed",
    },
    {
      id: "104",
      projectId: "2",
      name: "Frontend Development",
      dueDate: "2024-03-30",
      status: "completed",
    },
    {
      id: "105",
      projectId: "3",
      name: "Data Collection",
      dueDate: "2024-04-01",
      status: "in-progress",
    },
    {
      id: "106",
      projectId: "3",
      name: "Algorithm Training",
      dueDate: "2024-05-01",
      status: "open",
    },
    {
      id: "107",
      projectId: "4",
      name: "Hardware Installation",
      dueDate: "2024-03-25",
      status: "completed",
    },
    {
      id: "108",
      projectId: "4",
      name: "Network Configuration",
      dueDate: "2024-04-15",
      status: "completed",
    },
    {
      id: "109",
      projectId: "5",
      name: "Data Modeling",
      dueDate: "2024-05-01",
      status: "in-progress",
    },
    {
      id: "110",
      projectId: "5",
      name: "ETL Process Setup",
      dueDate: "2024-06-01",
      status: "open",
    },
  ]);

  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredMilestones = milestones.filter((milestone) => {
    const projectFilter = selectedProject
      ? milestone.projectId === selectedProject
      : true;
    const statusFilter = selectedStatus
      ? milestone.status === selectedStatus
      : true;
    const searchFilter = searchTerm
      ? milestone.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return projectFilter && statusFilter && searchFilter;
  });

  const ApiLink = () => (
    <Button asChild variant="secondary" size="sm">
      <Link to="/api">API Docs</Link>
    </Button>
  );

  const ProjectCard = ({ project }: { project: Project }) => (
    <Card className="bg-white border-black/10 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-black">
          {project.name}
        </CardTitle>
        <CardDescription className="text-black/60">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm font-medium text-black">Progress</div>
        <Progress value={project.progress} className="h-2 mb-2" />
        <div className="flex items-center justify-between text-xs text-black/60">
          <span>{project.status}</span>
          <span>Due: {project.dueDate}</span>
        </div>
      </CardContent>
    </Card>
  );

  const MilestoneFilters = ({
    projects,
    selectedProject,
    onProjectChange,
    selectedStatus,
    onStatusChange,
    searchTerm,
    onSearchChange,
  }: {
    projects: Project[];
    selectedProject: string | null;
    onProjectChange: (projectId: string | null) => void;
    selectedStatus: string | null;
    onStatusChange: (status: string | null) => void;
    searchTerm: string;
    onSearchChange: (searchTerm: string) => void;
  }) => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <Select onValueChange={onProjectChange}>
        <SelectTrigger className="w-full sm:w-52">
          <SelectValue placeholder="Filter by Project" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={null}>All Projects</SelectItem>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id.toString()}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={null}>All Statuses</SelectItem>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="blocked">Blocked</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="text"
        placeholder="Search milestones..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full sm:w-64"
      />
    </div>
  );

  const MilestoneTimeline = ({
    milestones,
  }: {
    milestones: Milestone[];
  }) => (
    <div className="relative">
      {milestones.map((milestone, index) => (
        <div key={milestone.id} className="mb-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
            <div className="flex-1">
              <div className="font-medium text-black">{milestone.name}</div>
              <div className="text-sm text-black/60">
                Due: {milestone.dueDate} - Status: {milestone.status}
              </div>
            </div>
          </div>
          {index < milestones.length - 1 && (
            <div className="absolute left-1 top-6 h-full border-l border-gray-400 ml-1"></div>
          )}
        </div>
      ))}
    </div>
  );

  const MilestoneProgressChart = ({
    projects,
  }: {
    projects: Project[];
  }) => {
    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter(
      (m) => m.status === "completed"
    ).length;
    const progress = Math.round((completedMilestones / totalMilestones) * 100);

    return (
      <Card className="bg-white border-black/10 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-black">
            Milestone Completion
          </CardTitle>
          <CardDescription className="text-black/60">
            Overall progress of all milestones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-black">{progress}%</div>
          <Progress value={progress} className="h-4" />
          <div className="mt-2 text-sm text-black/60">
            {completedMilestones} of {totalMilestones} milestones completed
          </div>
        </CardContent>
      </Card>
    );
  };

  const CalendarView = ({ projects }: { projects: Project[] }) => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
      <Card className="bg-white border-black/10 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-black">
            Project Calendar
          </CardTitle>
          <CardDescription className="text-black/60">
            View project due dates on a calendar
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
          {date ? (
            <p className="text-center text-sm">
              {date ? (
                <span>
                  You selected{" "}
                  {date?.toLocaleDateString() /* TODO: fix this */}
                </span>
              ) : (
                <span>Please select a date.</span>
              )}
            </p>
          ) : (
            ""
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">ProjectHub</h1>
              <Badge variant="outline" className="hidden sm:inline-flex">
                Dashboard
              </Badge>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button asChild variant="outline" size="sm">
                <Link to="/landing">
                  Landing
                </Link>
              </Button>
              <ApiLink />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Analytics Overview */}
        <div className="mb-6 sm:mb-8">
          <AnalyticsOverview projects={projects} />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="projects" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-4 sm:grid-cols-none">
              <TabsTrigger value="projects" className="text-xs sm:text-sm">Projects</TabsTrigger>
              <TabsTrigger value="milestones" className="text-xs sm:text-sm">Milestones</TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
              <TabsTrigger value="calendar" className="text-xs sm:text-sm">Calendar</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="projects" className="space-y-6">
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-6">
            <div className="space-y-4 sm:space-y-6">
              <MilestoneFilters
                projects={projects}
                selectedProject={selectedProject}
                onProjectChange={setSelectedProject}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
              <MilestoneTimeline
                milestones={filteredMilestones}
              />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              <ProjectStatusChart projects={projects} />
              <MilestoneProgressChart projects={projects} />
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <CalendarView projects={projects} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
