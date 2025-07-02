
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GitBranch, ExternalLink, Plus, FileText, RefreshCw } from 'lucide-react';
import { useGitHubData } from '@/hooks/useGitHubData';

export const GitHubIntegration = () => {
  const { projects, issues, loading, error, lastUpdate, refetch, generatePRUrl, generateIssueUrl } = useGitHubData();
  const [showPRForm, setShowPRForm] = useState(false);
  const [prFormData, setPrFormData] = useState({
    projectName: '',
    status: 'on-track',
    nextMilestone: '',
    dueDate: '',
    progress: 0,
    description: ''
  });

  const handlePRSubmit = () => {
    const prUrl = generatePRUrl({
      id: prFormData.projectName.toLowerCase().replace(/\s+/g, '-'),
      name: prFormData.projectName,
      ...prFormData
    });
    window.open(prUrl, '_blank');
    setShowPRForm(false);
  };

  const handleCreateIssue = (projectId: string) => {
    const issueUrl = generateIssueUrl(projectId, {
      title: 'New Milestone',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'open',
      description: 'Milestone created from tracker'
    });
    window.open(issueUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin text-black/60" />
        <span className="ml-2 text-black/60 font-medium">Loading GitHub data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* GitHub Status */}
      <Card className="bg-white border-black/10 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3 text-xl font-semibold text-black">
              <GitBranch className="h-5 w-5" />
              <span>GitHub Integration</span>
            </CardTitle>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-[#00ec97]/10 text-black border-[#00ec97]/30 font-medium">
                Connected
              </Badge>
              <Button
                onClick={refetch}
                variant="outline"
                size="sm"
                className="font-medium border-black/20 hover:border-[#00ec97]"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#f2f1e9] rounded-lg p-4">
              <div className="text-2xl font-semibold text-black">{projects.length}</div>
              <div className="text-sm text-black/60 font-medium">Projects Tracked</div>
            </div>
            <div className="bg-[#f2f1e9] rounded-lg p-4">
              <div className="text-2xl font-semibold text-black">{issues.length}</div>
              <div className="text-sm text-black/60 font-medium">GitHub Issues</div>
            </div>
            <div className="bg-[#f2f1e9] rounded-lg p-4">
              <div className="text-2xl font-semibold text-black">
                {lastUpdate ? new Date(lastUpdate).toLocaleDateString() : 'N/A'}
              </div>
              <div className="text-sm text-black/60 font-medium">Last Updated</div>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-[#ff7966]/10 border border-[#ff7966]/30 rounded-lg">
              <div className="text-sm text-black font-medium">
                Error: {error}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button
          onClick={() => setShowPRForm(true)}
          className="bg-[#00ec97] hover:bg-[#00ec97]/90 text-black font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Propose Data Update
        </Button>
        
        <Button
          onClick={() => window.open('https://github.com/codingshot/nearmilestones/issues/new?template=milestone.md', '_blank')}
          variant="outline"
          className="font-medium border-black/20 hover:border-[#17d9d4]"
        >
          <FileText className="h-4 w-4 mr-2" />
          Create Milestone Issue
        </Button>
        
        <Button
          onClick={() => window.open('https://github.com/codingshot/nearmilestones', '_blank')}
          variant="outline"
          className="font-medium border-black/20 hover:border-[#9797ff]"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View Repository
        </Button>
      </div>

      {/* PR Form Modal */}
      {showPRForm && (
        <Card className="bg-white border-black/10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-black">Propose Project Update</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Project Name</label>
                <Input
                  value={prFormData.projectName}
                  onChange={(e) => setPrFormData({...prFormData, projectName: e.target.value})}
                  placeholder="Enter project name"
                  className="border-black/20 font-medium"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Status</label>
                <select
                  value={prFormData.status}
                  onChange={(e) => setPrFormData({...prFormData, status: e.target.value as any})}
                  className="w-full border border-black/20 rounded-md px-3 py-2 font-medium"
                >
                  <option value="on-track">On Track</option>
                  <option value="at-risk">At Risk</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Next Milestone</label>
                <Input
                  value={prFormData.nextMilestone}
                  onChange={(e) => setPrFormData({...prFormData, nextMilestone: e.target.value})}
                  placeholder="Enter next milestone"
                  className="border-black/20 font-medium"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Due Date</label>
                <Input
                  type="date"
                  value={prFormData.dueDate}
                  onChange={(e) => setPrFormData({...prFormData, dueDate: e.target.value})}
                  className="border-black/20 font-medium"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Description</label>
              <Textarea
                value={prFormData.description}
                onChange={(e) => setPrFormData({...prFormData, description: e.target.value})}
                placeholder="Describe the project and recent updates..."
                className="border-black/20 font-medium"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setShowPRForm(false)}
                variant="outline"
                className="font-medium border-black/20"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePRSubmit}
                className="bg-[#00ec97] hover:bg-[#00ec97]/90 text-black font-medium"
              >
                Create Pull Request
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent GitHub Issues */}
      <Card className="bg-white border-black/10 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-black">Recent Milestone Issues</CardTitle>
        </CardHeader>
        <CardContent>
          {issues.length > 0 ? (
            <div className="space-y-3">
              {issues.slice(0, 5).map((issue: any) => (
                <div key={issue.number} className="flex items-center justify-between p-3 bg-[#f2f1e9] rounded-lg">
                  <div>
                    <div className="font-semibold text-black">{issue.title}</div>
                    <div className="text-sm text-black/60 font-medium">
                      #{issue.number} • {new Date(issue.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className={`font-medium ${
                        issue.state === 'open' 
                          ? 'bg-[#00ec97]/10 text-black border-[#00ec97]/30' 
                          : 'bg-black/10 text-black border-black/30'
                      }`}
                    >
                      {issue.state}
                    </Badge>
                    <Button
                      onClick={() => window.open(`https://github.com/codingshot/nearmilestones/issues/${issue.number}`, '_blank')}
                      variant="ghost"
                      size="sm"
                      className="font-medium"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-black/60 font-medium">
              No milestone issues found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
