'use client';

import { useEffect, useState } from 'react';
import MobileLayout from '../components/MobileLayout';
import RankingCard from '../components/RankingCard';
import LiveUpdateIndicator from '../components/LiveUpdateIndicator';
import '../globals.css';

interface RankingUser {
  id: string;
  username: string;
  level: string;
  levelName: string;
  points: number;
  position: number;
  isCurrentUser?: boolean;
  avatar?: string;
  badge?: string;
}

const mockRankings: RankingUser[] = [
  {
    id: '1',
    username: 'bcarrillo',
    level: 'Nivel 3',
    levelName: 'Seguidor',
    points: 314,
    position: 1,
    isCurrentUser: true,
    badge: 'PRO'
  },
  {
    id: '2',
    username: 'archangelark2',
    level: 'Nivel 1',
    levelName: 'Novato',
    points: 25,
    position: 2
  },
  {
    id: '3',
    username: 'massieluche',
    level: 'Nivel 1',
    levelName: 'Novato',
    points: 10,
    position: 3
  },
  {
    id: '4',
    username: 'amolero',
    level: 'Nivel 1',
    levelName: 'Novato',
    points: 6,
    position: 4
  }
];

export default function RankingsPage() {
  const [rankings, setRankings] = useState<RankingUser[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    // TODO: Reemplazar con llamada real a API
    setRankings(mockRankings);
    
    // Simular tiempo de actualización
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', { 
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    });
    setLastUpdate(timeString);
  }, []);

  const handleCreateMemory = () => {
    console.log('Navigate to create memory');
  };

  return (
    <div className="font-display">
      <MobileLayout activeTab="rankings">
        <main className="flex-1 overflow-y-auto hide-scrollbar pb-24">
          <div className="px-4 py-6">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                  <span>🏆</span> Rankings
                </h2>
                <button 
                  onClick={handleCreateMemory}
                  className="bg-primary hover:bg-red-600 text-white px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                  <span className="text-xl font-bold">+</span>
                  <span className="font-bold text-sm tracking-wide">CREAR</span>
                </button>
              </div>
              
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Compite con fanáticos de todo el mundo
              </p>
              
              <LiveUpdateIndicator lastUpdate={lastUpdate} />
            </div>
            
            <div className="space-y-3">
              {rankings.map((user) => (
                <RankingCard key={user.id} user={user} />
              ))}
            </div>
          </div>
        </main>
      </MobileLayout>
    </div>
  );
}