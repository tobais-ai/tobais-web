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
        <section className="bg-gradient-to-r from-primary-600 to-blue-700 dark:from-primary-800 dark:to-blue-900 py-16 md:py-24">
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
                Find Us
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Our offices are strategically located to serve clients in both North and South America.
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
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114964.53925916665!2d-80.29949920266738!3d25.782390733064336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b0a20ec8c111%3A0xff96f271ddad4f65!2sMiami%2C%20FL!5e0!3m2!1sen!2sus!4v1651234567890!5m2!1sen!2sus" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Miami Office Location"
                  ></iframe>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Miami Office</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    123 Biscayne Blvd, <br />
                    Miami, FL 33132, <br />
                    United States
                  </p>
                  <p className="mt-4 text-primary-600 dark:text-primary-400">
                    +1 (555) 123-4567
                  </p>
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
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d254508.51141489705!2d-74.24789625449921!3d4.648618493988507!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9bfd2da6cb29%3A0x239d635520a33914!2sBogot%C3%A1%2C%20Colombia!5e0!3m2!1sen!2sus!4v1651234567890!5m2!1sen!2sus" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Bogota Office Location"
                  ></iframe>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Bogotá Office</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Calle 93 #13-24, <br />
                    Bogotá, <br />
                    Colombia
                  </p>
                  <p className="mt-4 text-primary-600 dark:text-primary-400">
                    +57 (1) 987-6543
                  </p>
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
