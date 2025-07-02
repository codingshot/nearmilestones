import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { GitBranch, Clock, User, Hash, ExternalLink, RefreshCw } from 'lucide-react';
import { ChangelogService, ChangelogEntry, Change } from '@/services/changelogService';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const Updates = () => {
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const changelogService = ChangelogService.getInstance();

  const fetchChangelog = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await changelogService.getChangelog();
      setChangelog(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch changelog');
      console.error('Error fetching changelog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChangelog();
  }, []);

  const getChangeTypeColor = (type: Change['type']) => {
    switch (type) {
      case 'milestone_completed':
        return 'bg-[#00ec97]/10 text-black border-[#00ec97]/30';
      case 'milestone_delayed':
        return 'bg-[#ff7966]/10 text-black border-[#ff7966]/30';
      case 'project_added':
        return 'bg-[#17d9d4]/10 text-black border-[#17d9d4]/30';
      case 'updated':
        return 'bg-[#9797ff]/10 text-black border-[#9797ff]/30';
      case 'added':
        return 'bg-[#00ec97]/10 text-black border-[#00ec97]/30';
      case 'removed':
        return 'bg-black/10 text-black border-black/30';
      default:
        return 'bg-black/10 text-black border-black/30';
    }
  };

  const getChangeTypeIcon = (type: Change['type']) => {
    switch (type) {
      case 'milestone_completed':
        return '✅';
      case 'milestone_delayed':
        return '⚠️';
      case 'project_added':
        return '🆕';
      case 'updated':
        return '📝';
      case 'added':
        return '➕';
      case 'removed':
        return '➖';
      default:
        return '📄';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f2f1e9] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-[#f2f1e9]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="text-4xl">🚀</div>
            <h1 className="text-4xl font-bold text-black">NEAR Ecosystem Product Updates</h1>
          </div>
          <p className="text-xl text-black/60 font-medium max-w-2xl mx-auto">
            Stay up to date with the latest changes, milestone completions, and project updates in the NEAR ecosystem
          </p>
          <div className="flex justify-center mt-6">
            <Button
              onClick={fetchChangelog}
              variant="outline"
              className="font-medium border-black/20 hover:border-[#00ec97]"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Updates
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="bg-[#ff7966]/10 border-[#ff7966]/30 mb-8">
            <CardContent className="p-6">
              <div className="text-center text-black">
                <p className="font-medium">Error loading updates: {error}</p>
                <Button
                  onClick={fetchChangelog}
                  variant="outline"
                  className="mt-4 font-medium"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Changelog Entries */}
        <div className="space-y-8">
          {changelog.length > 0 ? (
            changelog.map((entry, index) => (
              <Card key={entry.id} className="bg-white border-black/10 shadow-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="bg-[#00ec97]/10 text-black border-[#00ec97]/30 font-medium">
                          v{entry.version}
                        </Badge>
                        <div className="flex items-center space-x-2 text-sm text-black/60">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">{formatDate(entry.date)}</span>
                        </div>
                      </div>
                      
                      {entry.commitHash && (
                        <div className="flex items-center space-x-4 text-sm text-black/60">
                          <div className="flex items-center space-x-2">
                            <Hash className="h-4 w-4" />
                            <span className="font-mono font-medium">{entry.commitHash}</span>
                          </div>
                          {entry.author && (
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span className="font-medium">{entry.author}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {entry.commitMessage && (
                        <p className="text-sm text-black/70 font-medium italic">
                          "{entry.commitMessage}"
                        </p>
                      )}
                    </div>
                    
                    <Button
                      onClick={() => window.open('https://github.com/codingshot/nearmilestones/commits', '_blank')}
                      variant="ghost"
                      size="sm"
                      className="font-medium"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {entry.changes.map((change, changeIndex) => (
                      <div key={changeIndex} className="flex items-start space-x-4 p-4 bg-[#f2f1e9] rounded-lg">
                        <div className="text-xl flex-shrink-0">
                          {getChangeTypeIcon(change.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-black">{change.title}</h3>
                            <Badge 
                              variant="outline" 
                              className={`${getChangeTypeColor(change.type)} font-medium`}
                            >
                              {change.type.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-black/70 font-medium">{change.description}</p>
                          
                          {change.projectId && (
                            <div className="mt-2 flex items-center space-x-2">
                              <span className="text-sm text-black/60 font-medium">Project:</span>
                              <Badge variant="outline" className="bg-white text-black border-black/20 font-medium">
                                {change.projectId}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-white border-black/10 shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold text-black mb-2">No Updates Yet</h3>
                <p className="text-black/60 font-medium">
                  Check back later for the latest updates and changes to NEAR ecosystem projects.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Stats Section */}
        <Card className="bg-white border-black/10 shadow-sm mt-12">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-black">Update Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#f2f1e9] rounded-lg p-4 text-center">
                <div className="text-2xl font-semibold text-black">{changelog.length}</div>
                <div className="text-sm text-black/60 font-medium">Total Updates</div>
              </div>
              <div className="bg-[#f2f1e9] rounded-lg p-4 text-center">
                <div className="text-2xl font-semibold text-black">
                  {changelog.reduce((acc, entry) => acc + entry.changes.filter(c => c.type === 'milestone_completed').length, 0)}
                </div>
                <div className="text-sm text-black/60 font-medium">Milestones Completed</div>
              </div>
              <div className="bg-[#f2f1e9] rounded-lg p-4 text-center">
                <div className="text-2xl font-semibold text-black">
                  {changelog.reduce((acc, entry) => acc + entry.changes.filter(c => c.type === 'project_added').length, 0)}
                </div>
                <div className="text-sm text-black/60 font-medium">Projects Added</div>
              </div>
              <div className="bg-[#f2f1e9] rounded-lg p-4 text-center">
                <div className="text-2xl font-semibold text-black">
                  {changelog.reduce((acc, entry) => acc + entry.changes.length, 0)}
                </div>
                <div className="text-sm text-black/60 font-medium">Total Changes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Updates;
