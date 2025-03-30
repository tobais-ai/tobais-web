import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { LightbulbIcon, PencilRulerIcon, CodeIcon, RocketIcon } from "lucide-react";

export default function OurProcess() {
  const { t } = useLanguage();
  
  const processSteps = [
    {
      id: 1, 
      icon: <LightbulbIcon className="w-8 h-8" />,
      title: t("process.steps.discover.title"),
      description: t("process.steps.discover.description"),
      color: "bg-amber-500"
    },
    {
      id: 2, 
      icon: <PencilRulerIcon className="w-8 h-8" />,
      title: t("process.steps.design.title"),
      description: t("process.steps.design.description"),
      color: "bg-purple-500"
    },
    {
      id: 3, 
      icon: <CodeIcon className="w-8 h-8" />,
      title: t("process.steps.develop.title"),
      description: t("process.steps.develop.description"),
      color: "bg-blue-500" 
    },
    {
      id: 4, 
      icon: <RocketIcon className="w-8 h-8" />,
      title: t("process.steps.deliver.title"),
      description: t("process.steps.deliver.description"),
      color: "bg-green-500"
    }
  ];

  return (
    <section id="process" className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold font-['Poppins'] text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t("process.title")}
          </motion.h2>
          
          <motion.p 
            className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t("process.subtitle")}
          </motion.p>
        </div>
        
        <div className="relative">
          {/* Timeline connector */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200 dark:bg-gray-700"></div>
          
          <div className="space-y-16 md:space-y-0 relative">
            {processSteps.map((step, index) => (
              <motion.div 
                key={step.id}
                className={`md:flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Content */}
                <div className={`md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                  </div>
                </div>
                
                {/* Icon */}
                <div className="md:w-2/12 flex justify-center relative">
                  <div className={`rounded-full w-16 h-16 ${step.color} text-white flex items-center justify-center shadow-lg z-10 mx-auto my-6 md:my-0`}>
                    {step.icon}
                  </div>
                </div>
                
                {/* Empty space for timeline balance */}
                <div className="md:w-5/12"></div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <motion.div 
          className="mt-20 bg-primary-50 dark:bg-gray-700/30 p-6 md:p-8 rounded-xl border border-primary-100 dark:border-gray-700 text-center shadow-inner"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t("process.cta.title")}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            {t("process.cta.description")}
          </p>
          <button className="bg-primary-600 hover:bg-primary-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
            {t("process.cta.button")}
          </button>
        </motion.div>
      </div>
    </section>
  );
}