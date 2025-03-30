import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGlobe } from "react-icons/fa";
import tobaisLogo from "@/assets/tobais-logo.png";

export default function Footer() {
  const { t, language, toggleLanguage } = useLanguage();
  
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center overflow-hidden border-2 border-primary-500 mr-3">
                <img 
                  src={tobaisLogo} 
                  alt="TOBAIS Logo" 
                  className="h-12 w-12 object-cover" 
                />
              </div>
              <div className="text-2xl font-['Poppins'] font-bold text-white">TOBAIS</div>
            </div>
            <p className="text-gray-400 mb-4">
              {t("footer.description")}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://www.instagram.com/tobais.official/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">{t("footer.services")}</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">{t("services.webDesign.title")}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t("services.automation.title")}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t("services.branding.title")}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t("services.socialMedia.title")}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t("services.accounting.title")}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">{t("footer.company")}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about">
                  <a className="hover:text-white transition-colors">{t("footer.aboutUs")}</a>
                </Link>
              </li>
              <li><a href="#" className="hover:text-white transition-colors">{t("footer.blog")}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t("footer.careers")}</a></li>
              <li>
                <Link href="/contact">
                  <a className="hover:text-white transition-colors">{t("footer.contact")}</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">{t("footer.legal")}</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">{t("footer.privacyPolicy")}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t("footer.termsOfService")}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t("footer.cookiePolicy")}</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            {t("footer.copyright")}
          </p>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <button 
              onClick={toggleLanguage}
              className="flex items-center text-gray-400 hover:text-white transition-colors mr-4"
              aria-label="Toggle language"
            >
              <FaGlobe className="mr-2" />
              <span>{t("footer.language")}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
