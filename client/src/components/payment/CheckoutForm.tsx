import { useState } from "react";
import { useLocation } from "wouter";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, CreditCard, Calendar, CreditCardIcon, Lock } from "lucide-react";
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

  // Form states for custom payment form
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // Use custom card form instead of Stripe's element when Stripe is not available
  const [useCustomForm, setUseCustomForm] = useState(!stripe);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (stripe && elements && !useCustomForm) {
      // Real Stripe integration
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
      } catch (err) {
        toast({
          title: t("checkout.paymentFailed"),
          description: t("checkout.tryAgain"),
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Mockup payment flow
      setIsProcessing(true);
      
      // Simulate payment processing
      setTimeout(() => {
        toast({
          title: t("checkout.paymentSuccessful"),
          description: t("checkout.thankYou"),
        });
        
        // Simulate redirect to success page
        setTimeout(() => {
          setLocation("/payment-success");
        }, 1000);
        
        setIsProcessing(false);
      }, 2000);
    }
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

  // Format card number input (add spaces every 4 digits)
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Custom card input component
  const CustomCardForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="cardholderName">Cardholder Name</Label>
        <Input
          id="cardholderName"
          placeholder="Name on card"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="cardNumber">Card Number</Label>
        <div className="relative">
          <CreditCardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <Input
            id="cardNumber"
            className="pl-10"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            maxLength={19}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
            <Input
              id="expiryDate"
              className="pl-10"
              placeholder="MM/YY"
              value={expiryDate}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, '');
                if (value.length <= 4) {
                  let formattedValue = value;
                  if (value.length > 2) {
                    formattedValue = value.substring(0, 2) + '/' + value.substring(2);
                  }
                  setExpiryDate(formattedValue);
                }
              }}
              maxLength={5}
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="cvv">CVV</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
            <Input
              id="cvv"
              className="pl-10"
              placeholder="123"
              value={cvv}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, '');
                if (value.length <= 4) {
                  setCvv(value);
                }
              }}
              maxLength={4}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

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
            {stripe && elements && !useCustomForm ? (
              <PaymentElement />
            ) : (
              <CustomCardForm />
            )}
            
            <div className="mt-6">
              <Button
                disabled={isProcessing || (useCustomForm && (!cardholderName || cardNumber.length < 15 || expiryDate.length < 5 || cvv.length < 3))}
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