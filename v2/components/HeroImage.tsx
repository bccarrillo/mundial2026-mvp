import BackButton from './BackButton';
import '../globals.css';

interface HeroImageProps {
  image: string;
  title: string;
  location: string;
  category?: string;
  onBack?: () => void;
}

export default function HeroImage({ 
  image, 
  title, 
  location, 
  category = "Mundial 2026",
  onBack 
}: HeroImageProps) {
  return (
    <div className="relative w-full h-[65vh]">
      <img 
        alt={title} 
        className="w-full h-full object-cover" 
        src={image}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
      
      <div className="absolute top-6 left-6">
        <BackButton onClick={onBack} />
      </div>
      
      <div className="absolute bottom-12 left-6 right-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded uppercase tracking-wider">
            {category}
          </span>
          <span className="px-2 py-0.5 bg-white/20 ios-blur text-white text-[10px] font-bold rounded uppercase tracking-wider">
            {location}
          </span>
        </div>
        <h1 className="text-4xl font-extrabold text-white leading-tight shadow-sm">
          {title}
        </h1>
      </div>
    </div>
  );
}