
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Copy, ExternalLink, Play, BookOpen, Database, BarChart3, Download } from 'lucide-react';
import { ApiService, ApiResponse } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

const ApiDocs = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const apiService = ApiService.getInstance();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Code example has been copied to your clipboard."
    });
  };

  const testEndpoint = async (endpoint: string, method: string = 'GET', params?: any) => {
    setLoading(true);
    try {
      let result;
      switch (endpoint) {
        case '/projects':
          result = await apiService.getProjects(params);
          break;
        case '/projects/{id}':
          result = await apiService.getProject(params?.id || 'omnibridge');
          break;
        case '/projects/{id}/milestones':
          result = await apiService.getProjectMilestones(params?.id || 'omnibridge', params);
          break;
        case '/milestones':
          result = await apiService.getMilestones(params);
          break;
        case '/milestones/upcoming':
          result = await apiService.getUpcomingMilestones(params?.limit);
          break;
        case '/milestones/delayed':
          result = await apiService.getDelayedMilestones();
          break;
        case '/reports/project-health':
          result = await apiService.getProjectHealthReport();
          break;
        case '/reports/milestone-completion':
          result = await apiService.getMilestoneCompletionStats();
          break;
        default:
          throw new Error('Endpoint not implemented');
      }
      setTestResults(result);
      toast({
        title: "API Test Successful",
        description: `${method} ${endpoint} returned ${result.status}`
      });
    } catch (error: any) {
      setTestResults({ error: error.message || 'Test failed' });
      toast({
        title: "API Test Failed",
        description: error.message || 'An error occurred during testing',
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const endpoints = [
    {
      category: "Projects",
      icon: <Database className="h-4 w-4" />,
      endpoints: [
        {
          method: "GET",
          path: "/projects",
          description: "List all public projects with optional filtering",
          parameters: [
            { name: "category", type: "string", description: "Filter by project category" },
            { name: "status", type: "string", description: "Filter by project status" },
            { name: "page", type: "number", description: "Page number for pagination" },
            { name: "limit", type: "number", description: "Number of items per page" }
          ],
          example: `curl -X GET "https://api.example.com/projects?category=Infrastructure&limit=10"`,
          testable: true
        },
        {
          method: "GET",
          path: "/projects/{id}",
          description: "Retrieve details of a specific project",
          parameters: [
            { name: "id", type: "string", description: "Project ID", required: true }
          ],
          example: `curl -X GET "https://api.example.com/projects/omnibridge"`,
          testable: true
        },
        {
          method: "GET",
          path: "/projects/{id}/milestones",
          description: "Get all milestones for a specific project",
          parameters: [
            { name: "id", type: "string", description: "Project ID", required: true },
            { name: "status", type: "string", description: "Filter by milestone status" },
            { name: "page", type: "number", description: "Page number for pagination" },
            { name: "limit", type: "number", description: "Number of items per page" }
          ],
          example: `curl -X GET "https://api.example.com/projects/omnibridge/milestones?status=completed"`,
          testable: true
        },
        {
          method: "GET",
          path: "/projects/{id}/dependencies",
          description: "Get project dependencies",
          parameters: [
            { name: "id", type: "string", description: "Project ID", required: true }
          ],
          example: `curl -X GET "https://api.example.com/projects/omnibridge/dependencies"`
        },
        {
          method: "POST",
          path: "/projects/{id}/subscribe",
          description: "Subscribe to project updates (webhook)",
          parameters: [
            { name: "id", type: "string", description: "Project ID", required: true },
            { name: "webhook_url", type: "string", description: "URL to receive updates", required: true }
          ],
          example: `curl -X POST "https://api.example.com/projects/omnibridge/subscribe" \\
  -H "Content-Type: application/json" \\
  -d '{"webhook_url": "https://your-app.com/webhook"}'`
        }
      ]
    },
    {
      category: "Milestones",
      icon: <BarChart3 className="h-4 w-4" />,
      endpoints: [
        {
          method: "GET",
          path: "/milestones",
          description: "Query milestones with filtering options",
          parameters: [
            { name: "status", type: "string", description: "Filter by milestone status" },
            { name: "project", type: "string", description: "Filter by project ID" },
            { name: "dueDate", type: "string", description: "Filter by due date (ISO format)" },
            { name: "page", type: "number", description: "Page number for pagination" },
            { name: "limit", type: "number", description: "Number of items per page" }
          ],
          example: `curl -X GET "https://api.example.com/milestones?status=in-progress&limit=20"`,
          testable: true
        },
        {
          method: "GET",
          path: "/milestones/{id}",
          description: "Get specific milestone details",
          parameters: [
            { name: "id", type: "string", description: "Milestone ID", required: true }
          ],
          example: `curl -X GET "https://api.example.com/milestones/omnibridge-m1"`
        },
        {
          method: "POST",
          path: "/milestones/{id}/status",
          description: "Update milestone status (requires authentication)",
          parameters: [
            { name: "id", type: "string", description: "Milestone ID", required: true },
            { name: "status", type: "string", description: "New status", required: true },
            { name: "progress", type: "number", description: "Progress percentage (0-100)" }
          ],
          example: `curl -X POST "https://api.example.com/milestones/omnibridge-m1/status" \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"status": "completed", "progress": 100}'`
        },
        {
          method: "GET",
          path: "/milestones/upcoming",
          description: "Get upcoming milestones across all projects",
          parameters: [
            { name: "limit", type: "number", description: "Number of milestones to return (default: 10)" }
          ],
          example: `curl -X GET "https://api.example.com/milestones/upcoming?limit=5"`,
          testable: true
        },
        {
          method: "GET",
          path: "/milestones/delayed",
          description: "Get delayed milestones across all projects",
          parameters: [],
          example: `curl -X GET "https://api.example.com/milestones/delayed"`,
          testable: true
        }
      ]
    },
    {
      category: "Reports & Analytics",
      icon: <BarChart3 className="h-4 w-4" />,
      endpoints: [
        {
          method: "GET",
          path: "/reports/project-health",
          description: "Generate comprehensive project health report",
          parameters: [],
          example: `curl -X GET "https://api.example.com/reports/project-health"`,
          testable: true
        },
        {
          method: "GET",
          path: "/reports/milestone-completion",
          description: "Get milestone completion statistics",
          parameters: [],
          example: `curl -X GET "https://api.example.com/reports/milestone-completion"`,
          testable: true
        }
      ]
    },
    {
      category: "Data Export",
      icon: <Download className="h-4 w-4" />,
      endpoints: [
        {
          method: "GET",
          path: "/exports/csv",
          description: "Export data in CSV format",
          parameters: [
            { name: "type", type: "string", description: "Data type to export (projects|milestones)", required: true }
          ],
          example: `curl -X GET "https://api.example.com/exports/csv?type=projects"`
        },
        {
          method: "GET",
          path: "/exports/json",
          description: "Export data in JSON format",
          parameters: [
            { name: "type", type: "string", description: "Data type to export (projects|milestones)", required: true }
          ],
          example: `curl -X GET "https://api.example.com/exports/json?type=milestones"`
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f8fffe] to-[#f0fffc]">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Code className="h-8 w-8 text-[#17d9d4]" />
            <h1 className="text-4xl font-bold text-gray-900">NEAR Ecosystem API</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive RESTful API for accessing NEAR ecosystem project data, milestones, and analytics. 
            Perfect for building integrations, dashboards, and monitoring tools.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="endpoints" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Endpoints</span>
            </TabsTrigger>
            <TabsTrigger value="testing" className="flex items-center space-x-2">
              <Play className="h-4 w-4" />
              <span className="hidden sm:inline">Testing</span>
            </TabsTrigger>
            <TabsTrigger value="authentication" className="flex items-center space-x-2">
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">Auth</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                  <Database className="h-5 w-5 text-[#17d9d4]" />
                  <span>Core Features</span>
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• RESTful API with JSON responses</li>
                  <li>• Real-time project and milestone data</li>
                  <li>• Advanced filtering and pagination</li>
                  <li>• Comprehensive analytics and reports</li>
                  <li>• CSV and JSON data export</li>
                  <li>• Webhook support for updates</li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-[#00ec97]" />
                  <span>Use Cases</span>
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Build project monitoring dashboards</li>
                  <li>• Create custom reporting tools</li>
                  <li>• Integrate with existing workflows</li>
                  <li>• Automate milestone tracking</li>
                  <li>• Generate compliance reports</li>
                  <li>• Set up notification systems</li>
                </ul>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Base URL</h3>
              <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                https://api.near-ecosystem.com/v1
              </div>
              <p className="text-sm text-gray-600 mt-2">
                All API requests should be made to this base URL with the appropriate endpoint path.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="endpoints" className="space-y-6">
            {endpoints.map((category, idx) => (
              <Card key={idx} className="p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                  {category.icon}
                  <span>{category.category}</span>
                </h3>
                <div className="space-y-6">
                  {category.endpoints.map((endpoint, endIdx) => (
                    <div key={endIdx} className="border-l-4 border-[#17d9d4] pl-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <Badge variant={endpoint.method === 'GET' ? 'default' : 'destructive'}>
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {endpoint.path}
                        </code>
                        {endpoint.testable && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => testEndpoint(endpoint.path, endpoint.method)}
                            className="flex items-center space-x-1"
                          >
                            <Play className="h-3 w-3" />
                            <span>Test</span>
                          </Button>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">{endpoint.description}</p>
                      
                      {endpoint.parameters && endpoint.parameters.length > 0 && (
                        <div className="mb-4">
                          <h5 className="font-medium mb-2">Parameters:</h5>
                          <div className="space-y-1">
                            {endpoint.parameters.map((param, paramIdx) => (
                              <div key={paramIdx} className="text-sm">
                                <code className="bg-gray-100 px-1 rounded">{param.name}</code>
                                <span className="text-gray-500 ml-2">({param.type})</span>
                                {param.required && <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>}
                                <span className="text-gray-600 ml-2">- {param.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400">Example Request:</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(endpoint.example)}
                            className="text-gray-400 hover:text-white"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <pre className="whitespace-pre-wrap">{endpoint.example}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Play className="h-5 w-5 text-[#17d9d4]" />
                <span>API Testing Console</span>
              </h3>
              <p className="text-gray-600 mb-6">
                Test API endpoints directly from this interface. Click the "Test" buttons next to endpoints 
                in the Endpoints tab to see live results here.
              </p>

              {testResults && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Test Results:</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(JSON.stringify(testResults, null, 2))}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto max-h-96 overflow-y-auto">
                    <pre>{JSON.stringify(testResults, null, 2)}</pre>
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#17d9d4]"></div>
                  <span className="ml-2 text-gray-600">Testing endpoint...</span>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="authentication" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Authentication</h3>
              <p className="text-gray-600 mb-6">
                Most GET endpoints are public and don't require authentication. However, POST/PUT/DELETE 
                operations require API key authentication.
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">API Key Authentication</h4>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <code className="text-sm">Authorization: Bearer YOUR_API_TOKEN</code>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Rate Limits</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Public endpoints: 100 requests per minute</li>
                    <li>• Authenticated endpoints: 1000 requests per minute</li>
                    <li>• Webhook subscriptions: 10 per project</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Error Responses</h4>
                  <div className="bg-gray-900 text-red-400 p-4 rounded-lg text-sm font-mono">
                    <pre>{JSON.stringify({
                      "error": "RATE_LIMIT_EXCEEDED",
                      "status": 429,
                      "message": "Rate limit exceeded. Try again in 60 seconds."
                    }, null, 2)}</pre>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ApiDocs;
