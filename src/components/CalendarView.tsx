import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, List, RefreshCw } from 'lucide-react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils";
import { useIsMobile } from '@/hooks/use-mobile';

interface CalendarViewProps {
  projects: any[];
}

export const CalendarView = ({ projects }: CalendarViewProps) => {
  const [viewMode, setViewMode] = useState<'calendar' | 'condensed'>('condensed'); // Changed default to list view
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedMilestones, setSelectedMilestones] = useState<any[]>([]);
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [timeRangeFilter, setTimeRangeFilter] = useState<string>('all');
  const [availableProjects, setAvailableProjects] = useState<string[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    const projectNames = projects.map(project => project.name);
    setAvailableProjects(projectNames);
  }, [projects]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isPastDue = (dateString: string) => {
    const dueDate = new Date(dateString);
    const now = new Date();
    return dueDate < now;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-[#00ec97]/10 text-black border-[#00ec97]/30';
      case 'delayed':
        return 'bg-[#ff7966]/10 text-black border-[#ff7966]/30';
      case 'in-progress':
        return 'bg-[#9797ff]/10 text-black border-[#9797ff]/30';
      case 'pending':
        return 'bg-black/10 text-black border-black/30';
      default:
        return 'bg-black/10 text-black border-black/30';
    }
  };

  const getMilestonesForDate = (date: Date) => {
    if (!date) return [];

    const formattedDate = date.toISOString().split('T')[0];
    return getFilteredMilestones().filter(milestone => milestone.dueDate.split('T')[0] === formattedDate);
  };

  const getFilteredMilestones = () => {
    let filtered = projects.flatMap(project => {
      return project.milestones.map(milestone => ({
        ...milestone,
        projectName: project.name,
        projectCategory: project.category
      }));
    });

    if (projectFilter !== 'all') {
      filtered = filtered.filter(milestone => milestone.projectName === projectFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(milestone => milestone.status === statusFilter);
    }

    if (timeRangeFilter !== 'all') {
      const now = new Date();
      let startDate: Date | null = null;
      let endDate: Date | null = null;

      switch (timeRangeFilter) {
        case 'this-month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          break;
        case 'next-month':
          startDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);
          break;
        case 'this-quarter': {
          const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
          startDate = new Date(now.getFullYear(), quarterStartMonth, 1);
          endDate = new Date(now.getFullYear(), quarterStartMonth + 3, 0);
          break;
        }
        case 'overdue':
          filtered = filtered.filter(milestone => isPastDue(milestone.dueDate) && milestone.status !== 'completed');
          break;
        default:
          break;
      }

      if (startDate && endDate) {
        filtered = filtered.filter(milestone => {
          const milestoneDate = new Date(milestone.dueDate);
          return milestoneDate >= startDate! && milestoneDate <= endDate!;
        });
      }
    }

    return filtered;
  };

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <Card className="bg-white border-black/10 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-black flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Milestone Calendar</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* View Mode Toggle - Mobile responsive */}
              {isMobile ? (
                <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'calendar' | 'condensed')} className="w-full">
                  <ToggleGroupItem value="calendar" className="flex-1 data-[state=on]:bg-[#00ec97] data-[state=on]:text-black">
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendar
                  </ToggleGroupItem>
                  <ToggleGroupItem value="condensed" className="flex-1 data-[state=on]:bg-[#00ec97] data-[state=on]:text-black">
                    <List className="h-4 w-4 mr-2" />
                    List
                  </ToggleGroupItem>
                </ToggleGroup>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'calendar' ? 'default' : 'outline'}
                    onClick={() => setViewMode('calendar')}
                    className="font-medium"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendar View
                  </Button>
                  <Button
                    variant={viewMode === 'condensed' ? 'default' : 'outline'}
                    onClick={() => setViewMode('condensed')}
                    className="font-medium"
                  >
                    <List className="h-4 w-4 mr-2" />
                    List View
                  </Button>
                </div>
              )}
            </div>

            {/* Filters - Mobile Responsive */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-black">Filters:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-medium text-xs h-8 px-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  {!isMobile && <span className="ml-2">Refresh</span>}
                </Button>
              </div>
              
              {/* Mobile: 2 columns, Desktop: 3 columns */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue placeholder="Project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {availableProjects.map((project) => (
                      <SelectItem key={project} value={project}>{project}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={timeRangeFilter} onValueChange={setTimeRangeFilter}>
                  <SelectTrigger className="text-xs h-9 col-span-2 lg:col-span-1">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="next-month">Next Month</SelectItem>
                    <SelectItem value="this-quarter">This Quarter</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Results count */}
              <div className="flex items-center text-sm text-black/60 font-medium">
                <span>{getFilteredMilestones().length} milestones</span>
              </div>
            </div>
          </div>

          {viewMode === 'calendar' ? (
            <div className="space-y-6">
              {/* Calendar Component */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-[#f2f1e9] rounded-lg p-4">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        if (date) {
                          const milestonesForDate = getMilestonesForDate(date);
                          setSelectedMilestones(milestonesForDate);
                        }
                      }}
                      className="rounded-md border-0"
                      modifiers={{
                        hasMilestone: (date) => getMilestonesForDate(date).length > 0
                      }}
                      modifiersStyles={{
                        hasMilestone: {
                          backgroundColor: '#00ec97',
                          color: 'white',
                          fontWeight: 'bold'
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Selected Date Milestones */}
                <div className="space-y-4">
                  <div className="bg-[#f2f1e9] rounded-lg p-4">
                    <h3 className="font-semibold text-black mb-3">
                      {selectedDate ? formatDate(selectedDate.toISOString()) : 'Select a date'}
                    </h3>
                    {selectedMilestones.length > 0 ? (
                      <div className="space-y-3">
                        {selectedMilestones.map((milestone, index) => (
                          <div key={index} className="bg-white rounded-lg p-3 border border-black/10">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge
                                variant="outline"
                                className={`${getStatusColor(milestone.status)} font-medium`}
                              >
                                {milestone.status}
                              </Badge>
                              <span className="text-xs text-black/60 font-medium">{milestone.projectName}</span>
                            </div>
                            <h4 className="font-medium text-black text-sm mb-1">{milestone.title}</h4>
                            <p className="text-xs text-black/60">{milestone.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-black/60 font-medium">No milestones for this date</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Condensed Timeline View */}
              <div className="space-y-4">
                {getFilteredMilestones().length > 0 ? (
                  getFilteredMilestones()
                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .map((milestone, index) => (
                      <div key={index} className="bg-[#f2f1e9] rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                              <h3 className="font-semibold text-black">{milestone.title}</h3>
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant="outline"
                                  className={`${getStatusColor(milestone.status)} font-medium`}
                                >
                                  {milestone.status}
                                </Badge>
                                <Badge variant="outline" className="bg-white text-black border-black/20 font-medium">
                                  {milestone.projectName}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-black/70 mb-2">{milestone.description}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-black/60">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span className="font-medium">Due: {formatDate(milestone.dueDate)}</span>
                                {isPastDue(milestone.dueDate) && milestone.status !== 'completed' && (
                                  <Badge variant="outline" className="bg-[#ff7966]/10 text-black border-[#ff7966]/30 font-medium">
                                    Overdue
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">Category: {milestone.projectCategory}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="bg-[#f2f1e9] rounded-lg p-8 text-center">
                    <Calendar className="h-12 w-12 text-black/40 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-black mb-2">No Milestones Found</h3>
                    <p className="text-black/60 font-medium">Try adjusting your filters to see more milestones.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
