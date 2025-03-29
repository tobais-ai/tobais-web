import { useLanguage } from "@/contexts/LanguageContext";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Users, Briefcase, Award, Globe } from "lucide-react";

export default function Stats() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Stats data
  const stats = [
    {
      id: 1,
      icon: <Users className="w-10 h-10" />,
      value: 150,
      label: t("stats.clients"),
      suffix: "+"
    },
    {
      id: 2,
      icon: <Briefcase className="w-10 h-10" />,
      value: 250,
      label: t("stats.projects"),
      suffix: "+"
    },
    {
      id: 3,
      icon: <Award className="w-10 h-10" />,
      value: 10,
      label: t("stats.awards"),
      suffix: ""
    },
    {
      id: 4,
      icon: <Globe className="w-10 h-10" />,
      value: 12,
      label: t("stats.countries"),
      suffix: ""
    }
  ];
  
  return (
    <section className="py-12 bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10" ref={ref}>
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.id}
              className="flex flex-col items-center text-center p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="p-3 bg-white/10 rounded-full mb-4 text-primary-200">
                {stat.icon}
              </div>
              
              <div className="flex items-baseline">
                <h3 className="text-3xl md:text-4xl font-bold font-['Poppins']">
                  {stat.value}
                </h3>
                <span className="text-2xl md:text-3xl font-bold font-['Poppins']">{stat.suffix}</span>
              </div>
              
              <p className="text-primary-200 font-medium mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}