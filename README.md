# Project Portfolio & Milestone Tracker

A modern, responsive project management dashboard built with React, TypeScript, and Tailwind CSS. Track project milestones, dependencies, and progress with beautiful visualizations and GitHub integration.

## 🚀 Features

### Project Management
- **Project Portfolio View**: Browse and explore multiple projects with detailed cards
- **Milestone Tracking**: Comprehensive milestone management with progress indicators
- **Dependency Management**: Clickable dependencies linking to other milestones or external resources
- **Progress Visualization**: Charts and timelines showing project completion status

### GitHub Integration
- **External Milestone Sources**: Override project milestones from GitHub repository `milestones.md` files
- **Real-time Sync**: Automatic synchronization with GitHub repositories
- **Flexible Milestone Parsing**: Support for various milestone formats and structures

### Views & Navigation
- **Calendar View**: Timeline-based project visualization with list/calendar toggle
- **Project Detail Pages**: In-depth project information with milestone breakdowns
- **Mobile-Responsive Design**: Optimized layouts for all device sizes
- **Dark/Light Mode**: Theme switching support

### Analytics & Insights
- **Project Status Charts**: Visual representation of project health and progress
- **Milestone Analytics**: Detailed insights into completion rates and timelines
- **Dependency Graphs**: Visual mapping of project interdependencies

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn-ui components
│   ├── AnalyticsOverview.tsx
│   ├── CalendarView.tsx
│   ├── DependencyGraph.tsx
│   ├── MilestoneTimeline.tsx
│   ├── ProjectCard.tsx
│   └── ...
├── pages/               # Route components
│   ├── Index.tsx        # Main dashboard
│   ├── ProjectDetail.tsx
│   ├── ApiDocs.tsx
│   └── ...
├── services/            # API and data services
│   ├── githubService.ts
│   ├── milestoneParser.ts
│   ├── apiService.ts
│   └── ...
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── lib/                # Utility functions
public/
├── data/               # Static data files
│   └── projects.json   # Project configuration
└── ...
```

## 🛠 Development

### Prerequisites
- Node.js (recommended: install with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm or yarn

### Local Development

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Using Lovable
Visit the [Lovable Project](https://lovable.dev/projects/9d4dbbd7-b7c3-412f-a35d-1ce97322fb0c) for visual editing and AI-powered development.

### GitHub Integration
- Changes made in Lovable automatically sync to GitHub
- Local changes pushed to GitHub sync back to Lovable
- Supports parallel development workflows

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/9d4dbbd7-b7c3-412f-a35d-1ce97322fb0c) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
