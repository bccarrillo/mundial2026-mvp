interface BottomNavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function BottomNavigation({ activeTab = 'home', onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'home', icon: 'home', label: 'Inicio', filled: true },
    { id: 'explore', icon: 'explore', label: 'Explorar' },
    { id: 'favorites', icon: 'favorite', label: 'Favoritos' },
    { id: 'vip', icon: 'stars', label: 'VIP', special: true }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 flex justify-around items-center py-3 px-6 z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange?.(tab.id)}
          className={`flex flex-col items-center gap-1 ${
            activeTab === tab.id 
              ? tab.special 
                ? 'text-gold-vip' 
                : 'text-primary'
              : 'text-gray-400'
          }`}
        >
          <div className="relative">
            <span className={`material-symbols-outlined ${
              activeTab === tab.id && tab.filled ? 'font-variation-fill' : ''
            }`}>
              {tab.icon}
            </span>
            {tab.special && activeTab === tab.id && (
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