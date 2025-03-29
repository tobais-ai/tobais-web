import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Moon, Sun, Menu, X } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const { language, t, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logoutMutation } = useAuth();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  
  // Close mobile menu when navigating
  useEffect(() => {
    setIsOpen(false);
  }, [location]);
  
  const isActive = (path: string) => {
    return location === path ? "border-primary-500" : "border-transparent hover:border-primary-300";
  };
  
  const navItems = [
    { path: "/", label: t("navigation.home") },
    { path: "/services", label: t("navigation.services") },
    { path: "/about", label: t("navigation.about") },
    { path: "/contact", label: t("navigation.contact") }
  ];
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-2xl font-['Poppins'] font-bold text-primary-600 dark:text-primary-400 cursor-pointer">TOBAIS</span>
              </Link>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path} className={`inline-flex items-center px-1 pt-1 border-b-2 ${isActive(item.path)} text-sm font-medium transition-colors`}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Language toggle */}
            <button 
              onClick={toggleLanguage}
              className="ml-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors"
              aria-label={`Switch language to ${language === 'en' ? 'Spanish' : 'English'}`}
            >
              <span className="flex items-center text-sm font-medium">
                {language === 'en' ? 'EN' : 'ES'}
              </span>
            </button>
            
            {/* Theme toggle */}
            <button 
              onClick={toggleTheme}
              className="ml-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon size={18} />
              ) : (
                <Sun size={18} />
              )}
            </button>
            
            {/* Auth buttons (desktop) */}
            <div className="hidden md:flex items-center ml-4">
              {user ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="mr-2">
                      {t("navigation.dashboard")}
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    {t("navigation.logout")}
                  </Button>
                </>
              ) : (
                <Link href="/auth">
                  <Button variant="default" size="sm">
                    {t("navigation.login")}
                  </Button>
                </Link>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="-mr-2 flex items-center md:hidden">
              <button 
                onClick={toggleMenu}
                className="bg-white dark:bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`block pl-3 pr-4 py-2 border-l-4 ${location === item.path ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'} text-base font-medium transition-colors`}
            >
              {item.label}
            </Link>
          ))}
          
          {/* Auth buttons (mobile) */}
          {user ? (
            <>
              <Link 
                href="/dashboard"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700 text-base font-medium transition-colors"
              >
                {t("navigation.dashboard")}
              </Link>
              <button 
                onClick={handleLogout}
                className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700 text-base font-medium transition-colors"
              >
                {t("navigation.logout")}
              </button>
            </>
          ) : (
            <Link 
              href="/auth"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700 text-base font-medium transition-colors"
            >
              {t("navigation.login")}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
