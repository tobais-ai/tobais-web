import { useState } from "react";
import { useLocation } from "wouter";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useToast } from "../hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useTranslation } from "../hooks/use-translation";
import { PayPalButton } from "../components/payment/PayPalButton";

export default function TestPayPalPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSuccess = (details: any) => {
    console.log('Payment completed successfully:', details);
    toast({
      title: t('checkout.paymentSuccessful'),
      description: t('checkout.testPaymentCompleted'),
    });
    setLocation("/payment-success?provider=paypal");
  };

  const handleError = (error: any) => {
    console.error('Error processing PayPal payment:', error);
    toast({
      title: t('checkout.paymentFailed'),
      description: error?.message || t('checkout.unexpectedError'),
      variant: "destructive",
    });
    setIsProcessing(false);
  };

  if (!import.meta.env.VITE_PAYPAL_CLIENT_ID) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('checkout.configurationError')}
              </h1>
              <p className="text-red-500">
                {t('checkout.paypalMissingConfig')}
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              {t('checkout.testPayPalPayment')} ($1.00)
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
              {t('checkout.testPaymentDescription')}
            </p>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p>{t('checkout.processing')}</p>
                </div>
              ) : (
                <PayPalButton 
                  amount={1.00} 
                  onSuccess={handleSuccess}
                  onError={handleError}
                  isTestPayment
                />
              )}
            </div>
            
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
              {t('checkout.realPaymentWarning')}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}