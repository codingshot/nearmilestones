
import { useState, useEffect } from 'react';
import { GitHubService } from '@/services/githubService';

export const useGitHubData = () => {
  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const githubService = GitHubService.getInstance();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [projectsData, issuesData] = await Promise.all([
        githubService.fetchProjectsData(),
        githubService.fetchIssues()
      ]);
      
      setProjects(projectsData.projects || []);
      setIssues(issuesData);
      setLastUpdate(projectsData.lastUpdate || new Date().toISOString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Error fetching GitHub data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generatePRUrl = (projectData: any) => {
    return githubService.generatePRUrl(projectData);
  };

  const generateIssueUrl = (projectId: string, milestoneData: any) => {
    return githubService.generateIssueUrl(projectId, milestoneData);
  };

  const getDataUrl = () => {
    return githubService.getDataUrl();
  };

  const getRepoUrl = () => {
    return githubService.getRepoUrl();
  };

  return {
    projects,
    issues,
    loading,
    error,
    lastUpdate,
    refetch: fetchData,
    generatePRUrl,
    generateIssueUrl,
    getDataUrl,
    getRepoUrl
  };
};
