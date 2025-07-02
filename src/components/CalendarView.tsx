
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Clock, AlertTriangle, List, Grid3X3 } from 'lucide-react';
import { Link } from 'react-router-dom';

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
}

interface CalendarViewProps {
  projects: Project[];
}

export const CalendarView = ({ projects }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedMilestones, setSelectedMilestones] = useState<Project[]>([]);
  const [viewMode, setViewMode] = useState<'calendar' | 'condensed'>('calendar');

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
        return 'bg-[#00ec97]/10 text-black border-[#00ec97]/30';
      case 'at-risk':
        return 'bg-[#ff7966]/10 text-black border-[#ff7966]/30';
      case 'delayed':
        return 'bg-[#ff7966]/20 text-black border-[#ff7966]/40';
      default:
        return 'bg-black/5 text-black border-black/20';
    }
  };

  const isOverdue = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  // Get milestones for selected date
  const getMilestonesForDate = (date: Date) => {
    const dateStr = date.toDateString();
    return projects.filter(project => 
      new Date(project.dueDate).toDateString() === dateStr
    );
  };

  // Get dates that have milestones
  const getDatesWithMilestones = () => {
    return projects.map(project => new Date(project.dueDate));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const milestones = getMilestonesForDate(date);
      setSelectedMilestones(milestones);
    }
  };

  const milestoneDates = getDatesWithMilestones();

  // Group projects by month for condensed view
  const groupProjectsByMonth = () => {
    const groups: { [key: string]: Project[] } = {};
    projects.forEach(project => {
      const date = new Date(project.dueDate);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(project);
    });
    return groups;
  };

  const monthlyGroups = groupProjectsByMonth();

  if (viewMode === 'condensed') {
    return (
      <div className="space-y-6">
        {/* View Toggle */}
        <Card className="bg-white border-black/10 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-3 text-xl font-semibold text-black">
                <CalendarIcon className="h-5 w-5" />
                <span>Milestone Calendar - Condensed View</span>
              </CardTitle>
              <div className="flex gap-2">
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
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(monthlyGroups)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([monthKey, monthProjects]) => {
                  const [year, month] = monthKey.split('-');
                  const monthName = new Date(parseInt(year), parseInt(month)).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  });
                  
                  return (
                    <div key={monthKey} className="space-y-3">
                      <h3 className="text-lg font-semibold text-black border-b border-black/10 pb-2">
                        {monthName}
                      </h3>
                      <div className="grid gap-3">
                        {monthProjects
                          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                          .map((project) => (
                            <div key={project.id} className="flex items-center justify-between p-3 bg-black/5 rounded-lg hover:bg-black/10 transition-colors">
                              <div className="flex items-center space-x-4">
                                <div className="text-sm text-black/60 font-medium min-w-[60px]">
                                  {new Date(project.dueDate).getDate()}
                                </div>
                                <div>
                                  <Link to={`/project/${project.id}`} className="font-semibold text-black hover:text-[#00ec97] transition-colors">
                                    {project.name}
                                  </Link>
                                  <div className="text-sm text-black/70 font-medium">{project.nextMilestone}</div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <Badge variant="outline" className="text-xs font-medium border-black/20 text-black">
                                  {project.category}
                                </Badge>
                                <Badge className={`text-xs font-medium ${getStatusColor(project.status)}`}>
                                  {project.status.replace('-', ' ')}
                                </Badge>
                                {isOverdue(project.dueDate) && (
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2 bg-white border-black/10 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-3 text-xl font-semibold text-black">
                <CalendarIcon className="h-5 w-5" />
                <span>Milestone Calendar</span>
              </CardTitle>
              <div className="flex gap-2">
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
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-md border border-black/10 p-3 pointer-events-auto"
              modifiers={{
                milestone: milestoneDates,
                overdue: projects
                  .filter(p => isOverdue(p.dueDate))
                  .map(p => new Date(p.dueDate))
              }}
              modifiersStyles={{
                milestone: { 
                  backgroundColor: 'rgba(0, 236, 151, 0.1)', 
                  color: 'black',
                  fontWeight: 'bold',
                  border: '2px solid rgba(0, 236, 151, 0.3)',
                  borderRadius: '6px'
                },
                overdue: {
                  backgroundColor: 'rgba(255, 121, 102, 0.2)',
                  color: 'black',
                  fontWeight: 'bold',
                  border: '2px solid rgba(255, 121, 102, 0.4)',
                  borderRadius: '6px'
                }
              }}
            />
            
            {/* Milestone boxes for selected date */}
            {selectedDate && getMilestonesForDate(selectedDate).length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold text-black text-sm">
                  Milestones on {formatDate(selectedDate.toISOString())}:
                </h4>
                {getMilestonesForDate(selectedDate).map((project) => (
                  <div key={project.id} className="p-2 bg-[#00ec97]/10 rounded border-l-4 border-[#00ec97]">
                    <div className="flex items-center justify-between">
                      <Link to={`/project/${project.id}`} className="font-medium text-black hover:text-[#00ec97] transition-colors text-sm">
                        {project.name}
                      </Link>
                      <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                        {project.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className="text-xs text-black/70 mt-1">{project.nextMilestone}</div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4 flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#00ec97]/20 rounded border border-[#00ec97]/30"></div>
                <span className="text-black/70 font-medium">Has Milestones</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#ff7966]/20 rounded border border-[#ff7966]/40"></div>
                <span className="text-black/70 font-medium">Overdue</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Info */}
        <Card className="bg-white border-black/10 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-black">
              {selectedDate ? formatDate(selectedDate.toISOString()) : 'Select a Date'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMilestones.length > 0 ? (
              <div className="space-y-3">
                <div className="text-sm font-semibold text-black mb-3">
                  {selectedMilestones.length} Milestone{selectedMilestones.length > 1 ? 's' : ''}
                </div>
                {selectedMilestones.map((project) => (
                  <div key={project.id} className="p-3 bg-black/5 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <Link to={`/project/${project.id}`} className="font-medium text-black hover:text-[#00ec97] transition-colors">
                        {project.name}
                      </Link>
                      <Badge className={`text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className="text-sm text-black/70 font-medium mb-2">{project.nextMilestone}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-black/60 font-medium">{project.category}</span>
                      {isOverdue(project.dueDate) && (
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
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Milestones Timeline */}
      <Card className="bg-white border-black/10 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-black">Upcoming Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects
              .filter(p => new Date(p.dueDate) >= new Date())
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .slice(0, 5)
              .map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 bg-black/5 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-black/60 font-medium min-w-[80px]">
                      {formatDate(project.dueDate)}
                    </div>
                    <div>
                      <Link to={`/project/${project.id}`} className="font-semibold text-black hover:text-[#00ec97] transition-colors">
                        {project.name}
                      </Link>
                      <div className="text-sm text-black/70 font-medium">{project.nextMilestone}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="text-xs font-medium border-black/20 text-black">
                      {project.category}
                    </Badge>
                    <Badge className={`text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
