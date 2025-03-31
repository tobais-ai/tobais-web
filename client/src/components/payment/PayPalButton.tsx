import { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useToast } from '../../hooks/use-toast';
import { apiRequest } from '../../lib/queryClient';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '../../hooks/use-translation';

interface PayPalButtonProps {
  amount: number;
  onSuccess?: (details: any) => void;
  onError?: (error: any) => void;
  isTestPayment?: boolean;
}

export function PayPalButton({ amount, onSuccess, onError, isTestPayment = false }: PayPalButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Asegúrese de que el monto se redondee a 2 decimales
  const formattedAmount = parseFloat(amount.toFixed(2));

  if (!import.meta.env.VITE_PAYPAL_CLIENT_ID) {
    return (
      <div className="p-4 text-red-500 bg-red-50 border border-red-100 rounded-md">
        {t('checkout.paypalMissingConfig')}
      </div>
    );
  }

  const createOrder = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('POST', '/api/create-paypal-order', {
        amount: formattedAmount,
        isTestPayment
      });
      
      const data = await response.json();
      return data.id;
    } catch (error: any) {
      toast({
        title: t('checkout.errorCreatingOrder'),
        description: error.message,
        variant: 'destructive'
      });
      if (onError) onError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const onApprove = async (data: { orderID: string }) => {
    setLoading(true);
    try {
      const response = await apiRequest('POST', '/api/capture-paypal-order', {
        orderId: data.orderID
      });
      
      const orderData = await response.json();
      
      toast({
        title: t('checkout.paymentSuccessful'),
        description: t('checkout.transactionCompleted')
      });
      
      if (onSuccess) onSuccess(orderData);
      return orderData;
    } catch (error: any) {
      toast({
        title: t('checkout.paymentFailed'),
        description: error.message,
        variant: 'destructive'
      });
      if (onError) onError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {loading && (
        <div className="flex justify-center items-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">{t('checkout.processing')}</span>
        </div>
      )}
      
      <PayPalScriptProvider options={{ 
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID as string,
        currency: "USD",
        intent: "capture"
      }}>
        <PayPalButtons
          style={{ 
            layout: "vertical",
            shape: "rect",
            color: "blue"
          }}
          disabled={loading}
          fundingSource={undefined}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={(err: any) => {
            console.error("Error processing PayPal payment:", err);
            const errorMessage = typeof err === 'object' && err.message ? err.message : 'Error processing payment';
            toast({
              title: t('checkout.paymentFailed'),
              description: errorMessage,
              variant: 'destructive'
            });
            if (onError) onError(err);
          }}
          onCancel={() => {
            toast({
              title: t('checkout.paymentCancelled'),
              description: t('checkout.paymentCancelledDescription'),
              variant: 'destructive'
            });
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}