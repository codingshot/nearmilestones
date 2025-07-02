
import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';

interface MilestoneFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  projectFilter: string;
  onProjectFilterChange: (project: string) => void;
  availableProjects: string[];
}

export const MilestoneFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  projectFilter,
  onProjectFilterChange,
  availableProjects
}: MilestoneFiltersProps) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'pending', label: 'Pending' },
    { value: 'delayed', label: 'Delayed' }
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/40" />
        <Input
          placeholder="Search milestones..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white border-black/10 focus:border-[#17d9d4] focus:ring-[#17d9d4]/20"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Status Filter */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm font-semibold text-black">
            <Filter className="h-4 w-4" />
            <span>Status</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <Badge
                key={option.value}
                variant={statusFilter === option.value ? "default" : "outline"}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  statusFilter === option.value 
                    ? 'bg-[#17d9d4] text-black border-[#17d9d4]' 
                    : 'border-black/20 text-black hover:bg-black/5'
                }`}
                onClick={() => onStatusFilterChange(option.value)}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Project Filter - only show if multiple projects */}
        {availableProjects.length > 1 && (
          <div className="space-y-2">
            <div className="text-sm font-semibold text-black">Project</div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={projectFilter === 'all' ? "default" : "outline"}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  projectFilter === 'all' 
                    ? 'bg-[#00ec97] text-black border-[#00ec97]' 
                    : 'border-black/20 text-black hover:bg-black/5'
                }`}
                onClick={() => onProjectFilterChange('all')}
              >
                All Projects
              </Badge>
              {availableProjects.map((project) => (
                <Badge
                  key={project}
                  variant={projectFilter === project ? "default" : "outline"}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    projectFilter === project 
                      ? 'bg-[#00ec97] text-black border-[#00ec97]' 
                      : 'border-black/20 text-black hover:bg-black/5'
                  }`}
                  onClick={() => onProjectFilterChange(project)}
                >
                  {project}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
