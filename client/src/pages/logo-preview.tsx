import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

// Importación de logos
import currentLogo from '@/assets/tobais-logo.png';
import logoVector from '@/assets/tobais-logo-vector.svg';
import logoAlt from '@/assets/tobais-logo-vector-alt.svg';
import logoModern from '@/assets/tobais-logo-vector-modern.svg';

export default function LogoPreviewPage() {
  const { t } = useLanguage();
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold mb-2">Vista previa de logos TOBAIS</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Opciones de logo vectorial para seleccionar
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Logo actual */}
          <Card>
            <CardHeader>
              <CardTitle>Logo Actual</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full bg-black flex items-center justify-center overflow-hidden border-2 border-primary-500 mb-4">
                <img 
                  src={currentLogo} 
                  alt="TOBAIS Logo Actual" 
                  className="h-40 w-40 object-cover" 
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Formato PNG existente
              </p>
            </CardContent>
          </Card>
          
          {/* Logo Vector Opción 1 */}
          <Card>
            <CardHeader>
              <CardTitle>Opción 1</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full bg-black flex items-center justify-center overflow-hidden border-2 border-primary-500 mb-4">
                <img 
                  src={logoVector} 
                  alt="TOBAIS Logo Vector 1" 
                  className="h-40 w-40 object-cover" 
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                SVG Curvilíneo
              </p>
            </CardContent>
          </Card>
          
          {/* Logo Vector Opción 2 */}
          <Card>
            <CardHeader>
              <CardTitle>Opción 2</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full bg-black flex items-center justify-center overflow-hidden border-2 border-primary-500 mb-4">
                <img 
                  src={logoAlt} 
                  alt="TOBAIS Logo Vector 2" 
                  className="h-40 w-40 object-cover" 
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                SVG Geométrico
              </p>
            </CardContent>
          </Card>
          
          {/* Logo Vector Opción 3 */}
          <Card>
            <CardHeader>
              <CardTitle>Opción 3</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full bg-black flex items-center justify-center overflow-hidden border-2 border-primary-500 mb-4">
                <img 
                  src={logoModern} 
                  alt="TOBAIS Logo Vector 3" 
                  className="h-40 w-40 object-cover" 
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                SVG Moderno con Gradientes
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-col space-y-6">
          <h2 className="text-2xl font-bold">Ampliaciones (para comparar calidad)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Logo PNG Actual (Ampliado)</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-80 h-80 rounded-full bg-black flex items-center justify-center overflow-hidden border-2 border-primary-500">
                  <img 
                    src={currentLogo} 
                    alt="TOBAIS Logo Actual Ampliado" 
                    className="h-80 w-80 object-cover" 
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Logo SVG (Ampliado - Opción 1)</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-80 h-80 rounded-full bg-black flex items-center justify-center overflow-hidden border-2 border-primary-500">
                  <img 
                    src={logoVector} 
                    alt="TOBAIS Logo Vector Ampliado" 
                    className="h-80 w-80 object-cover" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Logo SVG (Ampliado - Opción 2)</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-80 h-80 rounded-full bg-black flex items-center justify-center overflow-hidden border-2 border-primary-500">
                  <img 
                    src={logoAlt} 
                    alt="TOBAIS Logo Alt Ampliado" 
                    className="h-80 w-80 object-cover" 
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Logo SVG (Ampliado - Opción 3)</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-80 h-80 rounded-full bg-black flex items-center justify-center overflow-hidden border-2 border-primary-500">
                  <img 
                    src={logoModern} 
                    alt="TOBAIS Logo Modern Ampliado" 
                    className="h-80 w-80 object-cover" 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}