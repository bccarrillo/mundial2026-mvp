interface IconProps {
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const iconMap: Record<string, string> = {
  menu: '☰',
  close: '✕',
  home: '🏠',
  explore: '🔍',
  favorite: '❤️',
  stars: '⭐',
  language: '🌐',
  chevron_left: '‹',
  chevron_right: '›',
  add: '+',
  share: '↗',
  download: '⬇',
  more_horiz: '⋯',
  photo_library: '📷',
  dashboard: '📊',
  add_circle: '⊕',
  military_tech: '🏆',
  logout: '↪',
  token: '🪙',
  add_photo_alternate: '📸',
  event: '📅',
  leaderboard: '📈',
  settings: '⚙️',
  sports_soccer: '⚽',
  volunteer_activism: '💝',
  person: '👤'
};

export default function Icon({ name, className = '', size = 'md' }: IconProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-xl', 
    lg: 'text-2xl',
    xl: 'text-3xl'
  };
  
  const unicodeIcon = iconMap[name] || '?';
  
  return (
    <span className={`material-symbols-outlined ${sizeClasses[size]} ${className}`}>
      {unicodeIcon}
    </span>
  );
}