'use client';

import '../globals.css';
import MobileHeader from '../components/MobileHeader';
import BottomNavigation from '../components/BottomNavigation';

export default function VIPZone() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-background-dark max-w-md mx-auto">
      <MobileHeader 
        title="Memories26" 
        showVIPBadge={true}
      />
      
      <main className="flex-1 overflow-y-auto hide-scrollbar pb-24">
        {/* VIP Hero Section */}
        <div className="px-6 py-8 text-center bg-gradient-to-b from-amber-50/50 to-white dark:from-amber-950/20 dark:to-background-dark">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
            <span className="text-5xl">👑</span>
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Zona VIP Exclusiva</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Bienvenido a tu área premium del Mundial 2026</p>
        </div>

        {/* VIP Stats Card */}
        <div className="px-4 -mt-4">
          <div className="bg-[#181111] dark:bg-gray-900 rounded-2xl p-5 shadow-xl border border-amber-500/30">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-gray-400 text-sm">Miembro desde</span>
                <span className="text-white font-bold">5/2/2026</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-gray-400 text-sm">10% Descuento NFTs</span>
                <div className="text-right">
                  <span className="text-amber-400 font-bold">$2.03</span>
                  <span className="text-gray-500 text-xs line-through ml-1">$3.00</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Funciones exclusivas</span>
                <span className="text-white font-bold">7 Activas</span>
              </div>
            </div>
          </div>
        </div>

        {/* VIP Benefits */}
        <div className="px-6 mt-10">
          <h3 className="text-lg font-bold mb-4 dark:text-white">Tus Beneficios VIP</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-yellow-600 flex items-center justify-center text-white">
                <span className="text-lg">✓</span>
              </div>
              <div>
                <p className="font-bold text-sm dark:text-white">Badge VIP Exclusivo</p>
                <p className="text-xs text-gray-500">Destaca en todos tus recuerdos</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                <span className="text-lg">%</span>
              </div>
              <div>
                <p className="font-bold text-sm dark:text-white">10% Descuento</p>
                <p className="text-xs text-gray-500">En la creación de cualquier NFT</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-full bg-usa-blue flex items-center justify-center text-white">
                <span className="text-lg">📊</span>
              </div>
              <div>
                <p className="font-bold text-sm dark:text-white">Estadísticas Avanzadas</p>
                <p className="text-xs text-gray-500">Datos en tiempo real de tus activos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="px-6 mt-10">
          <h3 className="text-lg font-bold mb-4 dark:text-white">Próximamente</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 opacity-70">
              <span className="text-2xl mb-2 block">🔍</span>
              <p className="font-bold text-xs dark:text-gray-300">Filtros Especiales</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 opacity-70">
              <span className="text-2xl mb-2 block">💬</span>
              <p className="font-bold text-xs dark:text-gray-300">Chat VIP</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-8 flex flex-col gap-3">
          <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-transform">
            <span className="text-xl">🎫</span>
            Mintear NFT VIP
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-3.5 rounded-xl font-bold text-xs dark:text-white active:scale-[0.98] transition-transform">
              <span className="text-lg">🎧</span>
              Soporte Premium
            </button>
            <button className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-3.5 rounded-xl font-bold text-xs dark:text-white active:scale-[0.98] transition-transform">
              <span className="text-lg">👥</span>
              Club de Fans
            </button>
          </div>
        </div>
      </main>

      <BottomNavigation currentPage="vip" />
    </div>
  );
}