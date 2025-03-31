import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Initialize Stripe with the public key
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.error('Missing Stripe public key. Payments will not work correctly.');
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function TestPaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error('Stripe has not loaded yet');
      toast({
        title: "Error",
        description: "Stripe has not initialized yet. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/payment-success",
        },
        redirect: "if_required"
      });

      if (error) {
        console.error('Payment error:', error);
        toast({
          title: "Payment Failed",
          description: error.message || "Please try again.",
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        toast({
          title: "Payment Successful",
          description: "Thank you for your payment of $1.00.",
        });
        
        // Redirect to success page
        setLocation("/payment-success");
      } else {
        console.log('Payment result:', paymentIntent);
        if (paymentIntent && paymentIntent.next_action) {
          toast({
            title: "Additional Authentication Required",
            description: "Please follow the instructions to complete the payment.",
          });
        } else {
          toast({
            title: "Unexpected Payment State",
            description: "Please contact support.",
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      console.error('Payment submission error:', err);
      toast({
        title: "Payment Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      
      <Button 
        disabled={isProcessing || !stripe || !elements}
        type="submit"
        className="w-full mt-4"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Pay $1.00"
        )}
      </Button>
    </form>
  );
}

export default function TestPaymentPage() {
  const [clientSecret, setClientSecret] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Create test payment intent
    fetch('/api/test-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Test payment intent created:', data);
        setClientSecret(data.clientSecret);
        toast({
          title: "Test Payment Ready",
          description: `Created test payment intent for $${data.amount.toFixed(2)}`,
        });
      })
      .catch(error => {
        console.error('Error creating test payment:', error);
        toast({
          title: "Error",
          description: "Failed to create test payment. See console for details.",
          variant: "destructive",
        });
      });
  }, [toast]);

  if (!clientSecret) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 dark:text-white">
              Creating test payment...
            </h2>
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
              Test Payment ($1.00)
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
              This is a test payment of $1.00 to verify the Stripe integration.
            </p>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <TestPaymentForm />
              </Elements>
            </div>
            
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
              This is a real payment that will charge your card $1.00.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}