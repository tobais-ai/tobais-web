import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Project, SocialMedia } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function UserDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  // Fetch user's projects
  const { data: projects, isLoading: isLoadingProjects } = useQuery<Project[]>({
    queryKey: ["/api/user/projects"],
    enabled: !!user
  });
  
  // Fetch user's social media content
  const { data: socialMediaContent, isLoading: isLoadingSocial } = useQuery<SocialMedia[]>({
    queryKey: ["/api/social-media"],
    enabled: !!user
  });
  
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.title")}</CardTitle>
          <CardDescription>
            Your projects, social media content, and analytics in one place.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                {isLoadingProjects ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  projects?.length || 0
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Active Projects
              </div>
            </div>
            
            <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                {isLoadingSocial ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  socialMediaContent?.length || 0
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Social Media Posts
              </div>
            </div>
            
            <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                7
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Days Left in Billing Cycle
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Projects Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.projects")}</CardTitle>
          <CardDescription>Your most recent projects</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingProjects ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="space-y-4">
              {projects.slice(0, 3).map((project) => (
                <div key={project.id} className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{project.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      project.status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : project.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {project.description}
                  </p>
                  <div className="flex justify-between items-center mt-4 text-xs text-gray-500 dark:text-gray-400">
                    <div>Start: {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}</div>
                    <div>End: {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              {t("dashboard.noProjects")}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Recent Social Media Content */}
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.socialMedia")}</CardTitle>
          <CardDescription>Your recent social media content</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingSocial ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : socialMediaContent && socialMediaContent.length > 0 ? (
            <div className="space-y-4">
              {socialMediaContent.slice(0, 3).map((content) => (
                <div key={content.id} className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="capitalize font-medium">{content.platform}</span>
                      {content.aiGenerated && (
                        <span className="ml-2 px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 text-xs">
                          AI Generated
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(content.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {content.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              No social media content yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
