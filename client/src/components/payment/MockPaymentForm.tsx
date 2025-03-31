import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { CreditCard, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useLocation } from "wouter";

const expiryYears = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);
const expiryMonths = Array.from({ length: 12 }, (_, i) => i + 1);

export default function MockPaymentForm() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryMonth: "1",
    expiryYear: new Date().getFullYear().toString(),
    cvc: ""
  });

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");
    // Add a space after every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    
    if (name === "cardNumber") {
      value = formatCardNumber(value);
    } else if (name === "cvc") {
      value = value.replace(/\D/g, "").slice(0, 3);
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Redirect to success page
      setLocation("/payment-success");
    }, 2000);
  };

  const isFormValid = () => {
    const { cardNumber, cardHolder, cvc } = formData;
    return (
      cardNumber.replace(/\s/g, "").length === 16 &&
      cardHolder.trim().length > 0 &&
      cvc.length === 3
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="cardNumber" className="text-gray-700 dark:text-gray-300">
            {t("payment.cardNumber")}
          </Label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CreditCard className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              id="cardNumber"
              name="cardNumber"
              type="text"
              inputMode="numeric"
              value={formData.cardNumber}
              onChange={handleChange}
              className="pl-10"
              placeholder="4242 4242 4242 4242"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="cardHolder" className="text-gray-700 dark:text-gray-300">
            {t("payment.cardHolder")}
          </Label>
          <Input
            id="cardHolder"
            name="cardHolder"
            type="text"
            value={formData.cardHolder}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="flex space-x-4">
          <div className="w-2/3">
            <Label htmlFor="expiry" className="text-gray-700 dark:text-gray-300">
              {t("payment.expiryDate")}
            </Label>
            <div className="flex space-x-2 mt-1">
              <Select
                value={formData.expiryMonth}
                onValueChange={(value) => handleSelectChange("expiryMonth", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {expiryMonths.map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      {month.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={formData.expiryYear}
                onValueChange={(value) => handleSelectChange("expiryYear", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="YYYY" />
                </SelectTrigger>
                <SelectContent>
                  {expiryYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="w-1/3">
            <Label htmlFor="cvc" className="text-gray-700 dark:text-gray-300">
              {t("payment.cvc")}
            </Label>
            <Input
              id="cvc"
              name="cvc"
              type="text"
              inputMode="numeric"
              value={formData.cvc}
              onChange={handleChange}
              placeholder="123"
              required
              maxLength={3}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          className="w-full bg-primary-600 hover:bg-primary-700"
          disabled={!isFormValid() || isProcessing}
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t("checkout.processing")}
            </>
          ) : (
            t("checkout.payNow")
          )}
        </Button>
        
        <div className="flex items-center justify-center mt-4 text-sm text-gray-500 dark:text-gray-400">
          <Lock className="h-3.5 w-3.5 mr-1.5" />
          <span>{t("checkout.securePayment")}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-2 pt-2">
        <img src="https://cdn.jsdelivr.net/gh/creativetimofficial/public-assets@master/soft-ui-design-system/assets/img/logos/mastercard.png" 
             alt="mastercard" className="h-8" />
        <img src="https://cdn.jsdelivr.net/gh/creativetimofficial/public-assets@master/soft-ui-design-system/assets/img/logos/visa.png" 
             alt="visa" className="h-8" />
        <img src="https://cdn.jsdelivr.net/gh/creativetimofficial/public-assets@master/soft-ui-design-system/assets/img/logos/american-express.png" 
             alt="american express" className="h-8" />
      </div>
    </form>
  );
}