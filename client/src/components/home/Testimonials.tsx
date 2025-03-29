import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { Testimonial } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { FaQuoteRight, FaStar, FaStarHalfAlt, FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function Testimonials() {
  const { t, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"]
  });
  
  // Reset index when testimonials change
  useEffect(() => {
    if (testimonials && testimonials.length > 0) {
      setCurrentIndex(0);
    }
  }, [testimonials]);
  
  const handlePrevious = () => {
    if (!testimonials) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  const handleNext = () => {
    if (!testimonials) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };
  
  // Render the rating stars
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" />);
    }
    
    return (
      <div className="flex text-yellow-400">
        {stars}
      </div>
    );
  };
  
  return (
    <section className="py-16 bg-white dark:bg-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold font-['Poppins'] text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t("testimonials.title")}
          </motion.h2>
        </div>
        
        <div className="mx-auto max-w-3xl relative">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : testimonials && testimonials.length > 0 ? (
            <>
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="bg-gray-50 dark:bg-gray-700 p-8 rounded-2xl shadow-lg"
                >
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonials[currentIndex].image || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonials[currentIndex].name)}&background=random`} 
                      alt={`${testimonials[currentIndex].name}'s profile`} 
                      className="w-12 h-12 rounded-full object-cover mr-4" 
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{testimonials[currentIndex].name}</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {testimonials[currentIndex].position && testimonials[currentIndex].company
                          ? `${testimonials[currentIndex].position}, ${testimonials[currentIndex].company}`
                          : testimonials[currentIndex].position || testimonials[currentIndex].company}
                      </p>
                    </div>
                    <div className="ml-auto text-2xl text-primary-500">
                      <FaQuoteRight />
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 italic">
                    {language === 'es' && testimonials[currentIndex].contentEs 
                      ? testimonials[currentIndex].contentEs 
                      : testimonials[currentIndex].content}
                  </p>
                  <div className="mt-4">
                    {renderRating(testimonials[currentIndex].rating)}
                  </div>
                </motion.div>
              </AnimatePresence>
              
              <div className="flex justify-between mt-6">
                <button 
                  onClick={handlePrevious}
                  className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white p-2 rounded-full transition-colors"
                  aria-label={t("testimonials.prev")}
                >
                  <FaArrowLeft />
                </button>
                <button 
                  onClick={handleNext}
                  className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white p-2 rounded-full transition-colors"
                  aria-label={t("testimonials.next")}
                >
                  <FaArrowRight />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              No testimonials available yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
