import { useState } from 'react';
import PixelLogo from './PixelLogo';
import MobileMenu from './MobileMenu';
import Icon from './Icon';

interface MobileHeaderProps {
  title?: string;
  showVip?: boolean;
  showVIPBadge?: boolean;
  onMenuClick?: () => void;
}

export default function MobileHeader({ title = "Memories26", showVip = false, showVIPBadge = false, onMenuClick }: MobileHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleMenuClick = () => {
    if (onMenuClick) {
      onMenuClick();
    } else {
      setIsMenuOpen(true);
    }
  };
  
  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <PixelLogo size="mini" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold tracking-tight text-[#333333] dark:text-white leading-none">
                {title}
              </h1>
              {(showVip || showVIPBadge) && (
                <span className="bg-gradient-to-r from-amber-400 to-yellow-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
                  VIP
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1 mr-1">
            <Icon name="language" className="text-lg text-gray-500" />
            <select className="bg-transparent border-none text-[10px] font-bold uppercase tracking-wider focus:ring-0 py-0 pl-1 pr-4 text-gray-700 dark:text-gray-300">
              <option>ES</option>
              <option>EN</option>
              <option>PT</option>
            </select>
          </div>
          <button 
            onClick={handleMenuClick}
            className="p-2 text-[#333333] dark:text-white"
          >
            <Icon name="menu" size="xl" />
          </button>
        </div>
      </header>
      
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}