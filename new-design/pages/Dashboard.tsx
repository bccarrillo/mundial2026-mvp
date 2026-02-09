import MobileLayout from '../components/MobileLayout';

export default function Dashboard() {
  return (
    <MobileLayout showVip={true} activeTab="home">
      <div className="px-6">
        <div className="py-8 border-b border-gray-50 dark:border-gray-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-md">
                <img 
                  alt="Avatar" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZULVHg-k3tpnBCshVdTI2hyb6Wdd1deI8GucA4EtTmu4M2uifMXK0379-RPeSZKwc5zd7ynkA6kTXqulkQHrx4TI8iK7Uy-LOT7qml3gcX_8QYi4oQ-1xDX0LSO65ROxUYmeWlCAEEyOEBZ7EGYzcBxxblvg6cigcbI9acgYvx4lkHXkbWp7dL8khvTQt4S-QzFPUJ3WTh79bIpQHjKy-5CJxtNH8ibkgdPDaMMdy0oiEgwYu1gPNJ6xeYIO8lsQQYwk4OP5-tBE1"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold dark:text-white">¡Bienvenido!</h2>
                <span className="bg-gradient-to-r from-amber-400 to-yellow-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]">stars</span> VIP
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                bcarrillo@instepca.com
              </p>
            </div>
          </div>
        </div>

        <div className="py-8 space-y-4">
          <button className="w-full group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
              </div>
              <span className="font-bold text-lg dark:text-white">Crear Nuevo Recuerdo</span>
            </div>
            <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">
              chevron_right
            </span>
          </button>

          <button className="w-full group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-usa-blue dark:text-blue-400">
                <span className="material-symbols-outlined text-2xl">token</span>
              </div>
              <span className="font-bold text-lg dark:text-white">Ver Mis NFTs</span>
            </div>
            <span className="material-symbols-outlined text-gray-300 group-hover:text-usa-blue transition-colors">
              chevron_right
            </span>
          </button>

          <button className="w-full group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-mexico-green dark:text-green-400">
                <span className="material-symbols-outlined text-2xl">event</span>
              </div>
              <span className="font-bold text-lg dark:text-white">Explorar Eventos</span>
            </div>
            <span className="material-symbols-outlined text-gray-300 group-hover:text-mexico-green transition-colors">
              chevron_right
            </span>
          </button>
        </div>

        <div className="pt-4 flex justify-center">
          <button className="bg-primary/10 text-primary px-6 py-2.5 rounded-full font-bold text-sm hover:bg-primary hover:text-white transition-colors">
            Ver Galería Pública
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}