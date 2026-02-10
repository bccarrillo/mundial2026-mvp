import VIPBadge from './VIPBadge';
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
    isVip?: boolean;
  };
  date: string;
  hasNFT?: boolean;
  onCreateNFT?: () => void;
}

interface MemoryCardProps {
  memory: Memory;
  onViewDetail?: (id: string) => void;
  onCreateNFT?: () => void;
}

const locationColors = {
  primary: 'text-primary',
  'usa-blue': 'text-usa-blue', 
  'mexico-green': 'text-mexico-green'
};

const avatarColors = {
  primary: 'bg-primary',
  'usa-blue': 'bg-usa-blue',
  'mexico-green': 'bg-mexico-green',
  default: 'bg-gray-200 text-gray-700'
};

export default function MemoryCard({ memory, onViewDetail, onCreateNFT }: MemoryCardProps) {
  const locationColorClass = locationColors[memory.locationColor];
  const avatarColorClass = memory.author.avatarColor 
    ? avatarColors[memory.author.avatarColor as keyof typeof avatarColors] 
    : avatarColors.default;

  // Debug logging
  console.log('MemoryCard:', {
    id: memory.id,
    title: memory.title,
    hasNFT: memory.hasNFT
  });

  return (
    <article className="flex flex-col gap-3 group cursor-pointer" onClick={() => onViewDetail?.(memory.id)}>
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
        <img 
          alt={memory.title} 
          className="w-full h-full object-cover" 
          src={memory.image}
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          {memory.hasNFT && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
              <span className="text-xs">🏆</span>
              NFT
            </div>
          )}
          <span className={`bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${locationColorClass} shadow-sm`}>
            {memory.location}
          </span>
        </div>
      </div>
      
      <div className="px-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-lg dark:text-white leading-tight">{memory.title}</h3>
          <button className="text-gray-400">
            <span className="text-xl">⋯</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-6 h-6 rounded-full ${avatarColorClass} flex items-center justify-center text-[10px] font-bold`}>
            {memory.author.initials}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold dark:text-gray-300">{memory.author.name}</span>
            {memory.author.isVip && <VIPBadge size="sm" />}
          </div>
          <span className="text-gray-400 text-xs">•</span>
          <span className="text-gray-400 text-xs">{memory.date}</span>
        </div>
        
        {memory.hasNFT ? (
          <button 
            onClick={onCreateNFT}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3.5 rounded-xl font-bold text-sm transition-transform active:scale-[0.98] shadow-md hover:shadow-lg"
          >
            <span className="text-xl">🏆</span>
            Ver NFT Certificado
          </button>
        ) : (
          <button 
            onClick={onCreateNFT}
            className="w-full flex items-center justify-center gap-2 bg-text-dark dark:bg-white dark:text-text-dark text-white py-3.5 rounded-xl font-bold text-sm transition-transform active:scale-[0.98] shadow-md hover:shadow-lg"
          >
            <span className="text-xl">$</span>
            Crear un NFT
          </button>
        )}
      </div>
    </article>
  );
}