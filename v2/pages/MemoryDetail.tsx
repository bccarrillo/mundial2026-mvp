'use client';

import { useEffect, useState } from 'react';
import HeroImage from '../components/HeroImage';
import ActionGrid from '../components/ActionGrid';
import CentralFAB from '../components/CentralFAB';
import '../globals.css';

interface Memory {
  id: string;
  title: string;
  image: string;
  location: string;
  category: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  date: string;
  description: string;
}

const mockMemory: Memory = {
  id: '1',
  title: 'Gol Histórico',
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhvmxsrVLUuNjZ0R6ka0vaAFqyB91BdPuSV0-od-7aPS31X_jzCjFmweVdMMPxi9nEHPuBaaRTBRVovEb43rns5mK3dq61j1UGFRwJDxXHZJuDeb_xA7Am3P81Wl0vmvXBzji_MrWWqU7_hVgJ0bSR9YwA2I2BtGRyn8rgAaHXywIzLDWM57Ph4Wv2W-gP-wDFOboz23FibFpQnmnGZRr5ZNomnUsSQyzpVZLYI8XxOPJLl2eJCB_71RkyxdyBmOZDF_w1q5AXEN_d',
  location: 'Estadio Azteca',
  category: 'Mundial 2026',
  author: {
    name: '@fanatico2026',
    username: 'fanatico2026',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxYVix8ZODt4dYnCEiaby-dzhjl5yjErLhIf22XxVspJ5t179dWBQwK-qcVktdt_NtCVnStxXVhQ0U9Izs6Q-4GcyQje95GzTrZZ-QLyzdZ3Jvc4gKeZ8DrkjWGX8-dB6SYSF88BJ-IgFD7QDHdzRDRyXTEzZbT4EO74aaWQeqjMvRyimPfHj95jtmrK8btxMnMMu1mZ1W1eLSixlwdCovajBbdfV_JEUyzjY1_goQytwZyqAs5ov1v1KznJjSYKYtHKW1wVUfPW2H'
  },
  date: '12 de Junio, 2026',
  description: 'Un momento inolvidable grabado para siempre. El estadio vibraba con cada jugada, y este gol fue el clímax de una tarde legendaria en el fútbol mundial.'
};

export default function MemoryDetail({ params }: { params: { id: string } }) {
  const [memory, setMemory] = useState<Memory | null>(null);

  useEffect(() => {
    // TODO: Fetch memory by ID from API
    setMemory(mockMemory);
  }, [params.id]);

  const handleBack = () => {
    window.history.back();
  };

  const handleCreateNFT = () => {
    console.log('Create NFT for memory:', params.id);
  };

  if (!memory) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="font-display bg-white min-h-screen">
      {/* Hero Image */}
      <HeroImage 
        image={memory.image}
        title={memory.title}
        location={memory.location}
        category={memory.category}
        onBack={handleBack}
      />
      
      {/* Content */}
      <div className="relative -mt-8 bg-white rounded-t-[2.5rem] px-6 pt-8 shadow-2xl">
        {/* Author Info */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden border-2 border-primary/20 p-0.5">
              <img 
                alt={memory.author.name} 
                className="w-full h-full rounded-full bg-white" 
                src={memory.author.avatar}
              />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{memory.author.name}</p>
              <p className="text-xs text-gray-500">{memory.date}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400">
              <span className="text-2xl">⋯</span>
            </button>
          </div>
        </div>

        {/* Action Grid */}
        <ActionGrid />

        {/* Description */}
        <div className="mb-10">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
            Descripción
          </h3>
          <p className="text-gray-700 leading-relaxed text-lg">
            {memory.description}
          </p>
        </div>

        {/* NFT CTA */}
        <CentralFAB onCreateNFT={handleCreateNFT} />
      </div>

      {/* Bottom Navigation with Central FAB */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 ios-blur border-t border-gray-100 px-8 py-3 flex justify-between items-center z-40 pb-6">
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <span className="text-2xl">🏠</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Inicio</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-primary">
          <span className="text-2xl">📷</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Recuerdos</span>
        </button>
        <div className="relative -top-8">
          <button className="bg-primary text-white w-14 h-14 rounded-full shadow-xl shadow-red-200 flex items-center justify-center border-4 border-white">
            <span className="text-3xl font-bold">+</span>
          </button>
        </div>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <span className="text-2xl">🏆</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Ranking</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <span className="text-2xl">👤</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Perfil</span>
        </button>
      </div>
    </div>
  );
}