'use client';

import MobileLayout from '../components/MobileLayout';
import PixelLogo from '../components/PixelLogo';
import ActionButton from '../components/ActionButton';
import VIPBadge from '../components/VIPBadge';
import BackButton from '../components/BackButton';
import '../globals.css';

export default function V2Demo() {
  return (
    <div className="font-display">
      <MobileLayout showVip={true} activeTab="home">
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-4 text-primary">
              🚀 Nuevo Diseño V2 - Demo
            </h1>
            <p className="text-text-muted">
              Testing de componentes base mobile-first
            </p>
          </div>

          <div className="space-y-8">
            {/* Logo Tests */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold mb-4">PixelLogo Variants</h2>
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <PixelLogo size="mini" />
                  <p className="text-xs mt-2">Mini</p>
                </div>
                <div className="text-center">
                  <PixelLogo size="small" />
                  <p className="text-xs mt-2">Small</p>
                </div>
              </div>
              <div className="text-center mt-6">
                <PixelLogo size="large" />
                <p className="text-xs mt-2">Large</p>
              </div>
            </div>

            {/* Buttons Test */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold mb-4">ActionButton Variants</h2>
              <div className="space-y-3">
                <ActionButton variant="primary" fullWidth>
                  <span className="material-symbols-outlined">add</span>
                  Botón Primario
                </ActionButton>
                <ActionButton variant="secondary" fullWidth>
                  <span className="material-symbols-outlined">favorite</span>
                  Botón Secundario
                </ActionButton>
                <ActionButton variant="outline" fullWidth>
                  <span className="material-symbols-outlined">share</span>
                  Botón Outline
                </ActionButton>
                <ActionButton variant="vip" fullWidth>
                  <span className="material-symbols-outlined">stars</span>
                  Botón VIP
                </ActionButton>
              </div>
            </div>

            {/* VIP Badges Test */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold mb-4">VIP Badges</h2>
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <VIPBadge size="sm" />
                  <p className="text-xs mt-2">Small</p>
                </div>
                <div className="text-center">
                  <VIPBadge size="md" />
                  <p className="text-xs mt-2">Medium</p>
                </div>
                <div className="text-center">
                  <VIPBadge size="lg" />
                  <p className="text-xs mt-2">Large</p>
                </div>
              </div>
            </div>

            {/* Back Button Test */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold mb-4">Back Button (iOS Style)</h2>
              <div className="bg-gray-900 p-6 rounded-xl relative">
                <BackButton className="mb-4" />
                <p className="text-white text-sm">Botón de regreso con blur sobre fondo oscuro</p>
              </div>
            </div>

            {/* Colors Test */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold mb-4">Color Palette</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-lg"></div>
                  <span className="text-sm">Primary</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-mexico-green rounded-lg"></div>
                  <span className="text-sm">Mexico Green</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-usa-blue rounded-lg"></div>
                  <span className="text-sm">USA Blue</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gold-vip rounded-lg"></div>
                  <span className="text-sm">Gold VIP</span>
                </div>
              </div>
            </div>

            {/* Icons Test */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold mb-4">Material Icons</h2>
              <div className="flex items-center justify-around">
                <span className="material-symbols-outlined text-3xl text-primary">home</span>
                <span className="material-symbols-outlined text-3xl text-mexico-green">explore</span>
                <span className="material-symbols-outlined text-3xl text-usa-blue">favorite</span>
                <span className="material-symbols-outlined text-3xl text-gold-vip">stars</span>
              </div>
            </div>

            {/* Interactive Test */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold mb-4">Páginas Completas</h2>
              <div className="space-y-3">
                <ActionButton variant="primary" fullWidth onClick={() => window.open('/v2/landing', '_blank')}>
                  <span className="material-symbols-outlined">rocket_launch</span>
                  Ver LandingPage
                </ActionButton>
                <ActionButton variant="secondary" fullWidth onClick={() => window.open('/v2/dashboard', '_blank')}>
                  <span className="material-symbols-outlined">dashboard</span>
                  Ver Dashboard
                </ActionButton>
                <ActionButton variant="outline" fullWidth onClick={() => window.open('/v2/gallery', '_blank')}>
                  <span className="material-symbols-outlined">explore</span>
                  Ver Galería
                </ActionButton>
                <ActionButton variant="ghost" fullWidth onClick={() => window.open('/v2/memory/1', '_blank')}>
                  <span className="material-symbols-outlined">visibility</span>
                  Ver Detalle
                </ActionButton>
                <ActionButton variant="vip" fullWidth onClick={() => window.open('/v2/rankings', '_blank')}>
                  <span className="material-symbols-outlined">leaderboard</span>
                  Ver Rankings
                </ActionButton>
                <ActionButton variant="ghost" fullWidth onClick={() => window.open('/v2/vip', '_blank')}>
                  <span className="material-symbols-outlined">stars</span>
                  Ver VIP Zone
                </ActionButton>
                <p className="text-xs text-text-muted text-center">
                  ✅ Landing + Dashboard + Galería + Detalle + Rankings + VIP implementadas
                </p>
              </div>
            </div>

            {/* Interactive Test */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold mb-4">Interactividad</h2>
              <p className="text-sm text-text-muted mb-4">
                ✅ Menú hamburguesa funcional (click en ☰)<br/>
                ✅ Botones con efecto active:scale-[0.98]<br/>
                ✅ Bottom navigation con estados<br/>
                ✅ Responsive mobile-first
              </p>
            </div>
          </div>
        </div>
      </MobileLayout>
    </div>
  );
}