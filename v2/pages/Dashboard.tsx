'use client';

import { useEffect, useState } from 'react';
import MobileLayout from '../components/MobileLayout';
import UserProfile from '../components/UserProfile';
import ActionCards from '../components/ActionCards';
import ActionButton from '../components/ActionButton';
import '../globals.css';

interface User {
  name: string;
  email: string;
  avatar?: string;
  isVip: boolean;
}

export default function Dashboard() {
  const [user, setUser] = useState<User>({
    name: "¡Bienvenido!",
    email: "usuario@memories26.com",
    isVip: true
  });

  // Simular carga de datos de usuario
  useEffect(() => {
    // TODO: Reemplazar con llamada real a API
    const fetchUser = async () => {
      try {
        // Simulación de datos reales
        setUser({
          name: "¡Bienvenido!",
          email: "bcarrillo@instepca.com",
          avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZULVHg-k3tpnBCshVdTI2hyb6Wdd1deI8GucA4EtTmu4M2uifMXK0379-RPeSZKwc5zd7ynkA6kTXqulkQHrx4TI8iK7Uy-LOT7qml3gcX_8QYi4oQ-1xDX0LSO65ROxUYmeWlCAEEyOEBZ7EGYzcBxxblvg6cigcbI9acgYvx4lkHXkbWp7dL8khvTQt4S-QzFPUJ3WTh79bIpQHjKy-5CJxtNH8ibkgdPDaMMdy0oiEgwYu1gPNJ6xeYIO8lsQQYwk4OP5-tBE1",
          isVip: true
        });
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    
    fetchUser();
  }, []);

  const handleViewGallery = () => {
    // TODO: Navegar a galería pública
    console.log('Navigate to public gallery');
  };

  return (
    <div className="font-display">
      <MobileLayout showVip={user.isVip} activeTab="home">
      <main className="flex-1 overflow-y-auto hide-scrollbar pb-24 px-6">
        {/* User Profile Section */}
        <UserProfile 
          name={user.name}
          email={user.email}
          avatar={user.avatar}
          isVip={user.isVip}
        />

        {/* Action Cards */}
        <ActionCards />

        {/* Bottom CTA */}
        <div className="pt-4 flex justify-center">
          <button className="bg-primary/10 text-primary px-6 py-2.5 rounded-full font-bold text-sm hover:bg-primary hover:text-white transition-colors">
            Ver Galería Pública
          </button>
        </div>
      </main>
      </MobileLayout>
    </div>
  );
}