interface PixelLogoProps {
  size?: 'mini' | 'small' | 'large';
  className?: string;
}

export default function PixelLogo({ size = 'mini', className = '' }: PixelLogoProps) {
  const sizeClasses = {
    mini: 'w-6 h-6 grid-cols-5',
    small: 'w-8 h-8 grid-cols-5', 
    large: 'w-15 h-15 grid-cols-12'
  };

  if (size === 'large') {
    return (
      <div className={`grid ${sizeClasses[size]} gap-px ${className}`}>
        <div className="w-full h-full"></div><div className="w-full h-full"></div><div className="w-full h-full"></div><div className="w-full h-full bg-primary"></div><div className="w-full h-full bg-primary"></div><div className="w-full h-full bg-primary"></div><div className="w-full h-full bg-primary"></div><div className="w-full h-full"></div><div className="w-full h-full"></div><div className="w-full h-full"></div><div className="w-full h-full"></div><div className="w-full h-full"></div>
        <div className="w-full h-full"></div><div className="w-full h-full bg-primary"></div><div className="w-full h-full bg-primary"></div><div className="w-full h-full bg-gray-800"></div><div className="w-full h-full bg-gray-800"></div><div className="w-full h-full bg-gray-800"></div><div className="w-full h-full bg-gray-800"></div><div className="w-full h-full bg-primary"></div><div className="w-full h-full bg-primary"></div><div className="w-full h-full"></div><div className="w-full h-full"></div><div className="w-full h-full"></div>
        <div className="w-full h-full bg-mexico-green"></div><div className="w-full h-full bg-mexico-green"></div><div className="w-full h-full bg-gray-800"></div><div className="w-full h-full bg-white border border-gray-100"></div><div className="w-full h-full bg-white border border-gray-100"></div><div className="w-full h-full bg-white border border-gray-100"></div><div className="w-full h-full bg-white border border-gray-100"></div><div className="w-full h-full bg-gray-800"></div><div className="w-full h-full bg-usa-blue"></div><div className="w-full h-full bg-usa-blue"></div><div className="w-full h-full"></div><div className="w-full h-full"></div>
        <div className="w-full h-full bg-mexico-green"></div><div className="w-full h-full bg-mexico-green"></div><div className="w-full h-full bg-gray-800"></div><div className="w-full h-full bg-white border border-gray-100"></div><div className="w-full h-full bg-white border border-gray-100"></div><div className="w-full h-full bg-white border border-gray-100"></div><div className="w-full h-full bg-white border border-gray-100"></div><div className="w-full h-full bg-gray-800"></div><div className="w-full h-full bg-usa-blue"></div><div className="w-full h-full bg-usa-blue"></div><div className="w-full h-full"></div><div className="w-full h-full"></div>
        <div className="w-full h-full"></div><div className="w-full h-full bg-mexico-green"></div><div className="w-full h-full bg-mexico-green"></div><div className="w-full h-full bg-gray-800"></div><div className="w-full h-full bg-gray-800"></div><div className="w-full h-full bg-gray-800"></div><div className="w-full h-full bg-gray-800"></div><div className="w-full h-full bg-usa-blue"></div><div className="w-full h-full bg-usa-blue"></div><div className="w-full h-full"></div><div className="w-full h-full"></div><div className="w-full h-full"></div>
        <div className="w-full h-full"></div><div className="w-full h-full"></div><div className="w-full h-full"></div><div className="w-full h-full bg-primary"></div><div className="w-full h-full bg-primary"></div><div className="w-full h-full bg-primary"></div><div className="w-full h-full bg-primary"></div><div className="w-full h-full"></div><div className="w-full h-full"></div><div className="w-full h-full"></div><div className="w-full h-full"></div><div className="w-full h-full"></div>
      </div>
    );
  }

  return (
    <div className={`grid ${sizeClasses[size]} gap-px ${className}`}>
      <div className="w-full h-full"></div><div className="w-full h-full bg-primary"></div><div className="w-full h-full bg-primary"></div><div className="w-full h-full bg-primary"></div><div className="w-full h-full"></div>
      <div className="w-full h-full bg-mexico-green"></div><div className="w-full h-full bg-gray-800"></div><div className="w-full h-full bg-white border border-gray-100"></div><div className="w-full h-full bg-gray-800"></div><div className="w-full h-full bg-usa-blue"></div>
      <div className="w-full h-full bg-mexico-green"></div><div className="w-full h-full bg-gray-800"></div><div className="w-full h-full bg-white border border-gray-100"></div><div className="w-full h-full bg-gray-800"></div><div className="w-full h-full bg-usa-blue"></div>
      <div className="w-full h-full"></div><div className="w-full h-full bg-primary"></div><div className="w-full h-full bg-primary"></div><div className="w-full h-full bg-primary"></div><div className="w-full h-full"></div>
    </div>
  );
}