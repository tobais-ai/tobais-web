import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, CreditCard, AlertCircle, CheckCircle2 } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { PayPalButton } from "@/components/payment/PayPalButton";
import { apiRequest } from "@/lib/queryClient";
import CheckoutForm from "@/components/payment/CheckoutForm";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

// Initialize Stripe with the public key if available
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const hasStripeKey = !!stripePublicKey;

// Safely attempt to load Stripe only if the key is available
const stripePromise = hasStripeKey 
  ? loadStripe(stripePublicKey) 
  : Promise.resolve(null);

export default function TestPaymentPage() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  // Test amount is always $1.00 USD
  const testAmount = 1.00;

  const handleCreateTestPayment = async () => {
    setIsLoading(true);
    setPaymentStatus('processing');
    setErrorMessage("");
    
    try {
      const response = await apiRequest('POST', '/api/test-payment', { 
        isTestPayment: true
      });
      
      const data = await response.json();
      console.log('Test payment response:', data);
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        toast({
          title: t("testPayment.intentCreated"),
          description: t("testPayment.readyForPayment"),
        });
      } else {
        throw new Error('No client secret returned');
      }
    } catch (error: any) {
      console.error('Error creating test payment:', error);
      setPaymentStatus('error');
      setErrorMessage(error.message);
      toast({
        title: t("testPayment.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayPalSuccess = () => {
    setPaymentStatus('success');
    toast({
      title: t("testPayment.success"),
      description: t("testPayment.paypalSuccessful"),
    });
  };

  const handlePayPalError = (error: any) => {
    setPaymentStatus('error');
    setErrorMessage(error.message || "PayPal payment failed");
    toast({
      title: t("testPayment.error"),
      description: error.message || t("testPayment.paypalFailed"),
      variant: "destructive",
    });
  };

  // Options for Stripe Elements
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#6366f1',
      },
    },
  };

  // Payment success UI
  if (paymentStatus === 'success') {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t("testPayment.success")}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t("testPayment.successMessage")}
            </p>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                {t("testPayment.backToDashboard")}
              </button>
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t("testPayment.title")}
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              {t("testPayment.subtitle")}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("testPayment.testDetails")}
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {t("testPayment.description")}
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">
                    {t("testPayment.amount")}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${testAmount.toFixed(2)} USD
                  </span>
                </div>
                
                {!clientSecret && (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <Button
                        onClick={handleCreateTestPayment}
                        disabled={isLoading}
                        className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            {t("testPayment.processing")}
                          </>
                        ) : (
                          t("testPayment.createPayment")
                        )}
                      </Button>
                    </div>

                    {paymentStatus === 'error' && (
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
                        <div className="flex">
                          <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                          <div>
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                              {t("testPayment.error")}
                            </h3>
                            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                              {errorMessage || t("testPayment.genericError")}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {clientSecret && (
                  <div className="space-y-6">
                    <div className="flex justify-center border-b border-gray-200 dark:border-gray-700 pb-4">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => setPaymentMethod('stripe')}
                          className={`py-2 px-4 rounded-md ${
                            paymentMethod === 'stripe'
                              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          <div className="flex items-center">
                            <CreditCard className="h-5 w-5 mr-2" />
                            {t("testPayment.creditCard")}
                          </div>
                        </button>
                        <button
                          onClick={() => setPaymentMethod('paypal')}
                          className={`py-2 px-4 rounded-md ${
                            paymentMethod === 'paypal'
                              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="font-semibold text-blue-600 mr-1">Pay</span>
                            <span className="font-semibold text-blue-800">Pal</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {paymentMethod === 'stripe' && stripePromise ? (
                      <Elements stripe={stripePromise} options={options}>
                        <CheckoutForm onSuccess={() => setPaymentStatus('success')} />
                      </Elements>
                    ) : paymentMethod === 'paypal' ? (
                      <div className="flex justify-center py-4">
                        <PayPalButton 
                          amount={testAmount} 
                          onSuccess={handlePayPalSuccess}
                          onError={handlePayPalError}
                          isTestPayment
                        />
                      </div>
                    ) : (
                      <div className="text-center py-4 text-amber-600 dark:text-amber-400">
                        <AlertCircle className="h-6 w-6 mx-auto mb-2" />
                        <p>{t("testPayment.stripeNotConfigured")}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}