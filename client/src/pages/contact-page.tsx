import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactSection from "@/components/home/ContactSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <main>
        {/* Contact Hero Section */}
        <section className="bg-gradient-to-r from-gray-800 to-blue-900 dark:from-primary-800 dark:to-blue-900 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold font-['Poppins'] mb-6">
                {t("contact.title")}
              </h1>
              <p className="text-xl max-w-3xl mx-auto opacity-90">
                {t("contact.subtitle")}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Contact Section */}
        <ContactSection />

        {/* Map Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold font-['Poppins'] text-gray-900 dark:text-white mb-4">
                {t("contact.info.map.title")}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t("contact.info.map.description")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="aspect-video w-full">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d104994.80811241799!2d-80.90744300886853!3d35.22639499509289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88541fc4fc381a81%3A0x884650e6bf43d164!2sCharlotte%2C%20NC%2C%20USA!5e0!3m2!1sen!2sus!4v1714866893044!5m2!1sen!2sus" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Charlotte, NC Office Location"
                  ></iframe>
                </div>
              </motion.div>

              <motion.div 
                className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="aspect-video w-full">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d209825.59702315028!2d-56.408206486509664!3d-34.83381303611366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x959f80ffc63bf7d3%3A0x6b321b2e355bec99!2sMontevideo%2C%20Montevideo%20Department%2C%20Uruguay!5e0!3m2!1sen!2sus!4v1714866907927!5m2!1sen!2sus" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Montevideo, Uruguay Office Location"
                  ></iframe>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
