import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Hero() {
  const { t } = useLanguage();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-blue-700 dark:from-primary-800 dark:to-blue-900 animate-[gradient_8s_ease_infinite] bg-[length:400%_400%]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="text-white space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold font-['Poppins'] text-white"
              variants={itemVariants}
            >
              {t("hero.title")}
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl opacity-90 text-white"
              variants={itemVariants}
            >
              {t("hero.subtitle")}
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              variants={itemVariants}
            >
              <Link href="/contact">
                <Button className="bg-white text-primary-600 hover:bg-gray-100 hover:scale-105 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-3 transition-all duration-200 shadow-lg">
                  <i className="fas fa-comment-dollar mr-2"></i> {t("hero.cta1")}
                </Button>
              </Link>
              
              <Link href="/contact">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 hover:scale-105 focus:ring-4 focus:ring-white/30 font-medium rounded-lg text-sm px-5 py-3 transition-all duration-200">
                  <i className="fas fa-calendar-check mr-2"></i> {t("hero.cta2")}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="rounded-xl bg-white/10 backdrop-blur-md p-6 shadow-2xl max-w-md">
              <img 
                src="https://images.unsplash.com/photo-1487014679447-9f8336841d58?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80" 
                alt="Digital workplace with laptop and devices" 
                className="rounded-lg h-auto object-cover w-full shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/3 right-0 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary-400 rounded-full filter blur-3xl opacity-20"></div>
    </section>
  );
}
