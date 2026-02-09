'use client';

import { useEffect, useState } from 'react';
import MobileLayout from '../components/MobileLayout';
import MemoryCard from '../components/MemoryCard';
import '../globals.css';

interface Memory {
  id: string;
  title: string;
  image: string;
  location: string;
  locationColor: 'primary' | 'usa-blue' | 'mexico-green';
  author: {
    name: string;
    initials: string;
    avatarColor?: string;
  };
  date: string;
}

const mockMemories: Memory[] = [
  {
    id: '1',
    title: 'Grito de gol inaugural',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSVTu4QiPcS0BCuYz9AiO0_iIP99Xid26b7PfTqXKjX7ido3R_JszovY54O3hlL1QQskIfVcyf4J7kDT6YlFOwuPjxtb168AQk5Pfiqun1XoooYMFmU8frp6uz6Fw3UvMOuOiA_Ho64DxL7v7v4BtzvbXEVYkfn6OwDw0VHt_Ek6Ih6XnFnNyO0f9gM5J7WWKy7hcxFOQNDAhCm3kbHjiAsxMdEUOQeYlfKqw8xADnc4Ck2iFpcwRDYjZ2fv7d3YjzVedK9Y-Vl0hS',
    location: 'ESTADIO AZTECA',
    locationColor: 'primary',
    author: {
      name: 'Juan Diego',
      initials: 'JD',
      avatarColor: 'default'
    },
    date: '12 Jun 2026'
  },
  {
    id: '2',
    title: 'Festejo bajo la lluvia',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOAz74W5zQGtaBUXnU6NmDe2nyrlX-H_ce9YzskVjRQ0A02jrdtXnfog22QN2s-Az6JhPeeF8VWyjq0-ng95v0VcudI4KdUz1PHHZ3sc2VZRLW0OXlzvY1VvuEvQADihJTL0LySb_29usN-pl3G0TFmJBu9ADnmiPa7OADRjuh2b9xRwPfDZEQON4l_pbe8IMZ72mi1r9cYfn3xCDVN9W6nY-vJiNYGKDNIJg-HTZiQTcCCXdLMb-qrvBd7bKD_wokGNjwO6jOMsXq',
    location: 'TORONTO FC',
    locationColor: 'usa-blue',
    author: {
      name: 'Maria Lopez',
      initials: 'ML',
      avatarColor: 'usa-blue'
    },
    date: '14 Jun 2026'
  },
  {
    id: '3',
    title: 'Pasión en las tribunas',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFouA1exx_0ICuSE-KuE9N2SBERxUnlptUkf9oIPKdGfEqwfmKBy4iLBxWW7mIVBYepyIoCSQymyDgpXA2kHScFEg_T9rEQxSNzav0hmeO9Uby2K9NnEu0whUv0OVqBAVbH678QW9jyYtGX91btQSaJCCIckbgC8FmaptOXzEn6zbPQ33VOwsR_gLKUpTC9EcHP5XHlS3XZurmQw1OXzXemF8JJh9IJKBJWIvfacV-0rLmfpY_MJXTdXWsD06QYY3xsGZU0yPVjDeh',
    location: 'SOFI STADIUM',
    locationColor: 'mexico-green',
    author: {
      name: 'Ricardo K.',
      initials: 'RK',
      avatarColor: 'mexico-green'
    },
    date: '15 Jun 2026'
  }
];

export default function MemoriesGallery() {
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    // TODO: Reemplazar con llamada real a API
    setMemories(mockMemories);
  }, []);

  const handleCreateMemory = () => {
    console.log('Navigate to create memory');
  };

  const handleViewDetail = (memoryId: string) => {
    window.open(`/v2/memory/${memoryId}`, '_blank');
  };

  const handleCreateNFT = (memoryId: string) => {
    console.log('Create NFT for memory:', memoryId);
  };

  return (
    <div className="font-display">
      <MobileLayout activeTab="explore">
        <main className="flex-1 overflow-y-auto hide-scrollbar pb-24">
          <div className="px-4 py-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold dark:text-white leading-none">Recuerdos</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Explora los momentos del Mundial
                </p>
              </div>
              <button 
                onClick={handleCreateMemory}
                className="bg-primary hover:bg-red-600 text-white px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                <span className="text-xl font-bold">+</span>
                <span className="font-bold text-sm tracking-wide">CREAR</span>
              </button>
            </div>
            
            <div className="space-y-8">
              {memories.map((memory) => (
                <MemoryCard 
                  key={memory.id} 
                  memory={memory}
                  onViewDetail={handleViewDetail}
                  onCreateNFT={() => handleCreateNFT(memory.id)}
                />
              ))}
            </div>
          </div>
        </main>
      </MobileLayout>
    </div>
  );
}