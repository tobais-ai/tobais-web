import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BrainCircuit, MessageSquareDashed, Globe, Sparkles, Bot, BarChart } from "lucide-react";

export default function AISolutions() {
  const { t } = useLanguage();
  
  const aiSolutions = [
    {
      id: 1,
      icon: <MessageSquareDashed className="w-6 h-6" />,
      title: t("ai.solutions.contentGeneration.title"),
      description: t("ai.solutions.contentGeneration.description")
    },
    {
      id: 2,
      icon: <Globe className="w-6 h-6" />,
      title: t("ai.solutions.multilingual.title"),
      description: t("ai.solutions.multilingual.description")
    },
    {
      id: 3,
      icon: <Sparkles className="w-6 h-6" />,
      title: t("ai.solutions.brandingAssistant.title"),
      description: t("ai.solutions.brandingAssistant.description")
    },
    {
      id: 4,
      icon: <Bot className="w-6 h-6" />,
      title: t("ai.solutions.customerSupport.title"),
      description: t("ai.solutions.customerSupport.description")
    },
    {
      id: 5,
      icon: <BarChart className="w-6 h-6" />,
      title: t("ai.solutions.marketAnalysis.title"),
      description: t("ai.solutions.marketAnalysis.description")
    }
  ];
  
  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/30 dark:bg-primary-900/20 rounded-full filter blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-300/20 dark:bg-primary-800/20 rounded-full filter blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <BrainCircuit className="text-primary-600 dark:text-primary-400 w-8 h-8" />
              <span className="text-primary-600 dark:text-primary-400 font-medium uppercase tracking-wider text-sm">
                {t("ai.label")}
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] text-gray-900 dark:text-white mb-6">
              {t("ai.title")}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {t("ai.description")}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/services#ai-solutions">
                <Button className="px-6">
                  {t("ai.learnMore")}
                </Button>
              </Link>
              
              <Link href="/contact">
                <Button variant="outline" className="px-6">
                  {t("ai.getStarted")}
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            className="grid gap-6 sm:grid-cols-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {aiSolutions.map((solution, index) => (
              <motion.div
                key={solution.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 inline-block mb-4">
                  {solution.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {solution.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {solution.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg p-8 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t("ai.cta.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("ai.cta.description")}
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <Link href="/auth">
                <Button size="lg" className="w-full md:w-auto">
                  {t("ai.cta.button")}
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}