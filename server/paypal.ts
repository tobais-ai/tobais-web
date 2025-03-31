// Importamos los módulos necesarios del SDK de PayPal
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Variables para control de estado
let paypalInitialized = false;
let paypalSdk: any;
let paypalClient: any;
let environment: any;

// Configura el entorno de PayPal basado en si estamos en producción o desarrollo
const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

// Verificar y validar credenciales de PayPal
if (!clientId || !clientSecret) {
  console.warn('Warning: Missing PayPal credentials. PayPal payments will not work properly.');
  // No lanzar error para permitir que la aplicación continúe funcionando
} else {
  try {
    // @ts-ignore - Usar require para módulos que no soportan completamente ESM
    paypalSdk = require('@paypal/checkout-server-sdk');
    
    // Inicializar el entorno
    environment = process.env.NODE_ENV === 'production'
      ? new paypalSdk.core.LiveEnvironment(clientId, clientSecret)
      : new paypalSdk.core.SandboxEnvironment(clientId, clientSecret);
    
    // Crear el cliente HTTP de PayPal
    paypalClient = new paypalSdk.core.PayPalHttpClient(environment);
    
    paypalInitialized = true;
    console.log('PayPal configuration initialized with client ID:', clientId.substring(0, 5) + '...');
  } catch (error) {
    console.error('Error initializing PayPal SDK:', error);
    paypalInitialized = false;
  }
}

// Función para verificar el estado de la configuración de PayPal
export function isPayPalInitialized() {
  return paypalInitialized && !!paypalClient;
}

// Exportar el cliente HTTP de PayPal (puede ser null)
export { paypalClient };

// Función para crear una orden de PayPal
export async function createPayPalOrder(amount: number, currency: string = 'USD') {
  // Verificar si PayPal está configurado correctamente
  if (!isPayPalInitialized()) {
    throw new Error('PayPal is not initialized. Check your PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET');
  }

  // Verificar que el SDK y el cliente están disponibles
  if (!paypalSdk || !paypalClient) {
    throw new Error('PayPal SDK or client is not available');
  }

  try {
    // Crear la solicitud de la orden
    const request = new PayPalOrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
        },
      ],
    });

    // Ejecutar la solicitud
    const order = await paypalClient.execute(request);
    return order.result;
  } catch (err: any) {
    console.error('Error creating PayPal order:', err);
    
    // Mejorar el mensaje de error para facilitar la depuración
    if (err.statusCode === 401) {
      throw new Error('PayPal authentication failed. Please check your credentials (PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET)');
    }
    
    throw err;
  }
}

// Función para capturar un pago de PayPal
export async function capturePayPalOrder(orderId: string) {
  // Verificar si PayPal está configurado correctamente
  if (!isPayPalInitialized()) {
    throw new Error('PayPal is not initialized. Check your PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET');
  }

  // Verificar que el SDK y el cliente están disponibles
  if (!paypalSdk || !paypalClient) {
    throw new Error('PayPal SDK or client is not available');
  }

  try {
    const request = new PayPalOrdersCaptureRequest(orderId);
    request.requestBody({});
    const capture = await paypalClient.execute(request);
    return capture.result;
  } catch (err: any) {
    console.error('Error capturing PayPal payment:', err);
    
    // Mejorar el mensaje de error para facilitar la depuración
    if (err.statusCode === 401) {
      throw new Error('PayPal authentication failed. Please check your credentials');
    }
    
    throw err;
  }
}

// Clases para los requests de PayPal
class PayPalOrdersCreateRequest {
  preferHeader: string | null = null;
  body: any;

  path = '/v2/checkout/orders';
  method = 'POST';
  
  requestBody(body: any) {
    this.body = body;
  }
  
  prefer(value: string) {
    this.preferHeader = value;
  }

  headers() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.preferHeader) {
      headers.Prefer = this.preferHeader;
    }
    return headers;
  }
}

class PayPalOrdersCaptureRequest {
  path: string;
  method = 'POST';
  body: any;

  constructor(orderId: string) {
    this.path = `/v2/checkout/orders/${orderId}/capture`;
  }
  
  requestBody(body: any) {
    this.body = body;
  }

  headers() {
    return {
      'Content-Type': 'application/json',
    };
  }
}