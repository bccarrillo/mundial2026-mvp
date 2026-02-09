import PixelLogo from './PixelLogo';

interface MobileHeaderProps {
  showVip?: boolean;
  onMenuClick?: () => void;
}

export default function MobileHeader({ showVip = false, onMenuClick }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-4 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2">
        <PixelLogo size="mini" />
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <h1 className="text-base font-bold tracking-tight text-[#333333] dark:text-white leading-none">
              Memories26
            </h1>
            {showVip && (
              <span className="bg-gradient-to-r from-amber-400 to-yellow-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
                VIP
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1 mr-1">
          <span className="material-symbols-outlined text-lg text-gray-500">language</span>
          <select className="bg-transparent border-none text-[10px] font-bold uppercase tracking-wider focus:ring-0 py-0 pl-1 pr-4 text-gray-700 dark:text-gray-300">
            <option>ES</option>
            <option>EN</option>
            <option>PT</option>
          </select>
        </div>
        <button 
          onClick={onMenuClick}
          className="p-2 text-[#333333] dark:text-white"
        >
          <span className="material-symbols-outlined text-3xl">menu</span>
        </button>
      </div>
    </header>
  );
}