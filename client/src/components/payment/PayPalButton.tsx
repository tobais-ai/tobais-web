import { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useToast } from '../../hooks/use-toast';
import { apiRequest } from '../../lib/queryClient';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { useTranslation } from '../../hooks/use-translation';
import { Button } from '@/components/ui/button';

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
  
  // Estado para controlar errores de autenticación
  const [authError, setAuthError] = useState<string | null>(null);
  // Estado para controlar si se está verificando la configuración
  const [isVerifying, setIsVerifying] = useState(true);
  // Estado para los errores generales
  const [generalError, setGeneralError] = useState<string | null>(null);
  
  // Asegúrese de que el monto se redondee a 2 decimales
  const formattedAmount = parseFloat(amount.toFixed(2));

  // Verificar configuración de PayPal usando el nuevo endpoint
  const verifyPayPalConfig = async () => {
    // Resetear estados
    setIsVerifying(true);
    setAuthError(null);
    setGeneralError(null);
    
    // Verificar que exista la variable de entorno
    if (!import.meta.env.VITE_PAYPAL_CLIENT_ID) {
      setGeneralError(t('checkout.paypalMissingConfig'));
      setIsVerifying(false);
      return;
    }
    
    try {
      // Usar el nuevo endpoint para verificar el estado de PayPal
      const response = await apiRequest('GET', '/api/check-paypal-status');
      const status = await response.json();
      
      if (!status.initialized) {
        // PayPal no está inicializado correctamente
        if (status.clientIdConfigured) {
          // Hay credenciales configuradas pero no funcionan
          setAuthError(t('checkout.paypalAuthError'));
        } else {
          // No hay credenciales configuradas
          setGeneralError(t('checkout.paypalMissingConfig'));
        }
      }
      // Si está inicializado, no hay errores que mostrar
    } catch (error: any) {
      console.error('PayPal configuration verification error:', error);
      // Error al verificar el estado de PayPal
      setGeneralError(error.message || t('checkout.unexpectedError'));
    } finally {
      setIsVerifying(false);
    }
  };
  
  // Ejecutar verificación al cargar el componente
  useEffect(() => {
    verifyPayPalConfig();
  }, [t]);

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
      console.error('Error creating PayPal order:', error);
      
      // Mejorar manejo de errores
      let errorMessage = error.message;
      let shouldRetryConfig = false;
      
      // Si es un error del servicio de PayPal no disponible, actualizar UI
      if (error.status === 503 || (error.data && error.data.code === 'PAYPAL_NOT_INITIALIZED')) {
        errorMessage = t('checkout.paypalServiceUnavailable');
        shouldRetryConfig = true;
        // Forzar una nueva verificación de la configuración
        setAuthError(t('checkout.paypalAuthError'));
      }
      // Detectar errores específicos de autenticación
      else if (error.status === 401 || 
          error.data?.code === 'PAYPAL_AUTH_FAILED' || 
          errorMessage.includes('authentication')) {
        errorMessage = t('checkout.paypalAuthError');
        shouldRetryConfig = true;
        // Forzar una nueva verificación de la configuración
        setAuthError(t('checkout.paypalAuthError'));
      }
      
      // Solo mostrar toast si no vamos a actualizar la UI
      if (!shouldRetryConfig) {
        toast({
          title: t('checkout.errorCreatingOrder'),
          description: errorMessage,
          variant: 'destructive'
        });
      }
      
      if (onError) onError(error);
      
      // Si necesitamos verificar la configuración, no lanzar el error para evitar errores en la consola
      // ya que vamos a mostrar un UI específico
      if (!shouldRetryConfig) {
        throw error;
      } else {
        // Forzar una nueva verificación
        verifyPayPalConfig();
        // Detener la ejecución sin lanzar error
        return Promise.reject("PayPal not available");
      }
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
      console.error('Error capturing PayPal order:', error);
      
      // Mejorar manejo de errores
      let errorMessage = error.message;
      let shouldRetryConfig = false;
      
      // Si es un error del servicio de PayPal no disponible, actualizar UI
      if (error.status === 503 || (error.data && error.data.code === 'PAYPAL_NOT_INITIALIZED')) {
        errorMessage = t('checkout.paypalServiceUnavailable');
        shouldRetryConfig = true;
        // Forzar una nueva verificación de la configuración
        setAuthError(t('checkout.paypalAuthError'));
      }
      // Detectar errores específicos de autenticación
      else if (error.status === 401 || 
          error.data?.code === 'PAYPAL_AUTH_FAILED' || 
          errorMessage.includes('authentication')) {
        errorMessage = t('checkout.paypalAuthError');
        shouldRetryConfig = true;
        // Forzar una nueva verificación de la configuración
        setAuthError(t('checkout.paypalAuthError'));
      }
      
      // Solo mostrar toast si no vamos a actualizar la UI
      if (!shouldRetryConfig) {
        toast({
          title: t('checkout.paymentFailed'),
          description: errorMessage,
          variant: 'destructive'
        });
      }
      
      if (onError) onError(error);
      
      // Si necesitamos verificar la configuración, no lanzar el error
      if (!shouldRetryConfig) {
        throw error;
      } else {
        // Forzar una nueva verificación
        verifyPayPalConfig();
        // Detener la ejecución sin lanzar error
        return Promise.reject("PayPal not available");
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Componente para mostrar error de configuración
  const ConfigurationError = ({ message, isAuth = false }: { message: string, isAuth?: boolean }) => (
    <div className="p-6 text-red-500 bg-red-50 border border-red-100 rounded-md">
      <div className="flex items-start mb-3">
        <AlertCircle className="h-6 w-6 mr-2 flex-shrink-0" />
        <p className="font-medium">{isAuth ? t('checkout.paypalAuthError') : t('checkout.configurationError')}</p>
      </div>
      <p className="text-sm mb-4">{message}</p>
      <p className="text-sm mb-4">{t('checkout.contactAdministrator')}</p>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center" 
        onClick={verifyPayPalConfig}
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        {t('common.retry')}
      </Button>
    </div>
  );
  
  // Mostrar indicador de carga durante la verificación
  if (isVerifying) {
    return (
      <div className="w-full p-8 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-gray-600 dark:text-gray-300">{t('checkout.verifyingPayPal')}</p>
      </div>
    );
  }
  
  // Mostrar error de configuración si no hay ID de cliente
  if (!import.meta.env.VITE_PAYPAL_CLIENT_ID) {
    return <ConfigurationError message={t('checkout.paypalMissingConfig')} />;
  }
  
  // Mostrar error de autenticación
  if (authError) {
    return <ConfigurationError message={authError} isAuth={true} />;
  }
  
  // Mostrar error general
  if (generalError) {
    return <ConfigurationError message={generalError} />;
  }
  
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