import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { FaRocket, FaInfoCircle } from "react-icons/fa";

export default function CTASection() {
  const { t } = useLanguage();
  
  return (
    <section className="py-12 bg-primary-600 dark:bg-primary-800 transition-colors duration-200">
      <motion.div 
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold font-['Poppins'] mb-4">
          {t("cta.title")}
        </h2>
        
        <p className="mb-8 max-w-2xl mx-auto">
          {t("cta.description")}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact">
            <Button variant="secondary" className="border-2 hover:bg-white/10 hover:scale-105 focus:ring-4 focus:ring-white/30 font-medium rounded-lg text-sm px-6 py-3 transition-all duration-200 flex items-center gap-2">
              <FaRocket className="shrink-0" />
              <span>{t("cta.button1")}</span>
            </Button>
          </Link>
          
          <Link href="/services">
            <Button variant="outline" className="border-2 hover:bg-white/10 hover:scale-105 focus:ring-4 focus:ring-white/30 font-medium rounded-lg text-sm px-6 py-3 transition-all duration-200 flex items-center gap-2">
              <FaInfoCircle className="shrink-0" />
              <span>{t("cta.button2")}</span>
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
