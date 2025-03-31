// Importamos los módulos necesarios del SDK de PayPal
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
// @ts-ignore - Usar require para módulos que no soportan completamente ESM
const paypalSdk = require('@paypal/checkout-server-sdk');

// Configura el entorno de PayPal basado en si estamos en producción o desarrollo
const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.warn('Warning: Missing PayPal credentials. PayPal payments will not work properly.');
}

// Determine el entorno según las variables de entorno
const environment = process.env.NODE_ENV === 'production'
  ? new paypalSdk.core.LiveEnvironment(clientId, clientSecret)
  : new paypalSdk.core.SandboxEnvironment(clientId, clientSecret);

// Crea y exporta el cliente HTTP de PayPal
export const paypalClient = new paypalSdk.core.PayPalHttpClient(environment);

// Función para crear una orden de PayPal
export async function createPayPalOrder(amount: number, currency: string = 'USD') {
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

  try {
    const order = await paypalClient.execute(request);
    return order.result;
  } catch (err) {
    console.error('Error creating PayPal order:', err);
    throw err;
  }
}

// Función para capturar un pago de PayPal
export async function capturePayPalOrder(orderId: string) {
  const request = new PayPalOrdersCaptureRequest(orderId);
  request.requestBody({});

  try {
    const capture = await paypalClient.execute(request);
    return capture.result;
  } catch (err) {
    console.error('Error capturing PayPal payment:', err);
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
  requestBody(body: any) {
    this.body = body;
  }
  body: any;

  constructor(orderId: string) {
    this.path = `/v2/checkout/orders/${orderId}/capture`;
  }

  headers() {
    return {
      'Content-Type': 'application/json',
    };
  }
}