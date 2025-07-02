import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Calendar, Users, SlidersHorizontal, X } from 'lucide-react';
import { ProjectCard } from './ProjectCard';

interface Project {
  id: number;
  name: string;
  category: string;
  status: 'on-track' | 'at-risk' | 'delayed';
  progress: number;
  nextMilestone: string;
  dueDate: string;
  team: string[];
  dependencies: string[];
  fundingType?: string;
  description?: string;
}

interface ProjectExplorerProps {
  projects: Project[];
}

export const ProjectExplorer = ({ projects }: ProjectExplorerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [progressFilter, setProgressFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [fundingFilter, setFundingFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.nextMilestone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.team.some(member => member.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         project.dependencies.some(dep => dep.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    
    const matchesProgress = progressFilter === 'all' || 
      (progressFilter === 'low' && project.progress < 30) ||
      (progressFilter === 'medium' && project.progress >= 30 && project.progress < 70) ||
      (progressFilter === 'high' && project.progress >= 70);
    
    const matchesTeam = !teamFilter || project.team.some(member => 
      member.toLowerCase().includes(teamFilter.toLowerCase())
    );

    const matchesDate = dateFilter === 'all' ||
      (dateFilter === 'overdue' && new Date(project.dueDate) < new Date()) ||
      (dateFilter === 'thisMonth' && new Date(project.dueDate).getMonth() === new Date().getMonth()) ||
      (dateFilter === 'nextMonth' && new Date(project.dueDate).getMonth() === new Date().getMonth() + 1);
    
    const matchesFunding = fundingFilter === 'all' ||
      (fundingFilter === 'grantees' && (project.fundingType === 'grant' || project.category === 'Grantee')) ||
      (fundingFilter === 'infrastructure' && project.fundingType === 'infrastructure') ||
      (fundingFilter === 'sdk' && project.fundingType === 'sdk');
    
    return matchesSearch && matchesStatus && matchesCategory && matchesProgress && matchesTeam && matchesDate && matchesFunding;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'progress':
        comparison = a.progress - b.progress;
        break;
      case 'dueDate':
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      case 'status':
        const statusOrder = { 'delayed': 0, 'at-risk': 1, 'on-track': 2 };
        comparison = statusOrder[a.status] - statusOrder[b.status];
        break;
      default:
        comparison = a.name.localeCompare(b.name);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const categories = [...new Set(projects.map(p => p.category))];
  const allTeamMembers = [...new Set(projects.flatMap(p => p.team))];

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setProgressFilter('all');
    setTeamFilter('');
    setDateFilter('all');
    setFundingFilter('all');
  };

  const activeFiltersCount = [
    searchTerm,
    statusFilter !== 'all' && statusFilter,
    categoryFilter !== 'all' && categoryFilter,
    progressFilter !== 'all' && progressFilter,
    teamFilter,
    dateFilter !== 'all' && dateFilter,
    fundingFilter !== 'all' && fundingFilter
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Advanced Search and Filters */}
      <Card className="bg-white border-black/10 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-xl font-semibold text-black">
            <div className="flex items-center space-x-3">
              <Search className="h-5 w-5" />
              <span>Advanced Project Search</span>
            </div>
            <Badge variant="outline" className="font-medium border-black/20 text-black">
              {activeFiltersCount} Active Filter{activeFiltersCount !== 1 ? 's' : ''}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Search Input */}
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search projects, milestones, team members, or dependencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-black/20 focus:border-[#00ec97] font-medium"
              />
            </div>
          </div>
          
          {/* Filters Row 1 - More compact */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-black/20 font-medium text-xs h-8">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="on-track">On Track</SelectItem>
                <SelectItem value="at-risk">At Risk</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="border-black/20 font-medium text-xs h-8">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={fundingFilter} onValueChange={setFundingFilter}>
              <SelectTrigger className="border-black/20 font-medium text-xs h-8">
                <SelectValue placeholder="Funding" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Funding</SelectItem>
                <SelectItem value="grantees">Grantees</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="sdk">SDK</SelectItem>
              </SelectContent>
            </Select>

            <Select value={progressFilter} onValueChange={setProgressFilter}>
              <SelectTrigger className="border-black/20 font-medium text-xs h-8">
                <SelectValue placeholder="Progress" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Progress</SelectItem>
                <SelectItem value="low">Low (0-30%)</SelectItem>
                <SelectItem value="medium">Medium (30-70%)</SelectItem>
                <SelectItem value="high">High (70%+)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="border-black/20 font-medium text-xs h-8">
                <SelectValue placeholder="Due Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="nextMonth">Next Month</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Team member..."
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="border-black/20 focus:border-[#00ec97] font-medium text-xs h-8"
            />
          </div>

          {/* Controls Row - More compact */}
          <div className="flex flex-wrap items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="border-black/20 font-medium text-xs h-8 w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-1">
              <Button
                variant={sortOrder === 'asc' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortOrder('asc')}
                className={`text-xs h-8 px-2 ${sortOrder === 'asc' ? 'bg-[#00ec97] hover:bg-[#00ec97]/90 text-black font-medium' : 'border-black/20 hover:border-[#00ec97] font-medium'}`}
              >
                A-Z
              </Button>
              <Button
                variant={sortOrder === 'desc' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortOrder('desc')}
                className={`text-xs h-8 px-2 ${sortOrder === 'desc' ? 'bg-[#00ec97] hover:bg-[#00ec97]/90 text-black font-medium' : 'border-black/20 hover:border-[#00ec97] font-medium'}`}
              >
                Z-A
              </Button>
            </div>

            <div className="flex gap-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`text-xs h-8 px-2 ${viewMode === 'grid' ? 'bg-[#00ec97] hover:bg-[#00ec97]/90 text-black font-medium' : 'border-black/20 hover:border-[#00ec97] font-medium'}`}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={`text-xs h-8 px-2 ${viewMode === 'list' ? 'bg-[#00ec97] hover:bg-[#00ec97]/90 text-black font-medium' : 'border-black/20 hover:border-[#00ec97] font-medium'}`}
              >
                List
              </Button>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="font-medium hover:bg-black/5 text-xs h-8 px-2 ml-auto"
              >
                <X className="mr-1 h-3 w-3" />
                Clear All
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <p className="text-sm text-black/60 font-medium">
            Showing {sortedProjects.length} of {projects.length} projects
          </p>
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="h-4 w-4 text-black/60" />
            <span className="text-sm text-black/60 font-medium">
              Sorted by {sortBy} ({sortOrder === 'asc' ? 'ascending' : 'descending'})
            </span>
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      <div className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
          : 'space-y-4'
      }>
        {sortedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {sortedProjects.length === 0 && (
        <Card className="bg-white border-black/10 shadow-sm">
          <CardContent className="py-12 text-center">
            <div className="text-black/60">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2 text-black">No projects found</h3>
              <p className="font-medium mb-4">Try adjusting your search terms or filters</p>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="font-medium border-black/20 hover:border-[#00ec97]"
              >
                <X className="mr-2 h-4 w-4" />
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
