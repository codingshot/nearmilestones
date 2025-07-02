
import { Github } from 'lucide-react';
import { GitHubService } from '@/services/githubService';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const githubService = GitHubService.getInstance();

  return (
    <footer className="bg-white border-t border-black/10 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-black mb-2">NEAR Ecosystem Tracker</h3>
            <p className="text-sm text-black/60 font-medium">
              Open-source project tracking powered by GitHub
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <a
              href={githubService.getRepoUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-black hover:text-[#00ec97] transition-colors font-medium"
            >
              <Github className="h-5 w-5" />
              <span>GitHub</span>
            </a>
            
            <Link
              to="/landing"
              className="flex items-center space-x-2 text-black hover:text-[#17d9d4] transition-colors font-medium"
            >
              <span>About</span>
            </Link>
            
            <Link
              to="/data"
              className="flex items-center space-x-2 text-black hover:text-[#17d9d4] transition-colors font-medium"
            >
              <span>Data</span>
            </Link>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-black/10 text-center">
          <p className="text-xs text-black/50 font-medium">
            Contribute to this project by submitting PRs to update project data
          </p>
        </div>
      </div>
    </footer>
  );
};
