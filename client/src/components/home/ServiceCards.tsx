import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { ServiceType } from "@shared/schema";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { FaLaptopCode, FaRobot, FaPaintBrush } from "react-icons/fa";

export default function ServiceCards() {
  const { t, language } = useLanguage();
  
  const { data: services, isLoading } = useQuery<ServiceType[]>({
    queryKey: ["/api/services"]
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
  
  // Get appropriate icon for service
  const getServiceIcon = (iconName: string | null | undefined) => {
    switch(iconName) {
      case 'laptop-code':
        return <FaLaptopCode className="text-xl" />;
      case 'robot':
        return <FaRobot className="text-xl" />;
      case 'paint-brush':
        return <FaPaintBrush className="text-xl" />;
      default:
        return <FaLaptopCode className="text-xl" />;
    }
  };
  
  // Convert string features to array
  const parseFeatures = (featuresString: any, featuresEsString: any): string[] => {
    try {
      if (language === 'es' && featuresEsString) {
        return JSON.parse(featuresEsString);
      } else if (featuresString) {
        return JSON.parse(featuresString);
      }
      return [];
    } catch (e) {
      return [];
    }
  };
  
  return (
    <section id="services" className="py-16 bg-white dark:bg-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold font-['Poppins'] text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t("services.title")}
          </motion.h2>
          
          <motion.p 
            className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t("services.subtitle")}
          </motion.p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {services?.map(service => {
              const features = parseFeatures(service.features, service.featuresEs);
              return (
                <motion.div 
                  key={service.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
                  variants={itemVariants}
                >
                  <div className="p-6">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4 text-primary-600 dark:text-primary-300 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                      {getServiceIcon(service.icon)}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                      {language === 'es' && service.nameEs ? service.nameEs : service.name}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {language === 'es' && service.descriptionEs ? service.descriptionEs : service.description}
                    </p>
                    
                    <div className="space-y-2">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center text-gray-700 dark:text-gray-200">
                          <i className="fas fa-check text-secondary-500 mr-2"></i>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-baseline mb-4">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">${service.price}</span>
                        <span className="ml-1 text-gray-600 dark:text-gray-300">
                          {language === 'es' ? t("services.price") : t("services.price")}
                        </span>
                      </div>
                      
                      <a 
                        href={`/checkout?serviceId=${service.id}`}
                        className="block w-full bg-primary-600 hover:bg-primary-700 text-white text-center py-2 px-4 rounded-md transition-colors duration-300"
                      >
                        {t("services.buyNow")}
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
