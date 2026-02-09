import { ReactNode } from 'react';
import MobileHeader from './MobileHeader';
import BottomNavigation from './BottomNavigation';

interface MobileLayoutProps {
  children: ReactNode;
  showVip?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onMenuClick?: () => void;
}

export default function MobileLayout({ 
  children, 
  showVip = false, 
  activeTab = 'home',
  onTabChange,
  onMenuClick
}: MobileLayoutProps) {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white dark:bg-background-dark max-w-md mx-auto">
      <MobileHeader showVip={showVip} onMenuClick={onMenuClick} />
      
      <main className="flex-1 overflow-y-auto hide-scrollbar pb-24">
        {children}
      </main>
      
      <BottomNavigation activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}