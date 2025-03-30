import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";

export default function BlogPage() {
  const [_, navigate] = useLocation();
  const { language, t } = useLanguage();
  
  const { 
    data: blogPosts, 
    isLoading, 
    error 
  } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold mb-8">{t("blog.title", "Blog")}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="w-full h-48 bg-gray-200">
                <Skeleton className="h-full w-full" />
              </div>
              <CardHeader>
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-4 w-4/5" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-28" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold mb-8">{t("blog.title", "Blog")}</h1>
        <Card className="bg-red-50 dark:bg-red-900/10">
          <CardContent className="pt-6">
            <p className="text-red-700 dark:text-red-300">
              {t("blog.error", "Error loading blog posts. Please try again later.")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{t("blog.title", "Blog")}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t("blog.subtitle", "Latest articles, insights, and updates from our team")}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate("/")}
          className="mt-4 md:mt-0 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("common.backToHome", "Back to Home")}
        </Button>
      </div>
      <Separator className="mb-8" />
      
      {blogPosts && blogPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card 
              key={post.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              {post.featuredImage && (
                <div 
                  className="w-full h-48 bg-center bg-cover" 
                  style={{ backgroundImage: `url(${post.featuredImage})` }}
                  role="img"
                  aria-label={language === "en" ? post.title : post.titleEs || post.title}
                ></div>
              )}
              <CardHeader>
                <CardTitle className="line-clamp-2">
                  {language === "en" ? post.title : post.titleEs || post.title}
                </CardTitle>
                <CardDescription>
                  {formatDistanceToNow(new Date(post.createdAt), { 
                    addSuffix: true,
                    locale: language === "es" ? es : undefined 
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                  {language === "en" 
                    ? post.content.substring(0, 150) + (post.content.length > 150 ? "..." : "") 
                    : (post.contentEs || post.content).substring(0, 150) + ((post.contentEs || post.content).length > 150 ? "..." : "")}
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/blog/${post.slug}`)}
                >
                  {t("blog.readMore", "Read More")}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {t("blog.noPosts", "No blog posts found. Check back soon for updates!")}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}