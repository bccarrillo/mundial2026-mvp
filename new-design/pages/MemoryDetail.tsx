import PixelLogo from '../components/PixelLogo';

export default function MemoryDetail() {
  return (
    <div className="bg-white font-display">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-white/90 ios-blur px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <PixelLogo size="small" />
          <span className="text-lg font-bold tracking-tight text-[#1a1a1a]">Memories26</span>
        </div>
        <button className="p-1">
          <span className="material-symbols-outlined text-3xl text-gray-800">menu</span>
        </button>
      </header>

      <main className="pb-24">
        <div className="relative w-full h-[65vh]">
          <img 
            alt="Momento del Mundial" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhvmxsrVLUuNjZ0R6ka0vaAFqyB91BdPuSV0-od-7aPS31X_jzCjFmweVdMMPxi9nEHPuBaaRTBRVovEb43rns5mK3dq61j1UGFRwJDxXHZJuDeb_xA7Am3P81Wl0vmvXBzji_MrWWqU7_hVgJ0bSR9YwA2I2BtGRyn8rgAaHXywIzLDWM57Ph4Wv2W-gP-wDFOboz23FibFpQnmnGZRr5ZNomnUsSQyzpVZLYI8XxOPJLl2eJCB_71RkyxdyBmOZDF_w1q5AXEN_d"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
          
          <button 
            onClick={() => window.history.back()}
            className="absolute top-6 left-6 w-10 h-10 bg-white/30 ios-blur text-white rounded-full flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-2xl">chevron_left</span>
          </button>
          
          <div className="absolute bottom-12 left-6 right-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded uppercase tracking-wider">
                Mundial 2026
              </span>
              <span className="px-2 py-0.5 bg-white/20 ios-blur text-white text-[10px] font-bold rounded uppercase tracking-wider">
                Estadio Azteca
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-white leading-tight shadow-sm">
              Gol Histórico
            </h1>
          </div>
        </div>

        <div className="relative -mt-8 bg-white rounded-t-[2.5rem] px-6 pt-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden border-2 border-primary/20 p-0.5">
                <img 
                  alt="User" 
                  className="w-full h-full rounded-full bg-white" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxYVix8ZODt4dYnCEiaby-dzhjl5yjErLhIf22XxVspJ5t179dWBQwK-qcVktdt_NtCVnStxXVhQ0U9Izs6Q-4GcyQje95GzTrZZ-QLyzdZ3Jvc4gKeZ8DrkjWGX8-dB6SYSF88BJ-IgFD7QDHdzRDRyXTEzZbT4EO74aaWQeqjMvRyimPfHj95jtmrK8btxMnMMu1mZ1W1eLSixlwdCovajBbdfV_JEUyzjY1_goQytwZyqAs5ov1v1KznJjSYKYtHKW1wVUfPW2H"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">@fanatico2026</p>
                <p className="text-xs text-gray-500">12 de Junio, 2026</p>
              </div>
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400">
              <span className="material-symbols-outlined text-2xl">more_horiz</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-10">
            <button className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600 group-active:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-2xl">download</span>
              </div>
              <span className="text-xs font-semibold text-gray-500">Descargar</span>
            </button>
            <button className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600 group-active:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-2xl">share</span>
              </div>
              <span className="text-xs font-semibold text-gray-500">Compartir</span>
            </button>
            <button className="flex flex-col items-center gap-2 group">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600 group-active:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-2xl text-primary">favorite</span>
              </div>
              <span className="text-xs font-semibold text-gray-500">Favorito</span>
            </button>
          </div>

          <div className="mb-10">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
              Descripción
            </h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              Un momento inolvidable grabado para siempre. El estadio vibraba con cada jugada, 
              y este gol fue el clímax de una tarde legendaria en el fútbol mundial.
            </p>
          </div>

          <div className="bg-black rounded-3xl p-6 text-white overflow-hidden relative mb-8">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/30 blur-3xl rounded-full"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
                  <span className="material-symbols-outlined text-primary font-bold">token</span>
                </div>
                <span className="font-bold text-lg uppercase tracking-tight">Convertir en NFT</span>
              </div>
              <p className="text-gray-400 text-sm mb-6 leading-snug">
                Protege tu propiedad digital y haz que este recuerdo sea único en la blockchain.
              </p>
              <button className="w-full bg-primary hover:bg-red-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-900/20 active:scale-95 transition-all">
                Crear NFT Ahora
              </button>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 ios-blur border-t border-gray-100 px-8 py-3 flex justify-between items-center z-40 pb-6">
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <span className="material-symbols-outlined text-2xl">home</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Inicio</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined text-2xl">photo_library</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Recuerdos</span>
        </button>
        <div className="relative -top-8">
          <button className="bg-primary text-white w-14 h-14 rounded-full shadow-xl shadow-red-200 flex items-center justify-center border-4 border-white">
            <span className="material-symbols-outlined text-3xl">add</span>
          </button>
        </div>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <span className="material-symbols-outlined text-2xl">military_tech</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Ranking</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <span className="material-symbols-outlined text-2xl">person</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Perfil</span>
        </button>
      </div>
    </div>
  );
}