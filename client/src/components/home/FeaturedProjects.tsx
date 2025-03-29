import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { motion } from "framer-motion";
import { Loader2, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function FeaturedProjects() {
  const { t, language } = useLanguage();
  
  // Fetch featured projects
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects", { featured: true }]
  });
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  
  // Get badge color for project type
  const getProjectBadgeClass = (type: string): string => {
    switch(type) {
      case 'web-design': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'automation': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'branding': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'marketing': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  return (
    <section id="projects" className="py-16 bg-white dark:bg-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold font-['Poppins'] text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t("projects.title")}
          </motion.h2>
          
          <motion.p 
            className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t("projects.subtitle")}
          </motion.p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : projects && projects.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {projects.map(project => (
              <motion.div 
                key={project.id}
                className="flex flex-col md:flex-row bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                variants={itemVariants}
              >
                {/* Project image */}
                <div className="md:w-2/5 relative overflow-hidden">
                  <img 
                    src={project.image || "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80"} 
                    alt={language === 'es' && project.titleEs ? project.titleEs : project.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                
                {/* Project details */}
                <div className="p-6 md:w-3/5 flex flex-col">
                  <div className="mb-4">
                    <Badge variant="secondary" className={getProjectBadgeClass(project.status || '')}>
                      {project.status}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    {language === 'es' && project.titleEs ? project.titleEs : project.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 flex-grow mb-4">
                    {language === 'es' && project.descriptionEs ? project.descriptionEs : project.description}
                  </p>
                  
                  <div className="mt-auto">
                    <Button variant="outline" size="sm" className="inline-flex items-center gap-1">
                      {t("projects.viewCase")} <ExternalLink size={16} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center text-gray-600 dark:text-gray-300 py-10">
            {t("projects.noProjects")}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link href="/services">
            <Button size="lg" className="px-8">
              {t("projects.viewAll")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}