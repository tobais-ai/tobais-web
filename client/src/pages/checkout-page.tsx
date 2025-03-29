import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CheckoutForm from "@/components/payment/CheckoutForm";
import OrderSummary from "@/components/payment/OrderSummary";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { ServiceType } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

// This is your test publishable API key.
// In production, use your live key from environment variables
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || 
  "pk_test_51OdXYBIultrI0oDpYLTcr5L0d3g5Mws2sCCnAX2LvJQTSGWH8d6aNkQynYHlVNYfG5iNIZQR4yyyaY5XEkrQRLz600UxPyDf0F"
);

export default function CheckoutPage() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [clientSecret, setClientSecret] = useState("");
  const [serviceId, setServiceId] = useState<number | null>(null);

  // Extract serviceId from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1]);
    const id = params.get("serviceId");
    if (id) {
      setServiceId(parseInt(id, 10));
    }
  }, [location]);

  // Fetch service details
  const { data: service, isLoading: isLoadingService } = useQuery<ServiceType>({
    queryKey: ["/api/services", serviceId],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!serviceId,
  });

  // Create payment intent when service is selected
  useEffect(() => {
    if (service) {
      // Create PaymentIntent as soon as the page loads with the service price
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: service.price,
          serviceId: service.id 
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else if (data.message) {
            console.error("Error:", data.message);
          }
        })
        .catch((err) => {
          console.error("Error creating payment intent:", err);
        });
    }
  }, [service]);

  // Loading state
  if (isLoadingService || !service) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 dark:text-white">
              {t("checkout.loading")}
            </h2>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // No service found
  if (!serviceId || !service) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="text-center max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t("checkout.noServiceSelected")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t("checkout.pleaseSelectService")}
            </p>
            <a 
              href="/services" 
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              {t("checkout.browseServices")}
            </a>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            {t("checkout.title")}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Order Summary - 2 columns */}
            <div className="lg:col-span-2">
              <OrderSummary service={service} />
            </div>

            {/* Payment Form - 3 columns */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {t("checkout.paymentInformation")}
                </h2>

                {clientSecret ? (
                  <Elements
                    stripe={stripePromise}
                    options={{ clientSecret, appearance: { theme: 'stripe' } }}
                  >
                    <CheckoutForm />
                  </Elements>
                ) : (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
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