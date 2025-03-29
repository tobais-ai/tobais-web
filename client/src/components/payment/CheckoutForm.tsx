import { useState } from "react";
import { useLocation } from "wouter";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: window.location.origin + "/payment-success",
      },
      redirect: "if_required"
    });

    if (error) {
      toast({
        title: t("checkout.paymentFailed"),
        description: error.message || t("checkout.tryAgain"),
        variant: "destructive",
      });
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      toast({
        title: t("checkout.paymentSuccessful"),
        description: t("checkout.thankYou"),
      });
      
      // Redirect to success page
      setLocation("/payment-success");
    } else {
      toast({
        title: t("checkout.unexpectedState"),
        description: t("checkout.contactSupport"),
        variant: "destructive",
      });
    }

    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement />
      
      <div className="mt-6">
        <Button
          disabled={isProcessing || !stripe || !elements}
          type="submit"
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("checkout.processing")}
            </>
          ) : (
            t("checkout.payNow")
          )}
        </Button>
      </div>
      
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
        {t("checkout.securePayment")}
      </p>
    </form>
  );
}