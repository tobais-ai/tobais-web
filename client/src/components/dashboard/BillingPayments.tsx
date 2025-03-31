import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, CreditCard, DollarSign, FileText, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/payment/CheckoutForm";
import { useToast } from "@/hooks/use-toast";

// Initialize Stripe with the public key
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.error('Missing Stripe public key. Payments will not work correctly.');
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Mock invoice data (will be replaced with actual API data)
interface Invoice {
  id: number;
  description: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  serviceType: string;
  invoiceNumber: string;
}

export default function BillingPayments() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const [selectedInvoices, setSelectedInvoices] = useState<number[]>([]);
  
  // Mock data - will be replaced with actual API fetch
  const { data: invoices, isLoading } = useQuery<Invoice[]>({
    queryKey: ["/api/user/invoices"],
    enabled: !!user,
    // This is a temporary mock implementation
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return [
        {
          id: 1,
          description: "Web Design Services - Monthly Maintenance",
          amount: 99.00,
          status: 'pending',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          serviceType: "Maintenance",
          invoiceNumber: "INV-2025-001"
        },
        {
          id: 2,
          description: "Social Media Management - Mar 2025",
          amount: 149.00,
          status: 'pending',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          serviceType: "Marketing",
          invoiceNumber: "INV-2025-002"
        },
        {
          id: 3,
          description: "SEO Optimization - Q1 2025",
          amount: 299.00,
          status: 'overdue',
          dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          serviceType: "SEO",
          invoiceNumber: "INV-2025-003"
        },
        {
          id: 4,
          description: "Content Writing - Blog Posts Feb 2025",
          amount: 199.00,
          status: 'paid',
          dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          serviceType: "Content",
          invoiceNumber: "INV-2025-004"
        }
      ];
    }
  });
  
  const pendingInvoices = invoices?.filter(invoice => invoice.status === 'pending' || invoice.status === 'overdue') || [];
  const paidInvoices = invoices?.filter(invoice => invoice.status === 'paid') || [];
  
  const toggleInvoiceSelection = (invoiceId: number) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId)
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };
  
  const selectedTotal = invoices
    ?.filter(invoice => selectedInvoices.includes(invoice.id))
    .reduce((sum, invoice) => sum + invoice.amount, 0) || 0;
  
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);
  
  const handlePaySelected = async () => {
    if (selectedInvoices.length === 0) return;
    
    const selectedInvoiceObjects = invoices?.filter(invoice => selectedInvoices.includes(invoice.id)) || [];
    const totalAmount = selectedInvoiceObjects.reduce((sum, invoice) => sum + invoice.amount, 0);
    
    setIsCreatingIntent(true);
    
    try {
      // Create a payment intent for the selected invoices
      const response = await fetch('/api/create-invoice-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          invoiceIds: selectedInvoices
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }
      
      const data = await response.json();
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setShowPaymentForm(true);
      } else {
        throw new Error('No client secret returned');
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
    } finally {
      setIsCreatingIntent(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': 
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          <Clock className="w-3 h-3 mr-1" />
          {t("billing.pending")}
        </Badge>;
      case 'paid': 
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle className="w-3 h-3 mr-1" />
          {t("billing.paid")}
        </Badge>;
      case 'overdue': 
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          <FileText className="w-3 h-3 mr-1" />
          {t("billing.overdue")}
        </Badge>;
      default: 
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("billing.title")}</CardTitle>
          <CardDescription>{t("billing.description")}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  // Options for Stripe Elements
  const options = clientSecret ? {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#6366f1',
      },
    },
  } : {};

  // Reset the payment form
  const handleClosePaymentForm = () => {
    setShowPaymentForm(false);
    setClientSecret("");
  };

  // Payment form modal
  const PaymentFormModal = () => {
    const { toast } = useToast();
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4">
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("checkout.paymentInformation")}
            </h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClosePaymentForm}
              className="rounded-full h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                {t("checkout.orderSummary")}
              </h3>
              <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    {t("billing.selectedInvoices").replace('{count}', selectedInvoices.length.toString())}
                  </span>
                  <span className="font-medium">{selectedInvoices.length}</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  <span>{t("checkout.total")}</span>
                  <span className="text-primary-600 dark:text-primary-500">{formatCurrency(selectedTotal)}</span>
                </div>
              </div>
            </div>
            
            {clientSecret && (
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm />
              </Elements>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5" />
            {t("billing.title")}
          </CardTitle>
          <CardDescription>{t("billing.description")}</CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="pending" className="w-full">
          <CardContent>
            <TabsList className="mb-4">
              <TabsTrigger value="pending" className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                {t("billing.pendingInvoices")} 
                {pendingInvoices.length > 0 && 
                  <Badge variant="secondary" className="ml-2 bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400">
                    {pendingInvoices.length}
                  </Badge>
                }
              </TabsTrigger>
              <TabsTrigger value="history">
                <CheckCircle className="mr-2 h-4 w-4" />
                {t("billing.paymentHistory")}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="mt-0">
              {pendingInvoices.length > 0 ? (
                <div className="space-y-4">
                  {pendingInvoices.map(invoice => (
                    <div 
                      key={invoice.id} 
                      className={`border rounded-lg p-4 transition-all ${
                        selectedInvoices.includes(invoice.id) 
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-700' 
                          : 'hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <input 
                            type="checkbox" 
                            checked={selectedInvoices.includes(invoice.id)}
                            onChange={() => toggleInvoiceSelection(invoice.id)}
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                          />
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {invoice.description}
                            </h3>
                            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-2">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {invoice.invoiceNumber}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {invoice.serviceType}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {t("billing.dueDate")}: {invoice.dueDate}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-semibold text-gray-900 dark:text-white text-lg">
                            {formatCurrency(invoice.amount)}
                          </span>
                          <div className="mt-1">
                            {getStatusBadge(invoice.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {selectedInvoices.length > 0 && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {`${t("billing.selectedInvoices").replace('{count}', selectedInvoices.length.toString())}`}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white text-lg">
                          {formatCurrency(selectedTotal)}
                        </span>
                      </div>
                      <Button 
                        onClick={handlePaySelected} 
                        className="w-full"
                        size="lg"
                        disabled={isCreatingIntent}
                      >
                        {isCreatingIntent ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t("checkout.processing")}
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            {t("billing.payNow")}
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                    {t("billing.allPaid")}
                  </h3>
                  <p>{t("billing.noPendingInvoices")}</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="history" className="mt-0">
              {paidInvoices.length > 0 ? (
                <div className="space-y-4">
                  {paidInvoices.map(invoice => (
                    <div 
                      key={invoice.id} 
                      className="border rounded-lg p-4 transition-all hover:border-gray-300 dark:hover:border-gray-600"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {invoice.description}
                          </h3>
                          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {invoice.invoiceNumber}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {invoice.serviceType}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {t("billing.paidOn")}: {invoice.dueDate}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-semibold text-gray-900 dark:text-white text-lg">
                            {formatCurrency(invoice.amount)}
                          </span>
                          <div className="mt-1">
                            {getStatusBadge(invoice.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                    {t("billing.noPaymentHistory")}
                  </h3>
                  <p>{t("billing.noCompletedPayments")}</p>
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
        
        <CardFooter className="border-t p-6 bg-gray-50 dark:bg-gray-800/50">
          <div className="w-full space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-white">
              {t("billing.paymentMethods")}
            </h4>
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {t("billing.securePaymentMessage")}
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>
      
      {showPaymentForm && (
        <PaymentFormModal />
      )}
    </>
  );
}