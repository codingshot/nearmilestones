
import React from 'react';
import { Button } from '@/components/ui/button';
import { Code, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ApiLink = () => {
  return (
    <Link to="/api">
      <Button variant="outline" className="flex items-center space-x-2 hover:bg-[#17d9d4]/10 hover:border-[#17d9d4]">
        <Code className="h-4 w-4" />
        <span>API Docs</span>
        <ExternalLink className="h-3 w-3" />
      </Button>
    </Link>
  );
};
