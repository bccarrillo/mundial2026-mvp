'use client';

import { useEffect, useState } from 'react';
import PixelLogo from '../components/PixelLogo';
import ActionButton from '../components/ActionButton';
import StatsGrid from '../components/StatsGrid';
import FeatureCards from '../components/FeatureCards';
import '../globals.css';

export default function LandingPage() {
  const [stats, setStats] = useState({ users: 13, memories: 42 });

  // Simular carga de estadísticas reales
  useEffect(() => {
    // TODO: Reemplazar con llamada real a API
    const fetchStats = async () => {
      try {
        // Simulación de datos reales
        setStats({ users: 13, memories: 42 });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    
    fetchStats();
  }, []);

  const handleCreateAccount = () => {
    // TODO: Navegar a registro
    console.log('Navigate to register');
  };

  const handleViewMemories = () => {
    // TODO: Navegar a galería
    console.log('Navigate to gallery');
  };

  const handleGetStarted = () => {
    // TODO: Navegar a registro
    console.log('Navigate to register');
  };

  return (
    <div className="font-display">
      <div className="relative flex min-h-screen w-full flex-col bg-white max-w-md mx-auto">
      {/* Header */}
      <header className="flex flex-col items-center pt-8 pb-4 px-6">
        <PixelLogo size="small" className="mb-4" />
        <h1 className="text-3xl font-bold tracking-tight text-text-dark">Memories26</h1>
        <div className="h-1 w-10 bg-primary rounded-full mt-1 mb-4"></div>
        <h2 className="text-xl font-bold text-center leading-tight mb-2">
          Guarda y comparte tus recuerdos del Mundial
        </h2>
      </header>

      {/* Stats Grid */}
      <StatsGrid usersCount={stats.users} memoriesCount={stats.memories} />

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 px-6 mb-12">
        <ActionButton 
          variant="primary" 
          size="lg" 
          fullWidth 
          onClick={handleCreateAccount}
        >
          Crear cuenta gratis
        </ActionButton>
        <ActionButton 
          variant="secondary" 
          size="lg" 
          fullWidth 
          onClick={handleViewMemories}
        >
          Ver recuerdos
        </ActionButton>
      </div>

      {/* Feature Cards */}
      <FeatureCards />

      {/* Bottom CTA Section */}
      <div className="bg-text-dark text-white rounded-t-[2.5rem] px-8 pt-12 pb-16 mt-auto">
        <div className="flex flex-col items-center text-center">
          <h3 className="text-2xl font-bold mb-3">¿Listo para guardar tus recuerdos?</h3>
          <p className="text-gray-400 text-sm mb-8">
            Únete a miles de fanáticos que ya están creando su álbum digital
          </p>
          <ActionButton 
            variant="primary" 
            size="lg" 
            fullWidth 
            onClick={handleGetStarted}
            className="shadow-xl shadow-primary/10"
          >
            Empezar ahora
          </ActionButton>
          <p className="mt-6 text-xs text-gray-500">
            © 2026 Memories26. Todos los derechos reservados.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}