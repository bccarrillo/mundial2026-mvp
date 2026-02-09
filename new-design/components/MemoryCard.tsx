interface MemoryCardProps {
  image: string;
  title: string;
  author: string;
  date: string;
  location: string;
  onNFTClick?: () => void;
  onMoreClick?: () => void;
}

export default function MemoryCard({ 
  image, 
  title, 
  author, 
  date, 
  location, 
  onNFTClick, 
  onMoreClick 
}: MemoryCardProps) {
  const getLocationColor = (loc: string) => {
    if (loc.includes('AZTECA')) return 'text-primary';
    if (loc.includes('TORONTO')) return 'text-usa-blue';
    if (loc.includes('SOFI')) return 'text-mexico-green';
    return 'text-primary';
  };

  const getAuthorInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAuthorColor = (name: string) => {
    if (name.includes('Juan')) return 'bg-gray-200 text-gray-700';
    if (name.includes('Maria')) return 'bg-usa-blue text-white';
    if (name.includes('Ricardo')) return 'bg-mexico-green text-white';
    return 'bg-gray-200 text-gray-700';
  };

  return (
    <article className="flex flex-col gap-3 group">
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
        <img 
          alt={title} 
          className="w-full h-full object-cover" 
          src={image}
        />
        <div className="absolute top-3 right-3">
          <span className={`bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm ${getLocationColor(location)}`}>
            {location}
          </span>
        </div>
      </div>
      
      <div className="px-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-lg dark:text-white leading-tight">{title}</h3>
          <button onClick={onMoreClick} className="text-gray-400">
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${getAuthorColor(author)}`}>
            {getAuthorInitials(author)}
          </div>
          <span className="text-sm font-bold dark:text-gray-300">{author}</span>
          <span className="text-gray-400 text-xs">•</span>
          <span className="text-gray-400 text-xs">{date}</span>
        </div>
        
        <button 
          onClick={onNFTClick}
          className="w-full flex items-center justify-center gap-2 bg-[#181111] dark:bg-white dark:text-[#181111] text-white py-3.5 rounded-xl font-bold text-sm transition-transform active:scale-[0.98] shadow-md hover:shadow-lg"
        >
          <span className="material-symbols-outlined text-xl">token</span>
          Crear un NFT
        </button>
      </div>
    </article>
  );
}