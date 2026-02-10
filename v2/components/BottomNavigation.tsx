'use client'

import { useRouter } from 'next/navigation'
import Icon from './Icon';

interface TabItem {
  id: string;
  icon: string;
  label: string;
  filled?: boolean;
  special?: boolean;
  active?: boolean;
  central?: boolean;
  route?: string;
}

interface BottomNavigationProps {
  activeTab?: string;
  currentPage?: string;
  variant?: 'standard' | 'donation' | 'detail';
  onTabChange?: (tab: string) => void;
}

export default function BottomNavigation({ 
  activeTab, 
  currentPage,
  variant = 'standard',
  onTabChange 
}: BottomNavigationProps) {
  const router = useRouter()
  
  // Use currentPage if provided, otherwise use activeTab
  const currentActiveTab = currentPage || activeTab || 'home';
  
  const standardTabs: TabItem[] = [
    { id: 'home', icon: 'home', label: 'Inicio', filled: true, route: '/v2/dashboard' },
    { id: 'explore', icon: 'explore', label: 'Explorar', route: '/v2/feed' },
    { id: 'ranking', icon: 'leaderboard', label: 'Rankings', route: '/v2/rankings' },
    { id: 'vip', icon: 'stars', label: 'VIP', special: true, route: '/v2/vip' }
  ];

  const donationTabs: TabItem[] = [
    { id: 'home', icon: 'home', label: 'Inicio' },
    { id: 'matches', icon: 'sports_soccer', label: 'Partidos' },
    { id: 'donate', icon: 'volunteer_activism', label: 'Donar', special: true },
    { id: 'tables', icon: 'leaderboard', label: 'Tablas' },
    { id: 'settings', icon: 'settings', label: 'Ajustes' }
  ];

  const detailTabs: TabItem[] = [
    { id: 'home', icon: 'home', label: 'Inicio' },
    { id: 'memories', icon: 'photo_library', label: 'Recuerdos', active: true },
    { id: 'add', icon: 'add', label: '', central: true },
    { id: 'ranking', icon: 'military_tech', label: 'Ranking' },
    { id: 'profile', icon: 'person', label: 'Perfil' }
  ];

  const tabs = variant === 'donation' ? donationTabs : 
               variant === 'detail' ? detailTabs : standardTabs;

  const handleTabClick = (tab: TabItem) => {
    if (onTabChange) {
      onTabChange(tab.id)
    } else if (tab.route) {
      router.push(tab.route)
    }
  }

  if (variant === 'detail') {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 ios-blur border-t border-gray-100 px-8 py-3 flex justify-between items-center z-40 pb-6">
        {tabs.map((tab) => (
          tab.central ? (
            <div key={tab.id} className="relative -top-8">
              <button 
                onClick={() => handleTabClick(tab)}
                className="bg-primary text-white w-14 h-14 rounded-full shadow-xl shadow-red-200 flex items-center justify-center border-4 border-white"
              >
                <Icon name={tab.icon} size="xl" />
              </button>
            </div>
          ) : (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`flex flex-col items-center gap-1 ${
                tab.active ? 'text-primary' : 'text-gray-400'
              }`}
            >
              <Icon name={tab.icon} size="lg" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">{tab.label}</span>
            </button>
          )
        ))}
      </div>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 flex justify-around items-center py-3 px-6 z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab)}
          className={`flex flex-col items-center gap-1 ${
            currentActiveTab === tab.id 
              ? tab.special 
                ? 'text-gold-vip' 
                : 'text-primary'
              : 'text-gray-400'
          }`}
        >
          <div className="relative">
            <Icon name={tab.icon} />
            {tab.special && currentActiveTab === tab.id && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            )}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {tab.label}
          </span>
        </button>
      ))}
    </nav>
  );
}