interface VIPBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export default function VIPBadge({ size = 'md', showIcon = true, className = '' }: VIPBadgeProps) {
  const sizeClasses = {
    sm: 'text-[9px] px-1.5 py-0.5',
    md: 'text-[10px] px-2 py-0.5', 
    lg: 'text-xs px-3 py-1'
  };
  
  const iconSizes = {
    sm: 'text-[10px]',
    md: 'text-[12px]',
    lg: 'text-sm'
  };
  
  return (
    <span className={`bg-gradient-to-r from-amber-400 to-yellow-600 text-white font-black rounded-full shadow-sm flex items-center gap-0.5 ${sizeClasses[size]} ${className}`}>
      {showIcon && (
        <span className={`material-symbols-outlined ${iconSizes[size]}`}>stars</span>
      )}
      VIP
    </span>
  );
}