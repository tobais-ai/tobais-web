import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function ProjectTracker() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  
  // Fetch user's projects
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/user/projects"],
    enabled: !!user
  });
  
  // Filter projects by status
  const filteredProjects = filterStatus
    ? projects?.filter(project => project.status === filterStatus)
    : projects;
  
  // Calculate project progress percentage based on status
  const getProjectProgress = (status: string): number => {
    switch(status) {
      case 'pending': return 0;
      case 'planning': return 20;
      case 'in-progress': return 50;
      case 'review': return 80;
      case 'completed': return 100;
      default: return 0;
    }
  };
  
  // Status badge styling
  const getStatusBadgeClass = (status: string): string => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-200';
      case 'planning': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200';
      case 'in-progress': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 hover:bg-purple-200';
      case 'review': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 hover:bg-orange-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.projects")}</CardTitle>
        <CardDescription>Track and manage your projects</CardDescription>
        <Tabs 
          defaultValue="all" 
          onValueChange={(value) => setFilterStatus(value === 'all' ? null : value)}
          className="mt-2"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredProjects && filteredProjects.length > 0 ? (
          <div className="space-y-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="border rounded-md p-6 transition-all hover:shadow-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 space-y-2 md:space-y-0">
                  <div>
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <Badge variant="outline" className={getStatusBadgeClass(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {project.startDate && (
                      <span>
                        Started: {new Date(project.startDate).toLocaleDateString()}
                      </span>
                    )}
                    {project.endDate && (
                      <span className="ml-4">
                        Due: {new Date(project.endDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {project.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{getProjectProgress(project.status)}%</span>
                  </div>
                  <Progress value={getProjectProgress(project.status)} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            {filterStatus 
              ? `No ${filterStatus} projects found` 
              : t("dashboard.noProjects")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
