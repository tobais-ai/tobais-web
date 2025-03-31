import { ServiceType } from "@shared/schema";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatCurrency } from "@/lib/utils";

interface OrderSummaryProps {
  service: ServiceType | undefined;
}

export default function OrderSummary({ service }: OrderSummaryProps) {
  // Return placeholder if service is undefined
  if (!service) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Loading...
        </h2>
      </div>
    );
  }
  const { t, language } = useLanguage();
  
  // Display service name and description based on language
  const serviceName = language === 'es' && service.nameEs ? service.nameEs : service.name;
  const serviceDescription = language === 'es' && service.descriptionEs 
    ? service.descriptionEs 
    : service.description;
  
  // Calculate tax and total (simplified for demo)
  const tax = Math.round(service.price * 0.08 * 100) / 100; // 8% tax
  const total = service.price + tax;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        {t("checkout.orderSummary")}
      </h2>
      
      <div className="space-y-4">
        <div className="flex flex-col">
          <h3 className="font-medium text-gray-900 dark:text-white text-lg mb-2">
            {serviceName}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {serviceDescription}
          </p>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-2">
          <div className="flex justify-between text-gray-600 dark:text-gray-300">
            <span>{t("checkout.subtotal")}</span>
            <span>{formatCurrency(service.price)}</span>
          </div>
          
          <div className="flex justify-between text-gray-600 dark:text-gray-300">
            <span>{t("checkout.tax")}</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex justify-between font-semibold text-gray-900 dark:text-white">
            <span>{t("checkout.total")}</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
      
      {service.icon && (
        <div className="mt-6 flex justify-center">
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
            <img
              src={service.icon}
              alt={serviceName}
              className="w-16 h-16 object-contain"
            />
          </div>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        <p>{t("checkout.guaranteeMessage")}</p>
      </div>
    </div>
  );
}