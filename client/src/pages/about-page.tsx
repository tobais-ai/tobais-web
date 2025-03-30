import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutSection from "@/components/home/AboutSection";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <main>
        {/* About Hero Section */}
        <section className="bg-gradient-to-r from-gray-800 to-blue-900 dark:from-primary-800 dark:to-blue-900 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold font-['Poppins'] mb-6">
                {t("about.title")}
              </h1>
              <p className="text-xl max-w-3xl mx-auto opacity-90">
                {t("language") === "en" 
                  ? "TOBAIS, Technology on Business Artificial Intelligence Solutions, is a creative digital agency committed to empowering small businesses across the U.S. and Latin America."
                  : "TOBAIS, Technology on Business Artificial Intelligence Solutions, es una agencia digital creativa comprometida con el empoderamiento de pequeñas empresas en U.S. y América Latina."
                }
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main About Section */}
        <AboutSection />

        {/* Team Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] text-gray-900 dark:text-white mb-4">
                {t("team.title", "Our Team")}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t("team.subtitle", "Meet the talented professionals dedicated to helping your business succeed in the digital landscape.")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                  alt="Team member" 
                  className="w-full h-64 object-cover object-center"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Mateo Bourdillon</h3>
                  <p className="text-primary-600 dark:text-primary-400 mb-3">
                    {t("team.founderCeo", "Founder & CEO")}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t("team.mateoDescription", "Digital strategist with over 10 years of experience helping businesses transform their digital presence.")}
                  </p>
                </div>
              </motion.div>

              <motion.div 
                className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                  alt="Team member" 
                  className="w-full h-64 object-cover object-center"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Diana Castro</h3>
                  <p className="text-primary-600 dark:text-primary-400 mb-3">
                    {t("team.founderCeo", "Founder & CEO")}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t("team.dianaDescription", "Award-winning designer specializing in brand identity and UI/UX design for digital platforms.")}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <Testimonials />

        {/* Company Values */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] text-gray-900 dark:text-white mb-4">
                {t("values.title", "Our Values")}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t("values.subtitle", "The core principles that guide our work and relationships with clients.")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div 
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4 text-primary-600 dark:text-primary-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {t("values.excellence.title", "Excellence")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("values.excellence.description", "We strive for excellence in every project, focusing on quality, innovation, and results.")}
                </p>
              </motion.div>

              <motion.div 
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4 text-primary-600 dark:text-primary-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {t("values.clientFocus.title", "Client Focus")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("values.clientFocus.description", "We put our clients' needs first, building strong relationships based on trust and communication.")}
                </p>
              </motion.div>

              <motion.div 
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4 text-primary-600 dark:text-primary-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {t("values.innovation.title", "Innovation")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("values.innovation.description", "We embrace cutting-edge technologies and creative thinking to deliver forward-thinking solutions.")}
                </p>
              </motion.div>

              <motion.div 
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4 text-primary-600 dark:text-primary-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {t("values.globalVision.title", "Global Vision")}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t("values.globalVision.description", "We bring a multicultural perspective that serves diverse clients across the U.S. and Latin America.")}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
