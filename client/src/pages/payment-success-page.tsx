import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Check, ArrowRight } from "lucide-react";

export default function PaymentSuccessPage() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  
  // Extract the payment_intent parameter from the URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentIntent = params.get("payment_intent");
    setPaymentIntentId(paymentIntent);
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-lg mx-auto px-4 sm:px-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-green-600 dark:text-green-300" />
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t("paymentSuccess.title")}
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t("paymentSuccess.description")}
            </p>
            
            {paymentIntentId && (
              <div className="mb-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {t("paymentSuccess.transactionId")}
                </p>
                <p className="font-mono text-sm break-all">
                  {paymentIntentId}
                </p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Button
                variant="outline"
                onClick={() => setLocation("/dashboard")}
                className="flex items-center justify-center"
              >
                {t("paymentSuccess.viewDashboard")}
              </Button>
              
              <Button 
                onClick={() => setLocation("/")}
                className="flex items-center justify-center"
              >
                {t("paymentSuccess.returnHome")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("paymentSuccess.supportMessage")}
            </p>
            <a 
              href="mailto:support@tobais.com" 
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
            >
              support@tobais.com
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}