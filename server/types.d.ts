// TypeScript declaration file for modules without types

declare module '@paypal/checkout-server-sdk' {
  export class PayPalHttpClient {
    constructor(environment: Environment);
    execute<T>(request: any): Promise<{ result: T }>;
  }
  
  export interface Environment {
    clientId: string;
    clientSecret: string;
  }
  
  export class SandboxEnvironment implements Environment {
    constructor(clientId: string, clientSecret: string);
    clientId: string;
    clientSecret: string;
  }
  
  export class LiveEnvironment implements Environment {
    constructor(clientId: string, clientSecret: string);
    clientId: string;
    clientSecret: string;
  }
}