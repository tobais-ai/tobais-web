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
  const [invoiceIds, setInvoiceIds] = useState<number[]>([]);
  const [checkoutType, setCheckoutType] = useState<'service' | 'invoice'>('service');
  const [amount, setAmount] = useState<number | null>(null);

  // Extract parameters from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1]);
    
    // Check checkout type
    const type = params.get("type");
    if (type === "invoice") {
      setCheckoutType('invoice');
      
      // Handle invoice checkout
      const invoiceIdsParam = params.get("invoiceIds");
      const amountParam = params.get("amount");
      
      if (invoiceIdsParam) {
        setInvoiceIds(invoiceIdsParam.split(',').map(id => parseInt(id, 10)));
      }
      
      if (amountParam) {
        setAmount(parseFloat(amountParam));
      }
    } else {
      // Handle service checkout
      const id = params.get("serviceId");
      if (id) {
        setServiceId(parseInt(id, 10));
      }
    }
  }, [location]);

  // Fetch service details if it's a service checkout
  const { data: service, isLoading: isLoadingService } = useQuery<ServiceType>({
    queryKey: ["/api/services", serviceId],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!serviceId && checkoutType === 'service',
  });

  // Create payment intent for either service or invoices
  useEffect(() => {
    if (checkoutType === 'service' && service) {
      // Create PaymentIntent for service purchase
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
    } else if (checkoutType === 'invoice' && invoiceIds.length > 0 && amount) {
      // Create PaymentIntent for invoice payment
      fetch("/api/create-invoice-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: amount,
          invoiceIds: invoiceIds
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
  }, [service, checkoutType, invoiceIds, amount]);

  // Loading state for services
  const isLoading = (checkoutType === 'service' && (isLoadingService || !service)) || 
                    (checkoutType === 'invoice' && (!amount || invoiceIds.length === 0));
                    
  if (isLoading) {
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

  // No service/invoice found
  if ((checkoutType === 'service' && (!serviceId || !service)) || 
      (checkoutType === 'invoice' && invoiceIds.length === 0)) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="text-center max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {checkoutType === 'service' 
                ? t("checkout.noServiceSelected")
                : t("checkout.noInvoicesSelected")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {checkoutType === 'service'
                ? t("checkout.pleaseSelectService")
                : t("checkout.pleaseSelectInvoices")}
            </p>
            <a 
              href={checkoutType === 'service' ? "/services" : "/dashboard"} 
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              {checkoutType === 'service'
                ? t("checkout.browseServices")
                : t("checkout.backToDashboard")}
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Create Invoice Summary component for when checkoutType is 'invoice'
  const InvoiceSummary = () => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t("checkout.invoiceSummary")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {t("checkout.invoiceSummaryDesc").replace('{count}', invoiceIds.length.toString())}
          </p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                {t("checkout.invoiceCount")}
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {invoiceIds.length}
              </span>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("checkout.total")}
                </span>
                <span className="text-lg font-bold text-primary-600 dark:text-primary-500">
                  ${amount?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
              {checkoutType === 'service' ? (
                <OrderSummary service={service} />
              ) : (
                <InvoiceSummary />
              )}
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