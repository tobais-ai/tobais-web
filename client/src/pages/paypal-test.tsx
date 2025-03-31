import React, { useState, useEffect } from 'react';
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function PayPalTestPage() {
  const [loading, setLoading] = useState(true);
  const [paypalStatus, setPaypalStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkPayPalStatus();
  }, []);

  const checkPayPalStatus = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiRequest('GET', '/api/check-paypal-status');
      const status = await response.json();
      setPaypalStatus(status);
      
      console.log('PayPal status:', status);
      
      if (status.initialized) {
        toast({
          title: "PayPal está configurado correctamente",
          description: `Usando entorno ${status.environment} con endpoint ${status.apiEndpoint}`,
        });
      } else {
        toast({
          title: "PayPal no está configurado correctamente",
          description: status.message || "Hay un problema con la configuración de PayPal",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error('Error checking PayPal status:', err);
      setError(err.message || "Error al verificar el estado de PayPal");
      toast({
        title: "Error",
        description: err.message || "Error al verificar el estado de PayPal",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTestOrder = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('POST', '/api/create-paypal-order', {
        amount: 1.00,
        isTestPayment: true
      });
      
      const data = await response.json();
      console.log('Test order created:', data);
      
      toast({
        title: "Orden creada correctamente",
        description: `ID de la orden: ${data.id}`,
      });
      
      // Aquí podríamos redirigir a la página de checkout con PayPal
      window.open(`https://www.paypal.com/checkoutnow?token=${data.id}`, '_blank');
      
    } catch (err: any) {
      console.error('Error creating test order:', err);
      let errorMsg = err.message || "Error al crear la orden de prueba";
      
      // Intentar extraer más detalles si es posible
      try {
        if (err.data) {
          errorMsg = `${errorMsg}: ${JSON.stringify(err.data)}`;
        }
      } catch (e) {}
      
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Prueba de PayPal</CardTitle>
            <CardDescription>
              Esta página verifica la configuración de PayPal y permite hacer una prueba de pago.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p>Verificando configuración de PayPal...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                  <h3 className="font-medium text-lg mb-2">Estado de PayPal</h3>
                  
                  {paypalStatus ? (
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="mr-2">
                          {paypalStatus.initialized ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <p>
                          {paypalStatus.initialized 
                            ? "PayPal está inicializado correctamente" 
                            : "PayPal no está inicializado"}
                        </p>
                      </div>
                      
                      <div className="text-sm space-y-1 mt-2">
                        <p><strong>Entorno:</strong> {paypalStatus.environment || "No disponible"}</p>
                        <p><strong>API Endpoint:</strong> {paypalStatus.apiEndpoint || "No disponible"}</p>
                        <p><strong>Client ID configurado:</strong> {paypalStatus.clientIdConfigured ? "Sí" : "No"}</p>
                        <p><strong>Client Secret configurado:</strong> {paypalStatus.clientSecretConfigured ? "Sí" : "No"}</p>
                      </div>
                      
                      {paypalStatus.message && (
                        <p className={`text-sm mt-2 ${paypalStatus.initialized ? "text-green-600" : "text-red-600"}`}>
                          {paypalStatus.message}
                        </p>
                      )}
                    </div>
                  ) : error ? (
                    <div className="text-red-500">
                      <AlertCircle className="h-5 w-5 inline mr-2" />
                      {error}
                    </div>
                  ) : (
                    <p>No se pudo obtener el estado de PayPal.</p>
                  )}
                </div>
                
                <div className="flex flex-col gap-4">
                  <Button 
                    onClick={checkPayPalStatus}
                    variant="outline"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Verificar configuración de PayPal
                  </Button>
                  
                  <Button 
                    onClick={createTestOrder}
                    disabled={loading || !paypalStatus?.initialized}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Crear orden de prueba ($1.00 USD)
                  </Button>
                  
                  <Link href="/test-paypal" className="w-full">
                    <Button 
                      variant="secondary"
                      className="w-full"
                    >
                      Ir a la página de prueba de PayPal
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}