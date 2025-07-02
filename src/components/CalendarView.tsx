
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Clock, AlertTriangle, List, Grid3X3, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Milestone {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'pending' | 'delayed';
  dueDate: string;
  progress: number;
  description: string;
  definitionOfDone: string;
  isGrantMilestone: boolean;
  dependencies: string[];
}

interface Project {
  id: number | string;
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
  milestones?: Milestone[];
}

interface CalendarViewProps {
  projects: Project[];
}

export const CalendarView = ({ projects }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedMilestones, setSelectedMilestones] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'calendar' | 'condensed'>('condensed');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [timeRangeFilter, setTimeRangeFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');

  // Get all milestones from all projects
  const allMilestones = projects.flatMap(project => 
    (project.milestones || []).map(milestone => ({
      ...milestone,
      projectName: project.name,
      projectId: project.id,
      projectCategory: project.category
    }))
  );

  // Get unique project names for filter
  const availableProjects = [...new Set(projects.map(project => project.name))];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
      case 'completed':
        return 'bg-[#00ec97]/10 text-black border-[#00ec97]/30';
      case 'at-risk':
      case 'in-progress':
        return 'bg-[#ff7966]/10 text-black border-[#ff7966]/30';
      case 'delayed':
        return 'bg-[#ff7966]/20 text-black border-[#ff7966]/40';
      case 'pending':
        return 'bg-black/5 text-black border-black/20';
      default:
        return 'bg-black/5 text-black border-black/20';
    }
  };

  const isOverdue = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  // Filter milestones based on status, time range, and project
  const getFilteredMilestones = () => {
    let filtered = allMilestones;

    // Apply project filter
    if (projectFilter !== 'all') {
      filtered = filtered.filter(m => m.projectName === projectFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'incomplete') {
        filtered = filtered.filter(m => m.status === 'in-progress' || m.status === 'pending');
      } else if (statusFilter === 'overdue') {
        filtered = filtered.filter(m => isOverdue(m.dueDate) && m.status !== 'completed');
      } else {
        filtered = filtered.filter(m => m.status === statusFilter);
      }
    }

    // Apply time range filter
    if (timeRangeFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (timeRangeFilter) {
        case 'this-week':
          const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
          const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
          filtered = filtered.filter(m => {
            const date = new Date(m.dueDate);
            return date >= startOfWeek && date <= endOfWeek;
          });
          break;
        case 'this-month':
          filterDate.setMonth(now.getMonth(), 1);
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          filtered = filtered.filter(m => {
            const date = new Date(m.dueDate);
            return date >= filterDate && date <= endOfMonth;
          });
          break;
        case 'next-month':
          filterDate.setMonth(now.getMonth() + 1, 1);
          const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
          filtered = filtered.filter(m => {
            const date = new Date(m.dueDate);
            return date >= filterDate && date <= endOfNextMonth;
          });
          break;
        case 'past-due':
          filtered = filtered.filter(m => isOverdue(m.dueDate) && m.status !== 'completed');
          break;
      }
    }

    return filtered;
  };

  const filteredMilestones = getFilteredMilestones();

  // Get milestones for selected date
  const getMilestonesForDate = (date: Date) => {
    const dateStr = date.toDateString();
    return filteredMilestones.filter(milestone => 
      new Date(milestone.dueDate).toDateString() === dateStr
    );
  };

  // Get dates that have milestones with counts
  const getDatesWithMilestones = () => {
    const dateMap = new Map();
    filteredMilestones.forEach(milestone => {
      const date = new Date(milestone.dueDate);
      const dateStr = date.toDateString();
      if (!dateMap.has(dateStr)) {
        dateMap.set(dateStr, { date, count: 0 });
      }
      dateMap.get(dateStr).count++;
    });
    return dateMap;
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const milestones = getMilestonesForDate(date);
      setSelectedMilestones(milestones);
    }
  };

  const milestoneDatesMap = getDatesWithMilestones();
  const milestoneDates = Array.from(milestoneDatesMap.values()).map(item => item.date);

  // Group milestones by month for condensed view
  const groupMilestonesByMonth = () => {
    const groups: { [key: string]: any[] } = {};
    filteredMilestones.forEach(milestone => {
      const date = new Date(milestone.dueDate);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(milestone);
    });
    return groups;
  };

  const monthlyGroups = groupMilestonesByMonth();

  if (viewMode === 'condensed') {
    return (
      <div className="space-y-6">
        {/* Filters */}
        <Card className="bg-white border-black/10 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-black/60" />
                <span className="text-sm font-medium text-black">Filters:</span>
              </div>
              <div className="flex flex-col md:flex-row gap-3 flex-1">
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {availableProjects.map((project) => (
                      <SelectItem key={project} value={project}>{project}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="incomplete">Incomplete</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={timeRangeFilter} onValueChange={setTimeRangeFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="next-month">Next Month</SelectItem>
                    <SelectItem value="past-due">Past Due</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('calendar')}
                className="font-medium border-black/20 hover:border-[#00ec97]"
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Calendar View
              </Button>
            </div>
            <div className="mt-3 text-sm text-black/60">
              Showing {filteredMilestones.length} milestones
            </div>
          </CardContent>
        </Card>

        {/* View Toggle */}
        <Card className="bg-white border-black/10 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-xl font-semibold text-black">
              <CalendarIcon className="h-5 w-5" />
              <span>Milestone Calendar - Condensed View</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(monthlyGroups)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([monthKey, monthMilestones]) => {
                  const [year, month] = monthKey.split('-');
                  const monthName = new Date(parseInt(year), parseInt(month)).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  });
                  
                  return (
                    <div key={monthKey} className="space-y-3">
                      <h3 className="text-lg font-semibold text-black border-b border-black/10 pb-2">
                        {monthName} ({monthMilestones.length} milestones)
                      </h3>
                      <div className="grid gap-3">
                        {monthMilestones
                          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                          .map((milestone) => (
                            <div key={milestone.id} className="flex items-center justify-between p-3 bg-black/5 rounded-lg hover:bg-black/10 transition-colors">
                              <div className="flex items-center space-x-4">
                                <div className="text-sm text-black/60 font-medium min-w-[60px]">
                                  {new Date(milestone.dueDate).getDate()}
                                </div>
                                <div>
                                  <Link to={`/project/${milestone.projectId}`} className="font-semibold text-black hover:text-[#00ec97] transition-colors">
                                    {milestone.projectName}
                                  </Link>
                                  <div className="text-sm text-black/70 font-medium">{milestone.title}</div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <Badge variant="outline" className="text-xs font-medium border-black/20 text-black">
                                  {milestone.projectCategory}
                                </Badge>
                                <Badge className={`text-xs font-medium ${getStatusColor(milestone.status)}`}>
                                  {milestone.status.replace('-', ' ')}
                                </Badge>
                                {isOverdue(milestone.dueDate) && milestone.status !== 'completed' && (
                                  <Badge variant="destructive" className="text-xs">
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    Overdue
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-white border-black/10 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-black/60" />
              <span className="text-sm font-medium text-black">Filters:</span>
            </div>
            <div className="flex flex-col md:flex-row gap-3 flex-1">
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {availableProjects.map((project) => (
                    <SelectItem key={project} value={project}>{project}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="incomplete">Incomplete</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Select value={timeRangeFilter} onValueChange={setTimeRangeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="next-month">Next Month</SelectItem>
                  <SelectItem value="past-due">Past Due</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('condensed')}
              className="font-medium border-black/20 hover:border-[#00ec97]"
            >
              <List className="h-4 w-4 mr-2" />
              Condensed View
            </Button>
          </div>
          <div className="mt-3 text-sm text-black/60">
            Showing {filteredMilestones.length} milestones
          </div>
        </CardContent>
      </Card>

      {/* Calendar and Selected Date Info - Single Row */}
      <Card className="bg-white border-black/10 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 text-xl font-semibold text-black">
            <CalendarIcon className="h-5 w-5" />
            <span>Milestone Calendar</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <div>
              <div className="relative">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="rounded-md border border-black/10 p-0 w-full"
                  modifiers={{
                    milestone: milestoneDates,
                    overdue: filteredMilestones
                      .filter(m => isOverdue(m.dueDate) && m.status !== 'completed')
                      .map(m => new Date(m.dueDate)),
                    completed: filteredMilestones
                      .filter(m => m.status === 'completed')
                      .map(m => new Date(m.dueDate)),
                    noMilestone: (date: Date) => !milestoneDatesMap.has(date.toDateString())
                  }}
                  modifiersStyles={{
                    milestone: { 
                      backgroundColor: 'rgba(0, 236, 151, 0.1)', 
                      color: 'black',
                      fontWeight: 'bold',
                      border: '2px solid rgba(0, 236, 151, 0.3)',
                      borderRadius: '6px',
                      position: 'relative'
                    },
                    overdue: {
                      backgroundColor: 'rgba(255, 121, 102, 0.2)',
                      color: 'black',
                      fontWeight: 'bold',
                      border: '2px solid rgba(255, 121, 102, 0.4)',
                      borderRadius: '6px'
                    },
                    completed: {
                      backgroundColor: 'rgba(0, 236, 151, 0.2)',
                      color: 'black',
                      fontWeight: 'bold',
                      border: '2px solid rgba(0, 236, 151, 0.5)',
                      borderRadius: '6px'
                    },
                    noMilestone: {
                      color: '#999',
                      opacity: 0.4
                    }
                  }}
                  components={{
                    Day: ({ date, displayMonth, ...props }) => {
                      const dayProps = props as any;
                      const milestoneData = milestoneDatesMap.get(date.toDateString());
                      const count = milestoneData?.count || 0;
                      
                      return (
                        <div className="relative w-full h-full">
                          <button
                            {...dayProps}
                            className={`${dayProps.className} w-9 h-9 relative`}
                          >
                            {date.getDate()}
                            {count > 0 && (
                              <span className="absolute -top-1 -right-1 bg-[#00ec97] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                {count}
                              </span>
                            )}
                          </button>
                        </div>
                      );
                    }
                  }}
                />
              </div>
              
              <div className="mt-4 flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#00ec97]/20 rounded border border-[#00ec97]/30"></div>
                  <span className="text-black/70 font-medium">Has Milestones</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#ff7966]/20 rounded border border-[#ff7966]/40"></div>
                  <span className="text-black/70 font-medium">Overdue</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#00ec97]/30 rounded border border-[#00ec97]/50"></div>
                  <span className="text-black/70 font-medium">Completed</span>
                </div>
              </div>
            </div>

            {/* Selected Date Info */}
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-black">
                  {selectedDate ? formatDate(selectedDate.toISOString()) : 'Select a Date'}
                </h3>
              </div>
              <div className="h-[300px] overflow-y-auto">
                {selectedMilestones.length > 0 ? (
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-black mb-3">
                      {selectedMilestones.length} Milestone{selectedMilestones.length > 1 ? 's' : ''}
                    </div>
                    {selectedMilestones.map((milestone) => (
                      <div key={milestone.id} className="p-3 bg-black/5 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <Link to={`/project/${milestone.projectId}`} className="font-medium text-black hover:text-[#00ec97] transition-colors">
                            {milestone.projectName}
                          </Link>
                          <Badge className={`text-xs font-medium ${getStatusColor(milestone.status)}`}>
                            {milestone.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        <div className="text-sm text-black/70 font-medium mb-2">{milestone.title}</div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-black/60 font-medium">{milestone.projectCategory}</span>
                          {isOverdue(milestone.dueDate) && milestone.status !== 'completed' && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Overdue
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-black/60">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">No milestones on this date</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Milestones Timeline */}
      <Card className="bg-white border-black/10 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-black">Filtered Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMilestones
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .slice(0, 10)
              .map((milestone) => (
                <div key={milestone.id} className="flex items-center justify-between p-4 bg-black/5 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-black/60 font-medium min-w-[80px]">
                      {formatDate(milestone.dueDate)}
                    </div>
                    <div>
                      <Link to={`/project/${milestone.projectId}`} className="font-semibold text-black hover:text-[#00ec97] transition-colors">
                        {milestone.projectName}
                      </Link>
                      <div className="text-sm text-black/70 font-medium">{milestone.title}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="text-xs font-medium border-black/20 text-black">
                      {milestone.projectCategory}
                    </Badge>
                    <Badge className={`text-xs font-medium ${getStatusColor(milestone.status)}`}>
                      {milestone.status.replace('-', ' ')}
                    </Badge>
                    {isOverdue(milestone.dueDate) && milestone.status !== 'completed' && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Overdue
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
