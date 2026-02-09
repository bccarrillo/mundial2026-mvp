import '../globals.css';

interface CentralFABProps {
  onCreateNFT?: () => void;
}

export default function CentralFAB({ onCreateNFT }: CentralFABProps) {
  return (
    <div className="bg-text-dark rounded-3xl p-6 text-white overflow-hidden relative mb-8">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/30 blur-3xl rounded-full"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
            <span className="text-primary font-bold text-xl">$</span>
          </div>
          <span className="font-bold text-lg uppercase tracking-tight">
            Convertir en NFT
          </span>
        </div>
        
        <p className="text-gray-400 text-sm mb-6 leading-snug">
          Protege tu propiedad digital y haz que este recuerdo sea único en la blockchain.
        </p>
        
        <button 
          onClick={onCreateNFT}
          className="w-full bg-primary hover:bg-red-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-900/20 active:scale-95 transition-all"
        >
          Crear NFT Ahora
        </button>
      </div>
    </div>
  );
}