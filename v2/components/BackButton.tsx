interface BackButtonProps {
  onClick?: () => void;
  className?: string;
}

export default function BackButton({ onClick, className = '' }: BackButtonProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.history.back();
    }
  };
  
  return (
    <button 
      onClick={handleClick}
      className={`w-10 h-10 bg-white/30 ios-blur text-white rounded-full flex items-center justify-center ${className}`}
    >
      <span className="material-symbols-outlined text-2xl">chevron_left</span>
    </button>
  );
}