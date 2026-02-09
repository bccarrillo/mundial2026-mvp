interface Feature {
  emoji: string;
  title: string;
  description: string;
  bgColor: string;
}

const features: Feature[] = [
  {
    emoji: '📸',
    title: 'Guarda tus momentos',
    description: 'Sube fotos y videos de los mejores momentos del Mundial',
    bgColor: 'bg-red-50'
  },
  {
    emoji: '🔗',
    title: 'Comparte fácilmente',
    description: 'Cada recuerdo tiene su propio link para compartir en WhatsApp',
    bgColor: 'bg-blue-50'
  },
  {
    emoji: '💚',
    title: '100% Gratis',
    description: 'Sin límites, sin anuncios, sin costos ocultos',
    bgColor: 'bg-green-50'
  }
];

export default function FeatureCards() {
  return (
    <div className="flex flex-col gap-8 px-8 mb-16">
      {features.map((feature, index) => (
        <div key={index} className="flex flex-col items-center text-center">
          <div className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-3`}>
            <span className="text-3xl">{feature.emoji}</span>
          </div>
          <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
          <p className="text-text-muted text-sm leading-relaxed">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}