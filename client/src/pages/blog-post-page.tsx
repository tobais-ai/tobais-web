import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import { useLocation, Link } from "wouter";
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
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function BlogPostPage() {
  const [location] = useLocation();
  const { language, t } = useLanguage();
  
  // Get slug from the URL path
  const slug = location.split("/").pop();
  
  const { 
    data: post, 
    isLoading, 
    error 
  } = useQuery<BlogPost>({
    queryKey: [`/api/blog/${slug}`],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-12">
          <Link to="/blog" className="flex items-center text-primary mb-6 hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("blog.backToBlog", "Back to Blog")}
          </Link>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-10 w-3/4 mb-2" />
              <div className="flex items-center text-gray-500 gap-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-32" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 mb-8">
                <Skeleton className="h-full w-full" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-12">
          <Link to="/blog" className="flex items-center text-primary mb-6 hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("blog.backToBlog", "Back to Blog")}
          </Link>
          
          <Card className="bg-red-50 dark:bg-red-900/10">
            <CardContent className="pt-6">
              <p className="text-red-700 dark:text-red-300">
                {t("blog.postNotFound", "Blog post not found or an error occurred.")}
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                asChild
              >
                <Link to="/blog">
                  {t("blog.returnToBlog", "Return to Blog")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  const title = language === "en" ? post.title : post.titleEs || post.title;
  const content = language === "en" ? post.content : post.contentEs || post.content;
  const formattedDate = format(new Date(post.createdAt), 'MMMM d, yyyy', {
    locale: language === "es" ? es : undefined
  });

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-12">
        <Link to="/blog" className="flex items-center text-primary mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("blog.backToBlog", "Back to Blog")}
        </Link>
        
        <article>
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          
          <div className="flex flex-wrap items-center text-gray-500 dark:text-gray-400 gap-4 mb-8">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
          </div>
          
          {post.featuredImage && (
            <div className="mb-8">
              <img 
                src={post.featuredImage} 
                alt={title}
                className="w-full max-h-96 object-cover rounded-lg" 
              />
            </div>
          )}
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {content?.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('#')) {
                const level = paragraph.match(/^#+/)?.[0]?.length || 1;
                const text = paragraph.replace(/^#+\s/, '');
                
                switch (level) {
                  case 1:
                    return <h1 key={index} className="text-3xl font-bold my-4">{text}</h1>;
                  case 2:
                    return <h2 key={index} className="text-2xl font-bold my-4">{text}</h2>;
                  case 3:
                    return <h3 key={index} className="text-xl font-bold my-3">{text}</h3>;
                  default:
                    return <h4 key={index} className="text-lg font-bold my-2">{text}</h4>;
                }
              }
              
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').map(item => item.replace(/^-\s/, ''));
                return (
                  <ul key={index} className="list-disc pl-6 my-4">
                    {items.map((item, i) => <li key={i} className="my-1">{item}</li>)}
                  </ul>
                );
              }
              
              if (paragraph.match(/^\d+\./)) {
                const items = paragraph.split('\n').map(item => item.replace(/^\d+\.\s/, ''));
                return (
                  <ol key={index} className="list-decimal pl-6 my-4">
                    {items.map((item, i) => <li key={i} className="my-1">{item}</li>)}
                  </ol>
                );
              }
              
              return <p key={index} className="my-4 whitespace-pre-line">{paragraph}</p>;
            })}
          </div>
        </article>
      </div>
      <Footer />
    </>
  );
}