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
import { Loader2, CreditCard } from "lucide-react";
import { FaPaypal } from "react-icons/fa";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");

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

  const handlePayPalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate PayPal payment process
    setTimeout(() => {
      toast({
        title: t("checkout.paymentSuccessful"),
        description: t("checkout.thankYou"),
      });
      
      // Redirect to success page
      setLocation("/payment-success");
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div>
      <Tabs defaultValue="card" className="w-full mb-6" onValueChange={(value) => setPaymentMethod(value as "card" | "paypal")}>
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="card" className="flex items-center">
            <CreditCard className="w-4 h-4 mr-2" />
            Credit Card
          </TabsTrigger>
          <TabsTrigger value="paypal" className="flex items-center">
            <FaPaypal className="w-4 h-4 mr-2" />
            PayPal
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="card">
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
          </form>
        </TabsContent>
        
        <TabsContent value="paypal">
          <form id="paypal-form" onSubmit={handlePayPalSubmit}>
            <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800 mb-6">
              <div className="flex items-center justify-center py-8">
                <FaPaypal className="w-12 h-12 text-blue-600" />
              </div>
              <p className="text-center text-gray-700 dark:text-gray-300 mb-4">
                Conectarse con PayPal para procesar su pago de forma segura.
              </p>
            </div>
            
            <div className="mt-6">
              <Button
                disabled={isProcessing}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("checkout.processing")}
                  </>
                ) : (
                  <span className="flex items-center justify-center">
                    <FaPaypal className="mr-2 h-4 w-4" />
                    {t("checkout.payNow")} con PayPal
                  </span>
                )}
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
      
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
        {t("checkout.securePayment")}
      </p>

      <div className="flex items-center justify-center mt-6 gap-4">
        <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" className="h-8" />
        <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="MasterCard" className="h-8" />
        <img src="https://cdn-icons-png.flaticon.com/512/196/196565.png" alt="PayPal" className="h-8" />
        <img src="https://cdn-icons-png.flaticon.com/512/196/196539.png" alt="American Express" className="h-8" />
      </div>
    </div>
  );
}