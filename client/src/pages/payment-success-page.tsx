import { useEffect } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle, Home, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  const [, setLocation] = useLocation();
  const { t, language } = useLanguage();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-500" />
              </div>
            </div>
            
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
              {t("paymentSuccess.title")}
            </h2>
            
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {t("paymentSuccess.description")}
            </p>
            
            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t("paymentSuccess.nextSteps")}
              </p>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                  {t("paymentSuccess.emailSent")}
                </p>
                
                <div className="flex gap-4 flex-col sm:flex-row">
                  <Button 
                    onClick={() => setLocation("/")}
                    variant="outline"
                    className="flex items-center"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    {t("paymentSuccess.returnHome")}
                  </Button>
                  
                  <Button 
                    onClick={() => setLocation("/dashboard")}
                    className="flex items-center"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {t("paymentSuccess.viewDashboard")}
                  </Button>
                </div>
              </div>
            </div>
            
            <p className="mt-8 text-xs text-gray-500 dark:text-gray-400">
              {t("paymentSuccess.referenceNumber")}: TB-{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}