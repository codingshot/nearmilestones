
import { Github } from 'lucide-react';
import { GitHubService } from '@/services/githubService';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const githubService = GitHubService.getInstance();

  return (
    <footer className="bg-white border-t border-black/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col space-y-6 sm:space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
          <div className="text-center md:text-left">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <h3 className="text-lg font-semibold text-black mb-2">NEAR Ecosystem Tracker</h3>
            </Link>
            <p className="text-sm text-black/60 font-medium">
              Open-source project tracking powered by GitHub
            </p>
          </div>
          
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4 md:space-x-6">
            <a
              href={githubService.getRepoUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center sm:justify-start space-x-2 text-black hover:text-[#00ec97] transition-colors font-medium"
            >
              <Github className="h-5 w-5" />
              <span>GitHub</span>
            </a>
            
            <Link
              to="/landing"
              className="flex items-center justify-center sm:justify-start space-x-2 text-black hover:text-[#17d9d4] transition-colors font-medium"
            >
              <span>About</span>
            </Link>
            
            <Link
              to="/data"
              className="flex items-center justify-center sm:justify-start space-x-2 text-black hover:text-[#17d9d4] transition-colors font-medium"
            >
              <span>Data</span>
            </Link>

            <Link
              to="/updates"
              className="flex items-center justify-center sm:justify-start space-x-2 text-black hover:text-[#17d9d4] transition-colors font-medium"
            >
              <span>Updates</span>
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
