import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export default function AboutSection() {
  const { t } = useLanguage();
  
  return (
    <section id="about" className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="order-2 md:order-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] text-gray-900 dark:text-white mb-6">
              {t("about.title")}
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                {t("about.description")}
              </p>
              
              <div className="border-l-4 border-primary-500 pl-4 dark:border-primary-400">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t("about.mission.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("about.mission.description")}
                </p>
              </div>
              
              <div className="border-l-4 border-accent-500 pl-4 dark:border-accent-400">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t("about.vision.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("about.vision.description")}
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="order-1 md:order-2 flex justify-center md:justify-end"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="space-y-4">
                <motion.img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                  alt="Team collaboration" 
                  className="rounded-lg shadow-lg h-40 object-cover w-full"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                />
                <motion.img 
                  src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                  alt="Digital design" 
                  className="rounded-lg shadow-lg h-48 object-cover w-full"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                />
              </div>
              <div className="space-y-4 pt-8">
                <motion.img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                  alt="Creative workspace" 
                  className="rounded-lg shadow-lg h-48 object-cover w-full"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                />
                <motion.img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                  alt="Business meeting" 
                  className="rounded-lg shadow-lg h-40 object-cover w-full"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
